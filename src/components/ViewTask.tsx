// Hooks
import { useState, useRef, useEffect } from "react"

// Context
import { useBoards } from "./BoardsContext"
import { useActiveBoardId } from "./ActiveBoardContextId"

// Images
import verticalEllipsis from "../images/icon-vertical-ellipsis.svg"
import chevronDown from "../images/icon-chevron-down.svg"

type ViewTaskProps = {
    activeTaskId: string,
    setActiveTaskId: React.Dispatch<React.SetStateAction<string | null>>,
    setEditTaskId: React.Dispatch<React.SetStateAction<string | null>>,
    setDeleteTaskId: React.Dispatch<React.SetStateAction<string | null>>
}

export default function ViewTask({activeTaskId, setActiveTaskId, setEditTaskId, setDeleteTaskId}: ViewTaskProps) {
    // State variables
    const [settingsOpen, setSettingsOpen] = useState(false) // Controls task settings box
    const [selectOpen, setSelectOpen] = useState(false) // Controls select box

    // Refs
    const settingsRef = useRef<HTMLDivElement | null>(null)
    const selectBoxRef = useRef<HTMLDivElement | null>(null) 

    // Context
    const { boards, setBoards } = useBoards()
    const { activeBoardId } = useActiveBoardId()

    // Derived values
    const activeBoard = boards.find( (board) => board.id === activeBoardId)
    const activeTask = activeBoard?.columns.flatMap( (column) => column.tasks).find( (task) => task.id === activeTaskId)
    const activeColumn = activeBoard?.columns?.find( (column) => column.tasks.some( (task) => task.id === activeTaskId) )
    
    // If activeTask or activeColumn don't exist, return so that TypeScript doesn't complain
    if (!activeTask || !activeColumn) return

    const completedTasks = activeTask?.subtasks.filter( (subtask) => subtask.isCompleted === true)
    
    // Handle outside clicks
    useEffect( () => {
        function handleOutsideClick(event: MouseEvent) {
            // Task settings
            if (
                settingsRef.current 
                && !settingsRef.current.contains(event.target as Node)
            ) {
                setSettingsOpen(false)
            }

            // Select box
            if (
                selectBoxRef.current 
                && !selectBoxRef.current.contains(event.target as Node)
            ) {
                setSelectOpen(false)
            }
        }
        
        document.addEventListener("mousedown", handleOutsideClick)

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick)
        }
    }, [])

    // Handle checkbox changes for activeTask's subtasks
    function handleCheckboxChange(targetSubtaskId: string) {
        // Check if activeColumn and so TypeScript doesn't complain
        if (!activeColumn || !activeTask) return

        // Iterate through prevBoards until targetSubtask is reached and then flip its isCompleted property. Return non-active boards, columns, tasks and subtasks untouched.
        setBoards( (prevBoards) =>
            prevBoards.map( (board) => {
                if (board.id !== activeBoardId) {
                    return board
                }

                return {
                    ...board,
                    columns: board.columns.map( (column) => {
                        if (column.id !== activeColumn.id) {
                            return column
                        }

                        return {
                            ...column,
                            tasks: column.tasks.map( (task) => {
                                if (task.id !== activeTask.id) {
                                    return task
                                }
                                
                                return {
                                    ...task,
                                    subtasks: task.subtasks.map( (subtask) => {
                                        if (subtask.id !== targetSubtaskId) {
                                            return subtask
                                        }
                                        
                                        return {
                                            ...subtask,
                                            isCompleted: !subtask.isCompleted
                                        }
                                    })
                                }
                            })
                        }

                    })
                }
            })
        )
    }

    // Handle status (column) changes on activetask
    function handleStatusChange(targetColumnId: string) {
        // Check if activeColumn or activeTask don't exist so TypeScript doesn't complain
        if (!activeColumn || !activeTask) return

        // If trying to move the activeTask to the column it's already in, return early
        if (targetColumnId === activeColumn.id) {
            setSelectOpen(false)
            return
        }

        // Update the location of activeTask in the current board
        setBoards( (prevBoards) =>
            prevBoards.map( (board) => {
                if (board.id !== activeBoardId) { 
                    return board
                }

                return {
                    ...board,
                    columns: board.columns.map( (column) => {
                        // If the current column's .id matches the .id of the activeColumn, remove the task with the id of the activeTask from the current column's tasks array
                        // In other words, if the current column is the activeColumn, remove the activeTask from its tasks array
                        if (column.id === activeColumn.id) {
                            return {
                                ...column,
                                tasks: column.tasks.filter( (task) => task.id !== activeTaskId)
                            }
                        }

                        // If the current column's .id matches the .id of the targetColumn, return all of its tasks plus the activeTask
                        // In other words, if the current column is the targetColumn, add the activeTask to its tasks array
                        if (column.id === targetColumnId) {
                            return {
                                ...column,
                                tasks: [...column.tasks, activeTask]
                            }
                        }
                        
                        // If the current column is neither the activeColumn nor targetColumn, just return it as normal
                        return column
                    })
                }
            })
        )
        
        // Close select box
        setSelectOpen(false)
    }

    // Handle opening TaskForm in edit mode
    function handleOpenEditTask() {
        setActiveTaskId(null)
        setEditTaskId(activeTaskId)
    }

    function handleOpenDeleteTask() {
        setActiveTaskId(null)
        setDeleteTaskId(activeTaskId)
    }

    return (
            <div 
                onClick={ (e) => { if (e.target === e.currentTarget) setActiveTaskId(null) } }
                className="absolute inset-0 flex justify-center items-center p-4 bg-black/50"
            >
                <div className="z-10 flex flex-col gap-y-6 w-full sm:w-85.75 md:w-120 p-6 md:p-8 bg-white rounded-lg dark:bg-dark-grey">
                    {/* Heading and settings button */}
                    <div className="flex justify-between items-center gap-x-6">
                        <h2 className="text-black text-heading-l dark:text-white">{activeTask.title}</h2>

                        {/* Settings button and menu */}
                        <div 
                            ref={settingsRef} 
                            className="relative flex justify-center"
                        >
                            <button 
                                onClick={ () => setSettingsOpen(!settingsOpen) } 
                                className="shrink-0 px-3 py-1.5 md:px-4 md:py-2 cursor-pointer hover:bg-lines-light hover:rounded-full dark:hover:bg-lines-dark"
                            >
                                <img 
                                    className="w-[3.7px] md:w-[4.6px]" 
                                    src={verticalEllipsis} 
                                    alt="View task settings"
                                />
                            </button>

                            {settingsOpen && 
                                <div className="absolute top-12 right-0 md:right-auto flex flex-col gap-y-4 w-27.5 md:w-48 py-4 bg-white rounded-lg shadow-lg dark:bg-very-dark-grey">
                                    <button
                                        onClick={ () => handleOpenEditTask() }                                 
                                        className="w-full px-4 text-medium-grey text-body-l text-left cursor-pointer hover:bg-light-grey hover:dark:text-white hover:dark:bg-dark-grey"
                                    >
                                        Edit task
                                    </button>

                                    <button
                                        onClick={ () => handleOpenDeleteTask() }
                                        className="w-full px-4 text-dark-red text-body-l text-left cursor-pointer hover:bg-light-grey hover:dark:bg-dark-grey"
                                    >
                                        Delete task
                                    </button>
                                </div>
                            }
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-medium-grey text-body-l">{activeTask.description}</p>

                    {/* Subtasks */}
                    <div className="flex flex-col gap-y-4">
                        <h2 className="text-medium-grey text-body-m dark:text-white">Subtasks ({completedTasks.length} of {activeTask.subtasks.length})</h2>

                        <ul className="flex flex-col gap-y-2">
                            {
                                activeTask.subtasks.length === 0 ? 
                                <p className="-mt-2 text-medium-grey text-body-l">This task has no subtasks.</p> 
                                :
                                activeTask.subtasks.map( (subtask) => {
                                    return (
                                        <li 
                                            className="bg-light-grey rounded-lg hover:bg-dark-purple/25 dark:bg-very-dark-grey dark:hover:bg-dark-purple/25" 
                                            key={subtask.title}
                                        >
                                            <label 
                                                className="flex items-center gap-x-4 p-4 cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={subtask.isCompleted}
                                                    onChange={ () => handleCheckboxChange(subtask.id) }
                                                    className="accent-dark-purple w-4 h-4 shrink-0 dark:accent-black"
                                                />

                                                <span 
                                                    className={`
                                                        ${subtask.isCompleted ? "text-medium-grey line-through" : "text-black dark:text-white"}
                                                        text-body-m
                                                    `}
                                                >
                                                    {subtask.title}
                                                </span>
                                            </label>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>

                    {/* Status */}
                    <div className="flex flex-col gap-y-2">
                        <h2 className="text-medium-grey text-body-m">Current Status</h2>

                        <div 
                            ref={selectBoxRef} 
                            className="relative"
                        >
                            <button
                                onClick={ () => setSelectOpen(!selectOpen) }
                                className={`
                                    relative flex justify-between items-center w-full px-4 py-2 border 
                                    ${selectOpen ? "border-dark-purple" : "border-medium-grey/25"}
                                    rounded-lg cursor-pointer hover:border-dark-purple
                                `}
                            >
                                <span className="text-black text-body-l dark:text-white">{activeColumn?.name}</span>

                                <img 
                                    className="mt-1" 
                                    src={chevronDown} 
                                    alt=""
                                />
                            </button>

                            {selectOpen &&
                                <ul className="absolute mt-2.5 flex flex-col gap-y-2 w-full py-4 bg-white rounded-lg shadow-lg dark:bg-very-dark-grey">
                                    {
                                        activeBoard?.columns?.map( (column) => {
                                            return (
                                                <li 
                                                    className="group hover:bg-light-grey hover:dark:bg-dark-grey" 
                                                    key={column.id}
                                                >
                                                    <button 
                                                        onClick={ () => handleStatusChange(column.id) }
                                                        className="w-full px-4 text-medium-grey text-body-l text-left rounded-lg cursor-pointer group-hover:text-black group-hover:dark:text-white"
                                                    >
                                                        {column.name}
                                                    </button>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            }
                        </div>
                    </div>
                </div>
            </div>
    )
}