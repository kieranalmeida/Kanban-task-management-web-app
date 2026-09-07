// Hooks
import { useState } from "react"

// Components
import ViewTask from "./ViewTask"
import BoardModal from "./BoardModal"
import TaskModal from "./TaskModal"
import AddColumn from "./AddColumn"
import DeleteTask from "./DeleteTask"

// Context
import { useBoards } from "./BoardsContext"
import { useActiveBoardId } from "./ActiveBoardContextId"
import { useBoardModalContext } from "./BoardModalContext"

export default function Board() {
    // State variables
    const [activeTaskId, setActiveTaskId] = useState<string | null>(null) // Controls ViewTask
    const [editTaskId, setEditTaskId] = useState<string | null>(null) // Controls TaskModal in edit mode
    const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null) // Controls DeleteTask
    const [addColumnOpen, setAddColumnOpen] = useState(false) // Controls AddColumn

    // Context
    const { boards } = useBoards()
    const { activeBoardId } = useActiveBoardId()
    const { addBoardOpen, setAddBoardOpen } = useBoardModalContext()

    // Derived values
    const activeBoard = boards.find( (board) => board.id === activeBoardId)
    
    const boardHtml = activeBoard?.columns?.map( (column, index) => {
        // Used to assign colors to each column
        const colors = ["bg-sky-400", "bg-fuchsia-500", "bg-green-500", "bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-teal-400", "bg-cyan-400", "bg-blue-500", "bg-indigo-500", "bg-rose-500"]
        
        return (
            // Return each column in the targetBoard
            <section 
                className="flex flex-col gap-y-6 shrink-0 w-70"
                aria-labelledby={`column-${column.id}`}
                key={column.id}
            >
                <h2 
                    className="flex items-center gap-x-2 text-medium-grey text-heading-s uppercase truncate"
                    id={`column-${column.id}`}    
                >
                    <span className={`shrink-0 w-4 h-4 rounded-full ${colors[index]}`} aria-hidden="true"/>

                    {column.name} ({column.tasks.length})
                </h2>

                {/* Return each task inside the current column */}
                <ul className="flex flex-col gap-y-5">
                    {
                        column.tasks.map( (task) => {
                            // Get the amount of completed subtasks for the current task
                            const completedTasks = task.subtasks.filter( (subtask) => subtask.isCompleted === true)
                            
                            return (
                                <li className="min-h-22 bg-white rounded-lg shadow-md group dark:bg-dark-grey" key={task.id}>
                                    <button
                                        onClick={ () => setActiveTaskId(task.id) }
                                        className="flex flex-col gap-y-2 w-full px-4 py-5.5 text-left cursor-pointer"
                                        type="button" 
                                        aria-haspopup={true}
                                    >
                                        <h3 className="text-black text-heading-m group-hover:text-dark-purple dark:text-white">{task.title}</h3>
                                        <p className="text-medium-grey text-body-m">{completedTasks.length} of {task.subtasks.length} subtasks</p>
                                    </button>
                                </li>
                            )
                        })
                    }
                </ul>
            </section>
        )
    })

    return (
        <>
            <main 
                className="flex w-full h-full bg-light-grey overflow-auto dark:bg-very-dark-grey">
                {
                    // There are no boards
                    !activeBoard ? (
                            <div className="flex justify-center items-center w-full p-6 md:p-16">
                                <div className="flex flex-col justify-center items-center gap-y-10 text-center">
                                    <h2 className="text-medium-grey text-heading-l">There are no boards available. Create a new board to get started.</h2>

                                    <button 
                                        onClick={ () => setAddBoardOpen(true) }
                                        className="px-4.5 py-3.75 text-white bg-dark-purple rounded-2xl cursor-pointer hover:bg-light-purple"
                                        type="button" 
                                    >
                                        + Add New Board
                                    </button>
                                </div>
                            </div>
                    )
                    : (activeBoard && activeBoard?.columns?.length === 0) ? (
                        // Active board has no columns
                        <div className="flex justify-center items-center w-full p-6 md:p-16">
                            <div className="flex flex-col justify-center items-center gap-y-10 text-center">
                                <h2 className="text-medium-grey text-heading-l">This board is empty. Create a new column to get started.</h2>

                                <button 
                                    onClick={ () => setAddColumnOpen(true) }
                                    className="px-4.5 py-3.75 text-white bg-dark-purple rounded-2xl cursor-pointer hover:bg-light-purple"
                                    type="button" 
                                >
                                    + Add New Column
                                </button>
                            </div>
                        </div>
                    )
                    : (
                        // Active board has at least one column
                        <div className="flex gap-x-6 h-max p-6">
                            {boardHtml}

                            <div className="flex flex-col gap-y-6 h-203.5 shrink-0 w-70">
                                {/* Empty div for spacing */}
                                <div className="w-full h-4 pointer-events-none"/>

                                <button 
                                    onClick={ () => setAddColumnOpen(true) }
                                    className="w-full h-full text-medium-grey text-heading-xl bg-[#E9EFFA] rounded-lg cursor-pointer hover:text-dark-purple dark:bg-dark-grey"
                                    type="button" 
                                >
                                    + New Column
                                </button>
                            </div>
                        </div>
                    )
                }

                <div className="sr-only" 
                    role="status" 
                    aria-live="polite" 
                >
                    {activeBoard ? `Board changed to ${activeBoard.name}` : ""}
                </div>
            </main>

            {/* Render BoardModal in add mode */}
            {
                addBoardOpen &&
                <BoardModal addBoardOpen={addBoardOpen} setAddBoardOpen={setAddBoardOpen}/>
            }

            {/* Render AddColumn */}
            {
                addColumnOpen &&
                <AddColumn onClose={ () => setAddColumnOpen(false) }/>
            }

            {/* If a task is active (clicked on) render ViewTask */}
            {
                activeTaskId && 
                <ViewTask activeTaskId={activeTaskId} setActiveTaskId={setActiveTaskId} setEditTaskId={setEditTaskId} setDeleteTaskId={setDeleteTaskId}/>
            }

            {/* Render TaskModal in edit mode */}
            {
                editTaskId &&
                <TaskModal editTaskId={editTaskId} setEditTaskId={setEditTaskId}/>
            }

            {/* Render DeleteModal for the active task */}
            {
                deleteTaskId &&
                <DeleteTask deleteTaskId={deleteTaskId} onClose={ () => setDeleteTaskId(null)}/>
            }
        </>
    )
}