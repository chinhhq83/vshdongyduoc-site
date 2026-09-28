// api/english.js
module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  
  console.log('📧 English API called:', { 
    method: req.method, 
    path: pathname,
    action: req.query.action 
  });

  // Route based on query parameter or path
  if (req.method === 'GET' && req.query.action === 'test') {
    return res.json({ 
      success: true, 
      message: '✅ English App API is working!',
      timestamp: new Date().toISOString()
    });
  }

  if (req.method === 'POST' && req.query.action === 'register') {
    try {
      const { fullName, email, password, childName, childAge } = req.body;
      
      console.log('📧 Registration received:', { fullName, email });

      // Validation
      if (!fullName || !email || !password) {
        return res.status(400).json({ 
          success: false, 
          message: 'Vui lòng điền đầy đủ thông tin bắt buộc.' 
        });
      }

      // Create user
      const newUser = {
        id: Date.now().toString(),
        fullName,
        email,
        childName: childName || '',
        childAge: childAge || '',
        plan: 'free',
        createdAt: new Date().toISOString()
      };

      // Success
      return res.json({
        success: true,
        message: '🎉 Đăng ký thành công! Bạn đã có thể truy cập toàn bộ nội dung.',
        user: {
          id: newUser.id,
          fullName: newUser.fullName,
          email: newUser.email,
          plan: newUser.plan
        },
        token: `eng-token-${Date.now()}`
      });

    } catch (error) {
      console.error('❌ Registration error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Có lỗi xảy ra. Vui lòng thử lại.' 
      });
    }
  }

  if (req.method === 'POST' && req.query.action === 'login') {
    return res.json({
      success: true,
      message: 'Đăng nhập thành công!',
      user: {
        id: 'user-' + Date.now(),
        fullName: 'Người dùng Demo',
        email: req.body.email,
        plan: 'free'
      },
      token: `login-token-${Date.now()}`
    });
  }

  // Default response
  res.status(404).json({ 
    success: false, 
    message: 'Endpoint not found',
    availableEndpoints: [
      'GET /api/english?action=test',
      'POST /api/english?action=register', 
      'POST /api/english?action=login'
    ]
  });
};