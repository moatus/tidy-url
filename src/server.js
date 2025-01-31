const express = require('express');
const cors = require('cors');
const { TidyURL } = require('tidy-url');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/clean', (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL required' });
    
    try {
        const result = TidyURL.clean(url);
        res.json({ url: result.url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(process.env.PORT || 4300);
