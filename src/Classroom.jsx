import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import CanvasDraw from 'react-canvas-draw';
import { fetchClassById, saveCanvasState, fetchCanvasState } from './api';
import ChatBox from './ChatBox';
import { AuthContext } from './AuthContext';
import './Classroom.css';

function Classroom() {
  let { classId } = useParams();
  const { username } = useContext(AuthContext); // Assuming AuthContext provides the username
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
    const fetchState = async () => {
      try {
        const { canvas_state } = await fetchCanvasState(classId);
        if (canvasRef && canvas_state) {
          canvasRef.loadSaveData(canvas_state);
        }
      } catch (error) {
        console.error('Error fetching canvas state:', error);
      }
    };

    fetchState();
  }, [classId, canvasRef]);

  const handleSave = async () => {
    try {
      const canvasState = canvasRef.getSaveData();
      await saveCanvasState(classId, canvasState);
    } catch (error) {
      console.error('Error saving canvas state:', error);
    }
  };

  const handleChange = async () => {
    if (canvasRef) {
      handleSave();
    }
  };

  if (!classInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="classroom-container">
      <div className="chat-container">
        <ChatBox classId={classId} username={username} /> {/* Pass the username prop */}
      </div>
      <div className="canvas-container">
        <h2>{classInfo.name}, Taught By: {classInfo.professor}</h2>
        <CanvasDraw
          ref={canvas => setCanvasRef(canvas)}
          brushColor="black"
          brushRadius={2}
          lazyRadius={0}
          canvasWidth={800}
          canvasHeight={400}
          onChange={handleChange} // Save canvas state on change
        />
        <button onClick={() => canvasRef.undo()}>Undo</button>
        <button onClick={() => canvasRef.clear()}>Clear</button>
      </div>
    </div>
  );
}

export default Classroom;
