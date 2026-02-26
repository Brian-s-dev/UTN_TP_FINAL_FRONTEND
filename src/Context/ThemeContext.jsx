import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [tema, setTema] = useState("dark");

    useEffect(() => {
        if (tema === "dark") document.body.classList.add("dark-mode");
        else document.body.classList.remove("dark-mode");
    }, [tema]);

    const toggleTema = () => setTema(prev => prev === "dark" ? "light" : "dark");

    return (
        <ThemeContext.Provider value={{ tema, toggleTema }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);