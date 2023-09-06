import { configureStore } from '@reduxjs/toolkit'
import dateViewReducer from './dateViewSlice';

const store = configureStore({
  reducer: {
    dateView: dateViewReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store;