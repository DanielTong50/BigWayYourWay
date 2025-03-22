import { json } from '@sveltejs/kit';
import { getWaitlist } from '$lib/db.js';

export async function GET() {
  try {
    const waitlist = await getWaitlist();
    return json({ waitlist });
  } catch (error) {
    console.error('Error getting waitlist:', error);
    return json({ 
      error: 'Failed to get waitlist',
      waitlist: []
    }, { status: 500 });
  }
} 