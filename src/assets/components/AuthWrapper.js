// AuthWrapper.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { verifyToken } from '../../utils/session'; 
import styled from "styled-components";


const AuthWrapper = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      const isValid = await verifyToken();
      
      if (isValid) {
        setAuthenticated(true);
      } else {
        router.push('/auth/login'); 
      }
      setLoading(false); 
    };

    checkToken();
  }, [router]);

  const styles = {
    loadingDiv: {
      marginTop: '150px',
      fontSize: '28px',
      textAlign: 'center',
    },
  };

  if (loading) {
    return <div style= {styles.loadingDiv} >
        <p>Loading...</p>
        <p>Checking For Authentication</p>
        </div>; 
  }

  return authenticated ? children : null; 
};


export default AuthWrapper;
