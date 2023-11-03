import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'

const initialState: string="dates"

const dateViewSlice = createSlice({
    name: 'dateView',
    initialState,
    reducers: {
      setDateView: (state, action: PayloadAction<string>) => {
        return action.payload;
      },
    },
  });
  
  export const { setDateView } = dateViewSlice.actions;
  export default dateViewSlice.reducer;