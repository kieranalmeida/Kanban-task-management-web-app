// Context
import { useBoard } from "./BoardContext"
// Data
import data from "../data/data.json"

export default function Board() {
    const { activeBoard } = useBoard()
    const targetBoard = data.boards.find( (board) => board.name === activeBoard)
    
    const boardHtml = targetBoard?.columns?.map( (column, index) => {
        const colors = ["bg-sky-400", "bg-fuchsia-500", "bg-green-500", "bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-teal-400", "bg-cyan-400", "bg-blue-500", "bg-indigo-500", "bg-rose-500"]
        
        return (
            // Return each column in the targetBoard
            <div className="flex flex-col gap-y-6 shrink-0 w-70">
                <h2 className="flex items-center gap-x-2 text-medium-gray text-heading-s uppercase">
                    <div className={`w-4 h-4 rounded-full ${colors[index]}`}/>
                    {column.name} ({column.tasks.length})
                </h2>

                {/* Return each task inside the current column */}
                <div className="flex flex-col gap-y-5">
                    {
                        column.tasks.map( (task) => {
                            // Get the amount of completed subtasks for the current task
                            const completedTasks = task.subtasks.filter( (subtask) => subtask.isCompleted === true)
                            
                            return (
                                <div className="flex flex-col gap-y-2 min-h-22 px-4 py-5.5 bg-white rounded-lg shadow-md cursor-pointer group dark:bg-dark-grey">
                                    <h2 className="text-black text-heading-m group-hover:text-dark-purple dark:text-white">{task.title}</h2>
                                    <p className="text-medium-gray text-[0.75rem] font-medium">{completedTasks.length} of {task.subtasks.length} subtasks</p>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    })
    
    return (
        <main className="flex w-full p-6 bg-light-grey overflow-x-auto dark:bg-very-dark-grey">
            {
                targetBoard?.columns?.length === 0 ? (
                    // Active board has no columns
                    <div className="flex justify-center items-center w-full">
                        <div className="flex flex-col justify-center items-center gap-y-10 text-center mt-52.75 md:mt-82 2xl:mt-91">
                            <h2 className="text-medium-gray text-heading-l">This board is empty. Create a new column to get started.</h2>
                            <button className="px-4.5 py-3.75 text-white bg-dark-purple rounded-2xl cursor-pointer">+ Add New Column</button>
                        </div>
                    </div>
                )
                : (
                    // Active board has at least one column
                    <div className="flex gap-x-6">
                        {boardHtml}

                        <div className="flex flex-col gap-y-6 shrink-0 w-70">
                            {/* Empty div for spacing */}
                            <div className="w-full h-4 pointer-events-none"/>

                            <button className="w-full h-full text-medium-gray text-heading-xl bg-[#E9EFFA] rounded-lg cursor-pointer hover:text-dark-purple dark:bg-dark-grey">+ New Column</button>
                        </div>
                    </div>
                )
            }
        </main>
    )
}

// Vertical scroll only on main?
// Store entire active board or just name?


// Tasks can be viewed by clicking on them
// When viewing a task, the elipsis button opens a menu with "edit task" and "delete task" buttons

// Each board has columns
// Each column has a list of tasks
// Each task has subtasks

// Elipsis opens a menu with "edit board" and "delete board" buttons

// "Add new task" button creates new task for the current board
// "Create new board" button creates new board (adds to array of boards)

// Limit boards, columns and tasks
// No boards message
// Task placeholder for empty columns?

// Create a component for everything