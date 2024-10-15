
import axios from "axios";


// Function to set access and refresh tokens in localStorage
export const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};

// Function to get the access token from localStorage
export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

// Function to get the refresh token from localStorage
export const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};

// Function to remove both tokens from localStorage
export const removeTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

// Function to refresh the access token using the refresh token
export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    console.log("No refresh token found.");
    return false; // No refresh token available
  }

  try {
    // Make a request to refresh the access token (modify the endpoint as per your backend)
    const response = await axios.post("http://127.0.0.1:8000/api/v1/auth/token/refresh/", {
      refresh: refreshToken, // This assumes the backend expects a `refresh` field
    });

    const { access } = response.data;
    console.log(response.data)

    
    // Update the access token in localStorage
    setTokens(access, refreshToken);
    console.log("Access token refreshed successfully!");
    return true;
  } catch (error) {
    console.error("Failed to refresh access token:", error);
    // If refreshing fails, remove both tokens
    removeTokens();
    return false;
  }
};

// Function to verify the access token
export const verifyToken = async () => {
  const accessToken = getAccessToken();

  if (!accessToken) {
    console.log("No access token found.");
    return false;
  }

  try {
    // Verify the access token by making an API request
    const response = await axios.post("http://127.0.0.1:8000/api/v1/auth/token/verify/", {
      token: accessToken,
    });

    console.log("Access token is valid.");
    return true;
  } catch (error) {
    console.error("Access token verification failed:", error);

    // If the access token is expired, attempt to refresh it
    const refreshed = await refreshAccessToken();

    return refreshed; // If refreshed successfully, return true; otherwise, false
  }
};


export const logout = async () => {
  
    removeTokens();
    window.location.href = "/auth/login"; 
    console.log("User logged out successfully.");
  
  };