import { Link } from "react-router-dom"
import { useTheme } from "./ThemeContext"
import { useSidebar } from "./SidebarContext"
// Images
import logoMobile from "../images/logo-mobile.svg"
import logoLight from "../images/logo-light.svg"
import logoDark from "../images/logo-dark.svg"
import chevronDown from "../images/icon-chevron-down.svg"
import addTaskMobile from "../images/icon-add-task-mobile.svg"
import verticalEllipsis from "../images/icon-vertical-ellipsis.svg"

export default function Header() {
    const {darkMode} = useTheme()
    // Controls whether or not the sidebar is open
    const { sidebarOpen, setSidebarOpen } = useSidebar()
    
    return (
        <header className="flex items-center gap-x-4 md:gap-x-0 h-16 md:h-20 2xl:h-24 px-4 md:px-0 dark:bg-dark-grey">
            {/* Logo */}
            <div className={`h-full ${sidebarOpen ? "" : "md:border-b"} border-lines-light dark:border-lines-dark`}>
                {/* Mobile logo */}
                <div className="flex items-center h-full pl-4 md:hidden">
                    <Link to="/">
                        <img 
                            src={logoMobile} 
                            alt="Kanban logo"
                        />
                    </Link>
                </div>

                {/* Tablet and Desktop logo */}
                <div className={`items-center h-full ${sidebarOpen ? "md:w-65 2xl:w-75" : "w-52"} pl-6 border-r border-lines-light hidden md:flex dark:border-lines-dark`}>
                    <Link to="/" className="">
                        <img
                            src={!darkMode ? logoDark : logoLight}
                            alt="Kanban logo"
                        />
                    </Link>
                </div>
            </div>

            {/* Second half */}
            <div className="flex items-center justify-between gap-x-18 w-full h-full md:pl-6 md:pr-3 2xl:pr-4 md:border-b border-lines-light dark:border-lines-dark">
                <div>
                    <button className="flex items-center gap-x-2 cursor-pointer md:hidden">
                        <span className="text-black text-heading-l dark:text-white">Platform Launch</span>
                        <img className="mt-1" src={chevronDown} alt=""/>
                    </button>

                    <h1 className="text-black text-[1.25rem] font-bold 2xl:text-heading-xl hidden md:block dark:text-white">Platform Launch</h1>
                </div>

                <div className="flex items-center gap-x-3">
                    {/* Mobile add task button */}
                    <button className="py-2.5 px-4.5 bg-dark-purple opacity-50 rounded-2xl cursor-pointer hover:opacity-100 md:hidden">
                        <img src={addTaskMobile} alt="Add new task"/>
                    </button>

                    {/* Tablet and Desktop add task button */}
                    <button className="py-3.75 px-6 text-white text-heading-m bg-dark-purple opacity-50 rounded-3xl cursor-pointer hover:opacity-100 hidden md:block">
                        + Add New Task
                    </button>

                    <button className="px-3 py-1.5 md:px-4 md:py-2 cursor-pointer hover:bg-lines-light hover:rounded-full dark:hover:bg-lines-dark">
                        <img className="w-[3.7px] md:w-[4.6px]" src={verticalEllipsis} alt="View settings"/>
                    </button>
                </div>
            </div>
        </header>
    )
}