import { createContext, useContext } from "react"

type BoardModalContextType = {
    addBoardOpen: boolean,
    setAddBoardOpen: React.Dispatch<React.SetStateAction<boolean>>
    editBoardOpen: boolean
    setEditBoardOpen: React.Dispatch<React.SetStateAction<boolean>>
}

// The context is initialized as null here, but is later given the state and setter function by the Provider
export const BoardModalContext = createContext<BoardModalContextType | null>(null)

// A custom hook handles context access because TypeScript will complain otherwise (context may be null)
export const useBoardModalContext = () => {
    // Stores ActiveBoardId in "context"
    const context = useContext(BoardModalContext)

    // Returns an error if useBoardModalContext is used outside of BoardModalContext.Provider (in other words, if you try to receive the context values where they aren't being provided)
    if (!context) throw new Error("useBoardModalContext must be used within ThemeProvider")

    // Returns context
    return context
}