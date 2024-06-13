import React, { useState, useEffect, useRef, useContext } from 'react';
import { Stage, Layer, Line, Text, Image } from 'react-konva';
import { useParams } from 'react-router-dom';
import { fetchClassById, saveCanvasState, fetchCanvasState } from './api';
import ChatBox from './ChatBox';
import { AuthContext } from './AuthContext';
import io from 'socket.io-client';
import useImage from './useImage'; // Ensure this path is correct
import './Classroom.css';

const socket = io('https://isgoserver.ddns.net'); // Update with your server URL

function Classroom() {
  let { classId } = useParams();
  const { username } = useContext(AuthContext);
  const [classInfo, setClassInfo] = useState(null);
  const [lines, setLines] = useState([]);
  const [tool, setTool] = useState('pen');
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState('black');
  const [text, setText] = useState('');
  const [texts, setTexts] = useState([]);
  const [images, setImages] = useState([]);
  const isDrawing = useRef(false);

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
        if (canvas_state) {
          const { lines, texts, images } = JSON.parse(canvas_state);
          setLines(lines || []);
          setTexts(texts || []);
          setImages(images || []);
        } else {
          setLines([]);
          setTexts([]);
          setImages([]);
        }
      } catch (error) {
        console.error('Error fetching canvas state:', error);
      }
    };

    fetchState();
  }, [classId]);

  useEffect(() => {
    socket.on('drawing', (data) => {
      setLines((prevLines) => [...prevLines, data]);
    });

    socket.on('addText', (data) => {
      setTexts((prevTexts) => [...prevTexts, data]);
    });

    socket.on('addImage', (data) => {
      setImages((prevImages) => [...prevImages, data]);
    });

    return () => {
      socket.off('drawing');
      socket.off('addText');
      socket.off('addImage');
    };
  }, []);

  const handleMouseDown = (e) => {
    if (tool === 'pen' || tool === 'eraser') {
      isDrawing.current = true;
      const pos = e.target.getStage().getPointerPosition();
      setLines([...lines, { tool, points: [pos.x, pos.y], stroke: brushSize, color: brushColor }]);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
    socket.emit('drawing', lastLine);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
    saveCanvas();
  };

  const saveCanvas = async () => {
    try {
      const canvasState = JSON.stringify({ lines, texts, images });
      await saveCanvasState(classId, canvasState);
    } catch (error) {
      console.error('Error saving canvas state:', error);
    }
  };

  const clearCanvas = () => {
    setLines([]);
    setTexts([]);
    setImages([]);
    saveCanvas();
  };

  const addText = (e) => {
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    const newText = { text, x: pos.x, y: pos.y };
    setTexts([...texts, newText]);
    socket.emit('addText', newText);
    setText('');
    saveCanvas();
  };

  const addImage = (src) => {
    const image = new window.Image();
    image.src = src;
    image.onload = () => {
      const newImage = { src, x: 100, y: 100, width: image.width, height: image.height };
      setImages([...images, newImage]);
      socket.emit('addImage', newImage);
      saveCanvas();
    };
  };

  const BrushSizeSlider = ({ size }) => (
    <input
      type="range"
      min="1"
      max="50"
      value={brushSize}
      onChange={(e) => setBrushSize(Number(e.target.value))}
    />
  );

  const BrushColorPicker = ({ color }) => (
    <input
      type="color"
      value={brushColor}
      onChange={(e) => setBrushColor(e.target.value)}
    />
  );

  const URLImage = ({ image }) => {
    const [img] = useImage(image.src);
    return <Image image={img} x={image.x} y={image.y} width={image.width} height={image.height} />;
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
        <Stage
          width={800}
          height={400}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <Layer>
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke={line.tool === 'eraser' ? 'white' : line.color}
                strokeWidth={line.stroke}
                tension={0.5}
                lineCap="round"
                globalCompositeOperation={
                  line.tool === 'eraser' ? 'destination-out' : 'source-over'
                }
              />
            ))}
            {texts.map((text, i) => (
              <Text key={i} text={text.text} x={text.x} y={text.y} fontSize={20} />
            ))}
            {images.map((image, i) => (
              <URLImage key={i} image={image} />
            ))}
          </Layer>
        </Stage>
        <div className="buttons-container">
          <button onClick={clearCanvas}>Clear</button>
        </div>
      </div>
      <div className="toolbar">
        <button onClick={() => setTool('pen')}>Pen</button>
        <button onClick={() => setTool('eraser')}>Eraser</button>
        <BrushSizeSlider />
        <BrushColorPicker />
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text"
        />
        <button onClick={addText}>Add Text</button>
        <button onClick={() => addImage('https://via.placeholder.com/150')}>Add Image</button>
      </div>
    </div>
  );
}

export default Classroom;
