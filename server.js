const express = require('express');
const cors = require('cors');
const { TidyURL } = require('./lib/tidy');
const app = express();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
});

// Single URL cleaning endpoint
app.post('/clean', async (req, res) => {
    try {
        const { url } = req.body;
        
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        const result = TidyURL.clean(url);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Batch URL cleaning endpoint
app.post('/clean-batch', async (req, res) => {
    try {
        const { urls } = req.body;
        
        if (!Array.isArray(urls)) {
            return res.status(400).json({ error: 'URLs array is required' });
        }

        const results = urls.map(url => TidyURL.clean(url));
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 4300;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
