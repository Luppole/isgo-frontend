import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CanvasDraw from 'react-canvas-draw';
import './Classroom.css';  // Make sure to import the CSS file
import { fetchClassById } from './api';  // Import the function to fetch a class by ID

function Classroom() {
  let { classId } = useParams();
  const [classInfo, setClassInfo] = useState(null);
  const [canvasRef, setCanvasRef] = useState(null);

  useEffect(() => {
    const loadClass = async () => {
      try {
        const data = await fetchClassById(classId);
        setClassInfo(data);
      } catch (error) {
        console.error('Error fetching class:', error);
      }
    };
    loadClass();
  }, [classId]);

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
        />
      </div>
      <button onClick={() => canvasRef.undo()}>
        Undo
      </button>
      <button onClick={() => canvasRef.clear()}>
        Clear
      </button>
    </div>
  );
}

export default Classroom;
