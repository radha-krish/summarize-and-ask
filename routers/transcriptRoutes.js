const express = require("express");
const multer = require("multer");
const path = require("path");
const { uploadTranscript, getTranscript } = require("../controllers/transcriptController");

const router = express.Router();

// Store uploaded files in /uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

/**
 * @swagger
 * /transcripts/upload:
 *   post:
 *     summary: Upload a transcript file
 *     description: Upload a PDF or TXT transcript. The text will be extracted and saved in the database.
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The transcript file to upload (PDF or TXT)
 *               title:
 *                 type: string
 *                 description: Optional title for the transcript
 *     responses:
 *       201:
 *         description: Transcript uploaded successfully
 */
router.post("/upload", upload.single("file"), uploadTranscript);

/**
 * @swagger
 * /transcripts/{id}:
 *   get:
 *     summary: Get a transcript by ID
 *     description: Fetch the uploaded transcript by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transcript ID
 *     responses:
 *       200:
 *         description: Transcript details
 */
router.get("/:id", getTranscript);

module.exports = router;
