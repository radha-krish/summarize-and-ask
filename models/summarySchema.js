const mongoose = require("mongoose");

const summarySchema = new mongoose.Schema({
  transcriptId: { type: mongoose.Schema.Types.ObjectId, ref: "Transcript", required: true },
  prompt: { type: String }, // custom instruction given by user
  generatedText: { type: String, required: true }, // AI-generated summary
  editedText: { type: String }, // optional: user-edited summary
  sharedWith: [{ type: String }], // list of emails it was shared with
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Summary", summarySchema);
