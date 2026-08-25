// Hooks
import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"

// Components
import ThemeSwitch from "./ThemeSwitch"
import TaskModal from "./TaskModal"
import BoardModal from "./BoardModal"

// Context
import { useTheme } from "./ThemeContext"
import { useSidebar } from "./SidebarContext"
import { useBoards } from "./BoardsContext"
import { useActiveBoardId } from "./ActiveBoardContextId"
import { useBoardModalContext } from "./BoardModalContext"

// Images
import logoMobile from "../images/logo-mobile.svg"
import logoLight from "../images/logo-light.svg"
import logoDark from "../images/logo-dark.svg"
import chevronDown from "../images/icon-chevron-down.svg"
import addTaskMobile from "../images/icon-add-task-mobile.svg"
import verticalEllipsis from "../images/icon-vertical-ellipsis.svg"
import BoardIcon from "../images/icon-board.svg?react"
import lightThemeIcon from "../images/icon-light-theme.svg"
import darkThemeIcon from "../images/icon-dark-theme.svg"

export default function Header() {
    // State variables
    const [menuOpen, setMenuOpen] = useState(false) // Controls header mobile menu
    const [settingsOpen, setSettingsOpen] = useState(false) // Controls task settings box
    const [addTaskOpen, setAddTaskOpen] = useState(false) // Controls add task menu

    // Refs
    const settingsRef = useRef<HTMLDivElement | null>(null)
    
    // Context
    const { darkMode } = useTheme()
    const { sidebarOpen } = useSidebar()
    const { boards } = useBoards()
    const { activeBoardId, setActiveBoardId } = useActiveBoardId() // Controls active board ID
    const { addBoardOpen, setAddBoardOpen, editBoardOpen, setEditBoardOpen } = useBoardModalContext() // Controls board modal

    // Derived values
    const activeBoard = boards.find( (board) => board.id === activeBoardId) // Get active board
    const boardsNum = boards.length // Get amount of boards

    // Close menu automatically (if open) when screen size increases
    useEffect( () => {
        const media = window.matchMedia("(min-width: 768px)")

        const closeMenu = (e: MediaQueryListEvent) => {
            if (menuOpen && e.matches) {
                setMenuOpen(false)
            }
        }

        media.addEventListener("change", closeMenu)

        return () => {
            media.removeEventListener("change", closeMenu)
        }
    }, [menuOpen])

    // Handle outside clicks
    useEffect( () => {
        function handleOutsideClick(event: MouseEvent) {
            // Board settings
            if (
                settingsRef.current 
                && !settingsRef.current.contains(event.target as Node)
            ) {
                setSettingsOpen(false)
            }
        }
        
        document.addEventListener("mousedown", handleOutsideClick)

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick)
        }
    }, [])

    // Handle opening BoardModal in add mode
    function handleAddBoard() {
        setMenuOpen(false)
        setAddBoardOpen(true)
    }

    function handleEditBoard() {
        setSettingsOpen(false)
        setEditBoardOpen(true)
    }
    
    // Board button normal + active styling
    const boardButtonClass = (name: string) => `
        flex items-center gap-x-3 w-full text-heading-m pl-6 py-3.5 rounded-r-full cursor-pointer 
        ${activeBoard?.name === name ? "text-white bg-dark-purple" : "text-medium-grey hover:text-dark-purple hover:bg-dark-purple/10 dark:hover:bg-white"}  
    `

    // Creates a button for each board
    const boardButtons = boards.map( (board) => {
        return (
            <li onClick={ () => setMenuOpen(false) } className="flex items-center w-full rounded-r-full" key={board.name}>
                <button onClick={ () => setActiveBoardId(board.id) } className={boardButtonClass(board.name)}>
                    <BoardIcon/>
                    {board.name}
                </button>
            </li>
        )
    }) 
    
    return (
        <header className="flex items-center justify-center gap-x-4 md:gap-x-0 h-16 md:h-20 2xl:h-24 px-4 md:px-0 dark:bg-dark-grey">
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

            {/* Main header */}
            <div className="flex items-center justify-between gap-x-18 w-full h-full md:pl-6 md:pr-3 2xl:pr-4 md:border-b border-lines-light dark:border-lines-dark">
                <div>
                    <button onClick={ () => setMenuOpen(!menuOpen) } className="flex items-center gap-x-2 cursor-pointer md:hidden">
                        <span className="text-black text-heading-l dark:text-white">Platform Launch</span>
                        <img className="mt-1" src={chevronDown} alt=""/>
                    </button>

                    <h1 className="text-black text-[1.25rem] font-bold 2xl:text-heading-xl hidden md:block dark:text-white">Platform Launch</h1>
                </div>

                <div className="flex items-center gap-x-3">
                    {/* Mobile add task button */}
                    <button onClick={ () => setAddTaskOpen(true) } className="py-2.5 px-4.5 bg-dark-purple rounded-2xl cursor-pointer hover:bg-light-purple md:hidden">
                        <img src={addTaskMobile} alt="Add new task"/>
                    </button>

                    {/* Tablet and Desktop add task button */}
                    <button onClick={ () => setAddTaskOpen(true) } className="py-3.75 px-6 text-white text-heading-m bg-dark-purple rounded-3xl cursor-pointer hover:bg-light-purple hidden md:block">
                        + Add New Task
                    </button>

                    <div ref={settingsRef} className="relative">
                        <button onClick={ () => setSettingsOpen(!settingsOpen) } className="px-3 py-1.5 md:px-4 md:py-2 cursor-pointer hover:bg-lines-light hover:rounded-full dark:hover:bg-lines-dark">
                            <img className="w-[3.7px] md:w-[4.6px]" src={verticalEllipsis} alt="View board settings"/>
                        </button>

                        {settingsOpen && 
                            <div className="absolute top-13 right-0 flex flex-col gap-y-4 w-27.5 md:w-48 py-4 bg-white rounded-lg shadow-lg dark:bg-very-dark-grey">
                                <button
                                    onClick={ () => handleEditBoard() }                                 
                                    className="w-full px-4 text-medium-grey text-body-l text-left cursor-pointer hover:bg-light-grey hover:dark:text-white hover:dark:bg-dark-grey"
                                >
                                    Edit board
                                </button>

                                <button 
                                    className="w-full px-4 text-dark-red text-body-l text-left cursor-pointer hover:bg-light-grey hover:dark:bg-dark-grey"
                                >
                                    Delete task
                                </button>
                            </div>
                        }
                    </div>
                </div>
            </div>

            {/* Mobile version of sidebar menu */}
            {menuOpen &&
                <div 
                    onClick={ (e) => { if (e.target === e.currentTarget) setMenuOpen(false) } }
                    className="absolute inset-0 flex justify-center bg-black/50"
                >
                    <div className="absolute top-20 flex flex-col gap-y-4 w-66 py-4 bg-white border-r border-lines-light rounded-lg shadow-xl dark:bg-dark-grey dark:border-lines-dark">
                        <div className="flex flex-col">
                            {/* Heading */}
                            <h2 className="mb-4.75 pl-6 text-[0.75rem] text-medium-grey font-bold tracking-[0.15rem] uppercase">All boards ({boardsNum})</h2>
            
                            {/* Board buttons */}
                            <ul className="flex flex-col items-start w-60">
                                {boardButtons}
                            </ul>
                        
                            <button onClick={ () => handleAddBoard() } className="flex items-center gap-x-3 w-full text-dark-purple text-heading-m pl-6 py-3.5 rounded-r-full cursor-pointer">
                                <BoardIcon/>
                                + Create New Board
                            </button>
                        </div>
            
                        {/* Theme control */}
                        <div className="flex justify-center items-center gap-x-5.5 w-58.75 mx-auto py-3.5 bg-light-grey rounded-lg dark:bg-very-dark-grey">
                            <img src={lightThemeIcon}/>
                            <ThemeSwitch/>
                            <img src={darkThemeIcon}/>
                        </div>
                    </div>
                </div>
            }
            
            {/* Render BoardModal in add mode */}
            {
                addBoardOpen &&
                <BoardModal addBoardOpen={addBoardOpen} setAddBoardOpen={setAddBoardOpen}/>
            }

            {/* Render BoardModal in edit mode */}
            {
                editBoardOpen &&
                <BoardModal editBoardOpen={editBoardOpen} setEditBoardOpen={setEditBoardOpen}/>
            }

            {/* Render TaskModal in add mode */}
            {
                addTaskOpen && 
                <TaskModal addTaskOpen={addTaskOpen} setAddTaskOpen={setAddTaskOpen}/>
            }
            
        </header>
    )
}