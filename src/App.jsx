import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Plus, X, Ruler, User, Factory, Truck, MapPin, StickyNote, Trash2, Calendar as CalendarIcon, RotateCcw, Phone, LogOut, UserPlus } from "lucide-react";
import { db, auth, surveyDb } from "./firebase";
import { doc, onSnapshot, setDoc, deleteDoc, getDoc, getDocs, collection, query, where, writeBatch } from "firebase/firestore";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";

function toEmail(username) {
  return `${String(username || "").trim().toLowerCase()}@broadsystem.local`;
}

// ---------- Phone back-button support ----------
// Each open modal/overlay pushes one browser-history entry and registers itself on this
// stack. The back button fires 'popstate', which closes only the most recently opened
// layer (LIFO) — so nested overlays (e.g. a photo lightbox on top of an order-detail
// modal) close one step at a time instead of the whole app navigating away.
const backLayerStack = [];
let backPopstateAttached = false;

function ensureBackPopstateListener() {
  if (backPopstateAttached) return;
  backPopstateAttached = true;
  window.addEventListener("popstate", () => {
    const top = backLayerStack.pop();
    if (top) top.onClose();
  });
}

function useBackableLayer(isOpen, onClose) {
  const tokenRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    ensureBackPopstateListener();
  }, []);

  useEffect(() => {
    if (isOpen && !tokenRef.current) {
      const token = { onClose: () => onCloseRef.current() };
      tokenRef.current = token;
      backLayerStack.push(token);
      window.history.pushState({ backLayer: true }, "");
    } else if (!isOpen && tokenRef.current) {
      // Closed via an in-app button (not the back button) — remove our entry from the
      // stack and pop the matching history entry so it doesn't pile up over time.
      const idx = backLayerStack.indexOf(tokenRef.current);
      if (idx !== -1) backLayerStack.splice(idx, 1);
      tokenRef.current = null;
      if (window.history.state && window.history.state.backLayer) {
        window.history.back();
      }
    }
  }, [isOpen]);
}

const jobsCollectionRef = collection(db, "jobs");
const legacyJobsDocRef = doc(db, "board", "jobs"); // old single-document storage, kept only for one-time migration
const techDocRef = doc(db, "board", "technicians");

const PAPER = "#F3EFE4";
const NAVY = "#1E3A5F";
const NAVY_LIGHT = "#3D6EA5";
const ORANGE = "#E0631E";
const INK = "#2B2B28";
const GREEN = "#3F6B3F";
const GRAY = "#8B8478";
const GRID_LINE = "#D9D3C2";

const PROD_STATUS = ["대기중", "제작완료", "상차완료", "설치완료"];
const PROD_COLOR = {
  "대기중": { bg: "#EDE9DD", text: GRAY, border: "#C9C3B3" },
  "제작완료": { bg: "#E7F0E3", text: GREEN, border: "#9FC08F" },
  "상차완료": { bg: "#DCEEC5", text: "#1E3A5F", border: "#A8C980" },
  "설치완료": { bg: "#E6F1FB", text: "#0C447C", border: "#85B7EB" },
};

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function pad(n) { return String(n).padStart(2, "0"); }
function toKey(d) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
function todayKey() { return toKey(new Date()); }
function fmtDate(key) {
  if (!key) return "";
  const [y, m, d] = key.split("-");
  return `${y}.${m}.${d}`;
}
function getRegion(address) {
  if (!address) return "";
  const first = address.trim().split(/\s+/)[0];
  return first || "";
}
function emptyJob(dateKey) {
  return {
    id: "job_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
    siteName: "",
    address: "",
    orderDate: dateKey || todayKey(),
    measureDate: "",
    measureTech: "",
    width: "",
    heightCm: "",
    ceilingHeight: "",
    photos: [],
    officeDrawings: [],
    productionStatus: "대기중",
    installDate: "",
    installTech: "",
    memo: "",
  };
}

function resizeImageFile(file, maxDim, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("이미지를 읽을 수 없습니다."));
      img.onload = () => {
        let w = img.width, h = img.height;
        if (w > h && w > maxDim) { h = Math.round((h * maxDim) / w); w = maxDim; }
        else if (h > maxDim) { w = Math.round((w * maxDim) / h); h = maxDim; }
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function CornerMarks() {
  const s = { position: "absolute", width: 7, height: 7, borderColor: GRID_LINE };
  return (
    <>
      <div style={{ ...s, top: 2, left: 2, borderTop: "1px solid", borderLeft: "1px solid" }} />
      <div style={{ ...s, top: 2, right: 2, borderTop: "1px solid", borderRight: "1px solid" }} />
      <div style={{ ...s, bottom: 2, left: 2, borderBottom: "1px solid", borderLeft: "1px solid" }} />
      <div style={{ ...s, bottom: 2, right: 2, borderBottom: "1px solid", borderRight: "1px solid" }} />
    </>
  );
}

function Stamp({ text }) {
  const c = PROD_COLOR[text] || PROD_COLOR["대기중"];
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: 11,
        fontWeight: 800,
        padding: "2px 8px",
        borderRadius: 4,
        border: `1px dashed ${c.border}`,
        color: c.text,
        background: c.bg,
        transform: "rotate(-2deg)",
        letterSpacing: "0.02em",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </span>
  );
}

function Field({ label, icon, children }) {
  return (
    <label className="block mb-3">
      <div className="flex items-center gap-1 mb-1" style={{ fontSize: 12, fontWeight: 700, color: NAVY }}>
        {icon}
        <span>{label}</span>
      </div>
      {children}
    </label>
  );
}

const inputStyle = {
  width: "100%",
  border: `1px solid ${GRID_LINE}`,
  borderRadius: 6,
  padding: "8px 10px",
  fontSize: 14,
  background: "#FFFFFF",
  color: INK,
  fontFamily: "inherit",
  boxSizing: "border-box",
};

export default function InstallBoard() {
  const [jobs, setJobs] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [cursor, setCursor] = useState(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(todayKey());
  const [editingJob, setEditingJob] = useState(null);
  const [techFilter, setTechFilter] = useState("전체");
  const [viewMode, setViewMode] = useState("calendar");
  const [confirmReset, setConfirmReset] = useState(false);
  const [techPhones, setTechPhones] = useState({});
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [techAccounts, setTechAccounts] = useState([]);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [createAccountOpen, setCreateAccountOpen] = useState(false);

  // Phone back-button closes one overlay at a time, in the order they were opened.
  useBackableLayer(!!editingJob, () => setEditingJob(null));
  useBackableLayer(phoneModalOpen, () => setPhoneModalOpen(false));
  useBackableLayer(createAccountOpen, () => setCreateAccountOpen(false));

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  const handleLogin = async (username, password) => {
    setLoginLoading(true);
    setLoginError("");
    try {
      await signInWithEmailAndPassword(auth, toEmail(username), password);
    } catch (e) {
      setLoginError("아이디 또는 비밀번호가 올바르지 않습니다.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => signOut(auth);

  useEffect(() => {
    if (!user) {
      setJobs([]);
      setLoaded(false);
      return;
    }
    let migrated = false;
    const unsub = onSnapshot(
      jobsCollectionRef,
      async (snap) => {
        if (snap.empty && !migrated) {
          // One-time migration from the old single-document format, if any legacy data exists.
          migrated = true;
          try {
            const legacy = await getDoc(legacyJobsDocRef);
            const legacyJobs = legacy.exists() ? legacy.data().jobs || [] : [];
            if (legacyJobs.length) {
              const batch = writeBatch(db);
              legacyJobs.forEach((j) => batch.set(doc(db, "jobs", j.id), j));
              await batch.commit();
              return; // onSnapshot fires again automatically with the migrated data
            }
          } catch (e) {
            // ignore migration errors — just proceed with an empty board
          }
        }
        setJobs(snap.docs.map((d) => d.data()));
        setError("");
        setLoaded(true);
      },
      (e) => {
        const detail = e && (e.code || e.message) ? ` (${e.code || ""} ${e.message || ""})` : "";
        setError("데이터를 불러오지 못했습니다. 인터넷 연결을 확인하고 새로고침해 주세요." + detail);
        setLoaded(true);
      }
    );
    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (!user) {
      setTechPhones({});
      return;
    }
    const unsub = onSnapshot(techDocRef, (snap) => {
      setTechPhones(snap.exists() ? snap.data().phones || {} : {});
    });
    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (!user) {
      setTechAccounts([]);
      return;
    }
    const q = query(collection(db, "users"), where("role", "==", "기사"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setTechAccounts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
      () => setTechAccounts([])
    );
    return () => unsub();
  }, [user]);

  const persistJob = useCallback(async (job) => {
    setSaving(true);
    try {
      await setDoc(doc(db, "jobs", job.id), job);
      setError("");
    } catch (e) {
      setError("저장 중 오류가 발생했습니다. 사진 용량이 너무 크면 실패할 수 있어요 — 사진 수를 줄여서 다시 시도해 주세요.");
    } finally {
      setSaving(false);
    }
  }, []);

  const removeJob = useCallback(async (id) => {
    setSaving(true);
    try {
      await deleteDoc(doc(db, "jobs", id));
      setError("");
    } catch (e) {
      setError("삭제 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  }, []);

  const saveJob = (job) => {
    setJobs((prev) => {
      const exists = prev.some((j) => j.id === job.id);
      return exists ? prev.map((j) => (j.id === job.id ? job : j)) : [...prev, job];
    });
    persistJob(job);
    setEditingJob(null);
  };

  const deleteJob = (id) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
    removeJob(id);
    setEditingJob(null);
  };

  const resetAll = async () => {
    setSaving(true);
    try {
      const snap = await getDocs(jobsCollectionRef);
      const batch = writeBatch(db);
      snap.forEach((d) => batch.delete(d.ref));
      await batch.commit();
      setJobs([]);
      setError("");
    } catch (e) {
      setError("초기화 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
      setConfirmReset(false);
    }
  };

  const savePhones = async (nextPhones) => {
    setTechPhones(nextPhones);
    try {
      await setDoc(techDocRef, { phones: nextPhones, updatedAt: Date.now() });
    } catch (e) {
      setError("연락처 저장 중 오류가 발생했습니다.");
    }
  };

  const technicians = useMemo(() => {
    const set = new Set();
    jobs.forEach((j) => {
      if (j.measureTech) set.add(j.measureTech.trim());
      if (j.installTech) set.add(j.installTech.trim());
    });
    return Array.from(set).filter(Boolean).sort();
  }, [jobs]);

  const registeredTechNames = useMemo(() => {
    return Array.from(new Set(techAccounts.map((a) => a.name).filter(Boolean))).sort();
  }, [techAccounts]);

  const visibleJobs = useMemo(() => {
    if (techFilter === "전체") return jobs;
    return jobs.filter((j) => j.measureTech === techFilter || j.installTech === techFilter);
  }, [jobs, techFilter]);

  const pendingJobs = useMemo(() => {
    return visibleJobs
      .filter((j) => !j.installDate)
      .sort((a, b) => {
        // Not-yet-measured jobs first, then by order date (oldest first)
        const aMeasured = a.measureDate ? 1 : 0;
        const bMeasured = b.measureDate ? 1 : 0;
        if (aMeasured !== bMeasured) return aMeasured - bMeasured;
        return (a.orderDate || "").localeCompare(b.orderDate || "");
      });
  }, [visibleJobs]);

  // events per date: {orderDate, measureDate, installDate}
  const eventsByDate = useMemo(() => {
    const map = {};
    visibleJobs.forEach((j) => {
      [
        ["order", j.orderDate],
        ["measure", j.measureDate],
        ["install", j.installDate],
      ].forEach(([type, key]) => {
        if (!key) return;
        if (!map[key]) map[key] = { order: [], measure: [], install: [] };
        map[key][type].push(j);
      });
    });
    return map;
  }, [visibleJobs]);

  const monthLabel = `${cursor.getFullYear()}년 ${cursor.getMonth() + 1}월`;

  const weeks = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = firstDay.getDay();
    const gridStart = new Date(year, month, 1 - startOffset);
    const days = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
      days.push(d);
    }
    const rows = [];
    for (let i = 0; i < 6; i++) rows.push(days.slice(i * 7, i * 7 + 7));
    return rows;
  }, [cursor]);

  const monthPrefix = `${cursor.getFullYear()}-${pad(cursor.getMonth() + 1)}`;

  // Jobs with no install date yet: not tied to any specific month, so they always show,
  // in every month's list, at the top, in their own labeled box.
  const unsetInstallJobs = useMemo(() => {
    return visibleJobs
      .filter((j) => !j.installDate)
      .sort((a, b) => (a.orderDate || "").localeCompare(b.orderDate || ""));
  }, [visibleJobs]);

  // Jobs with an install date: shown only in the month their install date falls in —
  // never in the order month, even if the order came in a different month.
  const monthDatedJobs = useMemo(() => {
    return visibleJobs
      .filter((j) => j.installDate && j.installDate.startsWith(monthPrefix))
      .sort((a, b) => a.installDate.localeCompare(b.installDate));
  }, [visibleJobs, monthPrefix]);

  const todaySummary = useMemo(() => {
    const tk = todayKey();
    const measureToday = jobs.filter((j) => j.measureDate === tk).length;
    const installToday = jobs.filter((j) => j.installDate === tk).length;
    const waitingProd = jobs.filter((j) => j.productionStatus !== "제작완료" && j.productionStatus !== "상차완료" && j.productionStatus !== "설치완료" && j.measureDate).length;
    return { measureToday, installToday, waitingProd };
  }, [jobs]);

  if (authLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: PAPER, color: GRAY, fontSize: 13 }}>
        불러오는 중…
      </div>
    );
  }

  if (!user) {
    return <LoginScreen onLogin={handleLogin} error={loginError} loading={loginLoading} />;
  }

  return (
    <div
      className="board-root"
      style={{
        background: PAPER,
        backgroundImage: `linear-gradient(${GRID_LINE} 1px, transparent 1px), linear-gradient(90deg, ${GRID_LINE} 1px, transparent 1px)`,
        backgroundSize: "24px 24px",
        minHeight: "100vh",
        minWidth: 900,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Malgun Gothic', system-ui, sans-serif",
        color: INK,
        padding: 16,
      }}
    >
      {/* Header / title block */}
      <div
        className="board-header"
        style={{
          border: `2px solid ${NAVY}`,
          borderRadius: 4,
          background: "#FBF9F3",
          padding: "14px 18px",
          marginBottom: 14,
          position: "relative",
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.12em", color: NAVY_LIGHT, fontWeight: 800 }}>
              행거 시스템장 설치 관리
            </div>
            <div className="board-title" style={{ fontSize: 20, fontWeight: 800, color: NAVY }}>설치일정 통합보드</div>
          </div>
          <div className="flex items-center gap-2">
            {saving && <span style={{ fontSize: 12, color: GRAY }}>저장 중…</span>}
            <button
              onClick={() => setCreateAccountOpen(true)}
              style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: NAVY_LIGHT, background: "#fff", border: `1px solid ${NAVY_LIGHT}`, borderRadius: 6, padding: "8px 10px", cursor: "pointer" }}
            >
              <UserPlus size={14} /> 계정 만들기
            </button>
            <button
              onClick={handleLogout}
              style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: GRAY, background: "#fff", border: `1px solid ${GRID_LINE}`, borderRadius: 6, padding: "8px 10px", cursor: "pointer" }}
            >
              <LogOut size={14} /> 로그아웃
            </button>
            <button
              onClick={() => !error && setEditingJob(emptyJob(selectedDate))}
              disabled={!!error}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: error ? GRAY : ORANGE,
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "9px 14px",
                fontSize: 13,
                fontWeight: 700,
                cursor: error ? "not-allowed" : "pointer",
              }}
            >
              <Plus size={16} /> 새 주문 등록
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <div style={{ fontSize: 12, background: "#E6F1FB", color: "#0C447C", border: "1px solid #85B7EB", borderRadius: 5, padding: "4px 10px" }}>
            오늘 실측 <b>{todaySummary.measureToday}</b>건
          </div>
          <div style={{ fontSize: 12, background: "#FCEEDF", color: "#B15A16", border: "1px solid #E8A768", borderRadius: 5, padding: "4px 10px" }}>
            오늘 설치 <b>{todaySummary.installToday}</b>건
          </div>
          <div style={{ fontSize: 12, background: "#EDE9DD", color: GRAY, border: `1px solid #C9C3B3`, borderRadius: 5, padding: "4px 10px" }}>
            제작 대기/진행 <b>{todaySummary.waitingProd}</b>건
          </div>
        </div>
      </div>

      {error && (
        <div style={{ background: "#FCEBEB", color: "#791F1F", border: "1px solid #F09595", borderRadius: 6, padding: "10px 12px", marginBottom: 12, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <span>{error}</span>
          <button
            onClick={() => window.location.reload()}
            style={{ fontSize: 12, fontWeight: 700, color: "#791F1F", background: "#fff", border: "1px solid #F09595", borderRadius: 5, padding: "5px 10px", cursor: "pointer", whiteSpace: "nowrap" }}
          >
            다시 불러오기
          </button>
        </div>
      )}

      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span style={{ fontSize: 12, color: GRAY, fontWeight: 700 }}>담당기사</span>
        <button
          onClick={() => setTechFilter("전체")}
          style={{
            fontSize: 12,
            padding: "4px 10px",
            borderRadius: 999,
            border: `1px solid ${techFilter === "전체" ? NAVY : GRID_LINE}`,
            background: techFilter === "전체" ? NAVY : "#fff",
            color: techFilter === "전체" ? "#fff" : INK,
            cursor: "pointer",
          }}
        >
          전체
        </button>
        {technicians.map((t) => (
          <button
            key={t}
            onClick={() => setTechFilter(t)}
            style={{
              fontSize: 12,
              padding: "4px 10px",
              borderRadius: 999,
              border: `1px solid ${techFilter === t ? NAVY : GRID_LINE}`,
              background: techFilter === t ? NAVY : "#fff",
              color: techFilter === t ? "#fff" : INK,
              cursor: "pointer",
            }}
          >
            {t}
          </button>
        ))}
        <button
          onClick={() => setPhoneModalOpen(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: 12,
            padding: "4px 10px",
            borderRadius: 999,
            border: `1px solid ${NAVY_LIGHT}`,
            background: "#fff",
            color: NAVY_LIGHT,
            cursor: "pointer",
          }}
        >
          <Phone size={12} /> 연락처 관리
        </button>
      </div>

      {/* View tabs */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setViewMode("calendar")}
          style={{
            fontSize: 13,
            fontWeight: 700,
            padding: "8px 14px",
            borderRadius: 6,
            border: `1px solid ${viewMode === "calendar" ? NAVY : GRID_LINE}`,
            background: viewMode === "calendar" ? NAVY : "#fff",
            color: viewMode === "calendar" ? "#fff" : INK,
            cursor: "pointer",
          }}
        >
          📅 달력
        </button>
        <button
          onClick={() => setViewMode("pending")}
          style={{
            fontSize: 13,
            fontWeight: 700,
            padding: "8px 14px",
            borderRadius: 6,
            border: `1px solid ${viewMode === "pending" ? ORANGE : GRID_LINE}`,
            background: viewMode === "pending" ? ORANGE : "#fff",
            color: viewMode === "pending" ? "#fff" : INK,
            cursor: "pointer",
          }}
        >
          📋 설치일 미정 고객 {pendingJobs.length > 0 && `(${pendingJobs.length})`}
        </button>
      </div>

      {viewMode === "pending" ? (
        <div style={{ background: "#FBF9F3", border: `1px solid ${GRID_LINE}`, borderRadius: 6, padding: 14, marginBottom: 14 }}>
          <div style={{ fontWeight: 800, color: NAVY, fontSize: 14, marginBottom: 4 }}>
            설치일 미정 고객 ({pendingJobs.length}건)
          </div>
          <div style={{ fontSize: 12, color: GRAY, marginBottom: 12 }}>
            아직 설치일이 정해지지 않은 주문이에요. 실측 후 치수를 입력하고, 설치일이 정해지면 카드를 열어 설치일을 넣어주세요 — 넣는 즉시 달력에도 자동으로 나타나요.
          </div>

          {pendingJobs.length === 0 && (
            <div style={{ fontSize: 13, color: GRAY, padding: "16px 4px" }}>설치일 미정 고객이 없습니다.</div>
          )}

          <div className="flex flex-col gap-2">
            {pendingJobs.map((j) => (
              <div key={j.id} style={{ border: `1px solid ${GRID_LINE}`, borderRadius: 6, padding: "10px 12px", background: "#fff" }}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div style={{ fontWeight: 700, fontSize: 14, color: INK }}>
                    {j.siteName || "(현장명 미입력)"}
                  </div>
                  <Stamp text={j.productionStatus} />
                </div>
                <div style={{ fontSize: 12, color: GRAY, marginTop: 2 }}>
                  {j.address && <span><MapPin size={11} style={{ display: "inline", marginRight: 3, verticalAlign: -1 }} />{j.address}</span>}
                </div>
                <div className="flex flex-wrap gap-3 mt-2" style={{ fontSize: 12 }}>
                  <span style={{ color: GRAY }}>주문 {j.orderDate ? fmtDate(j.orderDate) : "-"}</span>
                  <span style={{ color: j.measureDate ? NAVY_LIGHT : "#B15A16", fontWeight: j.measureDate ? 400 : 700 }}>
                    실측 {j.measureDate ? `${fmtDate(j.measureDate)}${j.measureTech ? " · " + j.measureTech : ""}` : "실측 필요"}
                  </span>
                </div>
                {(j.width || j.heightCm || j.ceilingHeight) && (
                  <div style={{ fontSize: 12, color: INK, marginTop: 4, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
                    W{j.width || "-"} × H{j.heightCm || "-"} · 천고 {j.ceilingHeight || "-"}
                  </div>
                )}
                <div className="flex gap-2 mt-2">
                  <a
                    href={`https://q9mkghu-wq.github.io/hanger-survey/?jobId=${encodeURIComponent(j.id)}&name=${encodeURIComponent(j.siteName || "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 12, fontWeight: 700, color: NAVY_LIGHT, border: `1px solid ${NAVY_LIGHT}`, borderRadius: 5, padding: "6px 10px", textDecoration: "none" }}
                  >
                    📐 실측 앱 열기
                  </a>
                  <button
                    onClick={() => setEditingJob(j)}
                    style={{ fontSize: 12, fontWeight: 700, color: "#fff", background: ORANGE, border: "none", borderRadius: 5, padding: "6px 10px", cursor: "pointer" }}
                  >
                    정보 입력 / 설치일 지정
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
      <>
      {/* Calendar */}
      <div style={{ background: "#FBF9F3", border: `1px solid ${GRID_LINE}`, borderRadius: 6, padding: 12, marginBottom: 14 }}>
        <div className="flex items-center justify-between mb-2">
          <button onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))} style={{ border: "none", background: "transparent", cursor: "pointer", color: NAVY }}>
            <ChevronLeft size={20} />
          </button>
          <div style={{ fontWeight: 800, fontSize: 15, color: NAVY }}>{monthLabel}</div>
          <button onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))} style={{ border: "none", background: "transparent", cursor: "pointer", color: NAVY }}>
            <ChevronRight size={20} />
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 4 }}>
          {WEEKDAYS.map((w, i) => (
            <div key={w} style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: i === 0 ? "#A32D2D" : i === 6 ? NAVY_LIGHT : GRAY, padding: "4px 0" }}>
              {w}
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
          {weeks.flat().map((d, idx) => {
            const key = toKey(d);
            const inMonth = d.getMonth() === cursor.getMonth();
            const isToday = key === todayKey();
            const isSelected = key === selectedDate;
            const ev = eventsByDate[key];
            return (
              <div
                key={idx}
                className="cal-cell"
                onClick={() => setSelectedDate(key)}
                style={{
                  position: "relative",
                  minHeight: 78,
                  background: isSelected ? "#EAF3FB" : "#fff",
                  border: `1px solid ${isToday ? ORANGE : GRID_LINE}`,
                  borderWidth: isToday ? 2 : 1,
                  borderRadius: 4,
                  padding: "4px 5px",
                  cursor: "pointer",
                  opacity: inMonth ? 1 : 0.35,
                }}
              >
                <CornerMarks />
                <div style={{ fontSize: 12, fontWeight: isToday ? 800 : 500, color: isToday ? ORANGE : d.getDay() === 0 ? "#A32D2D" : d.getDay() === 6 ? NAVY_LIGHT : INK }}>
                  {d.getDate()}
                </div>
                {ev && ev.install.length > 0 && (
                  <div className="flex flex-col gap-0.5 mt-1">
                    {ev.install.map((j) => (
                      <div
                        key={j.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDate(key);
                          setEditingJob(j);
                        }}
                        style={{
                          fontSize: 9,
                          lineHeight: 1.3,
                          background: "#FCEEDF",
                          color: "#B15A16",
                          borderRadius: 3,
                          padding: "1px 3px",
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          cursor: "pointer",
                        }}
                        title={`${getRegion(j.address)} ${j.siteName || ""} · ${j.installTech || "미배정"} — 클릭하면 주문 상세가 열립니다`}
                      >
                        {getRegion(j.address) || "지역미정"} {j.siteName || "고객명미정"}
                        (<span
                          style={
                            j.productionStatus === "제작완료"
                              ? { background: NAVY_LIGHT, color: "#fff", borderRadius: 3, padding: "0 3px", fontWeight: 800 }
                              : j.productionStatus === "설치완료"
                              ? { background: "#C0392B", color: "#fff", borderRadius: 3, padding: "0 3px", fontWeight: 800 }
                              : j.productionStatus === "상차완료"
                              ? { background: PROD_COLOR["상차완료"].bg, color: PROD_COLOR["상차완료"].text, borderRadius: 3, padding: "0 3px", fontWeight: 800 }
                              : {}
                          }
                        >
                          {j.productionStatus}
                        </span>)
                        <br />
                        <span style={{ fontWeight: 700, color: INK }}>{j.installTech || "기사미배정"}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-3 mt-3" style={{ fontSize: 11, color: GRAY }}>
          <span><span style={{ display: "inline-block", width: 8, height: 8, background: ORANGE, borderRadius: 2, marginRight: 4 }} />설치일</span>
          <span>날짜를 누르면 새 주문을 그 날짜로 등록할 수 있어요 · 아래는 이번 달 전체 목록이에요</span>
        </div>
      </div>

      {/* Month detail */}
      <div style={{ background: "#FBF9F3", border: `1px solid ${GRID_LINE}`, borderRadius: 6, padding: 14 }}>
        <div className="flex items-center justify-between mb-2">
          <div style={{ fontWeight: 800, color: NAVY, fontSize: 14 }}>
            {monthLabel} 전체 일정 ({unsetInstallJobs.length + monthDatedJobs.length}건)
          </div>
          <button
            onClick={() => !error && setEditingJob(emptyJob(selectedDate))}
            disabled={!!error}
            style={{ fontSize: 12, color: error ? GRAY : NAVY_LIGHT, background: "transparent", border: `1px solid ${error ? GRAY : NAVY_LIGHT}`, borderRadius: 5, padding: "4px 9px", cursor: error ? "not-allowed" : "pointer" }}
          >
            + {fmtDate(selectedDate)}에 등록
          </button>
        </div>

        {unsetInstallJobs.length > 0 && (
          <div style={{ border: `1.5px dashed #E8C79A`, background: "#FDF4E3", borderRadius: 8, padding: 10, marginBottom: 14 }}>
            <div style={{ fontWeight: 800, color: "#B15A16", fontSize: 12.5, marginBottom: 8 }}>
              📌 설치일 미정 ({unsetInstallJobs.length}건)
            </div>
            <div className="flex flex-col gap-2">
              {unsetInstallJobs.map((j) => (
                <div
                  key={j.id}
                  onClick={() => setEditingJob(j)}
                  style={{ border: `1px solid #E8C79A`, borderRadius: 6, padding: "10px 12px", background: "#fff", cursor: "pointer" }}
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div style={{ fontWeight: 700, fontSize: 14, color: INK }}>
                      {j.siteName || "(현장명 미입력)"}
                    </div>
                    <Stamp text={j.productionStatus} />
                  </div>
                  <div style={{ fontSize: 12, color: GRAY, marginTop: 2 }}>
                    {j.address && <span><MapPin size={11} style={{ display: "inline", marginRight: 3, verticalAlign: -1 }} />{j.address}</span>}
                  </div>
                  <div className="flex flex-wrap gap-3 mt-2" style={{ fontSize: 12 }}>
                    <span style={{ color: GRAY }}>주문 {j.orderDate ? fmtDate(j.orderDate) : "-"}</span>
                    <span style={{ color: NAVY_LIGHT }}>
                      실측 {j.measureDate ? fmtDate(j.measureDate) : "미정"}{j.measureTech ? ` · ${j.measureTech}` : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ fontWeight: 800, color: NAVY, fontSize: 12.5, marginBottom: 8 }}>
          {monthLabel} 설치 예정 ({monthDatedJobs.length}건)
        </div>
        {monthDatedJobs.length === 0 && (
          <div style={{ fontSize: 13, color: GRAY, padding: "16px 4px" }}>이번 달 설치 예정 건이 없습니다.</div>
        )}

        <div className="flex flex-col gap-2">
          {monthDatedJobs.map((j) => (
            <div
              key={j.id}
              onClick={() => setEditingJob(j)}
              style={{ border: `1px solid ${GRID_LINE}`, borderRadius: 6, padding: "10px 12px", background: "#fff", cursor: "pointer" }}
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div style={{ fontWeight: 700, fontSize: 14, color: INK }}>
                  {j.siteName || "(현장명 미입력)"}
                </div>
                <Stamp text={j.productionStatus} />
              </div>
              <div style={{ fontSize: 12, color: GRAY, marginTop: 2 }}>
                {j.address && <span><MapPin size={11} style={{ display: "inline", marginRight: 3, verticalAlign: -1 }} />{j.address}</span>}
              </div>
              <div className="flex flex-wrap gap-3 mt-2" style={{ fontSize: 12 }}>
                <span style={{ color: NAVY_LIGHT }}>
                  실측 {j.measureDate ? fmtDate(j.measureDate) : "미정"}{j.measureTech ? ` · ${j.measureTech}` : ""}
                </span>
                <span style={{ color: ORANGE }}>
                  설치 {fmtDate(j.installDate)}{j.installTech ? ` · ${j.installTech}` : ""}
                </span>
              </div>
              {(j.width || j.heightCm || j.ceilingHeight) && (
                <div style={{ fontSize: 12, color: INK, marginTop: 4, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
                  W{j.width || "-"} × H{j.heightCm || "-"} · 천고 {j.ceilingHeight || "-"}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      </>
      )}

      <div className="flex justify-end mt-4">
        {!confirmReset ? (
          <button onClick={() => setConfirmReset(true)} style={{ fontSize: 11, color: GRAY, background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
            <RotateCcw size={12} /> 전체 데이터 초기화
          </button>
        ) : (
          <div className="flex items-center gap-2" style={{ fontSize: 12 }}>
            <span style={{ color: "#791F1F" }}>모든 데이터가 삭제됩니다. 계속할까요?</span>
            <button onClick={resetAll} style={{ color: "#fff", background: "#A32D2D", border: "none", borderRadius: 4, padding: "3px 8px", cursor: "pointer" }}>삭제</button>
            <button onClick={() => setConfirmReset(false)} style={{ color: INK, background: "#fff", border: `1px solid ${GRID_LINE}`, borderRadius: 4, padding: "3px 8px", cursor: "pointer" }}>취소</button>
          </div>
        )}
      </div>

      {!loaded && (
        <div style={{ textAlign: "center", fontSize: 13, color: GRAY, padding: 20 }}>불러오는 중…</div>
      )}

      {editingJob && (
        <JobModal
          job={editingJob}
          onClose={() => setEditingJob(null)}
          onSave={saveJob}
          onDelete={jobs.some((j) => j.id === editingJob.id) ? () => deleteJob(editingJob.id) : null}
          technicians={registeredTechNames}
        />
      )}

      {phoneModalOpen && (
        <PhoneBookModal
          technicians={registeredTechNames}
          phones={techPhones}
          onClose={() => setPhoneModalOpen(false)}
          onSave={savePhones}
        />
      )}

      {createAccountOpen && <CreateAccountModal onClose={() => setCreateAccountOpen(false)} />}
    </div>
  );
}

function JobModal({ job, onClose, onSave, onDelete, technicians }) {
  const [form, setForm] = useState(job);
  const [photos, setPhotos] = useState(job.photos || []);
  const [photoStatus, setPhotoStatus] = useState("");
  const [photoBusy, setPhotoBusy] = useState(false);
  const [officeDrawings, setOfficeDrawings] = useState(job.officeDrawings || []);
  const [drawingStatus, setDrawingStatus] = useState("");
  const [drawingBusy, setDrawingBusy] = useState(false);
  const [surveyRooms, setSurveyRooms] = useState(null); // null = loading, [] = none found, array = found
  const [lightboxSrc, setLightboxSrc] = useState(null);
  useBackableLayer(!!lightboxSrc, () => setLightboxSrc(null));
  const fileInputRef = useRef(null);
  const drawingInputRef = useRef(null);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const MAX_JOB_PHOTOS = 10;
  const MAX_JOB_DRAWINGS = 10;
  const surveyAppUrl = `https://q9mkghu-wq.github.io/hanger-survey/?jobId=${encodeURIComponent(job.id)}&name=${encodeURIComponent(job.siteName || "")}`;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const idxSnap = await getDoc(doc(surveyDb, "hanger_survey_kv", "rooms-index"));
        const ids = idxSnap.exists() ? JSON.parse(idxSnap.data().value) : [];
        const rooms = [];
        for (const id of ids) {
          try {
            const r = await getDoc(doc(surveyDb, "hanger_survey_kv", "rooms:" + id));
            if (r.exists()) {
              const parsed = JSON.parse(r.data().value);
              if (parsed.jobId === job.id) rooms.push(parsed);
            }
          } catch (e) { /* skip unreadable record */ }
        }
        if (!cancelled) setSurveyRooms(rooms);
      } catch (e) {
        if (!cancelled) setSurveyRooms([]);
      }
    })();
    return () => { cancelled = true; };
  }, [job.id]);
  const MAX_TOTAL_BYTES = 900000; // shared budget for photos + drawings, safely under Firestore's 1MiB per-document limit

  const totalUsedBytes = () =>
    photos.reduce((sum, p) => sum + p.length, 0) + officeDrawings.reduce((sum, p) => sum + p.length, 0);

  const handlePhotoFiles = async (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    const room = MAX_JOB_PHOTOS - photos.length;
    if (room <= 0) {
      setPhotoStatus(`최대 ${MAX_JOB_PHOTOS}장까지만 첨부할 수 있어요.`);
      return;
    }
    const toProcess = files.slice(0, room);
    const skipped = files.length - toProcess.length;
    setPhotoBusy(true);
    setPhotoStatus("사진 처리 중…");
    try {
      let added = 0;
      let blockedBySize = false;
      for (const file of toProcess) {
        const dataUrl = await resizeImageFile(file, 900, 0.55);
        if (totalUsedBytes() + dataUrl.length > MAX_TOTAL_BYTES) {
          blockedBySize = true;
          break;
        }
        setPhotos((prev) => [...prev, dataUrl]);
        added += 1;
      }
      if (blockedBySize) {
        setPhotoStatus(`용량이 한도에 가까워 ${added}장만 추가했어요. 더 넣으려면 기존 사진/도면을 지워주세요.`);
      } else if (skipped > 0) {
        setPhotoStatus(`사진 ${added}장 첨부됨 (최대 ${MAX_JOB_PHOTOS}장이라 ${skipped}장은 제외).`);
      } else {
        setPhotoStatus(`사진 ${added}장 첨부됨. 저장을 눌러야 반영됩니다.`);
      }
    } catch (e) {
      setPhotoStatus("사진을 처리하지 못했습니다.");
    } finally {
      setPhotoBusy(false);
    }
  };

  const removePhoto = (idx) => {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
    setPhotoStatus("");
  };

  const handleDrawingFiles = async (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    const room = MAX_JOB_DRAWINGS - officeDrawings.length;
    if (room <= 0) {
      setDrawingStatus(`최대 ${MAX_JOB_DRAWINGS}장까지만 첨부할 수 있어요.`);
      return;
    }
    const toProcess = files.slice(0, room);
    const skipped = files.length - toProcess.length;
    setDrawingBusy(true);
    setDrawingStatus("도면 처리 중…");
    try {
      let added = 0;
      let blockedBySize = false;
      for (const file of toProcess) {
        // Drawings usually have small text/lines, so keep more resolution than site photos.
        const dataUrl = await resizeImageFile(file, 1400, 0.6);
        if (totalUsedBytes() + dataUrl.length > MAX_TOTAL_BYTES) {
          blockedBySize = true;
          break;
        }
        setOfficeDrawings((prev) => [...prev, dataUrl]);
        added += 1;
      }
      if (blockedBySize) {
        setDrawingStatus(`용량이 한도에 가까워 ${added}장만 추가했어요. 더 넣으려면 기존 사진/도면을 지워주세요.`);
      } else if (skipped > 0) {
        setDrawingStatus(`도면 ${added}장 첨부됨 (최대 ${MAX_JOB_DRAWINGS}장이라 ${skipped}장은 제외).`);
      } else {
        setDrawingStatus(`도면 ${added}장 첨부됨. 저장을 눌러야 반영됩니다.`);
      }
    } catch (e) {
      setDrawingStatus("도면을 처리하지 못했습니다.");
    } finally {
      setDrawingBusy(false);
    }
  };

  const removeDrawing = (idx) => {
    setOfficeDrawings((prev) => prev.filter((_, i) => i !== idx));
    setDrawingStatus("");
  };

  const handleSave = () => {
    onSave({ ...form, photos, officeDrawings });
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(30,58,95,0.35)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "24px 10px",
        zIndex: 50,
        overflowY: "auto",
        boxSizing: "border-box",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#FBF9F3",
          border: `2px solid ${NAVY}`,
          borderRadius: 6,
          width: "100%",
          maxWidth: 480,
          padding: 16,
          boxSizing: "border-box",
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div style={{ fontWeight: 800, color: NAVY, fontSize: 15 }}>
            {job.siteName ? "주문 상세" : "새 주문 등록"}
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", color: GRAY }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ fontSize: 11, fontWeight: 800, color: NAVY_LIGHT, letterSpacing: "0.08em", margin: "10px 0 6px" }}>기본 정보</div>
        <Field label="현장/고객명" icon={<User size={12} />}>
          <input style={inputStyle} value={form.siteName} onChange={set("siteName")} placeholder="예: 김민수 고객님 안방" />
        </Field>
        <Field label="주소" icon={<MapPin size={12} />}>
          <input style={inputStyle} value={form.address} onChange={set("address")} placeholder="주소 입력" />
        </Field>
        <Field label="주문 접수일" icon={<CalendarIcon size={12} />}>
          <input type="date" style={inputStyle} value={form.orderDate} onChange={set("orderDate")} />
        </Field>

        <div style={{ fontSize: 11, fontWeight: 800, color: NAVY_LIGHT, letterSpacing: "0.08em", margin: "14px 0 6px" }}>실측</div>
        <div className="grid grid-cols-2 gap-2">
          <Field label="실측일" icon={<CalendarIcon size={12} />}>
            <input type="date" style={inputStyle} value={form.measureDate} onChange={set("measureDate")} />
          </Field>
          <Field label="실측한 사람" icon={<User size={12} />}>
            <select style={inputStyle} value={form.measureTech} onChange={set("measureTech")}>
              <option value="">선택 안 함</option>
              <option value="고객">고객</option>
              {technicians.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </Field>
        </div>
        <div style={{ fontSize: 11, fontWeight: 800, color: NAVY_LIGHT, letterSpacing: "0.08em", margin: "14px 0 6px" }}>
          실측 도면 (3D 실측앱 자동 생성)
        </div>
        {surveyRooms && surveyRooms.length > 0 ? (
          <a
            href={surveyAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "#fff", background: NAVY_LIGHT, border: "none", borderRadius: 6, padding: "8px 12px", textDecoration: "none", marginBottom: 10 }}
          >
            🧊 3D 실측앱 열기
          </a>
        ) : (
          <div
            title="아직 이 주문으로 저장된 실측 기록이 없어요. '설치일 미정 고객' 목록에서 실측을 먼저 진행해 주세요."
            style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "#fff", background: GRAY, border: "none", borderRadius: 6, padding: "8px 12px", marginBottom: 10, cursor: "not-allowed" }}
          >
            🧊 3D 실측앱 열기
          </div>
        )}

        {surveyRooms === null && (
          <div style={{ fontSize: 12, color: GRAY }}>실측 도면을 불러오는 중…</div>
        )}
        {surveyRooms && surveyRooms.length === 0 && (
          <div style={{ fontSize: 12, color: GRAY }}>
            아직 이 주문으로 저장된 실측 기록이 없어요. "설치일 미정 고객" 목록에서 실측을 먼저 진행하면, 이후부터 여기서 이어서 열 수 있어요.
          </div>
        )}
        {surveyRooms && surveyRooms.length > 0 && surveyRooms.map((room) => (
          <div key={room.id} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: INK, marginBottom: 4 }}>{room.name || "이름 없음"}</div>
            {room.drawingSnapshots && room.drawingSnapshots.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {room.drawingSnapshots.map((d, i) => (
                  <div key={i} style={{ width: 76, flexShrink: 0 }}>
                    <img
                      src={d.dataUrl}
                      alt={d.label}
                      onClick={() => setLightboxSrc(d.dataUrl)}
                      style={{ width: 76, height: 62, objectFit: "contain", background: "#fff", border: `1px solid ${GRID_LINE}`, borderRadius: 6, cursor: "zoom-in" }}
                    />
                    <div style={{ fontSize: 9.5, color: GRAY, textAlign: "center", marginTop: 2 }}>{d.label}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: 11.5, color: GRAY }}>이 기록에는 도면 이미지가 없어요 (예전 버전으로 저장됨).</div>
            )}
          </div>
        ))}

        <div style={{ fontSize: 11, fontWeight: 800, color: NAVY_LIGHT, letterSpacing: "0.08em", margin: "14px 0 6px" }}>
          현장/실측 사진 (최대 {MAX_JOB_PHOTOS}장)
        </div>
        <div className="flex flex-wrap gap-2">
          {photos.map((src, i) => (
            <div key={i} style={{ position: "relative", width: 64, height: 64, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "#F3EFE4" }}>
              <img
                src={src}
                alt=""
                onClick={() => setLightboxSrc(src)}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", cursor: "zoom-in" }}
              />
              <div
                onClick={() => removePhoto(i)}
                style={{
                  position: "absolute", top: 2, right: 2, width: 18, height: 18, borderRadius: "50%",
                  background: "rgba(15,37,64,0.7)", color: "#fff", fontSize: 11, lineHeight: "18px",
                  textAlign: "center", cursor: "pointer",
                }}
              >
                ✕
              </div>
            </div>
          ))}
          {photos.length < MAX_JOB_PHOTOS && (
            <div
              onClick={() => !photoBusy && fileInputRef.current && fileInputRef.current.click()}
              style={{
                width: 64, height: 64, borderRadius: 8, border: `1.5px dashed ${GRID_LINE}`, background: "#FBF9F3",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: GRAY,
                cursor: photoBusy ? "not-allowed" : "pointer", flexShrink: 0,
              }}
            >
              +
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          style={{ display: "none" }}
          onChange={(e) => {
            handlePhotoFiles(e.target.files);
            e.target.value = "";
          }}
        />
        {photoStatus && <div style={{ fontSize: 11.5, color: GRAY, marginTop: 6 }}>{photoStatus}</div>}

        <div style={{ fontSize: 11, fontWeight: 800, color: NAVY_LIGHT, letterSpacing: "0.08em", margin: "14px 0 6px" }}>
          제작 도면 (사무실 업로드, 최대 {MAX_JOB_DRAWINGS}장)
        </div>
        <div className="flex flex-wrap gap-2">
          {officeDrawings.map((src, i) => (
            <div key={i} style={{ position: "relative", width: 64, height: 64, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "#F3EFE4" }}>
              <img
                src={src}
                alt=""
                onClick={() => setLightboxSrc(src)}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", cursor: "zoom-in" }}
              />
              <div
                onClick={() => removeDrawing(i)}
                style={{
                  position: "absolute", top: 2, right: 2, width: 18, height: 18, borderRadius: "50%",
                  background: "rgba(15,37,64,0.7)", color: "#fff", fontSize: 11, lineHeight: "18px",
                  textAlign: "center", cursor: "pointer",
                }}
              >
                ✕
              </div>
            </div>
          ))}
          {officeDrawings.length < MAX_JOB_DRAWINGS && (
            <div
              onClick={() => !drawingBusy && drawingInputRef.current && drawingInputRef.current.click()}
              style={{
                width: 64, height: 64, borderRadius: 8, border: `1.5px dashed ${GRID_LINE}`, background: "#FBF9F3",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: GRAY,
                cursor: drawingBusy ? "not-allowed" : "pointer", flexShrink: 0,
              }}
            >
              +
            </div>
          )}
        </div>
        <input
          ref={drawingInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={(e) => {
            handleDrawingFiles(e.target.files);
            e.target.value = "";
          }}
        />
        {drawingStatus && <div style={{ fontSize: 11.5, color: GRAY, marginTop: 6 }}>{drawingStatus}</div>}
        <div style={{ fontSize: 11.5, color: GRAY, background: "#EEF3F7", borderRadius: 6, padding: "8px 10px", marginTop: 6, lineHeight: 1.5 }}>
          제작이 확정된 도면 이미지를 사무실에서 여기에 올려두면, 기사님이 설치 전에 확인할 수 있어요.
        </div>

        <div style={{ fontSize: 11, fontWeight: 800, color: NAVY_LIGHT, letterSpacing: "0.08em", margin: "14px 0 6px" }}>제작</div>
        <Field label="제작 상태" icon={<Factory size={12} />}>
          <div className="flex gap-2">
            {PROD_STATUS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setForm((f) => ({ ...f, productionStatus: s }))}
                style={{
                  flex: 1,
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "7px 0",
                  borderRadius: 5,
                  border: `1px solid ${form.productionStatus === s ? NAVY : GRID_LINE}`,
                  background: form.productionStatus === s ? NAVY : "#fff",
                  color: form.productionStatus === s ? "#fff" : INK,
                  cursor: "pointer",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </Field>

        <div style={{ fontSize: 11, fontWeight: 800, color: NAVY_LIGHT, letterSpacing: "0.08em", margin: "14px 0 6px" }}>설치</div>
        <div className="grid grid-cols-2 gap-2">
          <Field label="설치일" icon={<CalendarIcon size={12} />}>
            <input type="date" style={inputStyle} value={form.installDate} onChange={set("installDate")} />
          </Field>
          <Field label="설치 담당기사" icon={<Truck size={12} />}>
            <select style={inputStyle} value={form.installTech} onChange={set("installTech")}>
              <option value="">선택 안 함</option>
              {technicians.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="비고" icon={<StickyNote size={12} />}>
          <textarea style={{ ...inputStyle, minHeight: 48, resize: "vertical" }} value={form.memo} onChange={set("memo")} placeholder="특이사항" />
        </Field>

        <div className="flex items-center justify-between mt-4">
          <div>
            {onDelete && (
              <button
                onClick={onDelete}
                style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#A32D2D", background: "transparent", border: "1px solid #F09595", borderRadius: 5, padding: "7px 10px", cursor: "pointer" }}
              >
                <Trash2 size={13} /> 삭제
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} style={{ fontSize: 13, color: INK, background: "#fff", border: `1px solid ${GRID_LINE}`, borderRadius: 5, padding: "8px 14px", cursor: "pointer" }}>
              취소
            </button>
            <button onClick={handleSave} style={{ fontSize: 13, fontWeight: 700, color: "#fff", background: ORANGE, border: "none", borderRadius: 5, padding: "8px 16px", cursor: "pointer" }}>
              저장
            </button>
          </div>
        </div>
      </div>

      {lightboxSrc && (
        <div
          onClick={(e) => { e.stopPropagation(); setLightboxSrc(null); }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,37,64,0.92)",
            zIndex: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "32px 20px",
            cursor: "zoom-out",
          }}
        >
          <div
            onClick={(e) => { e.stopPropagation(); setLightboxSrc(null); }}
            style={{
              position: "fixed",
              top: 16,
              right: 20,
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              color: "#fff",
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            ✕
          </div>
          <img
            src={lightboxSrc}
            alt=""
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "92vw", maxHeight: "88vh", borderRadius: 8, boxShadow: "0 20px 60px rgba(0,0,0,0.5)", cursor: "default" }}
          />
        </div>
      )}
    </div>
  );
}

function PhoneBookModal({ technicians, phones, onClose, onSave }) {
  const [draft, setDraft] = useState(() => ({ ...phones }));
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(draft);
    setSaving(false);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(30,58,95,0.35)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "24px 10px",
        zIndex: 50,
        overflowY: "auto",
        boxSizing: "border-box",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#FBF9F3",
          border: `2px solid ${NAVY}`,
          borderRadius: 6,
          width: "100%",
          maxWidth: 420,
          padding: 16,
          boxSizing: "border-box",
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div style={{ fontWeight: 800, color: NAVY, fontSize: 15 }}>기사 연락처 관리</div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", color: GRAY }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ fontSize: 12, color: GRAY, marginBottom: 12 }}>
          설치일 하루 전날 아침 9시에 문자로 설치 안내를 자동 발송하려면, 여기에 각 기사님의 휴대폰 번호를 등록해 주세요.
        </div>

        {technicians.length === 0 && (
          <div style={{ fontSize: 13, color: GRAY, padding: "12px 4px" }}>
            등록된 기사 계정이 없습니다. "계정 만들기"에서 기사 계정을 먼저 생성해 주세요.
          </div>
        )}

        <div className="flex flex-col gap-2">
          {technicians.map((t) => (
            <div key={t}>
              <div style={{ fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 4 }}>{t}</div>
              <input
                style={inputStyle}
                value={draft[t] || ""}
                onChange={(e) => setDraft((d) => ({ ...d, [t]: e.target.value }))}
                placeholder="01012345678 (- 없이 숫자만)"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ fontSize: 13, fontWeight: 700, color: "#fff", background: ORANGE, border: "none", borderRadius: 5, padding: "8px 16px", cursor: saving ? "not-allowed" : "pointer" }}
          >
            {saving ? "저장 중…" : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
}

function LoginScreen({ onLogin, error, loading }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submit = () => {
    if (!username.trim() || !password) return;
    onLogin(username, password);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: PAPER,
        backgroundImage: `linear-gradient(${GRID_LINE} 1px, transparent 1px), linear-gradient(90deg, ${GRID_LINE} 1px, transparent 1px)`,
        backgroundSize: "24px 24px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Malgun Gothic', system-ui, sans-serif",
        padding: 16,
      }}
    >
      <div style={{ background: "#FBF9F3", border: `2px solid ${NAVY}`, borderRadius: 6, padding: 28, width: "100%", maxWidth: 340, boxSizing: "border-box" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.12em", color: NAVY_LIGHT, fontWeight: 800 }}>
          행거 시스템장 설치 관리
        </div>
        <div style={{ fontSize: 20, fontWeight: 800, color: NAVY, marginBottom: 18 }}>로그인</div>

        <Field label="아이디" icon={<User size={12} />}>
          <input
            style={inputStyle}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            autoCapitalize="off"
            autoCorrect="off"
          />
        </Field>
        <Field label="비밀번호">
          <input
            type="password"
            style={inputStyle}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
        </Field>

        {error && <div style={{ color: "#791F1F", fontSize: 12, marginBottom: 10 }}>{error}</div>}

        <button
          onClick={submit}
          disabled={loading}
          style={{
            width: "100%",
            background: ORANGE,
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "10px 0",
            fontWeight: 700,
            fontSize: 14,
            cursor: loading ? "not-allowed" : "pointer",
            marginTop: 6,
          }}
        >
          {loading ? "로그인 중…" : "로그인"}
        </button>
      </div>
    </div>
  );
}

function CreateAccountModal({ onClose }) {
  const [form, setForm] = useState({ username: "", password: "", name: "", role: "기사" });
  const [adminPassword, setAdminPassword] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    if (!form.username.trim() || !form.password) {
      setStatus("아이디와 비밀번호를 입력해 주세요.");
      return;
    }
    setBusy(true);
    setStatus("");
    try {
      const res = await fetch("/api/create-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, adminPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "계정 생성에 실패했습니다.");
      setStatus(`"${form.username}" 계정이 생성되었습니다.`);
      setForm({ username: "", password: "", name: "", role: "기사" });
    } catch (e) {
      setStatus(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(30,58,95,0.35)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "24px 10px",
        zIndex: 50,
        overflowY: "auto",
        boxSizing: "border-box",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#FBF9F3",
          border: `2px solid ${NAVY}`,
          borderRadius: 6,
          width: "100%",
          maxWidth: 420,
          padding: 16,
          boxSizing: "border-box",
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div style={{ fontWeight: 800, color: NAVY, fontSize: 15 }}>새 계정 만들기</div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", color: GRAY }}>
            <X size={18} />
          </button>
        </div>

        <Field label="이름" icon={<User size={12} />}>
          <input style={inputStyle} value={form.name} onChange={set("name")} placeholder="예: 윤형진" />
        </Field>
        <Field label="아이디" icon={<User size={12} />}>
          <input style={inputStyle} value={form.username} onChange={set("username")} placeholder="영문/숫자 (예: yhj01)" autoCapitalize="off" />
        </Field>
        <Field label="초기 비밀번호" icon={<User size={12} />}>
          <input style={inputStyle} value={form.password} onChange={set("password")} placeholder="6자 이상" />
        </Field>
        <Field label="구분" icon={<User size={12} />}>
          <div className="flex gap-2">
            {["기사", "사무실"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setForm((f) => ({ ...f, role: r }))}
                style={{
                  flex: 1,
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "7px 0",
                  borderRadius: 5,
                  border: `1px solid ${form.role === r ? NAVY : GRID_LINE}`,
                  background: form.role === r ? NAVY : "#fff",
                  color: form.role === r ? "#fff" : INK,
                  cursor: "pointer",
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </Field>
        <Field label="관리자 비밀번호" icon={<User size={12} />}>
          <input type="password" style={inputStyle} value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="새 계정 발급 권한 확인용" />
        </Field>

        {status && <div style={{ fontSize: 12, color: status.includes("생성되었습니다") ? GREEN : "#791F1F", marginBottom: 8 }}>{status}</div>}

        <div className="flex justify-end mt-2">
          <button
            onClick={submit}
            disabled={busy}
            style={{ fontSize: 13, fontWeight: 700, color: "#fff", background: ORANGE, border: "none", borderRadius: 5, padding: "8px 16px", cursor: busy ? "not-allowed" : "pointer" }}
          >
            {busy ? "생성 중…" : "계정 생성"}
          </button>
        </div>
      </div>
    </div>
  );
}
