import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, orderBy, limit, doc, updateDoc } from "firebase/firestore/lite";
import jwt from "jsonwebtoken";

const firebaseConfig = {
  projectId: "gen-lang-client-0983661862",
  appId: "1:492139124696:web:b67e8ef2beaa622150c4ad",
  apiKey: "AIzaSyBmaOFGKyMwJ735BkZ4Psmdx6H2rAtBei8",
  authDomain: "gen-lang-client-0983661862.firebaseapp.com",
  storageBucket: "gen-lang-client-0983661862.firebasestorage.app",
  messagingSenderId: "492139124696"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-e9c2d681-7821-46c6-83a5-06aac423e67a");

export default async function handler(req: any, res: any) {
  // Auth Check
  const token = req.cookies?.admin_token || req.headers.cookie?.match(/(?:(?:^|.*;\s*)admin_token\s*\=\s*([^;]*).*$)|^.*$/)?.[1] || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
  
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    jwt.verify(token, process.env.JWT_SECRET || 'supersecret');
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }

  if (req.method === 'GET') {
    try {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"), limit(100));
      const querySnapshot = await getDocs(q);
      const orders = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : doc.data().createdAt
      }));
      return res.status(200).json(orders);
    } catch (error) {
      console.error("Error reading orders:", error);
      return res.status(500).json({ error: "Failed to read orders" });
    }
  }

  if (req.method === 'PUT') {
    // If the URL is just /api/orders, this doesn't match the specific ID route, but let's assume they could send the ID in the body.
    return res.status(405).json({ error: 'Use /api/orders/[id] instead' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
