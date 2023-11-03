import { configureStore } from '@reduxjs/toolkit'
import dateViewReducer from './dateViewSlice';
import timeGridViewReducer from './timeGridViewSlice'

const store = configureStore({
  reducer: {
    dateView: dateViewReducer,
    timeGridView: timeGridViewReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store;