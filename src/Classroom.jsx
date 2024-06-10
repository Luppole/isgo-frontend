import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import CanvasDraw from 'react-canvas-draw';
import { fetchClassById } from './api';
import { io } from 'socket.io-client';
import './Classroom.css';

const socket = io('http://localhost:3000');

function Classroom() {
  let { classId } = useParams();
  const [classInfo, setClassInfo] = useState(null);
  const canvasRef = useRef(null);

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
    socket.on('draw', (data) => {
      if (canvasRef.current) {
        const ctx = canvasRef.current.ctx.drawing;
        const img = new Image();
        img.src = data;
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
        };
      }
    });

    socket.on('clear', () => {
      if (canvasRef.current) {
        canvasRef.current.clear();
      }
    });

    return () => {
      socket.off('draw');
      socket.off('clear');
    };
  }, []);

  const handleDraw = () => {
    if (canvasRef.current) {
      const dataURL = canvasRef.current.getSaveData();
      socket.emit('draw', dataURL);
    }
  };

  const handleClear = () => {
    if (canvasRef.current) {
      canvasRef.current.clear();
      socket.emit('clear');
    }
  };

  if (!classInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="classroom-container">
      <div className="description">{classInfo.description}</div>
      <h2>{classInfo.name}, Taught By: {classInfo.professor}</h2>
      <div className="whiteboard-container">
        <CanvasDraw
          ref={canvasRef}
          onChange={handleDraw}
          brushColor="black"
          brushRadius={2}
          lazyRadius={0}
          canvasWidth={800}
          canvasHeight={400}
        />
      </div>
      <button onClick={handleClear}>
        Clear
      </button>
    </div>
  );
}

export default Classroom;
