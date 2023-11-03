import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'

const initialState: boolean=false


const timeGridViewSlice = createSlice({
    name: "timeGridView",
    initialState: initialState, 
    reducers: {
      toggleTimeGridView: (state) => !state,
    },
  });
  
  export const { toggleTimeGridView } = timeGridViewSlice.actions;
  
  export default timeGridViewSlice.reducer;