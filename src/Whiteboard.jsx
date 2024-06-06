// src/components/Whiteboard.js
import React, { useEffect } from 'react';
import { database } from '../firebase-config';

function Whiteboard() {
  useEffect(() => {
    const drawingRef = database.ref('drawings');
    drawingRef.on('value', (snapshot) => {
      const data = snapshot.val();
      // handle drawing data
    });

    // Cleanup function
    return () => {
      drawingRef.off('value');
    };
  }, []);

  // Rest of your component logic
}

export default Whiteboard;
