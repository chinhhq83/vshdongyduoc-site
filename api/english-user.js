// api/user.js
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // TODO: Trong thực tế, xác thực token và lấy user từ database
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Token không hợp lệ' });
    }

    res.json({
      success: true,
      user: {
        id: 'demo-user',
        fullName: 'Người dùng Demo',
        email: 'demo@example.com',
        plan: 'free'
      }
    });

  } catch (error) {
    console.error('❌ Lỗi lấy thông tin user:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Có lỗi xảy ra.' 
    });
  }
};