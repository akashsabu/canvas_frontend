"use client";
import styles from "./styles.module.css";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { useDispatch } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faExpandArrowsAlt } from "@fortawesome/free-solid-svg-icons";

import { setProjectProps } from "../../redux/features/projectSlice";

const Newproject = () => {
  const dispatch = useDispatch();
  const [projectName, setProjectName] = useState("");
  const [canvasWidth, setCanvasWidth] = useState(500);
  const [canvasHeight, setCanvasHeight] = useState(400);

  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      setProjectProps({
        name: projectName,
        height: canvasHeight,
        width: canvasWidth,
        
      })
    );
    router.push("/canvas");
  };

  const handleWidthChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (value > 720) {
      value = 720;
    }
    setCanvasWidth(value);
  };

  const handleHeightChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (value > 720) {
      value = 720;
    }
    setCanvasHeight(value);
  };

  return (
    <div className={styles.setupContainer} >
      <div className={styles.titleDiv}>
        <div className={styles.logoDiv}>
          {/* <!-- <img src="logo.png" alt="Logo" /> --> */}
        </div>
      </div>
      <div className={styles.rightContainer}>
        <h1>Set Up New Canvas Project</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup} >
            <input
              type="text"
              placeholder="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
            <FontAwesomeIcon icon={faPen} />

          </div>
          <div className={styles.formGroup}>
            <label for="width">Canvas Width: </label>
            <input
              id="width"
              type="number"
              placeholder="Canvas Width"
              value={isNaN(canvasWidth) ? '' : canvasWidth}
              onChange={handleWidthChange}
              max={720}
              required
            />
            <FontAwesomeIcon icon={faExpandArrowsAlt} />

          </div>
          <div className={styles.formGroup} >
            <label for="height">Canvas Height: </label>
            <input
              id="height"
              type="number"
              placeholder=""
              value={isNaN(canvasHeight) ? '' : canvasHeight}
              onChange={handleHeightChange}
              max={720}
              required
            />
            <FontAwesomeIcon icon={faExpandArrowsAlt} />

          </div>
          <button className={styles.button} type="submit">Create Project</button>
        </form>
      </div>
    </div>
  );
};

export default Newproject;
