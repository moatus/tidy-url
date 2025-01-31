const express = require('express');
const cors = require('cors');
const { TidyURL } = require('tidy-url');
const app = express();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        version: '1.18.3'
    });
});

// Configuration endpoint - get current config
app.get('/config', (req, res) => {
    res.json({
        config: TidyURL.config.getAll(),
        supportedOptions: {
            allowAMP: "boolean - remove AMP from URLs",
            allowRedirects: "boolean - follow redirect parameters",
            fullClean: "boolean - apply global rules to all URLs",
            removeHash: "boolean - remove hash fragments from URLs",
            removeTrailing: "boolean - remove trailing slashes",
            forceHTTPS: "boolean - convert http to https",
            parameterKeyBlacklist: "array - parameters to always remove",
            parameterKeyWhitelist: "array - parameters to always keep"
        }
    });
});

// Single URL cleaning endpoint
app.post('/clean', async (req, res) => {
    try {
        const { url, options } = req.body;
        
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        // Configure TidyURL
        if (options) {
            if (options.parameterKeyWhitelist) {
                TidyURL.config.set('parameterKeyWhitelist', options.parameterKeyWhitelist);
            }
            if (options.parameterKeyBlacklist) {
                TidyURL.config.set('parameterKeyBlacklist', options.parameterKeyBlacklist);
            }
            if (options.allowAMP !== undefined) {
                TidyURL.config.set('allowAMP', options.allowAMP);
            }
            if (options.allowRedirects !== undefined) {
                TidyURL.config.set('allowRedirects', options.allowRedirects);
            }
            if (options.fullClean !== undefined) {
                TidyURL.config.set('fullClean', options.fullClean);
            }
            if (options.removeHash !== undefined) {
                TidyURL.config.set('removeHash', options.removeHash);
            }
            if (options.removeTrailing !== undefined) {
                TidyURL.config.set('removeTrailing', options.removeTrailing);
            }
            if (options.forceHTTPS !== undefined) {
                TidyURL.config.set('forceHTTPS', options.forceHTTPS);
            }
        }

        // Clean the URL
        const cleanResult = TidyURL.clean(url);
        const cleanedUrl = cleanResult.url;
        
        res.json({
            originalUrl: url,
            cleanedUrl: cleanedUrl,
            wasModified: url !== cleanedUrl,
            details: cleanResult.info
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Batch URL cleaning endpoint
app.post('/clean-batch', async (req, res) => {
    try {
        const { urls, options } = req.body;
        
        if (!Array.isArray(urls)) {
            return res.status(400).json({ error: 'URLs array is required' });
        }

        // Configure TidyURL (same as single URL endpoint)
        if (options) {
            if (options.parameterKeyWhitelist) {
                TidyURL.config.set('parameterKeyWhitelist', options.parameterKeyWhitelist);
            }
            if (options.parameterKeyBlacklist) {
                TidyURL.config.set('parameterKeyBlacklist', options.parameterKeyBlacklist);
            }
            if (options.allowAMP !== undefined) {
                TidyURL.config.set('allowAMP', options.allowAMP);
            }
            if (options.allowRedirects !== undefined) {
                TidyURL.config.set('allowRedirects', options.allowRedirects);
            }
            if (options.fullClean !== undefined) {
                TidyURL.config.set('fullClean', options.fullClean);
            }
            if (options.removeHash !== undefined) {
                TidyURL.config.set('removeHash', options.removeHash);
            }
            if (options.removeTrailing !== undefined) {
                TidyURL.config.set('removeTrailing', options.removeTrailing);
            }
            if (options.forceHTTPS !== undefined) {
                TidyURL.config.set('forceHTTPS', options.forceHTTPS);
            }
        }

        const results = urls.map(url => {
            const cleanResult = TidyURL.clean(url);
            return {
                originalUrl: url,
                cleanedUrl: cleanResult.url,
                wasModified: url !== cleanResult.url,
                details: cleanResult.info
            };
        });
        
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 4300;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Available endpoints:`);
    console.log(`  GET  /health      - Check server status`);
    console.log(`  GET  /config      - Get current configuration`);
    console.log(`  POST /clean       - Clean single URL`);
    console.log(`  POST /clean-batch - Clean multiple URLs`);
});
