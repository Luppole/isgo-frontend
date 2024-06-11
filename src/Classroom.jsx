import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import CanvasDraw from 'react-canvas-draw';
import { fetchClassById } from './api';  // Import the function
import ChatBox from './ChatBox';  // Import the ChatBox component
import io from 'socket.io-client';
import './Classroom.css';

const socket = io('http://localhost:3000');

function Classroom() {
  let { classId } = useParams();
  const [classInfo, setClassInfo] = useState(null);
  const [canvasRef, setCanvasRef] = useState(null);
  const username = localStorage.getItem('username');

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
      if (canvasRef) {
        canvasRef.loadSaveData(data, true);
      }
    });

    return () => {
      socket.off('draw');
    };
  }, [canvasRef]);

  const handleCanvasChange = () => {
    const saveData = canvasRef.getSaveData();
    socket.emit('draw', saveData);
  };

  if (!classInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="classroom-container">
      <div className="chat-container">
        <ChatBox classId={classId} username={username} socket={socket} />
      </div>
      <div className="canvas-container">
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
            onChange={handleCanvasChange}
          />
        </div>
        <button className="undo" onClick={() => canvasRef.undo()}>Undo</button>
        <button className="clear" onClick={() => canvasRef.clear()}>Clear</button>
      </div>
    </div>
  );
}

export default Classroom;
