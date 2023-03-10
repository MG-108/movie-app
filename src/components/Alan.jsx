import { useEffect, useContext } from 'react';
import alanBtn from '@alan-ai/alan-sdk-web';

import { useHistory } from 'react-router-dom';

import { ColorModeContext } from '../utils/ToggleColorMode';
import { fetchToken } from '../utils';

const useAlan = () => {
  const { setMode } = useContext(ColorModeContext);
  const history = useHistory();

  useEffect(() => {
    alanBtn({
      key: 'df3c97a9d3718c9b770cd3ce7d31f27f2e956eca572e1d8b807a3e2338fdd0dc/stage',
      onCommand: ({ command, mode }) => {
        if (command === 'changeMode') {
          if (mode === 'light') {
            setMode('light');
          } else {
            setMode('dark');
          }
        } else if (command === 'login') {
          fetchToken();
        } else if (command === 'logout') {
          localStorage.clear();

          history.push('/');
        }
      },
    });
  }, []);
};

export default useAlan;
