// api/english-register.js
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

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed. Use POST.' 
    });
  }

  try {
    const { fullName, email, password, childName, childAge } = req.body;
    
    console.log('📧 English App - Registration received:', { fullName, email });

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
    res.json({
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
    console.error('❌ English App - Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Có lỗi xảy ra. Vui lòng thử lại.' 
    });
  }
};