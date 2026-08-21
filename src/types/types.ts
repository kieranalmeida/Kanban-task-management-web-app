export type SubTask = {
    id: string,
    title: string,
    isCompleted?: boolean,
    placeholder?: string
}

export type Task = {
    id: string
    title: string,
    description: string,
    status: string,
    subtasks: SubTask[]
}

export type Column = {
    id: string
    name: string,
    tasks: Task[]
}

export type Board = {
    id: string
    name: string,
    columns: Column[]
}

export type Boards = Board[]

// export type NewSubTask = {
//     id: string,
//     title: string,
//     placeholder?: string
// }

export type TaskFormValues = {
    title: string,
    description: string,
    subtasks: SubTask[]
    targetColumnId: string
}