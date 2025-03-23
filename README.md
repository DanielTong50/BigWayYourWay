# 🍜 BigWay, Your Way! @UBC

> A smart waitlist management system for UBC's popular hotpot chain

## 🎯 The Problem

Reserving a table at the popular hotpot chain, BigWay, has become increasingly difficult as it skyrockets in popularity. Their current system has you join a waitlist, making it so that you have to essentially guess when you should join. In peak times, the wait list skyrockets to 200-300+ people, making it difficult to estimate when you should join.

## 💡 The Solution

We developed **BigWay, Your Way** to make it easier and more convenient to time your Big Way order. Our system:

- 📱 Takes user information (phone number, name, party size, desired time)
- 🤖 Generates optimal waitlist join time using AI
- 🔔 Sends SMS notifications with direct waitlist URL
- 📊 Analyzes historical waitlist data for better predictions

## 🛠️ Technical Stack

- **Frontend**: Svelte.js
- **Backend**: Supabase
- **AI**: OpenAI ChatGPT Assistant
- **SMS**: Twilio API
- **Data Analysis**: UBC Bigway waitlist data

## ⚠️ Current Limitations

> **Note**: Since we do not have a subscription plan for Twilio, the app is not fully functional since it does not allow us to send SMS messages to unverified numbers. However, we can demo with numbers already inputted.

## 🚀 Upcoming Features

We had limited time but we had plans and are in the process of implementing these features:

- 🤖 Complete the integration of Puppeteer script to automate filling out the form
  - **Status**: In Progress
  - **Challenge**: We ran into Captcha issues with the automation of websites being blocked and ran out of time to complete our script

## 🎮 How It Works

1. Enter your details (name, phone, party size)
2. Select your desired dining time
3. Our AI calculates the optimal time to join the waitlist
4. Receive an SMS notification with the waitlist URL when it's time to join

## 🛡️ Security & Privacy

- All user data is securely stored in Supabase
- Phone numbers are verified through Twilio
- No sensitive information is shared with third parties

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Made with ❤️ by the BigBacks: Daniel, Jack, and Jimmy
