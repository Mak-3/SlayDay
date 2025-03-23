import { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';

export function useWarmUpBrowser() {
  useEffect(() => {
    WebBrowser.warmUpAsync(); // Preload browser for smoother login

    return () => {
      WebBrowser.coolDownAsync(); // Cleanup to free resources
    };
  }, []);
}