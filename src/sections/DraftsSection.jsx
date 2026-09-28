import { useState, useEffect } from "react";
import { fetchComponents, deleteComponent, renameComponent } from "../supabase.js";
import { useToast } from "../shared/ui.jsx";
import { RenderFigmaNode, rowToDraft } from "./Simulator.jsx";

function DraftsSection({ onUseInSimulator }) {
  const toast = useToast();
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [renamingId, setRenamingId] = useState(null);
  const [renameVal, setRenameVal] = useState("");

  const refresh = () => {
    setLoading(true);
    fetchComponents()
      .then(rows => { setDrafts(rows.map(rowToDraft)); setLoading(false); })
      .catch(e => { toast("불러오기 실패: " + e.message, "error"); setLoading(false); });
  };

  useEffect(() => { refresh(); }, []);

  const handleDelete = (draft) => {
    deleteComponent(draft.id)
      .then(() => { refresh(); toast(`"${draft.name}" 삭제됐습니다`, "info"); })
      .catch(e => toast("삭제 실패: " + e.message, "error"));
  };

  const startRename = (draft) => {
    setRenamingId(draft.id);
    setRenameVal(draft.name);
  };

  const confirmRename = (id) => {
    const prev = drafts.find(d => d.id === id)?.name;
    renameComponent(id, renameVal)
      .then(() => { setRenamingId(null); refresh(); toast(`"${prev}" → "${renameVal}" 이름 변경됐습니다`, "success"); })
      .catch(e => toast("변경 실패: " + e.message, "error"));
  };

  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"300px", gap:"10px", color:"#bbbbbb" }}>
      <span style={{ display:"inline-block", width:"16px", height:"16px", border:"2px solid #e5e5e5", borderTopColor:"#5028c8", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} />
      <span style={{ fontSize:"13px" }}>불러오는 중...</span>
    </div>
  );

  if (drafts.length === 0) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"300px", gap:"12px", color:"#bbbbbb" }}>
      <div style={{ fontSize:"32px", opacity:0.4 }}>◈</div>
      <div style={{ fontSize:"13px" }}>저장된 컴포넌트가 없습니다</div>
      <div style={{ fontSize:"11px", color:"#d0d0d0", textAlign:"center", lineHeight:1.7 }}>
        시뮬레이터 → Add → Figma SVG<br/>에서 컴포넌트를 붙여넣어 저장하세요.
      </div>
    </div>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
      <div style={{ fontSize:"11px", color:"#aaaaaa" }}>{drafts.length}개의 Draft 컴포넌트</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(220px, 1fr))", gap:"16px" }}>
        {drafts.map(draft => {
          const isSvg = !!draft.svgData;
          const dw = draft.w || draft.figmaData?.absoluteBoundingBox?.width || 100;
          const dh = draft.h || draft.figmaData?.absoluteBoundingBox?.height || 100;
          const scale = Math.min(180 / dw, 120 / dh, 1);
          const date = new Date(draft.createdAt).toLocaleDateString("ko-KR", { month:"short", day:"numeric", hour:"2-digit", minute:"2-digit" });
          return (
            <div key={draft.id} style={{ background:"#ffffff", border:"1px solid #e5e5e5", borderRadius:"12px", overflow:"hidden", display:"flex", flexDirection:"column" }}>
              {/* Thumbnail */}
              <div style={{ background:"#f5f5f5", height:"130px", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", position:"relative", flexShrink:0 }}>
                {isSvg ? (
                  <div style={{ transform:`scale(${scale})`, transformOrigin:"center center", lineHeight:0 }}
                    dangerouslySetInnerHTML={{ __html: draft.svgData }} />
                ) : draft.figmaData?.absoluteBoundingBox ? (
                  <div style={{ transform:`scale(${scale})`, transformOrigin:"center center", position:"absolute" }}>
                    <div style={{ position:"relative", width: dw, height: dh }}>
                      <RenderFigmaNode node={draft.figmaData} ox={draft.figmaData.absoluteBoundingBox.x} oy={draft.figmaData.absoluteBoundingBox.y} />
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize:"11px", color:"#cccccc" }}>미리보기 없음</div>
                )}
              </div>

              {/* Info */}
              <div style={{ padding:"12px", display:"flex", flexDirection:"column", gap:"8px", flex:1 }}>
                {renamingId === draft.id ? (
                  <div style={{ display:"flex", gap:"4px" }}>
                    <input value={renameVal} onChange={e => setRenameVal(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") confirmRename(draft.id); if (e.key === "Escape") setRenamingId(null); }}
                      autoFocus
                      style={{ flex:1, padding:"4px 7px", borderRadius:"5px", border:"1px solid #5028c8", fontSize:"12px", color:"#111111", outline:"none" }} />
                    <button onClick={() => confirmRename(draft.id)}
                      style={{ padding:"4px 8px", borderRadius:"5px", background:"#5028c8", border:"none", color:"#ffffff", fontSize:"10px", cursor:"pointer" }}>확인</button>
                  </div>
                ) : (
                  <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                    <div style={{ fontSize:"13px", fontWeight:700, color:"#111111", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{draft.name}</div>
                    <button onClick={() => startRename(draft)}
                      style={{ background:"none", border:"none", color:"#bbbbbb", cursor:"pointer", fontSize:"11px", flexShrink:0, padding:"2px 4px" }}>✎</button>
                  </div>
                )}
                <div style={{ fontSize:"10px", color:"#aaaaaa" }}>
                  {Math.round(dw)}×{Math.round(dh)}px · {date}
                </div>

                {/* Actions */}
                <div style={{ display:"flex", gap:"6px", marginTop:"auto" }}>
                  <button onClick={() => { onUseInSimulator(draft); toast(`"${draft.name}" 시뮬레이터에 추가됐습니다`, "success"); }}
                    style={{ flex:1, padding:"6px", borderRadius:"6px", background:"#111111", border:"none", color:"#ffffff", fontSize:"10px", fontWeight:700, cursor:"pointer" }}>
                    시뮬레이터에 추가
                  </button>
                  <button onClick={() => handleDelete(draft)}
                    style={{ padding:"6px 10px", borderRadius:"6px", background:"transparent", border:"1px solid #f0b0b0", color:"#aa3333", fontSize:"10px", cursor:"pointer" }}
                    onMouseEnter={e => { e.currentTarget.style.background="#ffeaea"; }}
                    onMouseLeave={e => { e.currentTarget.style.background="transparent"; }}>
                    삭제
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DraftsSection;
