import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { sql } from './config/db.js';

import loginRoute from './routes/loginRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
//console.log(PORT);

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors()); // Enable CORS for all routes
app.use(helmet()); // Use Helmet to enhance API's security

app.use(morgan('dev')); // Use Morgan for logging requests

app.use('/api/users', loginRoute);

async function startServer() {
   try {
     await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        user_type VARCHAR(20) CHECK (user_type IN ('user', 'admin')) DEFAULT user,
        avatar_url VARCHAR(500),
        username VARCHAR(500) NOT NULL,
        phone_num VARCHAR(500) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
     `;

     console.log(`Database connected successfully`);
   } catch (error) {
     console.error('Failed to start server:', error);
   }
}
startServer().then(() => {
 app.listen(PORT, () => {
   console.log(`Server is running on port ` + PORT);
 });
});