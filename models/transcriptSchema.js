const mongoose = require("mongoose");

const transcriptSchema = new mongoose.Schema({
  title: { type: String },
  text: { type: String, required: true }, // raw transcript text
  fileUrl: { type: String }, // optional, if file stored in cloud
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Transcript", transcriptSchema);
