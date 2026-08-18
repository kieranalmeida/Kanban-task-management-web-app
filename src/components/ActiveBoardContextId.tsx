import { createContext, useContext } from "react"

type ActiveBoardIdContextType = {
    activeBoardId: string,
    setActiveBoardId: React.Dispatch<React.SetStateAction<string>>
}

// The context is initialized as null here, but is later given the state and setter function by the Provider
export const ActiveBoardIdContext = createContext<ActiveBoardIdContextType | null>(null)

// A custom hook handles context access because TypeScript will complain otherwise (context may be null)
export const useActiveBoardId = () => {
    // Stores ActiveBoardId in "context"
    const context = useContext(ActiveBoardIdContext)

    // Returns an error if useActiveBoardId is used outside of ActiveBoardIdContext.Provider (in other words, if you try to receive the context values where they aren't being provided)
    if (!context) throw new Error("useActiveBoardId must be used within ThemeProvider")

    // Returns context
    return context
}