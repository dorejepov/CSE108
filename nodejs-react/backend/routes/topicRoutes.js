const express = require('express');
const Topic = require('../models/Topic');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { name, description } = req.body;
        const newTopic = new Topic({ name, description });
        await newTopic.save();
        res.status(201).json(newTopic);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const topics = await Topic.find();
        res.json(topics);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
