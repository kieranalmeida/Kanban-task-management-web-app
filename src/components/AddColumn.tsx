// Hooks
import { useState, useEffect } from "react"

// Components
import { FocusTrap } from "focus-trap-react"

// Context
import { useBoards } from "./BoardsContext"
import { useActiveBoardId } from "./ActiveBoardContextId"

type AddColumnProps = {
    onClose: () => void
}

type ColumnFormErrors = {
    name?: string
}

export default function AddColumn({onClose}: AddColumnProps) {
    // State variables
    const [name, setName] = useState("")
    const [formErrors, setFormErrors] = useState<ColumnFormErrors>({}) // Controls form errors to render custom error messages

    // Context
    const { setBoards } = useBoards()
    const { activeBoardId } = useActiveBoardId()

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

    // Handle name input change
    function handleNameChange(value: string) {
        setName(value)
        
        // If there's an error key for name, remove it
        if (formErrors.name) {
            setFormErrors( (prevFormErrors) => {
                const {name, ...rest} = prevFormErrors
                
                return {
                    ...rest
                }
            })
        }
    }
    
    // Handle form submission
    function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        // Prevent page refresh and form reset
        e.preventDefault()
        
        // Empty error object to keep track of errors on each input
        let newErrors: ColumnFormErrors = {}

        // Check for errors on each input
        if (!name) { newErrors.name = "Can't be empty" }

        // Set the formErrors state to the newErrors object. Any key that exists will trigger a custom error message
        setFormErrors(newErrors)
        
        // To satisfy TypeScript, return early if name does not exist
        if (!name) return

        const newColumn = {
            id: crypto.randomUUID(),
            name,
            tasks: []
        }

        // Add column to active board
        setBoards( (prevBoards) => 
            prevBoards.map( (board) => {
                if (board.id !== activeBoardId) {
                    return board
                }

                return {
                    ...board,
                    columns: [...board.columns, newColumn]
                }
            })
        )

        // Close the add column menu
        onClose()
    }

    return (
        <div
            onMouseDown={ (e) => { if (e.target === e.currentTarget) onClose() } }
            className="absolute z-10 inset-0 flex justify-center items-center p-4 bg-black/50"
        >
            <FocusTrap>
                <div className="flex flex-col gap-y-6 w-full sm:w-85.75 md:w-120 p-6 md:p-8 bg-white rounded-lg dark:bg-very-dark-grey">
                    <h2 className="text-black text-heading-l dark:text-white">Add New Column</h2>

                    <form 
                        onSubmit={handleSubmit}
                        noValidate
                        className="flex flex-col gap-y-6" 
                    >
                        {/* Name */}
                        <div className="flex flex-col gap-y-2">
                            <label 
                                htmlFor="name"
                                className="text-medium-grey text-[0.75rem] font-bold dark:text-white"
                            >
                                Column Name
                            </label>

                            <div className="relative">
                                <input 
                                    type="text"
                                    value={name}
                                    onChange={ (e) => handleNameChange(e.target.value) }
                                    maxLength={15}
                                    id="name"
                                    placeholder="e.g. Web Design"
                                    className={`
                                        w-full px-4 py-2 text-body-l placeholder-black/25 border outline-0 rounded-sm focus:border-dark-purple dark:text-white dark:placeholder-white/25 
                                            ${
                                                formErrors.name ? "border-dark-red focus:border-dark-purple" 
                                                : "border-medium-grey/25  hover:border-dark-purple dark:outline-0"
                                            }
                                    `}
                                />

                                {
                                    formErrors.name &&
                                    <span className="absolute top-2.5 right-2 text-dark-red text-body-l">Can't be empty</span>
                                }
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="w-full py-2 text-white text-[0.8125rem] font-bold leading-5.75 bg-dark-purple rounded-full cursor-pointer hover:bg-light-purple"
                        >
                            Create Column
                        </button>
                    </form>
                </div>
            </FocusTrap>
        </div>
    )
}