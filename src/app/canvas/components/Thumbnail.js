"use client";
import React, { useRef, useEffect } from "react";
import backgroundImage from "../../../assets/bg.jpeg"
import './Thumbnail.css'; // Import your CSS styles


const Thumbnail = ({
  layer,
  index,
  width,
  height,
  thumbnailSize,
  onClick,
  isSelected,
}) => {
  const canvasRef = useRef(null);
  const scale = Math.min(thumbnailSize / width, thumbnailSize / height); // Ensure consistent scaling

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Clear the canvas before drawing
    ctx.clearRect(0, 0, thumbnailSize, thumbnailSize);


    const img = new Image();
    img.src = backgroundImage.src;

    img.onload = () => {
      ctx.drawImage(img, 0, 0, thumbnailSize, thumbnailSize); // Draw the image on the canvas


      // Set fill style for shapes with color
      if (layer.color) {
        ctx.fillStyle = layer.color;
      }
      const scaledLineWidth = (layer.lineWidth || 1) * (scale*2); // Scale the line width

      // Draw based on layer type
      if (layer.type === "rectangle") {
        if (layer.color) {
          ctx.fillRect(
            layer.x * scale,
            layer.y * scale,
            layer.width * scale,
            layer.height * scale
          );
        }
        if (layer.strokeStyle) {
          ctx.strokeStyle = layer.strokeStyle;
          ctx.lineWidth = scaledLineWidth;
          ctx.strokeRect(
            layer.x * scale,
            layer.y * scale,
            layer.width * scale,
            layer.height * scale
          );
        }
      } else if (layer.type === "line") {
        ctx.beginPath();
        ctx.moveTo(layer.x * scale, layer.y * scale);
        ctx.lineTo(
          (layer.x + layer.width) * scale,
          (layer.y + layer.height) * scale
        );
        ctx.strokeStyle = layer.strokeStyle || "black";
        ctx.lineWidth = scaledLineWidth;
        ctx.stroke();
      } else if (layer.type === "circle") {
      
        ctx.beginPath();
            const radius = Math.sqrt(layer.width * layer.width + layer.height * layer.height) / 2;
            const centerX = layer.x + layer.width / 2;
            const centerY = layer.y + layer.height / 2;
            ctx.arc( centerX * scale, centerY * scale, radius * scale, 0, Math.PI * 2);
        if (layer.color) {
          ctx.fill();
        }
        if (layer.strokeStyle) {
          ctx.strokeStyle = layer.strokeStyle;
          ctx.lineWidth = scaledLineWidth;
          ctx.stroke();
        }
      } else if (layer.type === "semi-circle") {
        ctx.beginPath();
            const semiCircleRadius = Math.sqrt(layer.width * layer.width + layer.height * layer.height) / 2;
            const semiCircleCenterX = layer.x + layer.width / 2;
            const semiCircleCenterY = layer.y + layer.height / 2;

            const startAngle = Math.atan2(layer.height, layer.width);  // Angle from (x, y) to (dx, dy)
            const endAngle = startAngle + Math.PI;  // Semi-circle covers 180 degrees

            ctx.arc(semiCircleCenterX * scale, semiCircleCenterY * scale, semiCircleRadius * scale, startAngle, endAngle);
            ctx.closePath(); // Close the path
        ctx.closePath();
        if (layer.color) {
          ctx.fill();
        }
        if (layer.strokeStyle) {
          ctx.strokeStyle = layer.strokeStyle;
          ctx.lineWidth = scaledLineWidth;
          ctx.stroke();
        }
      }else if(layer.type === "freehand"){
       
          if (layer.path && layer.path.length > 0) {
            ctx.beginPath();
            ctx.moveTo(layer.path[0].x * scale, layer.path[0].y * scale); // Start from the first point
            // Loop through each point in the freehand path
            for (let i = 1; i < layer.path.length; i++) {
              ctx.lineTo(layer.path[i].x * scale, layer.path[i].y * scale); // Draw line to each subsequent point
            }
            ctx.strokeStyle = layer.strokeStyle || "black"; // Use stroke style or default to black
            ctx.lineWidth = scaledLineWidth;
            ctx.stroke(); // Render the path
          }
    
      }

    };
    // ctx.fillStyle = "rgba(0, 255, 255, 5)"; // Fully transparent
    // ctx.fillRect(0, 0, thumbnailSize, thumbnailSize);
  }, [layer, scale, thumbnailSize]);

  return (
    <div
    className={`thumbnail ${isSelected ? 'selected' : ''}`}
    onClick={onClick}
  >
    <canvas
      ref={canvasRef}
      width={thumbnailSize}
      height={thumbnailSize}
      className="thumbnail-canvas"
    />
    <p className="thumbnail-label">Layer {index + 1}</p>
  </div>
  );
};

export default Thumbnail;
