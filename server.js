const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const { connectDB } = require('./db');
const PORT = process.env.PORT || 5000;

// Connect to MongoDB.
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded( { extended: false } ));

// Defined routes.
app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));

app.get('/', (req, res) => {
    res.send('Hello');
});


app.listen(PORT, () => {
    console.log('Server running on port: ' + PORT);
})