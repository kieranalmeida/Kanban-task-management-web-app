import { useState, useRef, useEffect} from "react"
// Context
import { useBoards } from "./BoardsContext"
import { useActiveBoardId } from "./ActiveBoardContextId"
// Images
import chevronDown from "../images/icon-chevron-down.svg"
import IconCross from "../images/icon-cross.svg?react"

type AddTaskProps = {
    setAddTaskOpen: React.Dispatch<React.SetStateAction<boolean>>
}

type Subtask = {
    id: string,
    title: string,
    placeholder?: string
}

type FormErrors = {
    title?: string,
    description?: string
    [key: `subtask-${string}`]: string | undefined
}

export default function AddTask({setAddTaskOpen}: AddTaskProps) {
    // Refs
    const addTaskRef = useRef<HTMLDivElement | null>(null)
    const selectBoxRef = useRef<HTMLDivElement | null>(null) 
    
    // Context
    const { boards, setBoards } = useBoards() // Controls boards
    const { activeBoardId } = useActiveBoardId() // Controls active board ID
    
    // Derived values
    const activeBoard = boards.find( (board) => board.id === activeBoardId) // Get active board
    
    // State variables
    const [formErrors, setFormErrors] = useState<FormErrors>({})
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [subtasks, setSubtasks] = useState<Subtask[]>(
        [
            {
                id: crypto.randomUUID(),
                title: "",
                placeholder: "e.g. Make coffee"
            },
                        {
                id: crypto.randomUUID(),
                title: "",
                placeholder: "e.g. Drink coffee & smile"
            }
        ]
    )
    const [selectOpen, setSelectOpen] = useState(false) // Controls select box
    const [targetColumnId, setTargetColumnId] = useState( activeBoard?.columns[0].id) // Controls the id of the target column (the one chosen in the form select box)
    
    // Derived values
    const targetColumn = activeBoard?.columns.find( (column) => column.id === targetColumnId)

    // Handle outside clicks
    useEffect( () => {
        function handleClickOutside(event: MouseEvent) {
            // addTask menu
            if (
                addTaskRef.current 
                && !addTaskRef.current.contains(event.target as Node)
            ) {
                setAddTaskOpen(false)
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
    
    // Handle title change
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
    
    // Handle description change
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
    
    // Handle subtask change
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

    console.log(formErrors)

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

        // Create the new task from the form data
        const newTask = {
            id: crypto.randomUUID(),
            title,
            description,
            status: targetColumn.name,
            subtasks: subtasks.map( (subtask) => (
                {
                    id: crypto.randomUUID(),
                    title: subtask.title,
                    isCompleted: false
                }
            ))
        }
        
        // Insert the new task into the selected column in the active board
        setBoards( (prevBoards) => 
            prevBoards.map( (board) => {
                if (board.id !== activeBoard?.id) {
                    return board
                }

                return {
                    ...board,
                    columns: board.columns.map( (column) => {
                        if (column.id !== targetColumn?.id) {
                            return column
                        }

                        return {
                            ...column,
                            tasks: [...column.tasks, newTask]
                        }
                    })
                }
            })
        )

        // Close AddTask
        setAddTaskOpen(false)
    }

    return (
        <div className="absolute z-10 inset-0 flex justify-center items-center p-4 bg-black/50">
            <div ref={addTaskRef} className="flex flex-col gap-y-6 w-full sm:w-85.75 md:w-120 p-6 md:p-8 bg-white rounded-lg dark:bg-very-dark-grey">
                <h2 className="text-black text-heading-l dark:text-white">Add New Task</h2>

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
                        Create Task    
                    </button>
                </form>
            </div>
        </div>
    )
}