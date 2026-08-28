// Context
import { useTheme } from "./ThemeContext"

// Switch to toggle dark mode on and off
export default function ThemeSwitch() {
    const {darkMode, setDarkMode} = useTheme()

    return (
        <button 
            onClick={ () => setDarkMode(!darkMode) } 
            className={`
                flex items-center w-10 h-5 p-1 bg-dark-purple rounded-full cursor-pointer transition hover:bg-light-purple
            `}
        >

            <div 
                className={`
                    w-3.5 h-3.5 bg-white rounded-full transition
                    ${darkMode ? "translate-x-4.5" : "translate-x-0"}
                `}
            />
        </button>
    )
}