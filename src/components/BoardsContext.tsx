import { createContext, useContext } from "react"
// Types
import type { Boards } from "../types/types"

type BoardsContextType = {
    boards: Boards,
    setBoards: React.Dispatch<React.SetStateAction<Boards>>
}

// The context is initialized as null here, but is later given the state and setter function by the Provider
export const BoardsContext = createContext<BoardsContextType | null>(null)

// A custom hook handles context access because TypeScript will complain otherwise (context may be null)
export const useBoards = () => {
    // Stores BoardsContext in "context"
    const context = useContext(BoardsContext)

    // Returns an error if BoardsContext is used outside of BoardsContext.Provider (in other words, if you try to receive the context values where they aren't being provided)
    if (!context) throw new Error("useBoards must be used within ThemeProvider")

    // Returns context
    return context
}