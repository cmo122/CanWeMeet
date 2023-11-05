import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: string=""

const sharedUsersSlice = createSlice({
    name: 'sharedUsers',
    initialState,
    reducers: {
      setSharedUsers: (state, action: PayloadAction<string>) => {
        return action.payload;
      },
    },
  });
  
  export const { setSharedUsers } = sharedUsersSlice.actions;
  export default sharedUsersSlice.reducer;