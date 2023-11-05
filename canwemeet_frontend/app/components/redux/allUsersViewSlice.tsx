import { createSlice } from '@reduxjs/toolkit'

const initialState: boolean=false


const allUsersViewSlice = createSlice({
    name: "allUsersView",
    initialState: initialState, 
    reducers: {
      toggleAllUsersView: (state) => !state,
    },
  });
  
  export const { toggleAllUsersView } = allUsersViewSlice.actions;
  
  export default allUsersViewSlice.reducer;