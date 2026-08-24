// Hooks
import { useState, useRef, useEffect} from "react"

// Context
import { useBoards } from "./BoardsContext"
import { useActiveBoardId } from "./ActiveBoardContextId"

// Images
import chevronDown from "../images/icon-chevron-down.svg"
import IconCross from "../images/icon-cross.svg?react"

// Types
import type { SubTask, TaskFormValues } from "../types/types"

type TaskFormProps = {
    initialValues: TaskFormValues
    formHeading: string,
    formButtonText: string,
    onSubmit: ( {title, description, subtasks, targetColumnId}: TaskFormValues) => void,
    onClose: () => void
}

type FormErrors = {
    title?: string,
    description?: string
    [key: `subtask-${string}`]: string | undefined
}

export default function TaskForm({initialValues, formHeading, formButtonText, onSubmit, onClose}: TaskFormProps) {
    // Refs
    const taskFormRef = useRef<HTMLDivElement | null>(null)
    const selectBoxRef = useRef<HTMLDivElement | null>(null)
    
    // Context
    const { boards } = useBoards() // Controls boards
    const { activeBoardId } = useActiveBoardId() // Controls active board ID
    
    // State variables
    const [title, setTitle] = useState(initialValues.title)
    const [description, setDescription] = useState(initialValues.description)
    const [subtasks, setSubtasks] = useState<SubTask[]>(initialValues.subtasks)
    const [targetColumnId, setTargetColumnId] = useState(initialValues.targetColumnId) // Controls the id of the target column (the one chosen in the form select box)
    const [selectOpen, setSelectOpen] = useState(false) // Controls select box
    const [formErrors, setFormErrors] = useState<FormErrors>({}) // Controls form errors to render custom error messages
    
    // Derived values
    const activeBoard = boards.find( (board) => board.id === activeBoardId) // Get active board
    const targetColumn = activeBoard?.columns.find( (column) => column.id === targetColumnId) // Get target column

    // Handle outside clicks
    useEffect( () => {
        function handleClickOutside(event: MouseEvent) {
            // taskForm menu
            if (
                taskFormRef.current 
                && !taskFormRef.current.contains(event.target as Node)
            ) {
               onClose()
            }

            // Select box
            if (
                selectBoxRef.current 
                && !selectBoxRef.current.contains(event.target as Node)
            ) {
                setSelectOpen(false)
            }
        }
        
        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])
    
    
    // Handle title input change
    function handleTitleChange(value: string) {
        setTitle(value)
        
        // If there's an error key for title, but title has since been updated, remove the error key
        if (formErrors.title && title) {
            setFormErrors( (prevFormErrors) => {
                const {title, ...rest} = prevFormErrors
                
                return {
                    ...rest
                }
            })
        }
    }
    
    // Handle description input change
    function handleDescriptionChange(value: string) {
        setDescription(value)
        
        // If there's an error key for description, but description has since been updated, remove the error key
        if (formErrors.description && description) {
            setFormErrors( (prevFormErrors) => {
                const {description, ...rest} = prevFormErrors
                
                return {
                    ...rest
                }
            })
        }
    }
    
    // Handle subtask input change
    function handleSubtaskChange(subtaskId: string, value: string) {
        setSubtasks( (prevSubtasks) => 
            prevSubtasks.map( (subtask) => {
                if (subtask.id !== subtaskId) {
                    return subtask
                }
                
                return {
                    ...subtask, title: value
                }
            })
        )
        
        // Without this, TypeScript will complain
        const currentSubtask = `subtask-${subtaskId}` as const
        
        // If there's an error key for a subtask, but that subtask has since been updated, remove the error key
        if (formErrors[currentSubtask] && value) {
            setFormErrors( (prevFormErrors) => {
                const {[currentSubtask]: _, ...rest} = prevFormErrors
                
                return {
                    ...rest
                }
            })
        }
    }
    
    // Handle adding subtasks
    function handleAddSubtask() {
        const newSubtask = {
            id: crypto.randomUUID(),
            title: ""
        }
        
        setSubtasks( (prevSubtasks) => [...prevSubtasks, newSubtask])
    }
    
    // Handle subtask deletion
    function handleSubtaskDelete(subtaskId: string) {
        // Update the subtasks array to include every subtask except the one being deleted
        setSubtasks( (prevSubtasks) => {
            return prevSubtasks.filter( (subtask) => subtask.id !== subtaskId)
        })
    }
    
    // Handle the select box options
    function handleSelectBox(columnId: string) {
        // Update targetColumnId
        setTargetColumnId(columnId)
        
        // Close the select box
        setSelectOpen(false)
    }

    // Handle form submission
    function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        // Prevent page refresh and form reset
        e.preventDefault()
        
        // Empty error object to keep track of errors on each input
        let newErrors: FormErrors = {}

        // Check for errors on each input
        if (!title) { newErrors.title = "Can't be empty" }
        if (!description) { newErrors.description = "Can't be empty" }
        subtasks.forEach( (subtask) => {
            if (!subtask.title) {
                newErrors[`subtask-${subtask.id}`] = "Can't be empty"
            }
        })

        // Set the formErrors state to the newErrors object. Any key that exists will trigger a custom error message
        setFormErrors(newErrors)
        
        // To satisfy TypeScript, return early if title, description, targetColumn or a subtask title do not exist
        if (!title || !description || !targetColumn || subtasks.some( (subtask) => !subtask.title)) {
            return
        }

        // Perform handleAddTask if in add mode or handleEditTask if in edit mode
        onSubmit( {title, description, targetColumnId, subtasks} )
    }
    
    return (
        <div className="absolute z-10 inset-0 flex justify-center items-center p-4 bg-black/50">
            <div ref={taskFormRef} className="flex flex-col gap-y-6 w-full sm:w-85.75 md:w-120 p-6 md:p-8 bg-white rounded-lg dark:bg-very-dark-grey">
                <h2 className="text-black text-heading-l dark:text-white">{formHeading}</h2>

                <form 
                    onSubmit={handleSubmit}
                    noValidate
                    className="flex flex-col gap-y-6" 
                    >
                    {/* Title */}
                    <div className="flex flex-col gap-y-2">
                        <label 
                            htmlFor="title"
                            className="text-medium-grey text-[0.75rem] font-bold dark:text-white"
                        >
                            Title
                        </label>

                        <div className="relative">
                            <input 
                                type="text"
                                value={title}
                                onChange={ (e) => handleTitleChange(e.target.value) }
                                id="title"
                                placeholder="e.g. Take coffee break"
                                className={`
                                    w-full px-4 py-2 text-body-l placeholder-black/25 border outline-0 rounded-sm focus:border-dark-purple dark:text-white dark:placeholder-white/25 
                                        ${
                                            (formErrors.title && !title) ? "border-dark-red focus:border-dark-purple" 
                                            : "border-medium-grey/25  hover:border-dark-purple dark:outline-0"
                                        }
                                    `}
                            />

                            {
                                (formErrors.title && !title) &&
                                <span className="absolute top-2.5 right-2 text-dark-red text-body-l">Can't be empty</span>
                            }
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label
                            htmlFor="description"
                            className="text-medium-grey text-[0.75rem] font-bold dark:text-white"
                        >
                            Description
                        </label>
 
                        <div className="relative">
                            <textarea 
                                value={description}
                                onChange={ (e) => handleDescriptionChange(e.target.value) }
                                id="description"
                                placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."
                                className={`
                                    resize-none w-full h-28 px-4 py-2 text-body-l placeholder-black/25 border outline-0 rounded-sm focus:border-dark-purple dark:text-white dark:placeholder-white/25
                                        ${
                                            (formErrors.description && !description) ? "border-dark-red focus:border-dark-purple" 
                                            : "border-medium-grey/25  hover:border-dark-purple dark:outline-0"
                                        }
                                    `}
                            />

                            {
                                (formErrors.description && !description) &&
                                <span className="absolute bottom-2.5 right-2 text-dark-red text-body-l">Can't be empty</span>
                            }
                        </div>
                    </div>

                    {/* Subtasks */}
                    <div className="flex flex-col">
                        <h3 className="text-medium-grey text-[0.75rem] font-bold dark:text-white">Subtasks</h3>

                        <ul className={`flex flex-col gap-y-3 mt-2 ${subtasks.length > 0 ? "mb-3" : "mb-0"}`}>
                            {
                                subtasks.map( (subtask) => {
                                    return (
                                        <li className="flex gap-x-4" key={subtask.id}>
                                            <div className="relative w-full">
                                                <input
                                                    type="text"
                                                    value={subtask.title}
                                                    onChange={ (e) => handleSubtaskChange(subtask.id, e.target.value) }
                                                    placeholder={subtask.placeholder}
                                                    className={`
                                                        w-full px-4 py-2 text-body-l placeholder-black/25 border outline-0 rounded-sm focus:border-dark-purple dark:text-white dark:placeholder-white/25
                                                            ${
                                                                (formErrors[`subtask-${subtask.id}`] && !subtask.title) ? "border-dark-red focus:border-dark-purple" 
                                                                : "border-medium-grey/25  hover:border-dark-purple dark:outline-0"
                                                            }
                                                        `} 
                                                />

                                                {
                                                    (formErrors[`subtask-${subtask.id}`] && !subtask.title) && 
                                                    <span className="absolute top-2.5 right-2 text-dark-red text-body-l">Can't be empty</span>
                                                }
                                            </div>

                                            <button
                                                type="button"
                                                onClick={ () => handleSubtaskDelete(subtask.id) }
                                                className="text-medium-grey cursor-pointer hover:text-dark-red"
                                            >
                                                <IconCross/>
                                            </button>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                        
                        <button
                            type="button"
                            onClick={ () => handleAddSubtask() }
                            className="w-full py-2 text-dark-purple text-[0.8125rem] font-bold leading-5.75 bg-dark-purple/10 rounded-full cursor-pointer hover:bg-dark-purple/25 dark:bg-white dark:hover:bg-white"
                        >
                            + Add new subtask
                        </button>
                    </div>

                    {/* Select box */}
                    <div className="flex flex-col gap-y-2">
                        <h2 className="text-medium-grey text-body-m dark:text-white">Current Status</h2>

                        <div ref={selectBoxRef} className="relative">
                            <button

                                type="button"
                                onClick={ () => setSelectOpen(!selectOpen) }
                                className={`relative flex justify-between items-center w-full px-4 py-2 border ${selectOpen ? "border-dark-purple" : "border-medium-grey/25"} rounded-lg cursor-pointer hover:border-dark-purple`}
                            >
                                <span className="text-black text-body-l dark:text-white">{targetColumn?.name}</span>
                                <img className="mt-1" src={chevronDown} alt=""/>
                            </button>

                            {selectOpen &&
                                <ul className="absolute mt-2.5 flex flex-col gap-y-2 w-full py-4 bg-white rounded-lg shadow-lg dark:bg-very-dark-grey">
                                    {
                                        activeBoard?.columns?.map( (column) => {
                                            return (
                                                <li className="group hover:bg-light-grey hover:dark:bg-dark-grey" key={column.id}>
                                                    <button 
                                                        type="button"
                                                        onClick={ () => handleSelectBox(column.id) }
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

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full py-2 text-white text-[0.8125rem] font-bold leading-5.75 bg-dark-purple rounded-full cursor-pointer hover:bg-light-purple"
                    >
                        {formButtonText}
                    </button>
                </form>
            </div>
        </div>
    )
}