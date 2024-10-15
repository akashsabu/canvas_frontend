"use client";
import styles from "./styles.module.css"; 
import React, { useState, useEffect, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useDispatch } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import { setProjectProps } from "../redux/features/projectSlice";
import AuthWrapper from '@/assets/components/AuthWrapper'; 


const Home = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [projectName, setProjectName] = useState("");
  const [canvasWidth, setCanvasWidth] = useState();
  const [canvasHeight, setCanvasHeight] = useState();
  const [layers, setLayers] = useState([]);

  const [data, setData] = useState([]);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("accessToken");
    setToken(tokenFromStorage);
  }, []);

  useEffect(() => {
    if (token) {
    axios
      .get("http://127.0.0.1:8000/api/v1/canvasdata/user_canvas_data/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    }

  }, [token]);


  const handleNewProjectClick = () => {
    console.log("New project clicked!");
    router.push("/newproject"); 
  };

  const handleProjectClick = async (item) => {
    console.log(item.id);
    console.log("Project clicked!");
  
    setProjectName(item.title);
  
    const filePath = `http://127.0.0.1:8000/${item.file}`;
  
    try {
      const response = await axios.get(filePath);
      const data = response.data;
      console.log(data);
  
      // Set canvas dimensions and layers
      setCanvasHeight(data.height);
      setCanvasWidth(data.width);
      setLayers(data.layers || []);
  
      // Ensure that these states are set after fetching the data
      dispatch(
        setProjectProps({
          name: item.title,
          height: data.height,
          width: data.width,
          layers: data.layers || [],
          isExistingProject: true,
        })
      );
  
      // Once the state is set, redirect to the canvas page
      router.push("/canvas");
  
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };
  

  return (
    <AuthWrapper>
      <div className={styles.container}>
        <h1>Canvas Data</h1>
        <div className={styles.grid}>
          <div className={styles.tile} onClick={handleNewProjectClick}>
            <FontAwesomeIcon icon={faPlus} className={styles.icon} />
            <h2 className={styles.title}>New Project</h2>
          </div>

          {data.map((item) => (
            <div key={item.id} className={styles.tile}    onClick={() => handleProjectClick(item)}>
              <img
                src={`http://127.0.0.1:8000${item.image}`}
                alt={item.title}
                className={styles.image}
              />
              <h2 className={styles.title}>{item.title}</h2>
            </div>
          ))}
        </div>
      </div>
    </AuthWrapper>

  );
};

export default Home;
