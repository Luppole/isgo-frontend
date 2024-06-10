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

    socket.on('drawing', (data) => {
      if (canvasRef.current) {
        canvasRef.current.loadSaveData(data, true);
      }
    });

    return () => {
      socket.off('drawing');
    };
  }, [classId]);

  const handleDrawing = () => {
    if (canvasRef.current) {
      const data = canvasRef.current.getSaveData();
      socket.emit('drawing', data);
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
          onChange={handleDrawing}
          brushColor="black"
          brushRadius={2}
          lazyRadius={0}
          canvasWidth={800}
          canvasHeight={400}
        />
      </div>
      <button onClick={() => canvasRef.current.undo()}>
        Undo
      </button>
      <button onClick={() => canvasRef.current.clear()}>
        Clear
      </button>
    </div>
  );
}

export default Classroom;
