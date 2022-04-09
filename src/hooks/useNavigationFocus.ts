import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';

export function useNavigationFocus(onFocus: () => void | Promise<void>) {
  const navigation = useNavigation();

  return useEffect(() => {
    let canceled = false;

    const callFocus = () => {
      if (!canceled) onFocus();
    };

    callFocus();

    navigation.addListener("focus", callFocus);

    return () => {
      canceled = true;
      navigation.removeListener("focus", callFocus);
    };
  }, []);
}

export default useNavigationFocus;
