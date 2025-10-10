require('dotenv').config();
const express = require('express');
const cors = require('cors');
const LinkedInPostGenerator = require('./linkedinPostGenerator');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize generator
const generator = new LinkedInPostGenerator();

// Routes
app.get('/api', (req, res) => {
    res.json({
        message: 'LinkedIn Post Generator API',
        endpoints: {
            '/generate': 'POST - Generate LinkedIn post calendar',
            '/countries': 'GET - Get available countries',
            '/holidays/:year/:country': 'GET - Get holidays for specific year and country'
        }
    });
});

// Get available countries
app.get('/countries', async (req, res) => {
    try {
        const countries = await generator.getAvailableCountries();
        res.json(countries);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch countries' });
    }
});

// Get holidays for specific year and country
app.get('/holidays/:year/:country', async (req, res) => {
    try {
        const { year, country } = req.params;
        const holidays = await generator.getHolidays(parseInt(year), country.toUpperCase());
        res.json(holidays);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch holidays' });
    }
});

// Get model status
app.get('/model-status', (req, res) => {
    try {
        const status = generator.getModelStatus();
        res.json({
            success: true,
            ...status
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get model status' });
    }
});

// Reset model failures
app.post('/reset-models', (req, res) => {
    try {
        generator.resetModelFailures();
        res.json({
            success: true,
            message: 'Model failures reset successfully',
            currentModel: generator.getCurrentModel()
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to reset models' });
    }
});

// Improve existing post with AI
app.post('/improve-post', async (req, res) => {
    try {
        const {
            currentPost,
            userRequest,
            postType,
            holiday,
            postTypeCategory,
            companyInfo
        } = req.body;

        // Validate required fields
        if (!currentPost || !userRequest) {
            return res.status(400).json({
                error: 'currentPost and userRequest are required'
            });
        }

        // Create improvement prompt
        const improvementPrompt = `You are a professional LinkedIn content expert. A user wants to improve their LinkedIn post.

Current Post:
"${currentPost}"

Post Context:
- Type: ${postType} ${holiday ? `(Holiday: ${holiday})` : `(Category: ${postTypeCategory})`}
- Company: ${companyInfo?.name || 'Unknown'}
- Industry: ${companyInfo?.industry || 'Business'}

User Request: "${userRequest}"

Please provide:
1. A brief explanation of what you'll improve (2-3 sentences)
2. An improved version of the post that addresses their request

Keep the improved post professional, engaging, and suitable for LinkedIn. Maintain the original structure and key information while implementing the requested changes.

Format your response as:
EXPLANATION: [Your explanation here]
IMPROVED_POST: [The improved post here]`;

        // Generate improvement using AI
        const aiResponse = await generator.generateContentWithAI(improvementPrompt);

        if (aiResponse) {
            // Parse the AI response
            const explanationMatch = aiResponse.match(/EXPLANATION:\s*(.*?)(?=IMPROVED_POST:|$)/s);
            const improvedPostMatch = aiResponse.match(/IMPROVED_POST:\s*(.*)/s);

            const explanation = explanationMatch ? explanationMatch[1].trim() : "I've improved your post based on your request.";
            const improvedPost = improvedPostMatch ? improvedPostMatch[1].trim() : aiResponse;

            res.json({
                success: true,
                explanation: explanation,
                improvedPost: improvedPost,
                originalPost: currentPost
            });
        } else {
            throw new Error('AI service unavailable');
        }
    } catch (error) {
        console.error('Error improving post:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to improve post',
            details: error.message
        });
    }
});

// Generate LinkedIn post calendar
app.post('/generate', async (req, res) => {
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
        } = req.body;

        // Validate required fields
        if (!startDate || !endDate) {
            return res.status(400).json({
                error: 'startDate and endDate are required'
            });
        }

        // Process services - convert string to array if needed
        let processedServices = services;
        if (typeof services === 'string') {
            processedServices = services.split('\n').filter(s => s.trim()).map(s => s.trim());
        } else if (!Array.isArray(services)) {
            processedServices = [];
        }

        // Set company information
        await generator.setCompanyInfo(companyName, website, processedServices, industry);

        // Generate calendar
        const calendar = await generator.generateCalendar(startDate, endDate, countryCode);

        // Return in requested format
        if (format === 'text') {
            res.set('Content-Type', 'text/plain');
            res.send(generator.exportToText(calendar));
        } else {
            res.json({
                success: true,
                dateRange: { startDate, endDate },
                countryCode,
                totalPosts: calendar.length,
                calendar: calendar
            });
        }
    } catch (error) {
        console.error('Error generating calendar:', error);
        res.status(500).json({
            error: 'Failed to generate calendar',
            details: error.message
        });
    }
});

// Start server
app.listen(port, () => {
    console.log(`LinkedIn Post Generator API running on port ${port}`);
    console.log(`Visit http://localhost:${port} for API documentation`);
});

module.exports = app;