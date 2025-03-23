// Historical wait time data for analysis
export const waitTimeData = {
  // Average wait times in minutes by party size
  partySize: {
    "1": 15,
    "2": 20,
    "3": 25,
    "4": 30,
    "5": 35,
    "6": 40,
    "7": 45,
    "8": 50
  },
  
  // Peak hour multipliers (6 PM - 8 PM)
  peakMultiplier: 1.5,
  
  // Queue size multipliers
  queueMultipliers: {
    "0-5": 1,
    "6-10": 1.2,
    "11-15": 1.4,
    "16-20": 1.6,
    "20+": 2
  }
}; 