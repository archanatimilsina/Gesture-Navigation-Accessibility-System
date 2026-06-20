import { useState, useRef, useEffect, useCallback } from "react";

const COLORS = [
  { value: "#1a1a2e", label: "Dark" },
  { value: "#185FA5", label: "Blue" },
  { value: "#0F6E56", label: "Teal" },
  { value: "#993C1D", label: "Coral" },
  { value: "#993556", label: "Pink" },
];

const SIZES = [
  { value: 2, label: "thin" },
  { value: 3, label: "mid" },
  { value: 6, label: "thick" },
];

export default function DrawingCanvas() {
  const drawCanvasRef = useRef(null);
  const pointCanvasRef = useRef(null);
  const wrapRef = useRef(null);

  const [strokeColor, setStrokeColor] = useState("#1a1a2e");
  const [strokeSize, setStrokeSize] = useState(3);
  const [showPoints, setShowPoints] = useState(false);
  const [stats, setStats] = useState({ strokes: 0, totalPoints: 0, currentStroke: null, lastPoint: null });
  const [lastStrokePts, setLastStrokePts] = useState([]);
  const [showHint, setShowHint] = useState(true);

  const stateRef = useRef({
    drawing: false,
    allStrokes: [],
    currentPoints: [],
    totalPoints: 0,
    strokeColor: "#1a1a2e",
    strokeSize: 3,
    showPoints: false,
  });

  useEffect(() => { stateRef.current.strokeColor = strokeColor; }, [strokeColor]);
  useEffect(() => { stateRef.current.strokeSize = strokeSize; }, [strokeSize]);
  useEffect(() => { stateRef.current.showPoints = showPoints; }, [showPoints]);

  const getCtx = () => ({
    dCtx: drawCanvasRef.current?.getContext("2d"),
    pCtx: pointCanvasRef.current?.getContext("2d"),
  });

  const drawStroke = (ctx, pts, color, size) => {
    if (pts.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  };

  const redrawPointDots = useCallback(() => {
    const { pCtx } = getCtx();
    if (!pCtx || !pointCanvasRef.current) return;
    pCtx.clearRect(0, 0, pointCanvasRef.current.width, pointCanvasRef.current.height);
    if (!stateRef.current.showPoints) return;
    stateRef.current.allStrokes.forEach((s) => {
      s.pts.forEach((p, i) => {
        pCtx.beginPath();
        pCtx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        pCtx.fillStyle =
          i === 0 ? "#185FA5"
          : i === s.pts.length - 1 ? "#0F6E56"
          : "rgba(180,100,60,0.7)";
        pCtx.fill();
      });
    });
  }, []);

  const redrawAll = useCallback(() => {
    const { dCtx } = getCtx();
    if (!dCtx || !drawCanvasRef.current) return;
    dCtx.clearRect(0, 0, drawCanvasRef.current.width, drawCanvasRef.current.height);
    stateRef.current.allStrokes.forEach((s) => drawStroke(dCtx, s.pts, s.color, s.size));
    if (stateRef.current.showPoints) redrawPointDots();
  }, [redrawPointDots]);

  const resize = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const W = wrap.clientWidth;
    const H = wrap.clientHeight;
    [drawCanvasRef.current, pointCanvasRef.current].forEach((c) => {
      if (c) { c.width = W; c.height = H; }
    });
    redrawAll();
  }, [redrawAll]);

  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [resize]);

  const updateStats = () => {
    const s = stateRef.current;
    const lastPt = s.currentPoints.length ? s.currentPoints[s.currentPoints.length - 1]: s.allStrokes.length
    ? s.allStrokes[s.allStrokes.length - 1].pts.at(-1): null;
    setStats({
      strokes: s.allStrokes.length,
      totalPoints: s.totalPoints,
      currentStroke: s.drawing
        ? s.currentPoints.length
        : s.allStrokes.length
        ? s.allStrokes[s.allStrokes.length - 1].pts.length
        : null,
      lastPoint: lastPt,
    });
  };

  const getPos = (e) => {
    const r = drawCanvasRef.current.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x: Math.round(src.clientX - r.left), y: Math.round(src.clientY - r.top) };
  };

  const handlePointerDown = (e) => {
    const s = stateRef.current;
    s.drawing = true;
    s.currentPoints = [getPos(e)];
    setShowHint(false);
    const { dCtx } = getCtx();
    if (dCtx) {
      dCtx.beginPath();
      dCtx.moveTo(s.currentPoints[0].x, s.currentPoints[0].y);
    }
    updateStats();
  };

  const handlePointerMove = (e) => {
    const s = stateRef.current;
    if (!s.drawing) return;
    const p = getPos(e);
    s.currentPoints.push(p);
    const { dCtx, pCtx } = getCtx();
    if (dCtx) {
      dCtx.lineTo(p.x, p.y);
      dCtx.strokeStyle = s.strokeColor;
      dCtx.lineWidth = s.strokeSize;
      dCtx.lineCap = "round";
      dCtx.lineJoin = "round";
      dCtx.stroke();
      dCtx.beginPath();
      dCtx.moveTo(p.x, p.y);
    }
    if (s.showPoints && pCtx) {
      pCtx.beginPath();
      pCtx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      pCtx.fillStyle = "rgba(180,100,60,0.7)";
      pCtx.fill();
    }
    updateStats();
  };

  const handlePointerUp = () => {
    const s = stateRef.current;
    if (!s.drawing) return;
    s.drawing = false;
    if (s.currentPoints.length > 0) {
      s.allStrokes.push({ pts: [...s.currentPoints], color: s.strokeColor, size: s.strokeSize });
      s.totalPoints += s.currentPoints.length;
      const pts = [...s.currentPoints];
      setLastStrokePts(pts);
      if (s.showPoints) {
        const { pCtx } = getCtx();
        if (pCtx) {
          [0, pts.length - 1].forEach((i, idx) => {
            pCtx.beginPath();
            pCtx.arc(pts[i].x, pts[i].y, 4, 0, Math.PI * 2);
            pCtx.fillStyle = idx === 0 ? "#185FA5" : "#0F6E56";
            pCtx.fill();
          });
        }
      }
    }
    s.currentPoints = [];
    updateStats();
  };

  const handleClear = () => {
    const s = stateRef.current;
    s.allStrokes = [];
    s.totalPoints = 0;
    s.currentPoints = [];
    const { dCtx, pCtx } = getCtx();
    if (dCtx) dCtx.clearRect(0, 0, drawCanvasRef.current.width, drawCanvasRef.current.height);
    if (pCtx) pCtx.clearRect(0, 0, pointCanvasRef.current.width, pointCanvasRef.current.height);
    setShowHint(true);
    setLastStrokePts([]);
    updateStats();
  };

  const handleTogglePoints = () => {
    const next = !showPoints;
    setShowPoints(next);
    stateRef.current.showPoints = next;
    if (!next) {
      const { pCtx } = getCtx();
      if (pCtx) pCtx.clearRect(0, 0, pointCanvasRef.current.width, pointCanvasRef.current.height);
    } else {
      redrawPointDots();
    }
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "var(--color-background-primary, #fff)", minHeight: "100vh" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
        padding: "12px 16px",
        borderBottom: "0.5px solid var(--color-border-tertiary, #e5e5e5)",
        background: "var(--color-background-primary, #fff)",
      }}>
        <span style={{ fontSize: 12, color: "var(--color-text-secondary, #666)", letterSpacing: "0.02em" }}>Color</span>
        {COLORS.map((c) => (
          <button
            key={c.value}
            title={c.label}
            onClick={() => setStrokeColor(c.value)}
            style={{
              width: 22, height: 22, borderRadius: "50%",
              border: strokeColor === c.value ? "2px solid var(--color-text-primary, #111)" : "2px solid transparent",
              background: c.value, cursor: "pointer",
              transform: strokeColor === c.value ? "scale(1.2)" : "scale(1)",
              transition: "transform 0.1s",
            }}
          />
        ))}

        <div style={{ width: "0.5px", height: 20, background: "var(--color-border-tertiary, #e5e5e5)", margin: "0 2px" }} />

        <span style={{ fontSize: 12, color: "var(--color-text-secondary, #666)", letterSpacing: "0.02em" }}>Size</span>
        {SIZES.map((sz) => (
          <button
            key={sz.value}
            onClick={() => setStrokeSize(sz.value)}
            style={{
              border: strokeSize === sz.value
                ? "0.5px solid var(--color-border-primary, #aaa)"
                : "0.5px solid var(--color-border-secondary, #ccc)",
              borderRadius: 6, padding: "4px 10px", cursor: "pointer",
              fontSize: 12,
              background: strokeSize === sz.value ? "var(--color-background-secondary, #f5f5f5)" : "transparent",
              color: strokeSize === sz.value ? "var(--color-text-primary, #111)" : "var(--color-text-secondary, #666)",
              transition: "background 0.15s",
            }}
          >
            {sz.label}
          </button>
        ))}

        <div style={{ width: "0.5px", height: 20, background: "var(--color-border-tertiary, #e5e5e5)", margin: "0 2px" }} />

        <button
          onClick={handleTogglePoints}
          style={{
            border: showPoints
              ? "0.5px solid var(--color-border-info, #185FA5)"
              : "0.5px solid var(--color-border-secondary, #ccc)",
            borderRadius: 6, padding: "4px 12px", cursor: "pointer",
            fontSize: 12,
            background: showPoints ? "var(--color-background-info, #e8f0fb)" : "transparent",
            color: showPoints ? "var(--color-text-info, #185FA5)" : "var(--color-text-secondary, #666)",
          }}
        >
          show points
        </button>

        <button
          onClick={handleClear}
          style={{
            marginLeft: "auto",
            border: "0.5px solid var(--color-border-secondary, #ccc)",
            borderRadius: 6, padding: "4px 12px", cursor: "pointer",
            fontSize: 12, background: "transparent",
            color: "var(--color-text-secondary, #666)",
          }}
        > clear
        </button>
      </div>

      <div
        ref={wrapRef}
        style={{
          position: "relative", width: "100%", height: 500,
          background: "#fff",
          borderBottom: "0.5px solid var(--color-border-tertiary, #e5e5e5)",
          cursor: "crosshair", overflow: "hidden",
        }}
      >
        <canvas
          ref={drawCanvasRef}
          style={{ position: "absolute", inset: 0, touchAction: "none" }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />
        <canvas
          ref={pointCanvasRef}
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        />
        {showHint && (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            pointerEvents: "none",
          }}>
            <span style={{
              fontSize: 13, color: "var(--color-text-tertiary, #aaa)",
              border: "0.5px dashed var(--color-border-tertiary, #e5e5e5)",
              padding: "8px 18px", borderRadius: 20,
            }}>
              draw anything here
            </span>
          </div>
        )}
      </div>

      <div style={{
        display: "flex", gap: 24, padding: "10px 16px",
        borderBottom: "0.5px solid var(--color-border-tertiary, #e5e5e5)",
        background: "var(--color-background-secondary, #f9f9f9)",
      }}>
        {[
          { label: "strokes", val: stats.strokes },
          { label: "total points", val: stats.totalPoints },
          { label: "this stroke", val: stats.currentStroke ?? "—" },
          { label: "last point", val: stats.lastPoint ? `${stats.lastPoint.x}, ${stats.lastPoint.y}` : "—" },
        ].map(({ label, val }) => (
          <div key={label} style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <span style={{ fontSize: 11, color: "var(--color-text-tertiary, #aaa)" }}>{label}</span>
            <span style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary, #111)" }}>{val}</span>
          </div>
        ))}
      </div>


      {showPoints && lastStrokePts.length > 0 && (
        <div style={{ maxHeight: 180, overflowY: "auto", padding: "12px 16px" }}>
          <h3 style={{ fontSize: 12, color: "var(--color-text-secondary, #666)", marginBottom: 8, fontWeight: 500 }}>
            Points in last stroke
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {lastStrokePts.map((p, i) => {
              const isFirst = i === 0;
              const isLast = i === lastStrokePts.length - 1;
              return (
                <span
                  key={i}
                  style={{
                    fontSize: 11, fontFamily: "monospace",
                    background: isFirst
                      ? "var(--color-background-info, #e8f0fb)"
                      : isLast
                      ? "var(--color-background-success, #e6f4f0)"
                      : "var(--color-background-secondary, #f5f5f5)",
                    border: `0.5px solid ${isFirst ? "var(--color-border-info, #185FA5)" : isLast ? "var(--color-border-success, #0F6E56)" : "var(--color-border-tertiary, #e5e5e5)"}`,
                    borderRadius: 4, padding: "2px 7px",
                    color: isFirst
                      ? "var(--color-text-info, #185FA5)"
                      : isLast
                      ? "var(--color-text-success, #0F6E56)"
                      : "var(--color-text-secondary, #666)",
                  }}
                >
                  {p.x},{p.y}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}