import { QueryResult, QueryResultRow } from 'pg';
import pool from './config';

export const query = async <T extends QueryResultRow>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> => {
  try {
    return await pool.query<T>(text, params);
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

export default {
  query,
};