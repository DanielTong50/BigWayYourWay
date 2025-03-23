import { createClient } from '@supabase/supabase-js';
import { generateResponse } from './openai';

// Use environment variables for Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;

// Waitlist functions
export async function addToWaitlist({ name, phone, partySize, targetTime, currentParties }) {
  try {
    // Get AI suggested time
    let suggestedTime = null;
    try {
      suggestedTime = await generateResponse(partySize, targetTime, currentParties);
    } catch (aiError) {
      console.error('Error getting AI suggestion:', aiError);
      // Continue with null suggested time if AI fails
    }

    // Format the data for insertion
    const waitlistEntry = {
      name: name.trim(),
      phone: phone ? phone.replace(/\D/g, '') : null,
      party_size: parseInt(partySize),
      requested_time: targetTime,
      suggested_time: suggestedTime,
      joined_at: new Date().toISOString(),
      status: 'waiting'
    };

    // Insert the data into Supabase
    const { data, error } = await supabase
      .from('waitlist')
      .insert([waitlistEntry])
      .select()
      .single();

    if (error) {
      console.error('Error inserting into waitlist:', error);
      throw new Error(error.message);
    }

    // Get position in line
    const { count, error: countError } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact' })
      .eq('status', 'waiting')
      .lte('joined_at', data.joined_at);

    if (countError) {
      console.error('Error getting position:', countError);
      throw new Error(countError.message);
    }

    return {
      success: true,
      position: count,
      data: data,
      suggestedTime
    };
  } catch (error) {
    console.error('Error in addToWaitlist:', error);
    throw error;
  }
}

// Get all waitlist entries with their suggested times
export async function getWaitlistEntries() {
  try {
    const { data, error } = await supabase
      .from('waitlist')
      .select('*')
      .eq('status', 'waiting')
      .order('joined_at', { ascending: true });

    if (error) throw error;
    return { entries: data || [] };
  } catch (error) {
    console.error('Error getting waitlist entries:', error);
    throw error;
  }
}

export async function getWaitlistCount() {
  try {
    const { count, error } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact' })
      .eq('status', 'waiting');

    if (error) throw error;
    return { count: count || 0 };
  } catch (error) {
    console.error('Error getting waitlist count:', error);
    throw error;
  }
}

export async function updateWaitlistStatus(id, status) {
  try {
    const { data, error } = await supabase
      .from('waitlist')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating waitlist status:', error);
    throw error;
  }
} 