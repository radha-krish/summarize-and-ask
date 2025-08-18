const Transcript = require("../models/transcriptSchema");
const fs = require("fs");
const pdfParse = require("pdf-parse");
// Upload transcript (text only for demo)
exports.uploadTranscript = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = req.file.path;
    let textContent = "";

    // Handle PDF
    if (req.file.mimetype === "application/pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      textContent = pdfData.text;
    }

    // Handle TXT
    else if (req.file.mimetype === "text/plain") {
      textContent = fs.readFileSync(filePath, "utf8");
    } else {
      return res.status(400).json({ message: "Unsupported file type. Use PDF or TXT." });
    }

    // Save transcript in DB
    const transcript = new Transcript({
      title: req.body.title || req.file.originalname,
      text: textContent
    });

    await transcript.save();

    // Optionally delete file after processing
    fs.unlinkSync(filePath);

    res.status(201).json(transcript);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Get a single transcript
exports.getTranscript = async (req, res) => {
  try {
    const transcript = await Transcript.findById(req.params.id);
    if (!transcript) return res.status(404).json({ message: "Transcript not found" });
    res.json(transcript);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
