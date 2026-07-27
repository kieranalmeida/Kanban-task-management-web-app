import { useState } from "react"
import { Link } from "react-router-dom"
import logoMobile from "../images/logo-mobile.svg"
import logoLight from "../images/logo-light.svg"
import logoDark from "../images/logo-dark.svg"
import chevronDown from "../images/icon-chevron-down.svg"
import addTaskMobile from "../images/icon-add-task-mobile.svg"
import verticalEllipsis from "../images/icon-vertical-ellipsis.svg"

export default function Header() {
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "light"
    )

    return (
        // pr-82.5, pr-112.5 if sidebar open (state)
        // left div bottom border disappears if sidebar open (state)
        <header className="flex items-center gap-x-4 md:gap-x-0 h-16 md:h-20 2xl:h-24 px-4 md:px-0 mb-20">
            {/* Logo */}
            <div className="md:h-20 2xl:h-24 md:px-6 2xl:px-8 md:border-b border-lines-light">
                {/* Mobile logo */}
                <Link to="/" className="md:hidden">
                    <img 
                        src={logoMobile} 
                        alt="Kanban logo"
                    />
                </Link>

                {/* Tablet and Desktop logo */}
                <div className="items-center h-full md:pr-6 2xl:pr-8 border-r-2 border-lines-light hidden md:flex">
                    <Link to="/" className="">
                        <img 
                            src={theme === "light" ? logoDark : logoLight}
                            alt="Kanban logo"
                        />
                    </Link>
                </div>
            </div>

            {/* Second half */}
            <div className="flex items-center justify-between gap-x-18 w-full md:h-20 2xl:h-24 md:pr-3 2xl:pr-4 md:border-b border-lines-light">
                <div>
                    <button className="flex items-center gap-x-2 cursor-pointer md:hidden">
                        <span className="text-black text-heading-l">Platform Launch</span>
                        <img className="mt-1" src={chevronDown} alt=""/>
                    </button>

                    <h1 className="text-black text-[1.25rem] font-bold 2xl:text-heading-xl hidden md:block">Platform Launch</h1>
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

                    <button className="px-3 py-1.5 md:px-4 md:py-2 cursor-pointer hover:bg-lines-light hover:rounded-full">
                        <img className="w-[3.7px] md:w-[4.6px]" src={verticalEllipsis} alt="View settings"/>
                    </button>
                </div>
            </div>
        </header>
    )
}

// Header

// Sidebar