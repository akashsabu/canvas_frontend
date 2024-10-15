import React from "react";
import Thumbnail from "./Thumbnail";
import './LayerList.css'; 


const LayerList = ({ layers, thumbnailSize, width, height, selectedLayerIndex, handleThumbnailClick }) => {
  return (
    <div className="layer-list">
      <label className="label">Layers:</label>
    {layers.map((layer, index) => (
      <Thumbnail
        key={index}
        layer={layer}
        index={index}
        width={width}
        height={height}
        thumbnailSize={thumbnailSize}
        isSelected={index === selectedLayerIndex}
        onClick={() => handleThumbnailClick(index)}
      />
    ))}
  </div>
  );
};

export default LayerList;
