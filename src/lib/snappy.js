const BROWSERLESS_TOKEN = 'RzenY7F9BEa3nRb042444c0a913b122347581424f5';
const BROWSERLESS_URL = 'https://chrome.browserless.io/function';

export async function submitSnappyForm(name, phone, partySize) {
  const script = `
    module.exports = async ({ page, context }) => {
      const { name, phone, partySize } = context;

      // Go to the waitlist page
      await page.goto('https://gosnappy.io/lineup/?force=true&storeId=2980', { waitUntil: 'networkidle2' });

      // Fill Name
      await page.type('input[formcontrolname="name"]', name);

      // Fill Mobile Number
      await page.type('input[formcontrolname="phone"]', phone);

      // Open the Party Size dropdown
      await page.click('#mat-select-value-1'); // Trigger dropdown

      // Wait for dropdown options to appear
      await page.waitForSelector('mat-option');

      // Select party size
      const options = await page.$$('mat-option');
      for (const option of options) {
        const text = await option.evaluate(el => el.textContent);
        if (text.includes(\`Party of \${partySize}\`)) {
          await option.click();
          break;
        }
      }

      // Click the "Join the Line Now" button
      await page.click('button');

      // Wait for navigation
      await page.waitForNavigation({ waitUntil: 'networkidle0' });

      return await page.url();
    };
  `;

  try {
    const response = await fetch(`${BROWSERLESS_URL}?token=${BROWSERLESS_TOKEN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify({
        code: script,
        context: {
          name,
          phone,
          partySize
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Browserless request failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error submitting Snappy form:', error);
    throw error;
  }
} 