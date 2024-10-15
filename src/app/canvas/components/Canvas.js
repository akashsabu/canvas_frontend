"use client";
import React, { useRef, useEffect, useState } from "react";
import "./Canvas.css"

const handleSize = 8; // Size of the resize handles

const Canvas = ({
  width,
  height,
  layers,
  currentLayer,
  setCurrentLayer,
  setLayers,
  selectedLayerIndex,
  undoStack,
  setUndoStack,
  redoStack,
  setRedoStack,
}) => {
  const canvasRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [hoveredHandle, setHoveredHandle] = useState(null); // New state for hovered handle
  const [freehandPath, setFreehandPath] = useState([]); // Array to store freehand drawing points


  // Variables to store the previous state before an action begins
  const prevLayersRef = useRef([]);
  const prevCurrentLayerRef = useRef(null);

  const getResizeHandle = (x, y, layer) => {
    if (!layer) {
      console.error("Layer is undefined:", layer);
      return; // Early exit if layer is not defined
    }
    const corners = [
      { x: layer.x, y: layer.y, position: "top-left" },
      { x: layer.x + layer.width, y: layer.y, position: "top-right" },
      { x: layer.x, y: layer.y + layer.height, position: "bottom-left" },
      {
        x: layer.x + layer.width,
        y: layer.y + layer.height,
        position: "bottom-right",
      },
    ];

    for (const corner of corners) {
      if (
        x >= corner.x - handleSize / 2 &&
        x <= corner.x + handleSize / 2 &&
        y >= corner.y - handleSize / 2 &&
        y <= corner.y + handleSize / 2
      ) {
        return corner.position;
      }
    }

    return null;
  };

  // Deep copy function for the layers
  const deepCopyLayers = (layers) => {
    return JSON.parse(JSON.stringify(layers));
  };

  const pushUndo = (prevLayers) => {
    setUndoStack((prev) => [...prev, JSON.parse(JSON.stringify(prevLayers))]); // Ensure deep copy
    setRedoStack([]); // Clear redo stack on new action
  };

  const handleMouseDown = (e) => {
    const rect = canvasContainerRef.current.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;
  
    if (selectedLayerIndex === null) {
      // No layer selected, start drawing a new layer
      if (!isDrawing) { // Check if already drawing
        setIsDrawing(true);
        setFreehandPath([{ x: startX, y: startY }]); // Start path with the initial point
        // Store the previous currentLayer before drawing
        prevCurrentLayerRef.current = { ...currentLayer };
        setCurrentLayer({
          ...currentLayer,
          x: startX,
          y: startY,
          width: 0,
          height: 0,
        });
      }
    } else if (selectedLayerIndex !== null) {
      const selectedLayer = layers[selectedLayerIndex];
  
      // Calculate the current bounds of the layer
      const layerBounds = {
        xMin: Math.min(selectedLayer.x, selectedLayer.x + selectedLayer.width),
        xMax: Math.max(selectedLayer.x, selectedLayer.x + selectedLayer.width),
        yMin: Math.min(selectedLayer.y, selectedLayer.y + selectedLayer.height),
        yMax: Math.max(selectedLayer.y, selectedLayer.y + selectedLayer.height),
      };
  
      // Allow moving the layer if clicked anywhere within its bounds
      if (
        startX >= layerBounds.xMin &&
        startX <= layerBounds.xMax &&
        startY >= layerBounds.yMin &&
        startY <= layerBounds.yMax
      ) {
        setIsMoving(true);
        setOffset({
          x: startX - selectedLayer.x,
          y: startY - selectedLayer.y,
        });
        // Store the previous state before moving
        prevLayersRef.current = deepCopyLayers(layers);
        return;
      }
  
      const handle = getResizeHandle(startX, startY, selectedLayer);
      if (handle) {
        if (!isResizing) { // Check if already resizing
          setIsResizing(true);
          setResizeHandle(handle);
          // Store the previous state before resizing
          prevLayersRef.current = deepCopyLayers(layers);
        }
      }
    }
  };
  
  

  const handleMouseMove = (e) => {
    const rect = canvasContainerRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    if (selectedLayerIndex !== null) {
      const selectedLayer = layers[selectedLayerIndex];
      const handle = getResizeHandle(currentX, currentY, selectedLayer);
      setHoveredHandle(handle); // Update hovered handle state
    } else {
      setHoveredHandle(null); // Reset if not hovering over a layer
    }

    if (isResizing || isMoving || isDrawing) {
      requestAnimationFrame(() => {

      if (isResizing) {
        const selectedLayer = layers[selectedLayerIndex];
        let newLayer = { ...selectedLayer };


        if (resizeHandle === "top-left") {
          newLayer.width += newLayer.x - currentX;
          newLayer.height += newLayer.y - currentY;
          newLayer.x = currentX;
          newLayer.y = currentY;
        } else if (resizeHandle === "top-right") {
          newLayer.width = currentX - newLayer.x;
          newLayer.height += newLayer.y - currentY;
          newLayer.y = currentY;
        } else if (resizeHandle === "bottom-left") {
          newLayer.width += newLayer.x - currentX;
          newLayer.x = currentX;
          newLayer.height = currentY - newLayer.y;
        } else if (resizeHandle === "bottom-right") {
          newLayer.width = currentX - newLayer.x;
          newLayer.height = currentY - newLayer.y;
        }


        const updatedLayers = layers.map((layer, index) =>
          index === selectedLayerIndex ? newLayer : layer
        );

        setLayers(updatedLayers);
        return;
      }

      if (isMoving) {
        const newLayer = {
          ...layers[selectedLayerIndex],
          x: currentX - offset.x,
          y: currentY - offset.y,
        };

        const updatedLayers = layers.map((layer, index) =>
          index === selectedLayerIndex ? newLayer : layer
        );

        setLayers(updatedLayers);
        return;
      }

      if (isDrawing) {
        const dx = currentX - currentLayer.x; // Distance in X direction
        const dy = currentY - currentLayer.y; // Distance in Y direction
      
        // Update the current layer for circle or semi-circle based on the type
        // if (currentLayer.type === "circle" || currentLayer.type === "semi-circle") {
        //   setCurrentLayer((prevLayer) => ({
        //     ...prevLayer,
        //     width: dx,
        //     height: dy,     
        //   }));
        // }
        // else 
        if(currentLayer.type === "freehand"){
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");

          if (freehandPath.length > 0) {
            ctx.beginPath();
            ctx.moveTo(freehandPath[freehandPath.length - 1].x, freehandPath[freehandPath.length - 1].y); // Last point
            ctx.lineTo(currentX, currentY); // New point
            ctx.stroke();
          }
      
          setFreehandPath((prev) => [...prev, { x: currentX, y: currentY }]); // Add current point to the path
          
        } 

        else {
          setCurrentLayer((prevLayer) => ({
            ...prevLayer,
            width: dx,
            height: dy,
          }));
        }
      }

    });
  }
  };

  const handleMouseUp = () => {
    // Always log the current layers before updating

    if (isDrawing) {
      // Push the current layers to undo stack before drawing the new layer
      pushUndo(layers);
     
      if (currentLayer.type === "freehand") {
        const newLayer = {
          type: "freehand",
          path: freehandPath, // Completed path
          color: currentLayer.color,
          strokeStyle:currentLayer.strokeStyle,
          lineWidth: currentLayer.lineWidth || 2,
        };
        setLayers((prev) => [...prev, newLayer]); // Add the completed freehand drawing to layers
        setFreehandPath([]); // Reset path for future drawings
      } else {
        setLayers((prev) => [...prev, currentLayer]); // Add the current layer to layers
      }

    } else if (isMoving || isResizing) {
      // Capture and push previous layers before moving or resizing
      pushUndo(prevLayersRef.current);
    }

    setIsDrawing(false);
    setIsMoving(false);
    setIsResizing(false);
  };

  const handleMouseLeave = () => {
    // Reset the drawing, resizing, and moving states
    setIsDrawing(false);
    setIsResizing(false);
    setIsMoving(false);
  };



  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return; // Ensure canvas is available
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);


    // Helper function to fill and stroke shapes
    const fillAndStrokeShape = (layer) => {
      if (layer.color) {
        ctx.fillStyle = layer.color;
        ctx.fill();
      }
      ctx.stroke();
    };

    // Helper function to draw specific shapes
    const drawShape = (ctx, layer) => {
      ctx.lineWidth = layer.lineWidth || 1;
      ctx.strokeStyle = layer.strokeStyle || "black";
      ctx.beginPath(); 

      switch (layer.type) {

        case "rectangle":
          if (layer.color) {
            ctx.fillStyle = layer.color;
            ctx.fillRect(layer.x, layer.y, layer.width, layer.height); // Fill the rectangle first
          }
            ctx.strokeRect(layer.x, layer.y, layer.width, layer.height); // Stroke the rectangle
          break;
        case "circle":
          const radius = Math.sqrt(layer.width * layer.width + layer.height * layer.height) / 2;
          const centerX = layer.x + layer.width / 2;
          const centerY = layer.y + layer.height / 2;
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2); // Draw the circle
          fillAndStrokeShape(layer); // Fill and stroke the circle
          break;
        case "semi-circle":
          const semiCircleRadius = Math.sqrt(layer.width * layer.width + layer.height * layer.height) / 2;
          const semiCircleCenterX = layer.x + layer.width / 2;
          const semiCircleCenterY = layer.y + layer.height / 2;
          const startAngle = 0; // Adjust if necessary
          const endAngle = Math.PI; // Semi-circle covers 180 degrees
          ctx.arc(semiCircleCenterX, semiCircleCenterY, semiCircleRadius, startAngle, endAngle, false);
          ctx.closePath(); // Close the path for semi-circle
          fillAndStrokeShape(layer);
          break;
        case "line":
          ctx.moveTo(layer.x, layer.y);
          ctx.lineTo(layer.x + layer.width, layer.y + layer.height);
          ctx.stroke();
          break;
        case "freehand":
          if (layer.path && Array.isArray(layer.path) && layer.path.length > 0) {
            ctx.moveTo(layer.path[0].x, layer.path[0].y); // Move to the starting point
            layer.path.forEach((point) => {
              ctx.lineTo(point.x, point.y); // Draw line to each point
            });
            ctx.stroke(); // Stroke the path
          }
          break;
        default:
          break;
      }

    };

    // Draw all layers
    layers.forEach((layer, index) => {
      drawShape(ctx, layer);
  
      // Draw resize handles for the selected layer
      if (index === selectedLayerIndex) {
        ctx.fillStyle = "black";
        const corners = [
          { x: layer.x, y: layer.y },
          { x: layer.x + layer.width, y: layer.y },
          { x: layer.x, y: layer.y + layer.height },
          { x: layer.x + layer.width, y: layer.y + layer.height },
        ];

        corners.forEach((corner) => {
          ctx.fillRect(corner.x - handleSize / 2, corner.y - handleSize / 2, handleSize, handleSize);
        });
      }
    });

    // Draw the current layer if drawing is in progress
    if (isDrawing && currentLayer) {
      drawShape(ctx, currentLayer);
    }

    if (hoveredHandle) {
      document.body.style.cursor = "nwse-resize"; // Example cursor for resizing
    } else {
      document.body.style.cursor = "auto"; // Default cursor
    }

    // Cleanup cursor style when component unmounts or hoveredHandle changes
    return () => {
      document.body.style.cursor = "auto";
    };

  }, [layers, currentLayer, isDrawing, selectedLayerIndex]);


  return (
    <div className="canvas-wrapper">
    <div
      ref={canvasContainerRef}
      className="canvas-container"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      // onMouseLeave={handleMouseLeave} // 
    >
      <canvas ref={canvasRef} width={width} height={height} />
    </div>
  </div>
  );
};

export default Canvas;
