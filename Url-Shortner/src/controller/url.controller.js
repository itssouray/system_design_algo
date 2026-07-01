const { shortenUrl, getLongUrl } = require('../service/url.service');

async function shorten(req, res) {
  const { longUrl } = req.body;

  if (!longUrl) {
    return res.status(400).json({ error: 'longUrl is required' });
  }

  const url = await shortenUrl(longUrl);
  res.status(201).json({
    shortCode: url.shortCode,
    shortUrl: `http://localhost:8000/${url.shortCode}`,
  });
}

async function redirect(req, res) {
  const { shortCode } = req.params;
  const url = await getLongUrl(shortCode);

  if (!url) {
    return res.status(404).json({ error: 'Short URL not found' });
  }

  res.redirect(url.longUrl);
}

module.exports = { shorten, redirect };