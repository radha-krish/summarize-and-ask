const express = require("express");
const router = express.Router();
const { generateSummary, editSummary, shareSummary, getSummary } = require("../controllers/summaryController");

/**
 * @swagger
 * /summaries/generate:
 *   post:
 *     summary: Generate a summary from a transcript
 *     description: |
 *       Takes a `transcriptId` and a custom `prompt`, then generates a summary using AI.
 *       If `stream` is true, the summary will be sent as a streaming response (text/event-stream).
 *       If `stream` is false, the full summary is returned as JSON and saved in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - transcriptId
 *             properties:
 *               transcriptId:
 *                 type: string
 *                 description: The ID of the transcript to summarize
 *               prompt:
 *                 type: string
 *                 description: Custom instruction for AI summarization
 *               stream:
 *                 type: boolean
 *                 description: Whether to stream the summary token-by-token (true) or return full JSON (false)
 *     responses:
 *       201:
 *         description: Summary generated successfully (for non-streaming mode)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 transcriptId:
 *                   type: string
 *                 prompt:
 *                   type: string
 *                 generatedText:
 *                   type: string
 *                 sharedWith:
 *                   type: array
 *                   items:
 *                     type: string
 *                 createdAt:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 *             example:
 *               _id: "64f123abc456def7890"
 *               transcriptId: "64f12ab34cd567ef890"
 *               prompt: "Summarize in bullet points for executives"
 *               generatedText: "• Point 1\n• Point 2\n• Point 3"
 *               sharedWith: []
 *               createdAt: "2025-08-17T12:00:00.000Z"
 *               updatedAt: "2025-08-17T12:00:00.000Z"
 */
router.post("/generate", generateSummary);

/**
 * @swagger
 * /summaries/{id}:
 *   put:
 *     summary: Edit an existing summary
 *     description: Update the summary with user-edited text.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Summary ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - editedText
 *             properties:
 *               editedText:
 *                 type: string
 *                 description: Updated summary text
 *     responses:
 *       200:
 *         description: Summary updated successfully
 */
router.put("/:id", editSummary);
/**
 * @swagger
 * /summaries/{id}/share:
 *   post:
 *     summary: Share a summary via email
 *     description: "Add recipient emails and share the summary. Demo: only stored in DB, not actually sent."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Summary ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipients
 *             properties:
 *               recipients:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["test@example.com", "user@example.com"]
 *     responses:
 *       200:
 *         description: Summary shared successfully
 */
router.post("/:id/share", shareSummary);


/**
 * @swagger
 * /summaries/{id}:
 *   get:
 *     summary: Get a summary by ID
 *     description: Fetch a generated or edited summary by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Summary ID
 *     responses:
 *       200:
 *         description: Summary details
 */
router.get("/:id", getSummary);

module.exports = router;
