import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'

const initialState: string[]=[]

const selectedTimesSlice = createSlice({
    name: 'selectedTimes',
    initialState,
    reducers: {
        setSelectedTimes: (state, action: PayloadAction<string[]>) => {
        return action.payload;
      },
    },
  });
  
  export const { setSelectedTimes} = selectedTimesSlice.actions;
  export default selectedTimesSlice.reducer;