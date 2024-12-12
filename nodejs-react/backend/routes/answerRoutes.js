const express = require('express');
const Answer = require('../models/Answer');
const Question = require('../models/Question');

const router = express.Router();

router.post('/:questionId', async (req, res) => {
    try {
        const { content, userId } = req.body;
        const { questionId } = req.params;

        const newAnswer = new Answer({
            questionId,
            userId,
            content,
        });
        await newAnswer.save();
        res.status(201).json(newAnswer);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/:questionId', async (req, res) => {
    try {
        const { questionId } = req.params;
        const answers = await Answer.find({ questionId }).populate('userId', 'username');
        res.json(answers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:answerId', async (req, res) => {
    try {
        const { answerId } = req.params;
        const { content } = req.body;
        const answer = await Answer.findById(answerId);

        if (!answer) throw new Error('Answer not found');
        if (answer.userId.toString() !== req.user.userId)
            throw new Error('Unauthorized to update this answer');

        answer.content = content;
        answer.updatedAt = Date.now();
        await answer.save();

        res.json(answer);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/:answerId', async (req, res) => {
    try {
        const { answerId } = req.params;
        const answer = await Answer.findById(answerId);

        if (!answer) throw new Error('Answer not found');
        if (answer.userId.toString() !== req.user.userId)
            throw new Error('Unauthorized to delete this answer');

        await answer.remove();
        res.json({ message: 'Answer deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
