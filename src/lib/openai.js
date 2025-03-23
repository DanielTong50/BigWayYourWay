// OpenAI API configuration
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('OpenAI API key not found. Please set VITE_OPENAI_API_KEY in your environment variables.');
}

import { waitTimeData } from './waitTimeData';

function isWithinOperatingHours(date) {
  const hours = date.getHours();
  // Operating hours: 10 AM - 2 AM
  return (hours >= 10 && hours <= 23) || (hours >= 0 && hours <= 2);
}

function calculateEstimatedWaitTime(partySize, isPeakHours, currentParties) {
  // Get base wait time for party size
  const baseWaitTime = waitTimeData.partySize[partySize] || waitTimeData.partySize["8"];
  
  // Apply peak hour multiplier if applicable
  const peakMultiplier = isPeakHours ? waitTimeData.peakMultiplier : 1;
  
  // Determine queue multiplier
  let queueMultiplier;
  if (currentParties <= 5) queueMultiplier = waitTimeData.queueMultipliers["0-5"];
  else if (currentParties <= 10) queueMultiplier = waitTimeData.queueMultipliers["6-10"];
  else if (currentParties <= 15) queueMultiplier = waitTimeData.queueMultipliers["11-15"];
  else if (currentParties <= 20) queueMultiplier = waitTimeData.queueMultipliers["16-20"];
  else queueMultiplier = waitTimeData.queueMultipliers["20+"];
  
  // Calculate final wait time with 15-minute buffer
  return Math.round(baseWaitTime * peakMultiplier * queueMultiplier) + 15;
}

export async function generateResponse(partySize, targetSeatingTime, currentParties) {
  try {
    const now = new Date();
    
    // Calculate target time
    const targetTime = targetSeatingTime ? new Date(`${now.toDateString()} ${targetSeatingTime}`) : now;
    
    // Validate operating hours
    if (!isWithinOperatingHours(targetTime)) {
      throw new Error('Restaurant is only open from 10 AM to 2 AM');
    }

    const hour = targetTime.getHours();
    const isPeakHours = hour >= 18 && hour <= 20; // 6 PM - 8 PM

    // Calculate estimated wait time
    const waitTimeMinutes = calculateEstimatedWaitTime(partySize, isPeakHours, currentParties);
    
    // Calculate recommended join time
    const joinTime = new Date(targetTime.getTime() - waitTimeMinutes * 60000);
    
    // Validate join time is also within operating hours
    if (!isWithinOperatingHours(joinTime)) {
      throw new Error('Recommended join time would be outside operating hours (10 AM - 2 AM)');
    }
    
    const formattedJoinTime = joinTime.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });

    // Return just the formatted time
    return formattedJoinTime;

  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
} 