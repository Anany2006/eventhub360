const NodeCache = require('node-cache');
// Instantiate a cache repository with an automatic 60-second expiration setting
const memoryCache = new NodeCache({ stdTTL: 60 }); 

const cacheMiddleware = (req, res, next) => {
    // Generate a unique data slot key based on the specific route path requested
    const cacheKey = req.originalUrl || req.url;
    const cachedResponse = memoryCache.get(cacheKey);

    if (cachedResponse) {
        // Cache Hit! Instantly serve data from RAM
        return res.status(200).json({ 
            success: true, 
            source: 'cache_memory', 
            data: cachedResponse 
        });
    }

    // Cache Miss! Intercept the original res.json method to capture database output
    res.sendResponse = res.json;
    res.json = (body) => {
        if (body && body.success && body.data) {
            memoryCache.set(cacheKey, body.data);
        }
        res.sendResponse(body);
    };

    next();
};

module.exports = cacheMiddleware;