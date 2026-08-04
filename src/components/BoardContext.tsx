import { createContext, useContext } from "react"

type BoardContextType = {
    activeBoard: string,
    setActiveBoard: React.Dispatch<React.SetStateAction<string>>
}

// The context is initialized as null here, but is later given the activeBoard state and setter function by the Provider
export const BoardContext = createContext<BoardContextType | null>(null)

// A custom hook handles context access because TypeScript will complain otherwise (context may be null)
export const useBoard = () => {
    // Stores SidebarContext in "context"
    const context = useContext(BoardContext)

    // Returns an error if useSidebar is used outside of BoardContext.Provider (in other words, if you try to receive the context values where they aren't being provided)
    if (!context) throw new Error("useBoard must be used within ThemeProvider")

    // Returns BoardContext
    return context
}