import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  // Buscar token en múltiples lugares
  const token = 
    req.cookies?.access_token ||          
    req.headers['authorization']?.split(' ')[1] || 
    req.headers['x-access-token'];        

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    return res.status(500).json({ message: 'Token verification failed' });
  }
};