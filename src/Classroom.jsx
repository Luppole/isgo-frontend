import React, { useEffect, useState, useRef, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { fetchClassById, saveCanvasState, fetchCanvasState } from './api';
import ChatBox from './ChatBox';
import { AuthContext } from './AuthContext';
import io from 'socket.io-client';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import './Classroom.css';

const socket = io('https://isgoserver.ddns.net'); // Update with your server URL

function Classroom() {
  let { classId } = useParams();
  const { username } = useContext(AuthContext);
  const [classInfo, setClassInfo] = useState(null);
  const canvasRef = useRef(null);
  const imageCanvasRef = useRef(null);
  const gridCanvasRef = useRef(null);
  const [tool, setTool] = useState('pen');
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [showGrid, setShowGrid] = useState(false);
  const [gridCanvasSize, setGridCanvasSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const getClassInfo = async () => {
      try {
        const data = await fetchClassById(classId);
        setClassInfo(data);
      } catch (error) {
        console.error('Error fetching class info:', error);
      }
    };

    getClassInfo();
  }, [classId]);

  useEffect(() => {
    const fetchState = async () => {
      try {
        const { canvas_state } = await fetchCanvasState(classId);
        if (canvas_state && canvasRef.current) {
          canvasRef.current.loadPaths(JSON.parse(canvas_state));
        }
      } catch (error) {
        console.error('Error fetching canvas state:', error);
      }
    };

    fetchState();
  }, [classId]);

  useEffect(() => {
    socket.on('drawing', (data) => {
      if (canvasRef.current) {
        canvasRef.current.loadPaths(data);
      }
    });

    return () => {
      socket.off('drawing');
    };
  }, []);

  const saveCanvas = async () => {
    if (canvasRef.current) {
      try {
        const paths = await canvasRef.current.exportPaths();
        await saveCanvasState(classId, JSON.stringify(paths));
        socket.emit('drawing', paths);
      } catch (error) {
        console.error('Error saving canvas state:', error);
      }
    }
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      canvasRef.current.clearCanvas();
      saveCanvas();
    }
  };

  const setPen = () => {
    setTool('pen');
    if (canvasRef.current) {
      canvasRef.current.eraseMode(false);
    }
  };

  const setEraser = () => {
    setTool('eraser');
    if (canvasRef.current) {
      canvasRef.current.eraseMode(true);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = imageCanvasRef.current;
          const sketchCanvas = canvasRef.current;
          if (sketchCanvas) {
            const sketchCanvasElem = sketchCanvas.canvas;
            canvas.width = sketchCanvasElem.width;
            canvas.height = sketchCanvasElem.height;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const imageDataUrl = canvas.toDataURL();
            const ctxSketch = sketchCanvasElem.getContext('2d');
            ctxSketch.drawImage(img, 0, 0, sketchCanvasElem.width, sketchCanvasElem.height);
            saveCanvas();
          }
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const drawGrid = () => {
    const canvas = gridCanvasRef.current;
    const sketchCanvas = canvasRef.current ? canvasRef.current.canvas : null;
    if (!canvas || !sketchCanvas) return;
    const ctx = canvas.getContext('2d');
    const gridSize = 20;

    canvas.width = sketchCanvas.width;
    canvas.height = sketchCanvas.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (showGrid) {
      ctx.strokeStyle = '#e0e0e0';
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }
  };

  useEffect(() => {
    const updateGridCanvasSize = () => {
      if (canvasRef.current) {
        const sketchCanvasElem = canvasRef.current.canvas;
        setGridCanvasSize({ width: sketchCanvasElem.width, height: sketchCanvasElem.height });
      }
    };

    updateGridCanvasSize();
    window.addEventListener('resize', updateGridCanvasSize);

    return () => {
      window.removeEventListener('resize', updateGridCanvasSize);
    };
  }, [classId]);

  useEffect(() => {
    drawGrid();
  }, [showGrid, gridCanvasSize]);

  const toggleGrid = () => {
    setShowGrid((prevShowGrid) => !prevShowGrid);
  };

  if (!classInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="classroom-container">
      <div className="toolbar-container">
        <div className="button-group">
          <button onClick={setPen}>Pen</button>
          <button onClick={setEraser}>Eraser</button>
        </div>
        <label>Brush Size</label>
        <input
          type="range"
          min="1"
          max="50"
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
        />
        <label>Brush Color</label>
        <input
          type="color"
          value={brushColor}
          onChange={(e) => setBrushColor(e.target.value)}
        />
        <div className="button-group">
          <button className="undo" onClick={() => canvasRef.current.undo()}>Undo</button>
          <button className="redo" onClick={() => canvasRef.current.redo()}>Redo</button>
        </div>
      </div>
      <div className="canvas-container">
        <h2 className="class-info">
          {classInfo.name}, Taught By: <a href={`/profile/${classInfo.professor}`} target="_blank" rel="noopener noreferrer">{classInfo.professor}</a>
        </h2>
        <canvas ref={imageCanvasRef} className="image-canvas" style={{ display: 'none' }}></canvas>
        <ReactSketchCanvas
          ref={canvasRef}
          strokeColor={brushColor}
          strokeWidth={brushSize}
          width="100%"
          height="100%"
          className="canvas"
          onChange={saveCanvas}
        />
        <canvas ref={gridCanvasRef} className="grid-canvas" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 1 }}></canvas>
        <div className="buttons-container">
          <button onClick={clearCanvas}>Clear</button>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          <button onClick={toggleGrid}>{showGrid ? 'Hide Grid' : 'Show Grid'}</button>
        </div>
      </div>
      <div className="chat-container">
        <ChatBox classId={classId} username={username} />
      </div>
    </div>
  );
}

export default Classroom;
