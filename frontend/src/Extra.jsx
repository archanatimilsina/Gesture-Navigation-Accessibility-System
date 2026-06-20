import React, { useState, useRef, useEffect, useCallback } from 'react';

const App = () => {
  const [isActive, setIsActive] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const lastTapRef = useRef(0);

  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState([]); 
  const [currentStroke, setCurrentStroke] = useState([]); 

  const [tutorialStep, setTutorialStep] = useState(0); 

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1a73e8';
    
    strokes.forEach(stroke => {
      if (stroke.length === 0) return;
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      stroke.forEach(point => ctx.lineTo(point.x, point.y));
      ctx.stroke();
    });
  }, [strokes]);

  useEffect(() => {
    if (isActive) {
      setupCanvas();
      window.addEventListener('resize', setupCanvas);
    }
    return () => window.removeEventListener('resize', setupCanvas);
  }, [isActive, setupCanvas]);

  useEffect(() => {
    const isNewUser = !localStorage.getItem('tutorialCompleted');
    if (isNewUser && isActive) {
      setTutorialStep(1);
    }
  }, [isActive]);

  const handleTripleClick = () => {
    const now = Date.now();
    const diff = now - lastTapRef.current;
    
    if (diff < 400) {
      setTapCount(prev => {
        const newCount = prev + 1;
        if (newCount === 3) {
          setIsActive(true);
          return 0;
        }
        return newCount;
      });
    } else {
      setTapCount(1);
    }
    lastTapRef.current = now;
  };

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    if (!isActive) return;
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    setCurrentStroke([{ x, y }]);
  };

  const draw = (e) => {
    if (!isDrawing || !isActive) return;
    const { x, y } = getCoordinates(e);
    
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(x, y);
    ctx.stroke();
    setCurrentStroke(prev => [...prev, { x, y }]);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    if (currentStroke.length > 0) {
      setStrokes(prev => [...prev, currentStroke]);
    }

    if (tutorialStep === 1) {
      setTutorialStep(0);
      localStorage.setItem('tutorialCompleted', 'true');
    }
    setCurrentStroke([]);
  };

  return (
    <div 
      onMouseDown={(e) => !isActive && handleTripleClick()} 
      onContextMenu={(e) => e.preventDefault()} 
      style={{ height: '100vh', width: '100vw', cursor: isActive ? 'crosshair' : 'default', userSelect: 'none', overflow: 'hidden', position: 'relative' }}
    >
      <div style={{ padding: '40px', filter: isActive ? 'blur(10px)' : 'none', transition: 'filter 0.4s ease' }}>
        <h1 style={{ color: '#1a73e8' }}>Screen Gesture Navigation System</h1>
        <p style={{ fontSize: '1.2rem' }}>Triple-click anywhere to activate the gesture layer.</p>
        
        <div style={cardStyle}>
          <h3>Available Services</h3>
          <p>Draw a gesture to interact with the system.</p>
        </div>
      </div>

      {isActive && (
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            zIndex: 10, 
            background: 'rgba(255, 255, 255, 0.4)',
            touchAction: 'none' 
          }}
        />
      )}

      {isActive && tutorialStep === 1 && (
        <div style={instructionBox}>
            <p>कृपया स्क्रिनमा एउटा गोलो (Circle) बनाउनुहोस्।</p>
        </div>
      )}

      {isActive && (
        <div style={controlPanelStyle}>
          <button onClick={() => {
            const canvas = canvasRef.current;
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
            setStrokes([]);
          }} style={btnStyle}>Clear</button>
          
          <button onClick={() => {
            setIsActive(false);
            setStrokes([]);
          }} style={btnStyle}>Exit</button>
          
          <button 
            onClick={() => console.log("Gesture Data:", strokes)} 
            style={{...btnStyle, background: '#28a745', color: 'white'}}
          >
            Analyze ({strokes.length})
          </button>
        </div>
      )}
    </div>
  );
};

const cardStyle = { marginTop: '20px', border: '1px solid #ddd', padding: '30px', borderRadius: '15px', background: '#f8f9fa' };
const instructionBox = { position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', background: '#1a73e8', color: 'white', padding: '15px 30px', borderRadius: '30px', zIndex: 100, fontSize: '1.5rem', fontWeight: 'bold', pointerEvents: 'none' };
const controlPanelStyle = { position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', zIndex: 20, display: 'flex', gap: '15px' };
const btnStyle = { padding: '12px 25px', borderRadius: '25px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', cursor: 'pointer', fontWeight: 'bold' };

export default App;