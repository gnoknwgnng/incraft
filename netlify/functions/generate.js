const LinkedInPostGenerator = require('../../linkedinPostGenerator');

exports.handler = async (event, context) => {
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const {
            startDate,
            endDate,
            countryCode = 'US',
            companyName,
            website,
            industry,
            services,
            format = 'json'
        } = JSON.parse(event.body);

        // Validate required fields
        if (!startDate || !endDate) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'startDate and endDate are required' 
                })
            };
        }

        // Initialize generator
        const generator = new LinkedInPostGenerator();

        // Set company information
        await generator.setCompanyInfo(companyName, website, services, industry);

        // Generate calendar
        const calendar = await generator.generateCalendar(startDate, endDate, countryCode);

        // Return in requested format
        if (format === 'text') {
            return {
                statusCode: 200,
                headers: {
                    ...headers,
                    'Content-Type': 'text/plain'
                },
                body: generator.exportToText(calendar)
            };
        } else {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    dateRange: { startDate, endDate },
                    countryCode,
                    totalPosts: calendar.length,
                    calendar: calendar
                })
            };
        }
    } catch (error) {
        console.error('Error generating calendar:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                success: false,
                error: 'Failed to generate calendar',
                details: error.message 
            })
        };
    }
};