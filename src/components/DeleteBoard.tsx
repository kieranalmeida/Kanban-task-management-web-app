// Context
import { useBoards } from "./BoardsContext"
import { useActiveBoardId } from "./ActiveBoardContextId"

type DeleteBoardProps = {
    onClose: () => void
}

export default function DeleteBoard({onClose}: DeleteBoardProps) {
    // Context
    const { boards, setBoards } = useBoards()
    const { activeBoardId, setActiveBoardId } = useActiveBoardId()

    // Derived values
    const activeBoard = boards.find( (board) => board.id === activeBoardId)

    // Delete the board
    function handleDeleteBoard() {
        const newBoards = boards.filter( (board) => board.id !== activeBoardId)
        
        // Delete board
        setBoards(newBoards)
        
        // Change active board id to the next one in the list, assuming there's at least one board
        if (newBoards.length >= 1) {
            setActiveBoardId(newBoards[0].id)
        }

        // Close the modal
        onClose()
    }

    return (
        <div
            onClick={ (e) => { if (e.target === e.currentTarget) onClose() } } 
            className="absolute z-10 inset-0 flex justify-center items-center p-4 bg-black/50"
        >
            <div className="flex flex-col gap-y-6 w-full sm:w-85.75 md:w-120 p-6 md:p-8 bg-white rounded-lg dark:bg-very-dark-grey">
                <h2 className="text-dark-red text-heading-l">Delete this board?</h2>

                <p className="text-medium-grey text-body-l">Are you sure you want to delete the '{activeBoard?.name}' board? This action will remove all columns and tasks and cannot be reversed.</p>
                
                <div className="flex gap-x-4 text-[0.8125rem] font-bold leading-5.75">
                    <button 
                        onClick={ () => handleDeleteBoard() }
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
        </div>
    )
}