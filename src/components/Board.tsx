// Context
import { useBoard } from "./BoardContext"
// Data
import data from "../data/data.json"

export default function Board() {
    const { activeBoard } = useBoard()
    const targetBoard = data.boards.find( (board) => board.name === activeBoard)

    const boardHtml = targetBoard?.columns.map( (column, index) => {
        const colors = ["bg-sky-400", "bg-fuchsia-500", "bg-green-500", "bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-teal-400", "bg-cyan-400", "bg-blue-500", "bg-indigo-500", "bg-rose-500"]

        return (
            // Return each column in the targetBoard
            <div className="flex flex-col gap-y-6">
                <h2 className="flex items-center gap-x-2 text-medium-gray text-heading-s uppercase">
                    <div className={`w-4 h-4 rounded-full ${colors[index]}`}/>
                    {column.name} ({column.tasks.length})
                </h2>

                {/* Return each task inside the current column */}
                <div className="flex flex-col gap-y-5 w-150">
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
        <main className="flex gap-x-6 w-full h-screen p-6 bg-light-grey dark:bg-very-dark-grey overflow-x-scroll">
            {boardHtml}
        </main>
    )
}

// Receives active board, renders a column for every object in columns array (component too?), and renders a Task for every task in each column
// Tasks are clickable, refer to below for functionality

// Control active board with state
// Render each board's columns and the tasks in each column
// If the current board has no columns, render "Add new column" button
// If the current board has at least 1 column, render "Add new column" column

// Tasks can be viewed by clicking on them
// When viewing a task, the elipsis button opens a menu with "edit task" and "delete task" buttons

// Each board has columns
// Each column has a list of tasks
// Each task has subtasks

// Elipsis opens a menu with "edit board" and "delete board" buttons

// "Add new task" button creates new task for the current board
// "Create new board" button creates new board (adds to array of boards)

// Limit boards, columns and tasks

// Create a component for everything