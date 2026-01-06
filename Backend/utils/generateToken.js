import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET || 'your_fallback_secret_key_change_this', {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    });

    // Set cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    console.log('Token generated for user:', userId);
    return token;
  } catch (error) {
    console.error('Error generating token:', error);
    throw new Error('Failed to generate token');
  }
};

export default generateToken;