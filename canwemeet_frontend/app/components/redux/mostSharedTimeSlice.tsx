import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface sharedTimes{
    names:string[];
    dates:string []
}

const initialState: sharedTimes= {names:[], dates: []}

const mostSharedTimesSlice = createSlice({
    name: 'mostSharedTimes',
    initialState,
    reducers: {
      setMostSharedTimes: (state, action: PayloadAction<sharedTimes>) => {
        return action.payload;
      },
    },
  });
  
  export const { setMostSharedTimes } = mostSharedTimesSlice.actions;
  export default mostSharedTimesSlice.reducer;