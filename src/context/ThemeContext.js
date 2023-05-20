import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({children}) => {
    const [theme, setTheme] = useState('dark');

    return(
        <ThemeContext.Provider value={{
            theme,
            toggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark')
        }}>
            {children}
        </ThemeContext.Provider>
    )
};

export const useThemeContext = () => useContext(ThemeContext);