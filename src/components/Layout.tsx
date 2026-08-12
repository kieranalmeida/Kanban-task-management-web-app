import { useState, useEffect } from "react"
import { Outlet } from "react-router-dom"
// Components
import Header from "./Header"
import Sidebar from "./Sidebar"
// Context
import { ThemeContext } from "./ThemeContext"
import { SidebarContext } from "./SidebarContext"
import { BoardContext } from "./BoardContext"
// Data
import data from "../data/data.json"

export default function Layout() {
    // Controls the website theme. Compare the value stored in local storage to "true", which will return false if the value is non-existent or "false", or true if it's "true"
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("darkMode") === "true"
    )
    // Controls the sidebar
    const [sidebarOpen, setSidebarOpen] = useState(true)

    // Controls the active board
    const [activeBoard, setActiveBoard] = useState(data.boards[0].name)

    // When darkMode changes, update the value saved in local storage. toString() is used to satisfy TypeScript
    useEffect( () => {
        localStorage.setItem("darkMode", darkMode.toString() )
    }, [darkMode])

    return (
        <ThemeContext.Provider value={ {darkMode, setDarkMode} }>
            <SidebarContext.Provider value={ {sidebarOpen, setSidebarOpen} }>
                <BoardContext.Provider value={ {activeBoard, setActiveBoard} }>

                    {/* If darkMode is enabled, apply "dark" to this div, which wraps the entire website, activating the @custom-variant in the CSS */}
                    <div className={`${darkMode ? "dark" : ""} flex flex-col min-h-screen`}>
                        <Header/>
                        
                        <div className="flex min-h-screen">
                            <Sidebar/>
                            <Outlet />
                        </div>
                    </div>
                    
                </BoardContext.Provider>
            </SidebarContext.Provider>
        </ThemeContext.Provider>
    )
}