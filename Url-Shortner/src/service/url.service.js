const Url = require('../model/url.model.js');
const { getNextSequence } = require('./counter.service');
const { encodeBase62 } = require('../utils/base62');
const {redisClient} = require('../config/redis'); 


async function shortenUrl(longUrl) {
  const seq = await getNextSequence('url_counter');
  const shortCode = encodeBase62(seq);
  
  const url = await Url.create({ shortCode, longUrl });

  await redisClient.set(shortCode, longUrl, { EX: 3600 });
  return url;
}

async function getLongUrl(shortCode) {
 const cached = await redisClient.get(shortCode);
  if (cached) {
    return { longUrl: cached }; // cache hit, skip DB entirely
  }


  const url = await Url.findOne({ shortCode });
  if (!url) return null;

  // 3. Populate cache for next time
  await redisClient.set(shortCode, url.longUrl, { EX: 3600 });
  return url;
}

module.exports = { shortenUrl, getLongUrl };