import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore/lite";
import { google } from 'googleapis';

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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, phone, wilaya, commune, deliveryType, price, productId, productName } = req.body;

    let nextOrderNumber = 1;
    try {
      const configRef = doc(db, "config", "main");
      const configSnap = await getDoc(configRef);
      if (configSnap.exists()) {
        nextOrderNumber = (configSnap.data().orderCounter || 0) + 1;
        await setDoc(configRef, { orderCounter: nextOrderNumber }, { merge: true });
      }
    } catch (err) {
      console.error("Error updating order counter:", err);
    }
    
    const displayId = String(nextOrderNumber).padStart(2, '0');

    try {
      await addDoc(collection(db, "orders"), {
        name,
        phone,
        wilaya,
        commune,
        deliveryType,
        price,
        productId: productId || 'med-alarm',
        productName: productName || 'منبه الدواء الذكي',
        createdAt: serverTimestamp(),
        orderNumber: nextOrderNumber,
        displayId,
        sheetSynced: false
      });
    } catch (err) {
      console.error("Error saving order to Firestore:", err);
    }

    // Google Sheets Service Account Sync
    const saEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    let saKey = process.env.GOOGLE_PRIVATE_KEY;
    
    if (saEmail && saKey) {
      try {
        saKey = saKey.replace(/\\n/g, '\n');
        const auth = new google.auth.JWT(
          saEmail,
          null,
          saKey,
          ['https://www.googleapis.com/auth/spreadsheets']
        );
        
        const configRef = doc(db, "config", "main");
        const configSnap = await getDoc(configRef);
        if (configSnap.exists()) {
          const spreadsheetId = configSnap.data().spreadsheetId;
          if (spreadsheetId) {
            const sheets = google.sheets({ version: 'v4', auth });
            const dateStr = new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Algiers' });
            
            await sheets.spreadsheets.values.append({
              spreadsheetId,
              range: 'Commandes!A1',
              valueInputOption: 'USER_ENTERED',
              requestBody: {
                values: [[
                  displayId,
                  name,
                  phone,
                  wilaya,
                  commune,
                  deliveryType === 'home' ? 'Domicile' : 'Stop Desk',
                  price,
                  dateStr,
                  'Nouveau'
                ]]
              }
            });
            console.log("Successfully synced order to Google Sheets.");
          }
        }
      } catch (sheetErr) {
        console.error("Error syncing to Google Sheets:", sheetErr);
      }
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.warn("Telegram credentials not configured. Order received but not sent to Telegram.");
      return res.status(200).json({ success: true, warning: "Telegram not configured" });
    }

    const dateStr = new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Algiers' });
    const text = `🛒 *طلبية جديدة #${displayId}!*\n🕒 *التاريخ والوقت:* ${dateStr}\n👤 *الاسم:* ${name}\n📞 *رقم الهاتف:* ${phone}\n📍 *الولاية:* ${wilaya}\n🏙️ *البلدية:* ${commune}\n🚚 *نوع التوصيل:* ${deliveryType === 'home' ? 'لباب المنزل' : 'للمكتب (Stop Desk)'}\n💰 *السعر الإجمالي:* ${price} د.ج`;

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: "Markdown",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Telegram API Error:", errorData);
      return res.status(500).json({ success: false, error: "Failed to send to Telegram" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Order processing error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
}
