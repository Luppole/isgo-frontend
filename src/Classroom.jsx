import React, { useState, useEffect, useRef, useContext } from 'react';
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
  const [tool, setTool] = useState('pen');
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);

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

  if (!classInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="classroom-container">
      <div className="chat-container">
        <ChatBox classId={classId} username={username} />
      </div>
      <div className="canvas-container">
        <h2 className="class-info">{classInfo.name}, Taught By: {classInfo.professor}</h2>
        <ReactSketchCanvas
          ref={canvasRef}
          strokeColor={brushColor}
          strokeWidth={brushSize}
          width="100%" // Set width to 100% to stretch to full width
          height="100vh" // Set height to 100vh to stretch to full height
          className="canvas"
          onChange={saveCanvas}
        />
        <div className="buttons-container">
          <button onClick={clearCanvas}>Clear</button>
        </div>
      </div>
      <div className="toolbar-container">
        <button onClick={setPen}>Pen</button>
        <button onClick={setEraser}>Eraser</button>
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
        <button onClick={() => canvasRef.current.undo()}>Undo</button>
        <button onClick={() => canvasRef.current.redo()}>Redo</button>
      </div>
    </div>
  );
}

export default Classroom;