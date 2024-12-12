const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    answerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Answer', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    voteType: { type: String, enum: ['up', 'down'], required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Vote', voteSchema);
