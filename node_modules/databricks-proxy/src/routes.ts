import express from 'express';
import { runQuery } from './databricks';

const router = express.Router();

router.post('/query', async (req, res) => {
  try {
    const { sql } = req.body;
    if (!sql) {
      return res.status(400).json({ error: 'SQL query is required' });
    }

    // Execute SQL query against Databricks
    try {
      const rows = await runQuery(sql);
      // Return the results directly as they're already formatted
      res.json({ rows });
    } catch (error: any) {
      console.error('Query error:', error);
      // Send more detailed error information
      res.status(500).json({ 
        error: error.message || 'Failed to execute query',
        details: error.stack,
        code: error.code || 'UNKNOWN_ERROR'
      });
    }
  } catch (error: any) {
    console.error('Route error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  }
});

export default router;