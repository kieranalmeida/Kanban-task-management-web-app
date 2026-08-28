// Hooks
import { useState, useEffect } from "react"

// Components
import ThemeSwitch from "./ThemeSwitch"

// Context
import { useSidebar } from "./SidebarContext"
import { useBoards } from "./BoardsContext"
import { useActiveBoardId } from "./ActiveBoardContextId"
import { useBoardModalContext } from "./BoardModalContext"

// Images
import BoardIcon from "../images/icon-board.svg?react"
import lightThemeIcon from "../images/icon-light-theme.svg"
import darkThemeIcon from "../images/icon-dark-theme.svg"
import HideSidebarIcon from "../images/icon-hide-sidebar.svg?react"
import ShowSidebarIcon from "../images/icon-show-sidebar.svg?react"

export default function Sidebar() {
    // State variables
    const [isTablet, setIsTablet] = useState(window.matchMedia("(min-width: 768px)").matches) // Is the screen at the tablet breakpoint or higher (true or false)

    // Context
    const { sidebarOpen, setSidebarOpen } = useSidebar()
    const { boards } = useBoards()
    const { activeBoardId, setActiveBoardId } = useActiveBoardId()
    const { setAddBoardOpen } = useBoardModalContext() // Controls BoardModal in add mode

    // Derived values
    const activeBoard = boards.find( (board) => board.id === activeBoardId)
    const boardsNum = boards.length

    // Creates a button for each board
    const boardButtons = boards.map( (board) => {
        return (
            <li 
                className="flex items-center w-full rounded-r-full" 
                key={board.id}
            >
                <button 
                    onClick={ () => setActiveBoardId(board.id) } 
                    className={`
                        flex items-center gap-x-3 w-full text-heading-m pl-6 py-3.5 rounded-r-full cursor-pointer 
                        ${activeBoard?.id === board.id ? "text-white bg-dark-purple" : "text-medium-grey hover:text-dark-purple hover:bg-dark-purple/10 dark:hover:bg-white"}    
                    `}
                >
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
                    <div className="flex flex-col justify-between shrink-0 w-65.25 2xl:w-75 border-r border-lines-light dark:bg-dark-grey dark:border-lines-dark ">
                        <div className="flex flex-col">
                            {/* Heading */}
                            <h2 className="mt-7.75 mb-4.75 pl-6 text-[0.75rem] text-medium-grey font-bold tracking-[0.15rem] uppercase">All boards ({boardsNum})</h2>
            
                            {/* Board buttons */}
                            <ul className="flex flex-col items-start w-60 2xl:w-69">
                                {boardButtons}
                            </ul>

                            <button 
                                onClick={ () => setAddBoardOpen(true) } 
                                className={`
                                    flex items-center gap-x-3 w-full text-dark-purple text-heading-m
                                    ${boards.length === 0 ? "-mt-3.5" : ""}
                                    pl-6 py-3.5 rounded-r-full cursor-pointer
                                `}
                            >
                                <BoardIcon/>
                                + Create New Board
                            </button>
                        </div>
            
                        {/* Controls */}
                        <div className="flex flex-col gap-y-2 mb-8">
                            <div className="flex justify-center items-center gap-x-5.5 w-58.75 2xl:w-62.75 mx-auto py-3.5 bg-light-grey rounded-lg dark:bg-very-dark-grey">
                                <img 
                                    src={lightThemeIcon}
                                    alt=""
                                />

                                <ThemeSwitch/>

                                <img 
                                    src={darkThemeIcon}
                                    alt=""
                                />
                            </div>
            
                            <button 
                                onClick={ () => setSidebarOpen(!sidebarOpen) } 
                                className="flex items-center gap-x-3.75 w-60 2xl:w-69 pl-6 py-3.5 text-medium-grey text-heading-m cursor-pointer hover:text-dark-purple hover:bg-dark-purple/10 rounded-r-full dark:hover:bg-white"
                            >
                                <HideSidebarIcon className="mt-1"/>
                                Hide Sidebar
                            </button>
                        </div>
                    </div>
                )
                : (
                    // Show sidebar button
                    <button 
                        onClick={ () => setSidebarOpen(true) } 
                        className="absolute left-0 bottom-8 flex justify-center items-center w-14 h-12 text-white bg-dark-purple rounded-r-full cursor-pointer hover:bg-light-purple"
                    >
                        <ShowSidebarIcon />
                    </button>
                )
            }
        </>
    )
}