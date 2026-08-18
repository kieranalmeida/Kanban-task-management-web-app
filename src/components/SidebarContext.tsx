import { createContext, useContext } from "react"

type SidebarContextType = {
    sidebarOpen: boolean,
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}

// The context is initialized as null here, but is later given the state and setter function by the Provider
export const SidebarContext = createContext<SidebarContextType | null>(null)

// A custom hook handles context access because TypeScript will complain otherwise (context may be null)
export const useSidebar = () => {
    // Stores SidebarContext in "context"
    const context = useContext(SidebarContext)

    // Returns an error if useSidebar is used outside of SidebarContext.Provider (in other words, if you try to receive the context values where they aren't being provided)
    if (!context) throw new Error("useSidebar must be used within ThemeProvider")

    // Returns context
    return context
}