import React, { useEffect } from 'react';
import { useDidShow, useDidHide } from '@tarojs/taro';
import { useAppStore } from '@/store/useAppStore';
import './app.scss';

function App(props) {
  const initFromStorage = useAppStore((state) => state.initFromStorage);
  const isInitialized = useAppStore((state) => state.isInitialized);

  useEffect(() => {
    if (!isInitialized) {
      initFromStorage();
      console.info('[App] Store initialization triggered');
    }
  }, [isInitialized, initFromStorage]);

  useDidShow(() => {
    if (!isInitialized) {
      initFromStorage();
    }
  });

  useDidHide(() => {});

  return props.children;
}

export default App;
