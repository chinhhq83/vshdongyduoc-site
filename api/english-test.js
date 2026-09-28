// api/english-test.js
module.exports = async (req, res) => {
  console.log('✅ English Test API called');
  
  res.json({ 
    success: true, 
    message: '✅ English App API is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
};