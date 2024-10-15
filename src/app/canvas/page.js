"use client";
import styles from "./canvas.module.css"; 

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import axios from "axios";

import Canvas from "./components/Canvas";
import Controls from "./components/Controls";
import LayerList from "./components/LayerList";
import Popup from "../../assets/components/Popup";
import { verifyToken, getAccessToken } from "@/utils/session"; 
import AuthWrapper from '@/assets/components/AuthWrapper'; 


export default function Home() {
  const title = useSelector((state) => state.projectProps.value.name);
  const width = useSelector((state) => state.projectProps.value.width);
  const height = useSelector((state) => state.projectProps.value.height);
  const savedLayers = useSelector((state) => state.projectProps.value.layers);
  const isExistingProject = useSelector((state) => state.projectProps.value.isExistingProject);
  const [isPopupOpen, setIsPopupOpen] = useState(false);



  const [layers, setLayers] = useState([]);
  const [currentLayer, setCurrentLayer] = useState({
    color: null,
    strokeStyle: "#000000",
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    type: "rectangle",
    lineWidth: 1,
  });
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [selectedLayerIndex, setSelectedLayerIndex] = useState(null);
  const [latestLayer, setLatestLayer] = useState(currentLayer);

  const [token, setToken] = useState(null);




  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    setToken(storedToken);
  }, []);
 
  useEffect(() => {
    if (savedLayers) {
      setLayers(savedLayers || []);
    }
  }, [savedLayers]);

  useEffect(() => {
    console.log("Updated layers:", layers);
  }, [layers]);


  const handleModeChange = (mode) => {
    setCurrentLayer({ ...currentLayer, type: mode });
    setSelectedLayerIndex(null);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    
    console.log("undostack: ",undoStack);

    const previousLayers = undoStack.pop();
    setRedoStack((prev) => [...prev, layers]); // Store the current layers in redo stack
    setLayers(previousLayers);
    console.log("layers:",layers);
    console.log("undostack: ",undoStack);

  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const nextLayers = redoStack.pop();
    setUndoStack((prev) => [...prev, layers]); // Store the current layers in undo stack
    setLayers(nextLayers);

  };

  const handleDeleteLayer = () => {
    if (selectedLayerIndex === null) return;
    const updatedLayers = layers.filter(
      (_, index) => index !== selectedLayerIndex
    );
    setLayers(updatedLayers);
    setSelectedLayerIndex(null);
    setUndoStack((prev) => [...prev, layers]);
    setRedoStack([]);
  };

  const handleThumbnailClick = (index) => {
    if (selectedLayerIndex === index) {
      setSelectedLayerIndex(null);
      setCurrentLayer(latestLayer); 
    } else {
      setSelectedLayerIndex(index);
      setCurrentLayer({ ...layers[index], type: null }); 
  };
  }

  const saveAsJSON = async (isNewFile = false) => {
    const data = {
      layers,
      width,
      height,
    };
    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: "application/json" });
  
    const timestamp = new Date().toISOString().replace(/[-:.]/g, "_");
    const dynamicFilename = `canvas_data_${timestamp}.json`;
  
    const formData = new FormData();
    formData.append("file", blob, dynamicFilename);
  
    const canvas = document.querySelector("canvas");
    if (!canvas) {
      console.error("Canvas element not found");
      return;
    }
    const imageData = canvas.toDataURL("image/png");
    const imageBlob = await (await fetch(imageData)).blob();
    const imageFilename = `canvas_image_${timestamp}.png`;
  
    formData.append("image", imageBlob, imageFilename);
    formData.append("title", title);
    formData.append("overwrite", !isNewFile); // Send flag to backend
  
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
  
    // Verify the token before proceeding
    const isTokenValid = await verifyToken();
    if (!isTokenValid) {
      console.error("Token is invalid or expired, and could not be refreshed.");
      alert("Session has expired. Please log in again.");
      return;
    }
  
    // Get the valid access token
    const token = getAccessToken();
  
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/v1/canvasdata/upload/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Use the valid token here
          },
        }
      );
  
      if (response.status === 200) {
        console.log("File overwritten successfully:", response.data);
        alert("File overwritten successfully!"); // Popup message
      } else if (response.status === 201) {
        console.log("File uploaded successfully:", response.data);
        alert("File uploaded successfully!"); // Popup message
      } else {
        console.error("Failed to upload file:", response.statusText);
        console.error(response.status);
      }
  
    } catch (error) {
      console.error("Error during file upload:", error.response ? error.response.data : error.message);
    }
  };


  const handleSaveClick = async () => {
    if (isExistingProject) {
      setIsPopupOpen(true); // Show the popup
    } else {
      await saveAsJSON(true); // Always create a new file for new projects
    }
  };

  const handleConfirm = async () => {
    setIsPopupOpen(false); // Close the popup
    await saveAsJSON(false); // Overwrite the existing file
  };

  const handleCancel = async () => {
    setIsPopupOpen(false); // Close the popup
    await saveAsJSON(true); // Create a new file
  };
  
  return (
    <AuthWrapper>
       <div className={styles.appLayout}>
      <div className={styles.controlsPanel}>
        <Controls
          handleModeChange={handleModeChange}
          handleUndo={handleUndo}
          handleRedo={handleRedo}
          handleDeleteLayer={handleDeleteLayer}
          undoStack={undoStack}
          redoStack={redoStack}
          selectedLayerIndex={selectedLayerIndex}
          setCurrentLayer={setCurrentLayer}
          currentLayer={currentLayer}
          handleSaveClick={handleSaveClick}
        />
      </div>
      <div className={styles.canvasContainer}>
        <Canvas
          width={width}
          height={height}
          layers={layers}
          currentLayer={currentLayer}
          setCurrentLayer={setCurrentLayer}
          setLayers={setLayers}
          selectedLayerIndex={selectedLayerIndex}
          latestLayer={latestLayer}
          setUndoStack={setUndoStack}
          setRedoStack={setRedoStack}
          undoStack={undoStack}
          redoStack={redoStack}
          setLatestLayer={setLatestLayer}
        />
      </div>
      <div className={styles.layerListPanel}>
        <LayerList
          layers={layers}
          thumbnailSize={70}
          width={width}
          height={height}
          selectedLayerIndex={selectedLayerIndex}
          handleThumbnailClick={handleThumbnailClick}
        />
      </div>
      <Popup
        isOpen={isPopupOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        onClose={() => setIsPopupOpen(false)}
      />
    </div>
    </AuthWrapper>

  );
}
