import { json } from '@sveltejs/kit';
import { addToWaitlist, getCurrentPartiesCount, getQueuePosition } from '$lib/db.js';

export async function POST({ request }) {
  try {
    const data = await request.json();
    const { name, phone, partySize } = data;

    // Validate input
    if (!name || !phone || !partySize) {
      return json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate phone number format
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      return json({ error: 'Invalid phone number format' }, { status: 400 });
    }

    // Add to waitlist
    const result = await addToWaitlist(name, phoneDigits, parseInt(partySize));
    if (!result || !result.id) {
      throw new Error('Failed to add to waitlist');
    }

    const position = await getQueuePosition(result.id);
    if (!position) {
      throw new Error('Failed to get queue position');
    }

    return json({
      success: true,
      id: result.id,
      position: position.position + 1
    });
  } catch (error) {
    console.error('Error adding to waitlist:', error);
    return json({ 
      error: 'Failed to add to waitlist. Please try again.' 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const count = await getCurrentPartiesCount();
    return json({ count });
  } catch (error) {
    console.error('Error getting waitlist count:', error);
    return json({ 
      error: 'Failed to get waitlist count',
      count: 0
    }, { status: 500 });
  }
} 