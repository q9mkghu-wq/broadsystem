import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)),
  });
}

function toEmail(username) {
  return `${String(username || "").trim().toLowerCase()}@broadsystem.local`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST 요청만 가능합니다." });
  }

  const { username, password, name, role, adminPassword } = req.body || {};

  if (!process.env.ADMIN_CREATE_SECRET) {
    return res.status(500).json({ error: "서버에 ADMIN_CREATE_SECRET이 설정되지 않았습니다." });
  }
  if (adminPassword !== process.env.ADMIN_CREATE_SECRET) {
    return res.status(401).json({ error: "관리자 비밀번호가 올바르지 않습니다." });
  }
  if (!username || !username.trim()) {
    return res.status(400).json({ error: "아이디를 입력해 주세요." });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ error: "비밀번호는 6자 이상이어야 합니다." });
  }

  const email = toEmail(username);

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name || username,
    });

    await admin.firestore().collection("users").doc(userRecord.uid).set({
      username: username.trim(),
      name: name || username,
      role: role || "기사",
      createdAt: Date.now(),
    });

    return res.status(200).json({ ok: true, uid: userRecord.uid });
  } catch (e) {
    let message = e.message || String(e);
    if (e.code === "auth/email-already-exists") message = "이미 존재하는 아이디입니다.";
    if (e.code === "auth/invalid-password") message = "비밀번호는 6자 이상이어야 합니다.";
    return res.status(400).json({ error: message });
  }
}
