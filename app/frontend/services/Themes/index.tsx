import { useDarkMode } from '@/hooks/useDarkMode';
import { Theme } from '@radix-ui/themes';
import { PropsWithChildren, createContext, useContext } from 'react';
import { Helmet } from 'react-helmet-async';

const DarkModeContext = createContext({ isDarkMode: false, toggle: () => {} });

export const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { isDarkMode, toggle } = useDarkMode({ defaultValue: false });

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggle }}>
      <Theme
        appearance={isDarkMode ? 'dark' : 'light'}
        accentColor="crimson"
        grayColor="sand"
        panelBackground="solid"
      >
        <Helmet>
          <body data-theme={isDarkMode ? 'dark' : 'light'} />
        </Helmet>
        {children}
      </Theme>
    </DarkModeContext.Provider>
  );
};

const useDarkModeContext = () => useContext(DarkModeContext);

export { useDarkModeContext as useDarkMode };
