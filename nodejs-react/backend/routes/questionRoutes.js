const express = require('express');
const Question = require('../models/Question');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { title, content, topicId, userId } = req.body;

        const newQuestion = new Question({
            title,
            content,
            topicId,
            userId, 
        });
        await newQuestion.save();
        res.status(201).json(newQuestion);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const { topicId } = req.query;
        const filter = topicId ? { topicId } : {};

        const questions = await Question.find(filter).populate('userId', 'username');
        res.json(questions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:questionId', async (req, res) => {
    try {
        const { questionId } = req.params;

        const question = await Question.findById(questionId)
            .populate('userId', 'username')
            .populate('topicId', 'name');
        if (!question) throw new Error('Question not found');

        res.json(question);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.put('/:questionId', async (req, res) => {
    try {
        const { questionId } = req.params;
        const { title, content } = req.body;

        const question = await Question.findById(questionId);
        if (!question) throw new Error('Question not found');
        if (question.userId.toString() !== req.user.userId)
            throw new Error('Unauthorized to update this question');

        question.title = title;
        question.content = content;
        question.updatedAt = Date.now();
        await question.save();

        res.json(question);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/:questionId', async (req, res) => {
    try {
        const { questionId } = req.params;

        const question = await Question.findById(questionId);
        if (!question) throw new Error('Question not found');
        if (question.userId.toString() !== req.user.userId)
            throw new Error('Unauthorized to delete this question');

        await question.remove();
        res.json({ message: 'Question deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
