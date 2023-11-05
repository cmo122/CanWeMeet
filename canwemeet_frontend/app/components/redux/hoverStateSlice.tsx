import { createSlice } from '@reduxjs/toolkit'

const initialState: boolean=false

const hoverStateSlice = createSlice({
    name: "hoverStateView",
    initialState: initialState, 
    reducers: {
      setHoverStateView: (state, action) => action.payload,
    },
  });
  
  export const { setHoverStateView } = hoverStateSlice.actions;
  
  export default hoverStateSlice.reducer;