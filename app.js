// Imports
import express from 'express';
import connectToDB from './config/database.js';
import bodyParser from 'body-parser';

import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to database
connectToDB();

// Middleware
app.use(express.static('public'))

// Routes
// Index route
app.get('/', (req, res) => {
    res.send('Your server is running!')
})

// Route groups
app.use('/admin', adminRoutes);
app.use('/users', userRoutes);

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})