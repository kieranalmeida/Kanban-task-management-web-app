import { useState, useEffect } from "react"
import { Outlet } from "react-router-dom"
// Context used to provide the entire website with the darkMode and sidebarOpen state and setter functions
import { ThemeContext } from "./ThemeContext"
import { SidebarContext } from "./SidebarContext"
// Components
import Header from "./Header"
import Sidebar from "./Sidebar"

export default function Layout() {
    // Controls the website theme. Compare the value stored in local storage to "true", which will return false if the value is non-existent or "false", or true if it's "true"
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("darkMode") === "true"
    )
    // Controls the sidebar
    const [sidebarOpen, setSidebarOpen] = useState(true)

    // When darkMode changes, update the value saved in local storage. toString() is used to satisfy TypeScript
    useEffect( () => {
        localStorage.setItem("darkMode", darkMode.toString() )
    }, [darkMode])

    return (
        <ThemeContext.Provider value={ {darkMode, setDarkMode} }>
            <SidebarContext.Provider value={ {sidebarOpen, setSidebarOpen} }>
                {/* If darkMode is enabled, apply "dark" to this div, which wraps the entire website, activating the @custom-variant in the CSS */}
                <div className={darkMode ? "dark" : ""}>
                    <Header/>
                    
                    <div className="flex">
                        <Sidebar/>
                        <Outlet />
                    </div>
                </div>
            </SidebarContext.Provider>
        </ThemeContext.Provider>
    )
}