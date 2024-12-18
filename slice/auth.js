import { createSlice } from "@reduxjs/toolkit";
import React,{useEffect} from "react";

const initialState = {
    user: false
}

const auth = createSlice({
    name: 'auth',
    initialState,
    reducers:{
			setUser: (state,action) => {
				state.user = action.payload
			}
    }
})

export const { setUser } = auth.actions
export default auth.reducer