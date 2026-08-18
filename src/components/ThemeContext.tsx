import { createContext, useContext } from "react"

type ThemeContextType = {
    darkMode: boolean
    setDarkMode: React.Dispatch<React.SetStateAction<boolean>>
}

// The context is initialized as null here, but is later given the state and setter function by the Provider
export const ThemeContext = createContext<ThemeContextType | null>(null)

// A custom hook handles context access because TypeScript will complain otherwise (context may be null)
export const useTheme = () => {
    // Stores ThemeContext in "context"
    const context = useContext(ThemeContext)

    // Returns an error if useTheme is used outside of ThemeContext.Provider (in other words, if you try to receive the context values where they aren't being provided)
    if (!context) throw new Error("useTheme must be used within ThemeProvider")

    // Returns context
    return context
}