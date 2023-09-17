import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from '../app/components/redux/store';
import App from './app';


export default function Index() {
  
  return (
    <Provider store={store}>
    <App />
  </Provider>
  )
}