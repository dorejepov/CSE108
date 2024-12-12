const express = require('express');
const Vote = require('../models/Vote');
const Answer = require('../models/Answer');

const router = express.Router();

router.post('/:answerId', async (req, res) => {
    try {
        const { answerId } = req.params;
        const { voteType, userId } = req.body;

        if (!['up', 'down'].includes(voteType)) throw new Error('Invalid vote type');

        const existingVote = await Vote.findOne({
            answerId,
            userId: userId,
        });

        if (existingVote) {
            existingVote.voteType = voteType;
            await existingVote.save();
        } else {
            // Create new vote
            const newVote = new Vote({
                answerId,
                userId: userId,
                voteType,
            });
            await newVote.save();
        }

        res.json({ message: 'Vote cast successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/:answerId', async (req, res) => {
    try {
        const { answerId } = req.params;

        const upvotes = await Vote.countDocuments({ answerId, voteType: 'up' });
        const downvotes = await Vote.countDocuments({ answerId, voteType: 'down' });

        res.json({ upvotes, downvotes });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
