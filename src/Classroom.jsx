import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CanvasDraw from 'react-canvas-draw';
import { fetchClassById } from './api';
import axios from 'axios';
import './Classroom.css';

function Classroom() {
  let { classId } = useParams();
  const [classInfo, setClassInfo] = useState(null);
  const [canvasRef, setCanvasRef] = useState(null);

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
    const fetchCanvasState = async () => {
      try {
        const response = await axios.get(`https://isgoserver.ddns.net/canvas/${classId}`);
        if (canvasRef) {
          canvasRef.loadSaveData(response.data.state, true);
        }
      } catch (error) {
        console.error('Error fetching canvas state:', error);
      }
    };

    fetchCanvasState();

    const interval = setInterval(fetchCanvasState, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [classId, canvasRef]);

  const handleSave = async () => {
    if (canvasRef) {
      const state = canvasRef.getSaveData();
      try {
        await axios.post(`https://isgoserver.ddns.net/canvas/${classId}`, { state });
      } catch (error) {
        console.error('Error saving canvas state:', error);
      }
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
          ref={canvas => setCanvasRef(canvas)}
          brushColor="black"
          brushRadius={2}
          lazyRadius={0}
          canvasWidth={800}
          canvasHeight={400}
          onChange={handleSave}
        />
      </div>
      <button onClick={() => {
        canvasRef.undo();
        handleSave();
      }}>
        Undo
      </button>
      <button onClick={() => {
        canvasRef.clear();
        handleSave();
      }}>
        Clear
      </button>
    </div>
  );
}

export default Classroom;
