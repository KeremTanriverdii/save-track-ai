// lib/firebaseAdmin.ts

import * as admin from 'firebase-admin';

// Sadece bir kez başlatıldığından emin olun
if (!admin.apps.length) {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    // Ortam değişkeni kontrolü
    if (!serviceAccountJson) {
        throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY ortam değişkeni ayarlanmadı. Lütfen .env.local dosyanızı kontrol edin.");
    }

    try {
        // 1. JSON stringini objeye dönüştür
        let serviceAccount = JSON.parse(serviceAccountJson);

        // 2. KRİTİK: private_key içindeki kaçış karakterlerini (\\n) düzelt
        // Bu, sunucu ortamlarında sıkça karşılaşılan bir sorunu çözer.
        if (serviceAccount.private_key) {
            serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
        }

        // 3. Admin SDK'yı başlat
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        console.log("✅ Firebase Admin SDK başarıyla başlatıldı.");

    } catch (error) {
        console.error("❌ Firebase Admin SDK başlatılamadı veya JSON parse hatası:", error);
        // Hatanın detayını göstererek Next.js'in çökmesini sağlayın
        throw new Error("Admin SDK Kimlik Bilgileri Hatalı. JSON formatını ve .env.local dosyanızı kontrol edin.");
    }
}

const adminDb = admin.firestore();
export { adminDb };