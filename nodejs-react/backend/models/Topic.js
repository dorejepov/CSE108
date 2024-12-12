const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    description: { type: String },
});

module.exports = mongoose.model('Topic', topicSchema);
