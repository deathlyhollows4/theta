const buckets = new Map();

const now = () => Date.now();

export const rateLimit = ({ windowMs, maxRequests, keyPrefix = 'global' }) => (req, res, next) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
  const key = `${keyPrefix}:${ip}`;
  const current = buckets.get(key) || { count: 0, start: now() };

  if (now() - current.start > windowMs) {
    current.count = 0;
    current.start = now();
  }

  current.count += 1;
  buckets.set(key, current);

  if (current.count > maxRequests) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests. Please retry shortly.'
    });
  }

  next();
};
