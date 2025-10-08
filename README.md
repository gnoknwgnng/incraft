# LinkedIn Post Generator

An automated LinkedIn post calendar generator powered by Groq Cloud API that fetches holiday data from the Nager.Date API and creates engaging posts for both festival days and regular business days.

## Features

- 🤖 **AI-Powered Content**: Uses Groq Cloud API with OpenAI GPT-OSS-20B model for intelligent content generation
- 🎉 **Festival Posts**: Automatically generates themed posts for holidays and special occasions
- 💼 **Business Posts**: Creates engaging content for regular business days
- 🏷️ **Auto-Generated Hashtags**: AI creates relevant hashtags based on your company and industry
- 🌍 **Multi-Country Support**: Works with holidays from different countries
- 🚀 **API Ready**: Built with Express.js for easy deployment
- 📅 **Date Range Flexibility**: Generate posts for any date range
- 🎨 **Customizable**: Easy to customize company information and post templates

## Installation

```bash
npm install
```

## Usage

### As a Node.js Module

```javascript
const LinkedInPostGenerator = require('./linkedinPostGenerator');

const generator = new LinkedInPostGenerator();

// Set your company information
generator.setCompanyInfo(
    'Your Company Name',
    'https://yourwebsite.com',
    ['Service 1', 'Service 2', 'Service 3'],
    ['hashtag1', 'hashtag2', 'hashtag3']
);

// Generate calendar
const calendar = await generator.generateCalendar('2025-10-01', '2025-10-31', 'US');
```

### As an API Server

```bash
npm start
```

The API will be available at `http://localhost:3000`

### API Endpoints

#### POST /generate
Generate a LinkedIn post calendar

**Request Body:**
```json
{
    "startDate": "2025-10-01",
    "endDate": "2025-10-31", 
    "countryCode": "US",
    "companyName": "Your Company",
    "website": "https://yourwebsite.com",
    "services": ["Service 1", "Service 2"],
    "hashtags": ["hashtag1", "hashtag2"],
    "format": "json"
}
```

#### GET /countries
Get list of available countries

#### GET /holidays/:year/:country
Get holidays for specific year and country

## Example

Run the example:
```bash
node example.js
```

This will generate posts for October 1-10, 2025 using sample company data.

## Sample Output

### Festival Post
```
📅 October 14, 2025 (Tuesday) - FESTIVAL POST

🇺🇸 Happy Columbus Day! 🇺🇸

Celebrating this special day with gratitude and joy.

At AP&A SYSTEM LLP, we believe in celebrating milestones and traditions that bring us together:

🔧 IT Solutions for digital transformation
🔧 HR & Recruitment for building strong teams
🔧 Branding & Marketing for powerful presence
🔧 Social Media Management for meaningful connections

May this Columbus Day bring prosperity and success to all!

Visit: https://www.apasystemllp.com/services

#ColumbusDay #DigitalTransformation #BusinessGrowth #APASystem
```

### Business Post
```
📅 October 15, 2025 (Wednesday) - SERVICE SPOTLIGHT

💼 Highlighting our comprehensive business solutions today!

At AP&A SYSTEM LLP, we provide:

✨ IT Solutions for digital transformation
✨ HR & Recruitment for building strong teams
✨ Branding & Marketing for powerful presence
✨ Social Media Management for meaningful connections

Ready to elevate your business? Let's connect and explore opportunities!

Visit: https://www.apasystemllp.com/services

#DigitalTransformation #BusinessGrowth #APASystem
```

## Deployment

This application is ready for deployment on:
- Heroku
- Vercel
- AWS Lambda
- Google Cloud Functions
- Any Node.js hosting platform

## Country Codes

Common country codes supported:
- US (United States)
- GB (United Kingdom) 
- CA (Canada)
- AU (Australia)
- IN (India)
- DE (Germany)
- FR (France)

Use the `/countries` endpoint to get the full list.

## License

MIT