require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var cors = require('cors')

const userRoutes = require('./routes/userRoutes');
const topicRoutes = require('./routes/topicRoutes');
const answerRoutes = require('./routes/answerRoutes');
const voteRoutes = require('./routes/voteRoutes');
const questionRoutes = require('./routes/questionRoutes');

const app = express();
app.use(cors())

app.use(bodyParser.json());


// Routes
app.use('/api/users', userRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/answers', answerRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/questions', questionRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Start Server
const PORT = process.env.PORT || 4003;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
