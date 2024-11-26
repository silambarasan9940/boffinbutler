"use client"; 

import React from 'react';
import { Provider } from 'react-redux';
import store from '@/redux/store/store';

// This component wraps its children with the Redux provider
const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
