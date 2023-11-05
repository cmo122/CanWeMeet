import { createSlice, PayloadAction } from '@reduxjs/toolkit'

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