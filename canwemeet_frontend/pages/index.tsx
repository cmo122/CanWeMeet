import React from 'react';
import Head from 'next/head';
import { Provider } from 'react-redux';
import store from '../app/components/redux/store';
import App from './app';


export default function Index() {
  
  return (
    <Provider store={store}>
      <Head>
        <meta name="viewport" content="width=device-width, height=device-height" />
      </Head>
      <App />
    </Provider>
  )
}