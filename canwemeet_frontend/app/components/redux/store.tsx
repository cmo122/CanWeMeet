import { configureStore } from '@reduxjs/toolkit'
import dateViewReducer from './dateViewSlice';
import timeGridViewReducer from './timeGridViewSlice'
import selectedTimesReducer from './selectedTimesSlice'

const store = configureStore({
  reducer: {
    dateView: dateViewReducer,
    timeGridView: timeGridViewReducer,
    selectedTimes: selectedTimesReducer
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store;