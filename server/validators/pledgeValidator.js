const PROFANITY_LIST = [
  'fgkfgv', 'fuck', 'shit', 'bitch', 'ass', 'spam', 'uhdsicff'
];

const sanitizeText = (text) => {
  if (typeof text !== 'string') return '';
  return text
    .replace(/<[^>]*>/g, '')        // Strip HTML tags
    .replace(/javascript:/gi, '')   // Strip JS protocol  
    .replace(/on\w+\s*=/gi, '')     // Strip event handlers
    .trim();
};

const validatePledgeInput = (body) => {
  const errors = [];
  
  if (!body.name || typeof body.name !== 'string' || 
      body.name.trim() === '') {
    errors.push('Name is required');
  }
  
  if (!body.pledge || typeof body.pledge !== 'string') {
    errors.push('Pledge is required');
  } else {
    const clean = sanitizeText(body.pledge);
    if (clean === '') errors.push('Pledge cannot be empty after sanitization');
    if (clean.length > 120) errors.push('Pledge must be 120 characters or fewer');
    
    const hasProfanity = PROFANITY_LIST.some(
      word => clean.toLowerCase().includes(word)
    );
    if (hasProfanity) errors.push('Please keep pledges clean and respectful');
  }
  
  return { isValid: errors.length === 0, errors };
};

module.exports = { sanitizeText, validatePledgeInput, PROFANITY_LIST };
