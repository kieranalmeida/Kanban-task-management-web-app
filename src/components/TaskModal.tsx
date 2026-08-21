// Components
import TaskForm from "./TaskForm"
// Context
import { useBoards } from "./BoardsContext"
import { useActiveBoardId } from "./ActiveBoardContextId"
// Types
import type { TaskFormValues } from "../types/types"

type AddTaskModalProps = {
    addTaskOpen: boolean
    setAddTaskOpen: React.Dispatch<React.SetStateAction<boolean>>
    editTaskId?: never
    setEditTaskId?: never
}

type EditTaskModalProps = {
    addTaskOpen?: never
    setAddTaskOpen?: never
    editTaskId: string | null
    setEditTaskId: React.Dispatch<React.SetStateAction<string | null>>
}

type TaskModalProps = AddTaskModalProps | EditTaskModalProps

export default function TaskModal({addTaskOpen, setAddTaskOpen, editTaskId, setEditTaskId}: TaskModalProps) {
    // Context
    const { boards, setBoards } = useBoards() // Controls boards
    const { activeBoardId } = useActiveBoardId() // Controls active board ID
    
    // Derived values
    const activeBoard = boards.find( (board) => board.id === activeBoardId) // Get active board
    const defaultColumnId = activeBoard?.columns[0].id // Get the default column id (the first column in the activeBoard) for when TaskModal is in add mode
    if (!defaultColumnId) return

    // Empty task form for when TaskForm is rendered in add mode (used to set initial state values)
    const emptyTaskForm = {
        title: "",
        description: "",
        targetColumnId: defaultColumnId,
        subtasks: [
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
    }

    // Get initial form values when TaskForm is in edit mode
    function getEditTaskFormValues() {
        const activeTask = activeBoard?.columns.flatMap( (column) => column.tasks).find( (task) => task.id === editTaskId) // Get the task being edited
        const activeColumn = activeBoard?.columns?.find( (column) => column.tasks.some( (task) => task.id === editTaskId) ) // Get the active column (the one the task being edited is in)
        if (!activeTask || !activeColumn) return
        
        const editTaskFormValues = {
            title: activeTask.title,
            description: activeTask.description,
            targetColumnId: activeColumn.id,
            subtasks: activeTask.subtasks
        }

        return editTaskFormValues
    }

    function handleAddTask( {title, description, targetColumnId, subtasks}: TaskFormValues) {
        const targetColumn = activeBoard?.columns.find( (column) => column.id === targetColumnId) // Get the target column (the one that the task being created will be added to)
        if (!targetColumn) return

        // Create the new task from the form data
        const newTask = {
            id: crypto.randomUUID(),
            title,
            description,
            status: targetColumn?.name,
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

        // Close add task form
        setAddTaskOpen!(false)
    }

    function handleEditTask( {title, description, targetColumnId, subtasks}: TaskFormValues) {
        const activeTask = activeBoard?.columns.flatMap( (column) => column.tasks).find( (task) => task.id === editTaskId) // Get the task being edited
        const activeColumn = activeBoard?.columns?.find( (column) => column.tasks.some( (task) => task.id === editTaskId) ) // Get active column (the one the task being edited is in before being updated)
        const targetColumn = activeBoard?.columns.find( (column) => column.id === targetColumnId) // Get the target column (the one that the task being edited is in or being moved to)
        if (!activeTask || !activeColumn || !targetColumn) return
        
        // Updated task values (id does not change)
        const updatedTask = {
            id: activeTask?.id,
            title,
            description,
            status: targetColumn?.name,
            subtasks
        }
        
        // If the current column id matches the active column id and target column id, update the task
        // If the current column id matches the active column id but not the target column id, remove the task
        // If the current column id doesn't match the active column id but matches the target column id, add the task
        // If the current column isn't the active or target column, return the column
        setBoards( (prevBoards) =>
            prevBoards.map( (board) => {
                if (board.id !== activeBoardId) {
                    return board
                }

                return {
                    ...board,
                    columns: board.columns.map( (column) => {
                        // update task in place
                        if (column.id === activeColumn.id && column.id === targetColumn.id) {
                            return {
                                ...column,
                                tasks: column.tasks.map( (task) => {
                                    if (task.id === editTaskId) {
                                        return updatedTask
                                    }

                                    return task
                                })
                            }
                        }

                        // remove task from old column
                        if (column.id === activeColumn.id && column.id !== targetColumn.id) {
                            return {
                                ...column,
                                tasks: column.tasks.filter( (task) => task.id !== editTaskId)
                            }
                        }

                        // add task to new column
                        if (column.id !== activeColumn.id && column.id === targetColumn.id) {
                            return {
                                ...column,
                                tasks: [...column.tasks, updatedTask]
                            }
                        }

                        // return normal column
                        return column
                    })
                }
            })
        )

        // Close edit task form
        setEditTaskId!(null)
    }

    const editTaskFormValues = editTaskId ? getEditTaskFormValues() : undefined

    return (
        <>
            {/* Render TaskForm in add mode */}
            {
                addTaskOpen && (
                    <TaskForm
                        initialValues={emptyTaskForm}
                        formHeading="Add New Task"
                        formButtonText="Create Task"
                        onSubmit={handleAddTask}
                        onClose={ () => setAddTaskOpen(false) }
                    />
                )
            }

            {/* Render TaskForm in edit mode */}
            {
                editTaskFormValues && (
                    <TaskForm
                        initialValues={editTaskFormValues} 
                        formHeading="Edit Task"
                        formButtonText="Save Changes"
                        onSubmit={handleEditTask}
                        onClose={ () => setEditTaskId!(null) }
                    />
                )
            }
        </>
    )
}