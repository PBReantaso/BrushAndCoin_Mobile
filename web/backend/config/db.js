import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

export const sql = neon(
    `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`
);
// 'postgresql://neondb_owner:npg_7nX3azJvuIGC@ep-bitter-resonance-adyed1v7-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
