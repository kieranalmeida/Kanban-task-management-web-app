import { useState, useEffect } from "react"
import { useSidebar } from "./SidebarContext"
// Components
import ThemeSwitch from "./ThemeSwitch"
// Context
import { useBoard } from "./BoardContext"
// Data
import data from "../data/data.json"
// Images
import BoardIcon from "../images/icon-board.svg?react"
import lightThemeIcon from "../images/icon-light-theme.svg"
import darkThemeIcon from "../images/icon-dark-theme.svg"
import HideSidebarIcon from "../images/icon-hide-sidebar.svg?react"
import ShowSidebarIcon from "../images/icon-show-sidebar.svg?react"

export default function Sidebar() {
    const [isTablet, setIsTablet] = useState(window.matchMedia("(min-width: 768px)").matches) // Is the screen at the tablet breakpoint or higher (true or false)
    const { sidebarOpen, setSidebarOpen } = useSidebar() // Controls whether or not the sidebar is open
    const { activeBoard, setActiveBoard } = useBoard() // Controls active board
    const boardsNum = data.boards.length // Get the amount of boards
    
    // Board button normal + active styling
    const boardButtonClass = (name: string) => `
        flex items-center gap-x-3 w-full text-heading-m pl-6 py-3.5 rounded-r-full cursor-pointer 
        ${activeBoard === name ? "text-white bg-dark-purple" : "text-medium-gray hover:text-dark-purple hover:bg-dark-purple/10 dark:hover:bg-white"}  
    `

    // Creates a button for each board
    const boardButtons = data.boards.map( (board) => {
        return (
            <li className="flex items-center w-full rounded-r-full" key={board.name}>
                <button onClick={ () => setActiveBoard(board.name) } className={boardButtonClass(board.name)}>
                    <BoardIcon/>
                    {board.name}
                </button>
            </li>
        )
    }) 

    // Checks if the screen size is above or below the tablet breakpoint and updates the isTablet state accordingly
    useEffect( () => {
        const media = window.matchMedia("(min-width: 768px)")

        const updateIsTablet = (e: MediaQueryListEvent) => {
            setIsTablet(e.matches)
        }

        media.addEventListener("change", updateIsTablet)

        return () => {
            media.removeEventListener("change", updateIsTablet)
        }
    }, [])

    return (
        <>
            {
                !isTablet ? null
                : 
                isTablet && sidebarOpen ? (
                    <div className="flex flex-col justify-between shrink-0 w-65.25 2xl:w-75 border-r border-lines-light dark:bg-dark-grey dark:border-lines-dark">
                        <div className="flex flex-col gap-y-4.75">
                            {/* Heading */}
                            <h2 className="mt-7.75 pl-6 text-[0.75rem] text-medium-gray font-bold tracking-[0.15rem] uppercase">All boards ({boardsNum})</h2>
            
                            {/* Board buttons */}
                            <ul className="flex flex-col items-start w-60 2xl:w-69">
                                {boardButtons}
            
                                <li className="flex items-center w-full rounded-r-full">
                                    <button className="flex items-center gap-x-3 w-full text-dark-purple text-heading-m pl-6 py-3.5 rounded-r-full cursor-pointer">
                                        <BoardIcon/>
                                        + Create New Board
                                    </button>
                                </li>
                            </ul>
                        </div>
            
                        {/* Controls */}
                        <div className="flex flex-col gap-y-2 mb-8">
                            <div className="flex justify-center items-center gap-x-5.5 w-58.75 2xl:w-62.75 mx-auto py-3.5 bg-light-grey rounded-lg dark:bg-very-dark-grey">
                                <img src={lightThemeIcon}/>
                                <ThemeSwitch/>
                                <img src={darkThemeIcon}/>
                            </div>
            
                            <button onClick={ () => setSidebarOpen(!sidebarOpen) } className="flex items-center gap-x-3.75 w-60 2xl:w-69 pl-6 py-3.5 text-medium-gray text-heading-m cursor-pointer hover:text-dark-purple hover:bg-dark-purple/10 rounded-r-full dark:hover:bg-white">
                                <HideSidebarIcon className="mt-1"/>
                                Hide Sidebar
                            </button>
                        </div>
                    </div>
                )
                : (
                    // Show sidebar button
                    <button onClick={() => setSidebarOpen(true)} className="absolute left-0 bottom-8 flex justify-center items-center w-14 h-12 text-white bg-dark-purple rounded-r-full cursor-pointer hover:bg-light-purple">
                        <ShowSidebarIcon />
                    </button>
                )
            }
        </>
    )
}