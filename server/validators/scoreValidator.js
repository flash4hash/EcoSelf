const validateScoreInput = (body) => {
  const errors = [];
  
  if (!body.name || typeof body.name !== 'string' || 
      body.name.trim() === '') {
    errors.push('Name is required');
  }
  
  const score = Number(body.score);
  if (body.score === undefined || body.score === null) {
    errors.push('Score is required');
  } else if (isNaN(score)) {
    errors.push('Score must be a valid number');
  } else if (score < 0 || score > 100) {
    errors.push('Score must be between 0 and 100');
  }
  
  return { isValid: errors.length === 0, errors };
};

module.exports = { validateScoreInput };
