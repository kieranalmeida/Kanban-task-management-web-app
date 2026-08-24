// Hooks
import { useState, useEffect } from "react"
import { Outlet } from "react-router-dom"

// Components
import Header from "./Header"
import Sidebar from "./Sidebar"

// Context
import { ThemeContext } from "./ThemeContext"
import { SidebarContext } from "./SidebarContext"
import { BoardsContext } from "./BoardsContext"
import { ActiveBoardIdContext } from "./ActiveBoardContextId"

// Data
import data from "../data/data.json"

// Types
import type { Boards } from "../types/types"

export default function Layout() {
    // Controls the website theme. Compare the value stored in local storage to "true", which will return false if the value is non-existent or "false", or true if it's "true"
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("darkMode") === "true"
    )
    
    // Controls the sidebar
    const [sidebarOpen, setSidebarOpen] = useState(true)
    
    // Controls the boards. Intialized as the data from data.json, but with an ID inserted into every board, column and task. "useState( () => )" is used to ensure IDs are only generated when state is initialized, not every time Layout renders. The original json data is not modified by any user input on the website, only the copy of it stored in state. In a real application, data like this would naturally be stored in a database.
    const [boards, setBoards] = useState<Boards>( () => 
        data.boards.map( (board) => ({
            ...board,
            id: crypto.randomUUID(),
            columns: board.columns.map( (column) => ({
                ...column,
                id: crypto.randomUUID(),
                tasks: column.tasks.map( (task) => ({
                    ...task,
                    id: crypto.randomUUID(),
                    subtasks: task.subtasks.map( (subtask) => ({
                        ...subtask,
                        id: crypto.randomUUID()
                    }))
                }))
            }))
        }))
    )
    
    // Controls the active board
    const [activeBoardId, setActiveBoardId] = useState<string>( () => boards[0].id)

    // When darkMode changes, update the value saved in local storage. toString() is used to satisfy TypeScript
    useEffect( () => {
        localStorage.setItem("darkMode", darkMode.toString() )
    }, [darkMode])

    return (
        <ThemeContext.Provider value={ {darkMode, setDarkMode} }>
            <SidebarContext.Provider value={ {sidebarOpen, setSidebarOpen} }>
                    <BoardsContext.Provider value={ {boards, setBoards} }>
                        <ActiveBoardIdContext.Provider value={ {activeBoardId, setActiveBoardId} }>


                    {/* If darkMode is enabled, apply "dark" to this div, which wraps the entire website, activating the @custom-variant in the CSS */}
                    <div className={`${darkMode ? "dark" : ""} flex flex-col h-screen`}>
                        <Header/>

                        <div className="flex flex-1 min-h-0">
                            <Sidebar/>
                            <Outlet />
                        </div>
                    </div>
                    
                    </ActiveBoardIdContext.Provider>
                </BoardsContext.Provider>
            </SidebarContext.Provider>
        </ThemeContext.Provider>
    )
}