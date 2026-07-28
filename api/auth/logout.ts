export default function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).end();
  res.setHeader('Set-Cookie', 'admin_token=; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
  return res.status(200).json({ success: true });
}
