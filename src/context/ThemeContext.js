import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({children}) => {
    const [theme, setTheme] = useState(() => {
        const storedTheme = JSON.parse(localStorage.getItem('THEME_TYPE'));
        if(!storedTheme) return 'dark';
        return storedTheme;
    });

    useEffect(() => {
        localStorage.setItem('THEME_TYPE', JSON.stringify(theme));
    }, [theme]);

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