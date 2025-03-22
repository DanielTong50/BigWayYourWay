import supabase from './supabase';

export async function addToWaitlist(name, phone, partySize) {
  try {
    const { data, error } = await supabase
      .from('waitlist')
      .insert([
        { 
          name, 
          phone, 
          party_size: partySize, 
          status: 'waiting' 
        }
      ])
      .select()
      .single();

    if (error) throw error;
    console.log('Added to waitlist:', data);
    return data;
  } catch (error) {
    console.error('Error adding to waitlist:', error);
    throw error;
  }
}

export async function getWaitlist() {
  try {
    const { data, error } = await supabase
      .from('waitlist')
      .select('*')
      .order('status', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;
    console.log('Retrieved waitlist entries:', data.length);
    return data;
  } catch (error) {
    console.error('Error getting waitlist:', error);
    throw error;
  }
}

export async function getQueuePosition(id) {
  try {
    // First get the created_at time of the target entry
    const { data: entry, error: entryError } = await supabase
      .from('waitlist')
      .select('created_at')
      .eq('id', id)
      .single();

    if (entryError) throw entryError;

    // Then count how many waiting entries were created before this one
    const { count, error: countError } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'waiting')
      .lt('created_at', entry.created_at);

    if (countError) throw countError;
    
    console.log('Queue position for ID', id, ':', count);
    return { position: count };
  } catch (error) {
    console.error('Error getting queue position:', error);
    throw error;
  }
}

export async function getCurrentPartiesCount() {
  try {
    const { count, error } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'waiting');

    if (error) throw error;
    console.log('Current waiting parties:', count);
    return count;
  } catch (error) {
    console.error('Error getting current parties count:', error);
    return 0;
  }
}

export async function removeFromWaitlist(id) {
  try {
    const { data, error } = await supabase
      .from('waitlist')
      .update({ status: 'completed' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    console.log('Removed from waitlist:', data);
    return data;
  } catch (error) {
    console.error('Error removing from waitlist:', error);
    throw error;
  }
}

export async function getDatabaseStatus() {
  try {
    const { count, error } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;

    return {
      status: 'connected',
      tables: ['waitlist'],
      counts: { waitlist: count },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting database status:', error);
    return {
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
} 