const Summary = require("../models/summarySchema");
const Transcript = require("../models/transcriptSchema");
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
// Generate summary (mock AI for demo)
exports.generateSummary = async (req, res) => {
  try {
    const { transcriptId, prompt, stream: useStream } = req.body;

    const transcript = await Transcript.findById(transcriptId);
    if (!transcript)
      return res.status(404).json({ message: "Transcript not found" });

    let summaryText = ""; 

    if (useStream) {
      // STREAMING MODE
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.flushHeaders();

      const stream = await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages: [
          {
            role: "system",
            content:
              "You are an AI assistant that summarizes meeting transcripts clearly and concisely.",
          },
          {
            role: "user",
            content: `${prompt || "Summarize this transcript"}:\n${transcript.text}`,
          },
        ],
        stream: true,
      });

      stream.on("data", (chunk) => {
        const payloads = chunk.toString().split("\n\n");
        for (const payload of payloads) {
          if (payload.includes("[DONE]")) return;
          if (payload.startsWith("data: ")) {
            const data = JSON.parse(payload.replace("data: ", ""));
            const token = data.choices[0].delta?.content;
            if (token) {
              summaryText += token;
              res.write(token); // stream token to frontend
            }
          }
        }
      });

      stream.on("end", async () => {
        // Save summary to DB
        const summary = new Summary({
          transcriptId,
          prompt,
          generatedText: summaryText,
        });
        await summary.save();

        res.write("\n\n");
        res.end();
      });

      stream.on("error", (err) => {
        console.error(err);
        res.status(500).json({ error: err.message });
      });
    } else {
      // NORMAL JSON MODE
      const completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages: [
          {
            role: "system",
            content:
              "You are an AI assistant that summarizes meeting transcripts clearly and concisely.",
          },
          {
            role: "user",
            content: `${prompt || "Summarize this transcript"}:\n${transcript.text}`,
          },
        ],
        stream: false, // get full response at once
      });

      summaryText = completion.choices[0]?.message?.content || "";

      const summary = new Summary({
        transcriptId,
        prompt,
        generatedText: summaryText,
      });
      await summary.save();

      res.status(201).json(summary);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Edit summary
exports.editSummary = async (req, res) => {
  try {
    const { editedText } = req.body;
    const summary = await Summary.findByIdAndUpdate(
      req.params.id,
      { editedText, updatedAt: Date.now() },
      { new: true }
    );
    if (!summary) return res.status(404).json({ message: "Summary not found" });
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Share summary (just store emails in DB for demo)
exports.shareSummary = async (req, res) => {
  try {
    const { recipients } = req.body;
    const summary = await Summary.findById(req.params.id);
    if (!summary) return res.status(404).json({ message: "Summary not found" });

    summary.sharedWith.push(...recipients);
    await summary.save();

    // In real project: use Nodemailer or SendGrid here
    res.json({ success: true, message: "Summary shared!", sharedWith: summary.sharedWith });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single summary
exports.getSummary = async (req, res) => {
  try {
    const summary = await Summary.findById(req.params.id).populate("transcriptId");
    if (!summary) return res.status(404).json({ message: "Summary not found" });
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
