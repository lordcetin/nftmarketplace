import { configureStore } from "@reduxjs/toolkit";
import todoReducer from '@/slice/todoSlice'
import auth from "@/slice/auth";

const store = configureStore({
    reducer: {
      auth
    }
  });

export default store;
