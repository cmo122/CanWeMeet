import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: string=""

const mostSharedTimeSlice = createSlice({
    name: 'mostSharedTime',
    initialState,
    reducers: {
      setMostSharedTime: (state, action: PayloadAction<string>) => {
        return action.payload;
      },
    },
  });
  
  export const { setMostSharedTime } = mostSharedTimeSlice.actions;
  export default mostSharedTimeSlice.reducer;