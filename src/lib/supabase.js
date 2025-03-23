import { createClient } from '@supabase/supabase-js';
import { generateResponse } from './openai';

// Use environment variables for Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL is required but not provided. Please check your environment variables.');
}

if (!supabaseAnonKey) {
  throw new Error('VITE_SUPABASE_ANON_KEY is required but not provided. Please check your environment variables.');
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export the Supabase client as both default and named export
export default supabase;
export { supabase };

// Waitlist functions
export async function addToWaitlist({ name, phone, partySize, targetTime, currentParties }) {
  try {
    // Validate and format target time
    let formattedTargetTime = null;
    if (targetTime) {
      const [targetHours, targetMinutes] = targetTime.split(':');
      if (!isNaN(targetHours) && !isNaN(targetMinutes)) {
        formattedTargetTime = `${parseInt(targetHours).toString().padStart(2, '0')}:${parseInt(targetMinutes).toString().padStart(2, '0')}`;
      } else {
        throw new Error('Invalid target time format. Expected HH:mm');
      }
    }

    // Get AI suggested time
    let suggestedTime = null;
    try {
      const aiSuggestedTime = await generateResponse(partySize, targetTime, currentParties);
      // Convert 12-hour format to 24-hour format
      if (aiSuggestedTime) {
        const [time, period] = aiSuggestedTime.split(' ');
        const [hours, minutes] = time.split(':');
        let hour = parseInt(hours);
        
        // Validate that hours and minutes are numbers
        if (isNaN(hour) || isNaN(minutes)) {
          throw new Error('Invalid AI suggested time format');
        }
        
        // Convert to 24-hour format
        if (period.toLowerCase() === 'pm' && hour !== 12) {
          hour += 12;
        } else if (period.toLowerCase() === 'am' && hour === 12) {
          hour = 0;
        }
        
        // Format as HH:mm
        suggestedTime = `${hour.toString().padStart(2, '0')}:${minutes}`;
      }
    } catch (aiError) {
      console.error('Error getting AI suggestion:', aiError);
      // Continue with null suggested time if AI fails
    }

    // Format the data for insertion
    const waitlistEntry = {
      name: name.trim(),
      phone: phone ? phone.replace(/\D/g, '') : null,
      party_size: parseInt(partySize),
      requested_time: formattedTargetTime,
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