import jwt from "jsonwebtoken";

export default function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ admin: true }, process.env.JWT_SECRET || 'supersecret', { expiresIn: '7d' });
    // In serverless environment, use standard setHeader for cookies
    res.setHeader('Set-Cookie', `admin_token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}`);
    return res.status(200).json({ success: true, token });
  }
  
  return res.status(401).json({ success: false, error: "Invalid password" });
}
