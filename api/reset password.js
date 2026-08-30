import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)),
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST 요청만 가능합니다." });
  }

  const { uid, newPassword, adminPassword } = req.body || {};

  if (!process.env.ADMIN_CREATE_SECRET) {
    return res.status(500).json({ error: "서버에 ADMIN_CREATE_SECRET이 설정되지 않았습니다." });
  }
  if (adminPassword !== process.env.ADMIN_CREATE_SECRET) {
    return res.status(401).json({ error: "관리자 비밀번호가 올바르지 않습니다." });
  }
  if (!uid) {
    return res.status(400).json({ error: "대상 계정 정보가 없습니다." });
  }
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: "새 비밀번호는 6자 이상이어야 합니다." });
  }

  try {
    await admin.auth().updateUser(uid, { password: newPassword });
    return res.status(200).json({ ok: true });
  } catch (e) {
    let message = e.message || String(e);
    if (e.code === "auth/user-not-found") message = "해당 계정을 찾을 수 없습니다.";
    return res.status(400).json({ error: message });
  }
}
