// Imports
import express from 'express';
import connectToDB from './config/database.js';
import dotenv from "dotenv";
import cors from "cors";

import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';


const app = express()
const port = 5000

// For ENV variables
dotenv.config();

// For Direct Browser Request
app.use(cors())
// For getting request body
app.use(express.json())

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