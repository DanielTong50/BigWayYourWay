import { json } from '@sveltejs/kit';
import { getDatabaseStatus } from '$lib/db.js';

export async function GET() {
  try {
    const status = await getDatabaseStatus();
    return json({
      status,
      timestamp: new Date().toISOString(),
      dbPath: process.cwd()
    });
  } catch (error) {
    console.error('Error getting debug info:', error);
    return json({ 
      error: 'Failed to get debug information',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 