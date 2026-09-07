// Hooks
import { useEffect } from "react"

// Components
import { FocusTrap } from "focus-trap-react"

// Context
import { useBoards } from "./BoardsContext"
import { useActiveBoardId } from "./ActiveBoardContextId"

type DeleteTaskProps = {
    deleteTaskId: string | null
    onClose: () => void
}

export default function DeleteTask({deleteTaskId, onClose}: DeleteTaskProps) {
    // Context
    const { boards, setBoards } = useBoards()
    const { activeBoardId } = useActiveBoardId()

    // Derived values
    const activeBoard = boards.find( (board) => board.id === activeBoardId)
    const activeTask = activeBoard?.columns.flatMap( (column) => column.tasks).find( (task) => task.id === deleteTaskId) // Get the task being deleted
    const activeColumn = activeBoard?.columns?.find( (column) => column.tasks.some( (task) => task.id === deleteTaskId) ) // Get the column of the task being deleted

    // Handle escape 
    useEffect( () => {
        // Close the modal if the escape key is pressed
        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                onClose()
            }
        }
        
        document.addEventListener("keydown", handleEscape)

        return () => {
            document.removeEventListener("keydown", handleEscape)
        }
    }, [])

    // Delete the task
    function handleDeleteTask() {
        // Delete task
        setBoards( (prevBoards) => 
            prevBoards.map( (board) => {
                if (board.id !== activeBoardId) {
                    return board
                }

                return {
                    ...board,
                    columns: board.columns.map( (column) => {
                        if (column.id !== activeColumn?.id) {
                            return column
                        }

                        return {
                            ...column,
                            tasks: column.tasks.filter( (task) => task.id !== deleteTaskId)
                        }
                    })
                }
            })
        )

        // Close the modal
        onClose()
    }

    return (
        <div
            onMouseDown={ (e) => { if (e.target === e.currentTarget) onClose() } } 
            className="absolute z-10 inset-0 flex justify-center items-center p-4 bg-black/50"
        >
            <FocusTrap>
                <div className="flex flex-col gap-y-6 w-full sm:w-85.75 md:w-120 p-6 md:p-8 bg-white rounded-lg dark:bg-very-dark-grey">
                    <h2 className="text-dark-red text-heading-l">Delete this task?</h2>

                    <p className="text-medium-grey text-body-l">Are you sure you want to delete the '{activeTask?.title}' task and its subtasks? This action cannot be reversed.</p>
                    
                    <div className="flex gap-x-4 text-[0.8125rem] font-bold leading-5.75">
                        <button 
                            onClick={ () => handleDeleteTask() }
                            className="w-full py-2 text-white bg-dark-red rounded-full cursor-pointer hover:bg-light-red"
                        >
                            Delete
                        </button>

                        <button 
                            onClick={ () => onClose() }
                            className="w-full py-2 text-dark-purple bg-dark-purple/10 rounded-full cursor-pointer hover:bg-dark-purple/25 dark:bg-white"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </FocusTrap>
        </div>
    )
}