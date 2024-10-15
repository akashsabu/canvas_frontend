"use client";
import React, { useEffect } from "react";
import "./Controls.css"

const Controls = ({
  handleModeChange,
  handleUndo,
  handleRedo,
  handleDeleteLayer,
  undoStack,
  redoStack,
  selectedLayerIndex,
  setCurrentLayer,
  currentLayer,
  handleSaveClick,
}) => {
  useEffect(() => {
    // Function to handle keydown events
    const handleKeyDown = (event) => {
      // Check if Ctrl or Command key is pressed
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case "z":
            if (undoStack.length > 0) {
              event.preventDefault(); // Prevent default browser undo
              handleUndo();
            }
            break;
          case "y":
            if (redoStack.length > 0) {
              event.preventDefault(); // Prevent default browser redo
              handleRedo();
            }
            break;
          default:
            break;
        }
      }

      // Check if the Delete key is pressed and a layer is selected
      if (event.key === "Delete" && selectedLayerIndex !== null) {
        event.preventDefault(); // Prevent default delete behavior
        handleDeleteLayer();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Clean up event listener when component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    undoStack,
    redoStack,
    handleUndo,
    handleRedo,
    selectedLayerIndex,
    handleDeleteLayer,
  ]);

  const highlightedStyle = {
    backgroundColor: "#351430", // Change this to your preferred highlight color
  };

  return (
    <div className="controls">
    <div className="control-section">
      <label className="label">Drawing Modes:</label>
      <button
        className="control-button"
        onClick={() => handleModeChange("freehand")}
        style={currentLayer.type === "freehand" ? highlightedStyle : {}}
      >
        Draw Freehand
      </button>
      <button
        className="control-button"
        onClick={() => handleModeChange("rectangle")}
        style={currentLayer.type === "rectangle" ? highlightedStyle : {}}
      >
        Draw Rectangle
      </button>
      <button
        className="control-button"
        onClick={() => handleModeChange("line")}
        style={currentLayer.type === "line" ? highlightedStyle : {}}
      >
        Draw Line
      </button>
      <button
        className="control-button"
        onClick={() => handleModeChange("circle")}
        style={currentLayer.type === "circle" ? highlightedStyle : {}}
      >
        Draw Circle
      </button>
      <button
        className="control-button"
        onClick={() => handleModeChange("semi-circle")}
        style={currentLayer.type === "semi-circle" ? highlightedStyle : {}}
      >
        Draw Semi-Circle
      </button>
    </div>

    <div className="control-section">
    <label className="label">Functions:</label>

      <button
        className="control-button"
        onClick={handleUndo}
        disabled={undoStack.length === 0}
      >
        Undo
      </button>
      <button
        className="control-button"
        onClick={handleRedo}
        disabled={redoStack.length === 0}
      >
        Redo
      </button>
      <button
        className="control-button"
        onClick={handleDeleteLayer}
        disabled={selectedLayerIndex === null}
      >
        Delete Layer
      </button>
      <button className="control-button" onClick={handleSaveClick}>
        Save File
      </button>
    </div>

    <div className="control-section">
      <label className="label">Stroke Color:</label>
      <input
        type="color"
        className="color-picker"
        value={currentLayer.strokeStyle}
        onChange={(e) =>
          setCurrentLayer({
            ...currentLayer,
            strokeStyle: e.target.value,
          })
        }
      />
    </div>

    <div className="control-section">
      <label className="label">Fill Color:</label>
      <input
        type="color"
        className="color-picker"
        value={currentLayer.color || "#FFFFFF"}
        onChange={(e) =>
          setCurrentLayer({ ...currentLayer, color: e.target.value })
        }
      />
      <button
        className="control-button"
        onClick={() => setCurrentLayer({ ...currentLayer, color: null })}
      >
        Transparent
      </button>
    </div>

    <div className="control-section">
      <label className="label">
        Line Width: {currentLayer.lineWidth || 1}
      </label>
      <input
        type="range"
        min="1"
        max="10"
        className="range-slider"
        value={currentLayer.lineWidth || 1}
        onChange={(e) =>
          setCurrentLayer({
            ...currentLayer,
            lineWidth: parseInt(e.target.value, 10),
          })
        }
      />
    </div>
  </div>
  );
};

export default Controls;
