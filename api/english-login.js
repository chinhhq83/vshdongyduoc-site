module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    res.json({
      success: true,
      message: 'Đăng nhập thành công!',
      user: {
        id: 'engapp-user-' + Date.now(),
        fullName: 'Người dùng English App',
        email: email,
        plan: 'free'
      },
      token: `engapp-login-${Date.now()}`
    });

  } catch (error) {
    console.error('❌ Lỗi đăng nhập English App:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Có lỗi xảy ra. Vui lòng thử lại.' 
    });
  }
};