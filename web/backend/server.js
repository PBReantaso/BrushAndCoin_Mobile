//const express = require('express');
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
//console.log(PORT);

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors()); // Enable CORS for all routes
app.use(helmet()); // Use Helmet to enhance API's security

app.use(morgan('dev')); // Use Morgan for logging requests

app.get('/test', (req, res) => {
    console.log(res.getHeaders());
  res.send('Hello World!');
});

 app.listen(PORT, () => {
   console.log(`Server is running on port ` + PORT);
 });