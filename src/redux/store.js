import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import projectReducer from "./features/projectSlice";
import toolReducer from "./features/toolSlice"


export const store = configureStore({
    reducer: {
        user: userReducer,
        projectProps: projectReducer,
        toolProps: toolReducer,
    },
  });