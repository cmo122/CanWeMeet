import { configureStore } from '@reduxjs/toolkit'
import dateViewReducer from './dateViewSlice';
import allUsersViewReducer from './allUsersViewSlice'
import selectedTimesReducer from './selectedTimesSlice'
import hoverStateReducer from './hoverStateSlice'
import sharedUsersReducer from './sharedUsersSlice'
import mostSharedTimeReducer from './mostSharedTimeSlice'

const store = configureStore({
  reducer: {
    dateView: dateViewReducer,
    allUsersView: allUsersViewReducer,
    selectedTimes: selectedTimesReducer,
    hoverState: hoverStateReducer,
    sharedUsers: sharedUsersReducer,
    mostSharedTimes:mostSharedTimeReducer
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store;