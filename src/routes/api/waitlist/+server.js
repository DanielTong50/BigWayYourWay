import { json } from '@sveltejs/kit';
import { addToWaitlist, getCurrentPartiesCount, getQueuePosition } from '$lib/db.js';
import { scheduleSnappySubmission } from '$lib/worker.js';

export async function POST({ request }) {
  try {
    const data = await request.json();
    const { name, phone, partySize, timePeriod } = data;

    // Validate input
    if (!name || !phone || !partySize || !timePeriod) {
      return json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate phone number format
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      return json({ error: 'Invalid phone number format' }, { status: 400 });
    }

    // Validate time period
    const validTimePeriods = [1, 5, 10, 15];
    if (!validTimePeriods.includes(timePeriod)) {
      return json({ error: 'Invalid time period' }, { status: 400 });
    }

    // Add to waitlist
    const result = await addToWaitlist(name, phoneDigits, parseInt(partySize), timePeriod);
    if (!result || !result.id) {
      throw new Error('Failed to add to waitlist');
    }

    // Schedule Snappy submission
    scheduleSnappySubmission(result.id, timePeriod);

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

// Add endpoint to get Snappy URL
export async function GET({ url }) {
  try {
    const id = url.searchParams.get('id');
    
    if (id) {
      // Get specific entry's Snappy URL
      const { data, error } = await supabase
        .from('waitlist')
        .select('snappy_url, snappy_status')
        .eq('id', id)
        .single();

      if (error) throw error;
      return json(data);
    }

    // Get total count (existing functionality)
    const count = await getCurrentPartiesCount();
    return json({ count });
  } catch (error) {
    console.error('Error:', error);
    return json({ 
      error: 'Failed to get requested data',
      count: 0
    }, { status: 500 });
  }
} 