// Components
import BoardForm from "./BoardForm"

// Context
import { useBoards } from "./BoardsContext"
import { useActiveBoardId } from "./ActiveBoardContextId"

// Types
import type { BoardFormValues } from "../types/types"

type AddBoardModalProps = {
    addBoardOpen: boolean
    setAddBoardOpen: React.Dispatch<React.SetStateAction<boolean>>
    editBoardOpen?: never
    setEditBoardOpen?: never
}

type EditBoardModalProps = {
    addBoardOpen?: never
    setAddBoardOpen?: never
    editBoardOpen: boolean
    setEditBoardOpen: React.Dispatch<React.SetStateAction<boolean>>
}

type BoardModalProps = AddBoardModalProps | EditBoardModalProps

export default function BoardModal({addBoardOpen, setAddBoardOpen, editBoardOpen, setEditBoardOpen}: BoardModalProps) {
    // Context
    const { boards, setBoards } = useBoards()
    const { activeBoardId, setActiveBoardId } = useActiveBoardId()

    // Derived values
    const activeBoard = boards.find( (board) => board.id === activeBoardId)

    // Empty board form for when BoardForm is rendered in add mode (used to set initial state values)
    const emptyBoardForm = {
        name: "",
        columns: [
            {
                id: crypto.randomUUID(),
                name: "Todo",
                tasks: []
            },
            {
                id: crypto.randomUUID(),
                name: "Doing",
                tasks: []
            }
        ]
    }

    // Get initial form values when BoardForm is in edit mode
    function getEditBoardFormValues() {
        if (!activeBoard) return

        // The values of the board being edited are used to set the initial values
        const editBoardFormValues = {
            name: activeBoard.name,
            columns: activeBoard.columns
        }

        return editBoardFormValues
    }

    // Handle adding the board when in add mode
    function handleAddBoard({name, columns}: BoardFormValues) {
        // Create the new board
        const newBoard = {
            id: crypto.randomUUID(),
            name,
            columns
        }

        // Add the new board to the array of boards in state
        setBoards( (prevBoards) => [...prevBoards, newBoard])

        // Set the active board to the newly created board
        setActiveBoardId(newBoard.id)

        // Close the add board form
        setAddBoardOpen!(false)
    }

    // Handle editing the board when in edit mode
    function handleEditBoard({name, columns}: BoardFormValues) {
        // Updated board values (id does not change)
        const updatedBoard = {
            id: activeBoardId,
            name,
            columns
        }

        // Update the board
        setBoards( (prevBoards) => 
            prevBoards.map( (board) => {
                if (board.id !== activeBoardId) {
                    return board
                }

                return updatedBoard
            })
        )

        // Close the edit board form
        setEditBoardOpen!(false)
    }

    // If editBoardId exists, get the edit form values. Otherwise, return undefined. If undefined, TaskForm cannot render in edit mode. If not checking the existence of initialValues before trying to render TaskForm, TypeScript will complain.
    const editBoardFormValues = editBoardOpen ? getEditBoardFormValues() : undefined

    return (
        <>
            {/* Render BoardForm in add mode */}
            {
                addBoardOpen &&
                    <BoardForm 
                        initialValues={emptyBoardForm}
                        formHeading="Add New Board"
                        formButtonText="Create Board"
                        onSubmit={handleAddBoard}
                        onClose={ () => setAddBoardOpen(false) }
                    />
            }

            {/* Render BoardForm in edit mode */}
            {
                (editBoardOpen && editBoardFormValues) &&
                    <BoardForm 
                        initialValues={editBoardFormValues}
                        formHeading="Edit Board"
                        formButtonText="Save Changes"
                        onSubmit={handleEditBoard}
                        onClose={ () => setEditBoardOpen(false) }
                    />
            }
        </>
    )
}