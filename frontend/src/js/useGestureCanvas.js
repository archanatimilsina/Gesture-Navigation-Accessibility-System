import { useCallback, useRef, useEffect } from "react";
const TAP_WINDOW_MS = 600;
const TAP_REQUIRED = 3;
const STROKE_PAUSE_MS = 800;
const MIN_POINTS = 5;

export default function useGestureCanvas({onGesture})
{
const canvasRef = useRef(null)
const activeRef = useRef(false)
const tapTimeRef = useRef([])
const strokeRef = useRef([])
const currentStrokeRef = useRef(null)
const pauseTimerRef = useRef(null)

const activateCanvas = useCallback(()=>{
    if(activeRef.current) return;
    activeRef.current= true;
    strokeRef.current= [];
    const canvas= canvasRef.current;
    canvas.style.display="block";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
},[]);

const handleTap = useCallback(()=>{
const now = Date.now();
tapTimeRef.current.push(now);
tapTimeRef.current = tapTimeRef.current.filter(t => now - t <= TAP_WINDOW_MS);
if(tapTimeRef.current.length >= TAP_REQUIRED){
    tapTimeRef.current=[];
    activateCanvas();
}
},[activateCanvas])

const deactivateCanvas= useCallback(()=>{
    activeRef.current = false;
    const canvas= canvasRef.current;
    canvas.style.display="none";
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width, canvas.height)
    strokeRef.current = [];
    currentStrokeRef.current = null
},[])

const getPoint =(e)=>
{
    const rect = canvasRef.current.getBoundingClientRect();
    const src = e.touches? e.touches[0]:e;
    return {x:src.clientX-rect.left, y:src.clientY-rect.top}
};

const onPointerDown = useCallback((e) => {
  if (!activeRef.current) return;
  clearTimeout(pauseTimerRef.current);
  const p = getPoint(e);
  currentStrokeRef.current = [p];
  const ctx = canvasRef.current.getContext("2d");
  ctx.beginPath();
  ctx.strokeStyle = "rgba(99,102,241,0.85)";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.moveTo(p.x, p.y);
}, []);

const onPointerMove = useCallback((e) => {
  if (!activeRef.current || !currentStrokeRef.current) return;
  const p = getPoint(e);
  currentStrokeRef.current.push(p);
  const ctx = canvasRef.current.getContext("2d");
  ctx.lineTo(p.x, p.y);
  ctx.stroke();
}, []);

const onPointerUp = useCallback(()=>{
   if (!activeRef.current || !currentStrokeRef.current) return;
   const stroke = currentStrokeRef.current;
   currentStrokeRef.current = null;
   if(stroke.length >=MIN_POINTS)
   {
    strokeRef.current.push(stroke)
   }
pauseTimerRef.current = setTimeout(()=>{
    const gesture = strokeRef.current
    deactivateCanvas();
    if(gesture.length >0 && onGesture)
    {
        onGesture(gesture)
    }
}, STROKE_PAUSE_MS)
},[onGesture,deactivateCanvas])

const onKeyDown = useCallback((e) => {
    if (e.key === "Escape" && activeRef.current) {
      clearTimeout(pauseTimerRef.current);
      deactivateCanvas();
    }
  }, [deactivateCanvas]);

  useEffect(() => {
    document.addEventListener("pointerdown", handleTap);
    document.addEventListener("keydown", onKeyDown);

    const canvas = canvasRef.current;
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup",   onPointerUp);

    return () => {
      document.removeEventListener("pointerdown", handleTap);
      document.removeEventListener("keydown", onKeyDown);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup",   onPointerUp);
      clearTimeout(pauseTimerRef.current);
    };
  }, [handleTap, onKeyDown, onPointerDown, onPointerMove, onPointerUp]);

  return canvasRef;
}