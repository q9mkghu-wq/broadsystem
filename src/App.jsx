import { useState, useEffect, useMemo, useCallback } from "react";
import { ChevronLeft, ChevronRight, Plus, X, Ruler, User, Factory, Truck, MapPin, StickyNote, Trash2, Calendar as CalendarIcon, RotateCcw } from "lucide-react";
import { db } from "./firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

const jobsDocRef = doc(db, "board", "jobs");

const PAPER = "#F3EFE4";
const NAVY = "#1E3A5F";
const NAVY_LIGHT = "#3D6EA5";
const ORANGE = "#E0631E";
const INK = "#2B2B28";
const GREEN = "#3F6B3F";
const GRAY = "#8B8478";
const GRID_LINE = "#D9D3C2";

const PROD_STATUS = ["대기중", "제작중", "제작완료"];
const PROD_COLOR = {
  "대기중": { bg: "#EDE9DD", text: GRAY, border: "#C9C3B3" },
  "제작중": { bg: "#FCEEDF", text: "#B15A16", border: "#E8A768" },
  "제작완료": { bg: "#E7F0E3", text: GREEN, border: "#9FC08F" },
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
    drawingMemo: "",
    productionStatus: "대기중",
    installDate: "",
    installTech: "",
    memo: "",
  };
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
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(
      jobsDocRef,
      (snap) => {
        setJobs(snap.exists() ? snap.data().jobs || [] : []);
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
  }, []);

  const persist = useCallback(async (next) => {
    setSaving(true);
    try {
      await setDoc(jobsDocRef, { jobs: next, updatedAt: Date.now() });
      setError("");
    } catch (e) {
      setError("저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  }, []);

  const saveJob = (job) => {
    setJobs((prev) => {
      const exists = prev.some((j) => j.id === job.id);
      const next = exists ? prev.map((j) => (j.id === job.id ? job : j)) : [...prev, job];
      persist(next);
      return next;
    });
    setEditingJob(null);
  };

  const deleteJob = (id) => {
    setJobs((prev) => {
      const next = prev.filter((j) => j.id !== id);
      persist(next);
      return next;
    });
    setEditingJob(null);
  };

  const resetAll = async () => {
    setJobs([]);
    await persist([]);
    setConfirmReset(false);
  };

  const technicians = useMemo(() => {
    const set = new Set();
    jobs.forEach((j) => {
      if (j.measureTech) set.add(j.measureTech.trim());
      if (j.installTech) set.add(j.installTech.trim());
    });
    return Array.from(set).filter(Boolean).sort();
  }, [jobs]);

  const visibleJobs = useMemo(() => {
    if (techFilter === "전체") return jobs;
    return jobs.filter((j) => j.measureTech === techFilter || j.installTech === techFilter);
  }, [jobs, techFilter]);

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

  const dayJobsForSelected = useMemo(() => {
    if (!selectedDate) return [];
    return visibleJobs.filter(
      (j) => j.orderDate === selectedDate || j.measureDate === selectedDate || j.installDate === selectedDate
    );
  }, [visibleJobs, selectedDate]);

  const todaySummary = useMemo(() => {
    const tk = todayKey();
    const measureToday = jobs.filter((j) => j.measureDate === tk).length;
    const installToday = jobs.filter((j) => j.installDate === tk).length;
    const waitingProd = jobs.filter((j) => j.productionStatus !== "제작완료" && j.measureDate).length;
    return { measureToday, installToday, waitingProd };
  }, [jobs]);

  return (
    <div
      className="board-root"
      style={{
        background: PAPER,
        backgroundImage: `linear-gradient(${GRID_LINE} 1px, transparent 1px), linear-gradient(90deg, ${GRID_LINE} 1px, transparent 1px)`,
        backgroundSize: "24px 24px",
        minHeight: "100vh",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Malgun Gothic', system-ui, sans-serif",
        color: INK,
        padding: 16,
      }}
    >
      <style>{`
        @media (max-width: 480px) {
          .grid-cols-2, .grid-cols-3 { grid-template-columns: 1fr !important; }
          .board-root { padding: 8px !important; }
          .board-header { padding: 10px 12px !important; }
          .board-title { font-size: 17px !important; }
          .cal-cell { min-height: 44px !important; padding: 3px 4px !important; }
          .install-tag-full { display: none !important; }
          .install-tag-compact { display: block !important; }
        }
        .install-tag-compact { display: none; }
      `}</style>
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
      </div>

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
                  <>
                    <div className="install-tag-full flex flex-col gap-0.5 mt-1">
                      {ev.install.map((j) => (
                        <div
                          key={j.id}
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
                          }}
                          title={`${getRegion(j.address)} ${j.siteName || ""} · ${j.installTech || "미배정"}`}
                        >
                          {getRegion(j.address) || "지역미정"} {j.siteName || "고객명미정"}
                          <br />
                          <span style={{ fontWeight: 700, color: INK }}>{j.installTech || "기사미배정"}</span>
                        </div>
                      ))}
                    </div>
                    <div
                      className="install-tag-compact"
                      style={{
                        marginTop: 4,
                        fontSize: 10,
                        fontWeight: 800,
                        background: "#FCEEDF",
                        color: "#B15A16",
                        borderRadius: 3,
                        padding: "1px 4px",
                        textAlign: "center",
                      }}
                    >
                      설치 {ev.install.length}건
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-3 mt-3" style={{ fontSize: 11, color: GRAY }}>
          <span><span style={{ display: "inline-block", width: 8, height: 8, background: ORANGE, borderRadius: 2, marginRight: 4 }} />설치일</span>
          <span>날짜를 누르면 주문·실측·설치 내역을 모두 볼 수 있어요</span>
        </div>
      </div>

      <div style={{ background: "#FBF9F3", border: `1px solid ${GRID_LINE}`, borderRadius: 6, padding: 14 }}>
        <div className="flex items-center justify-between mb-2">
          <div style={{ fontWeight: 800, color: NAVY, fontSize: 14 }}>
            {fmtDate(selectedDate)} 일정 ({dayJobsForSelected.length}건)
          </div>
          <button
            onClick={() => !error && setEditingJob(emptyJob(selectedDate))}
            disabled={!!error}
            style={{ fontSize: 12, color: error ? GRAY : NAVY_LIGHT, background: "transparent", border: `1px solid ${error ? GRAY : NAVY_LIGHT}`, borderRadius: 5, padding: "4px 9px", cursor: error ? "not-allowed" : "pointer" }}
          >
            + 이 날짜에 등록
          </button>
        </div>

        {dayJobsForSelected.length === 0 && (
          <div style={{ fontSize: 13, color: GRAY, padding: "16px 4px" }}>등록된 일정이 없습니다.</div>
        )}

        <div className="flex flex-col gap-2">
          {dayJobsForSelected.map((j) => (
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
                  설치 {j.installDate ? fmtDate(j.installDate) : "미정"}{j.installTech ? ` · ${j.installTech}` : ""}
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
          technicians={technicians}
        />
      )}
    </div>
  );
}

function JobModal({ job, onClose, onSave, onDelete, technicians }) {
  const [form, setForm] = useState(job);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = () => {
    onSave(form);
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
          <Field label="실측 담당기사" icon={<User size={12} />}>
            <input style={inputStyle} list="tech-list" value={form.measureTech} onChange={set("measureTech")} placeholder="이름 입력" />
          </Field>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Field label="가로(cm)" icon={<Ruler size={12} />}>
            <input style={inputStyle} value={form.width} onChange={set("width")} placeholder="0" />
          </Field>
          <Field label="세로(cm)" icon={<Ruler size={12} />}>
            <input style={inputStyle} value={form.heightCm} onChange={set("heightCm")} placeholder="0" />
          </Field>
          <Field label="천장고(cm)" icon={<Ruler size={12} />}>
            <input style={inputStyle} value={form.ceilingHeight} onChange={set("ceilingHeight")} placeholder="0" />
          </Field>
        </div>
        <Field label="도면/사진 메모 (링크 또는 설명)" icon={<StickyNote size={12} />}>
          <textarea style={{ ...inputStyle, minHeight: 56, resize: "vertical" }} value={form.drawingMemo} onChange={set("drawingMemo")} placeholder="카톡으로 보낸 사진 링크나 도면 설명을 적어주세요" />
        </Field>

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
            <input style={inputStyle} list="tech-list" value={form.installTech} onChange={set("installTech")} placeholder="이름 입력" />
          </Field>
        </div>
        <Field label="비고" icon={<StickyNote size={12} />}>
          <textarea style={{ ...inputStyle, minHeight: 48, resize: "vertical" }} value={form.memo} onChange={set("memo")} placeholder="특이사항" />
        </Field>

        <datalist id="tech-list">
          {technicians.map((t) => (
            <option key={t} value={t} />
          ))}
        </datalist>

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
    </div>
  );
}
