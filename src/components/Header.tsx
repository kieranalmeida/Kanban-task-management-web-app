// Hooks
import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"

// Components
import ThemeSwitch from "./ThemeSwitch"
import BoardModal from "./BoardModal"
import TaskModal from "./TaskModal"
import DeleteBoard from "./DeleteBoard"
import { FocusTrap } from "focus-trap-react"

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
    const [menuOpen, setMenuOpen] = useState(false) // Controls the header mobile menu
    const [settingsOpen, setSettingsOpen] = useState(false) // Controls the task settings menu
    const [addTaskOpen, setAddTaskOpen] = useState(false) // Controls TaskModal in add mode
    const [deleteBoardOpen, setDeleteBoardOpen] = useState(false) // Controls DeleteBoard

    // Refs
    const settingsRef = useRef<HTMLDivElement | null>(null)
    
    // Context
    const { darkMode } = useTheme()
    const { sidebarOpen } = useSidebar()
    const { boards } = useBoards()
    const { activeBoardId, setActiveBoardId } = useActiveBoardId()
    const { setAddBoardOpen, editBoardOpen, setEditBoardOpen } = useBoardModalContext() // Controls the rendering of BoardModal in add and edit mode

    // Derived values
    const activeBoard = boards.find( (board) => board.id === activeBoardId)
    const boardHeading = (boards.length === 0 ? "" : activeBoard?.name)
    const boardsNum = boards.length
    const isAddTaskBtnDisabled = boards.length === 0 || (activeBoard?.columns.length === 0)
    const areSettingsBtnsDisabled = boards.length === 0

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

    // Handle outside clicks and escape
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

        // Close the mobile menu or settings menu if either of them are open when the escape key is pressed
        function handleEscape(event: KeyboardEvent) {
            if (event.key !== "Escape") return

            if (menuOpen) {
                setMenuOpen(false)
            }
            
            if (settingsOpen) {
                setSettingsOpen(false)
            }
        }
        
        document.addEventListener("mousedown", handleOutsideClick)
        document.addEventListener("keydown", handleEscape)

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick)
            document.removeEventListener("keydown", handleEscape)
        }
    }, [menuOpen, settingsOpen])

    // Handle opening BoardModal in add mode
    function handleOpenAddBoard() {
        setMenuOpen(false)
        setAddBoardOpen(true)
    }

    // Handle opening BoardModal in edit mode
    function handleOpenEditBoard() {
        setSettingsOpen(false)
        setEditBoardOpen(true)
    }

    // Handle opening DeleteBoard
    function handleOpenDeleteBoard() {
        setSettingsOpen(false)
        setDeleteBoardOpen(true)
    }

    // Creates a button for each board
    const boardButtons = boards.map( (board) => {
        return (
            <li 
                onClick={ () => setMenuOpen(false) }
                title={board.name}
                className="flex items-center w-full rounded-r-full" 
                key={board.id}
            >
                <button
                    onClick={ () => setActiveBoardId(board.id) }
                    className={`
                        flex items-center gap-x-3 w-full text-heading-m pl-6 py-3.5 rounded-r-full cursor-pointer 
                        ${activeBoard?.id === board.id ? "text-white bg-dark-purple" : "text-medium-grey hover:text-dark-purple hover:bg-dark-purple/10 dark:hover:bg-white"}    
                    `}
                    aria-label={`Set active board to ${board.name}`}
                    type="button" 
                >
                    <BoardIcon/>

                    <span className="flex-1 min-w-0 truncate text-left">
                        {board.name}
                    </span>
                </button>
            </li>
        )
    }) 
    
    return (
        <>
            <header className="flex items-center justify-center gap-x-4 md:gap-x-0 h-16 md:h-20 2xl:h-24 pl-6 pr-3 md:px-0 dark:bg-dark-grey">
                {/* Logo */}
                <div 
                    className={`
                        shrink-0 h-full
                        ${sidebarOpen ? "" : "md:border-b"} 
                        border-lines-light dark:border-lines-dark
                    `}
                >
                    {/* Mobile logo */}
                    <div className="flex items-center shrink-0 w-full h-full md:hidden">
                        <Link to="/">
                            <img
                                src={logoMobile}
                                alt="Kanban logo"
                            />
                        </Link>
                    </div>

                    {/* Tablet and Desktop logo */}
                    <div className={`
                        items-center shrink-0 h-full flex-1 w-full 
                        ${sidebarOpen ? "md:w-65 2xl:w-75" : "w-52"}
                        pl-6 border-r border-lines-light hidden md:flex dark:border-lines-dark`}
                    >
                        <Link to="/">
                            <img
                                src={!darkMode ? logoDark : logoLight}
                                alt="Kanban logo"
                            />
                        </Link>
                    </div>
                </div>

                {/* Main header */}
                <div className="flex items-center justify-between gap-x-18 w-full h-full md:pl-6 md:pr-3 2xl:pr-4 md:border-b border-lines-light dark:border-lines-dark">
                    {/* Board heading */}
                    <div className="flex-1 w-40 2xl:w-47.5">
                        {/* Mobile board heading */}
                        <button
                            onClick={ () => setMenuOpen(!menuOpen) } 
                            className="flex items-center gap-x-2 w-full cursor-pointer md:hidden"
                            type="button" 
                            title={boardHeading}
                            aria-expanded={menuOpen}
                            aria-haspopup={true}
                        >
                            <span className="text-black text-heading-l truncate dark:text-white">{boardHeading}</span>

                            <img 
                                className="mt-1" 
                                src={chevronDown}
                                alt=""
                            />
                        </button>

                        {/* Tablet and desktop board heading */}
                        <h1 
                            title={boardHeading}
                            className="text-black text-[1.25rem] font-bold 2xl:text-heading-xl truncate hidden md:block dark:text-white" 
                        >
                            {boardHeading}
                        </h1>
                    </div>

                    {/* Add task and board settings */}
                    <div className="flex items-center gap-x-3 shrink-0">
                        {/* Mobile add task button */}
                        <button 
                            onClick={isAddTaskBtnDisabled ? undefined : () => setAddTaskOpen(true) }
                            disabled={isAddTaskBtnDisabled} 
                            className={`
                                py-2.5 px-4.5 rounded-2xl md:hidden
                                ${isAddTaskBtnDisabled ? "bg-dark-purple/25 cursor-not-allowed" : "bg-dark-purple cursor-pointer hover:bg-light-purple"}    
                            `}
                            type="button" 
                            aria-label="Add new task"
                            aria-haspopup={true}
                        >
                            <img 
                                src={addTaskMobile}
                                alt="Add new task"
                            />
                        </button>

                        {/* Tablet and Desktop add task button */}
                        <button 
                            onClick={isAddTaskBtnDisabled ? undefined : () => setAddTaskOpen(true) }
                            disabled={isAddTaskBtnDisabled}
                            className={`
                                py-3.75 px-6 text-white text-heading-m rounded-3xl hidden md:block
                                ${isAddTaskBtnDisabled ? "bg-dark-purple/25 cursor-not-allowed" : "bg-dark-purple cursor-pointer hover:bg-light-purple"}    
                            `}
                            type="button" 
                            aria-haspopup={true}
                        >
                            + Add New Task
                        </button>

                        {/* Board settings button and menu */}
                        <div 
                            ref={settingsRef} 
                            className="relative shrink-0"
                        >
                            <button 
                                onClick={ () => setSettingsOpen(!settingsOpen) } 
                                className="px-3 py-1.5 md:px-4 md:py-2 cursor-pointer hover:bg-lines-light hover:rounded-full dark:hover:bg-lines-dark"
                                type="button" 
                                aria-label="View board settings"
                                aria-expanded={settingsOpen}
                                aria-haspopup={true}
                            >
                                <img 
                                    className="w-[3.7px] md:w-[4.6px]" 
                                    src={verticalEllipsis} 
                                    alt="View board settings"
                                />
                            </button>

                            {settingsOpen &&
                                <FocusTrap>
                                    <div className="absolute top-13 right-0 flex flex-col gap-y-4 w-27.5 md:w-48 py-4 bg-white rounded-lg shadow-lg dark:bg-very-dark-grey">
                                        <button
                                            onClick={ () => handleOpenEditBoard() }
                                            disabled={areSettingsBtnsDisabled}      
                                            className={`
                                                w-full px-4 text-body-l text-left hover:bg-light-grey hover:dark:text-white hover:dark:bg-dark-grey
                                                ${areSettingsBtnsDisabled ? "text-medium-grey/30 cursor-not-allowed" : "text-medium-grey cursor-pointer"}    
                                            `}
                                            type="button"                            
                                        >
                                            Edit board
                                        </button>

                                        <button 
                                            onClick={ () => handleOpenDeleteBoard() }
                                            disabled={areSettingsBtnsDisabled}
                                            className={`
                                                w-full px-4 text-body-l text-left hover:bg-light-grey hover:dark:bg-dark-grey
                                                ${areSettingsBtnsDisabled ? "text-dark-red/30 cursor-not-allowed" : "text-dark-red cursor-pointer"}    
                                            `}
                                            type="button" 
                                        >
                                            Delete board
                                        </button>
                                    </div>
                                </FocusTrap> 
                            }
                        </div>
                    </div>
                </div>

                {/* Mobile version of sidebar menu */}
                {menuOpen &&
                    <div 
                        onMouseDown={ (e) => { if (e.target === e.currentTarget) setMenuOpen(false) } }
                        className="absolute inset-0 flex justify-center bg-black/50"
                    >
                        <FocusTrap>
                            <div className="absolute top-20 flex flex-col gap-y-4 w-66 py-4 bg-white border-r border-lines-light rounded-lg shadow-xl dark:bg-dark-grey dark:border-lines-dark">
                                <div className="flex flex-col">
                                    {/* Heading */}
                                    <h2 className="mb-4.75 pl-6 text-[0.75rem] text-medium-grey font-bold tracking-[0.15rem] uppercase">All boards ({boardsNum})</h2>
                    
                                    {/* Board buttons */}
                                    <ul className="flex flex-col items-start w-60">
                                        {boardButtons}
                                    </ul>
                                
                                    <button 
                                        onClick={ () => handleOpenAddBoard() }
                                        className="flex items-center gap-x-3 w-full text-dark-purple text-heading-m pl-6 py-3.5 rounded-r-full cursor-pointer"
                                    >
                                        <BoardIcon/>
                                        + Create New Board
                                    </button>
                                </div>
                    
                                {/* Theme control */}
                                <div className="flex justify-center items-center gap-x-5.5 w-58.75 mx-auto py-3.5 bg-light-grey rounded-lg dark:bg-very-dark-grey">
                                    <img src={lightThemeIcon} alt=""/>

                                    <ThemeSwitch/>

                                    <img src={darkThemeIcon} alt=""/>
                                </div>
                            </div>
                        </FocusTrap>
                    </div>
                }  
            </header>

            {/* Render BoardModal in edit mode */}
            {
                editBoardOpen &&
                <BoardModal editBoardOpen={editBoardOpen} setEditBoardOpen={setEditBoardOpen}/>
            }

            {/* Render DeleteBoard for the current board*/}
            {
                deleteBoardOpen &&
                <DeleteBoard onClose={ () => setDeleteBoardOpen(false) }/>
            }

            {/* Render TaskModal in add mode */}
            {
                addTaskOpen && 
                <TaskModal addTaskOpen={addTaskOpen} setAddTaskOpen={setAddTaskOpen}/>
            }
        </>
    )
}