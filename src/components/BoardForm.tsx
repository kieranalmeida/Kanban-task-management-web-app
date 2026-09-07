// Hooks
import { useState, useEffect } from "react"

// Components
import { FocusTrap } from "focus-trap-react"

// Images
import IconCross from "../images/icon-cross.svg?react"

// Types
import type { Column, BoardFormValues } from "../types/types"

type BoardFormProps = {
    initialValues: BoardFormValues
    formHeading: string,
    formButtonText: string,
    onSubmit: ( {name, columns}: BoardFormValues) => void,
    onClose: () => void
}

type BoardFormErrors = {
    name?: string
    [key: `column-${string}`]: string | undefined
}

export default function BoardForm({initialValues, formHeading, formButtonText, onSubmit, onClose}: BoardFormProps) {
    // State variables
    const [name, setName] = useState(initialValues.name)
    const [columns, setColumns] = useState<Column[]>(initialValues.columns)
    const [formErrors, setFormErrors] = useState<BoardFormErrors>({}) // Controls form errors to render custom error messages

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

    // Handle column input change
    function handleColumnChange(columnId: string, value: string) {
        setColumns( (prevColumns) => 
            prevColumns.map( (column) => {
                if (column.id !== columnId) {
                    return column
                }
                
                return {
                    ...column, name: value
                }
            })
        )
        
        // Without this, TypeScript will complain
        const currentColumn = `column-${columnId}` as const
        
        // If there's an error key for a column, remove it
        if (formErrors[currentColumn]) {
            setFormErrors( (prevFormErrors) => {
                const {[currentColumn]: _, ...rest} = prevFormErrors
                
                return {
                    ...rest
                }
            })
        }
    }

    // Handle adding columns
    function handleAddColumn() {
        const newColumn = {
            id: crypto.randomUUID(),
            name: "",
            tasks: []
        }
        
        setColumns( (prevColumns) => [...prevColumns, newColumn])
    }
    
    // Handle column deletion
    function handleColumnDelete(columnId: string) {
        // Update the columns array to include every column except the one being deleted
        setColumns( (prevColumns) => {
            return prevColumns.filter( (column) => column.id !== columnId)
        })
    }

    // Handle form submission
    function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        // Prevent page refresh and form reset
        e.preventDefault()
        
        // Empty error object to keep track of errors on each input
        let newErrors: BoardFormErrors = {}

        // Check for errors on each input
        if (!name) { newErrors.name = "Can't be empty" }
        columns.forEach( (column) => {
            if (!column.name) {
                newErrors[`column-${column.id}`] = "Can't be empty"
            }
        })

        // Set the formErrors state to the newErrors object. Any key that exists will trigger a custom error message
        setFormErrors(newErrors)
        
        // To satisfy TypeScript, return early if name, description, targetColumn or a subtask title do not exist
        if (!name || columns.some( (column) => !column.name)) {
            return
        }

        // Perform handleAddBoard if in add mode or handleEditBoard if in edit mode
        onSubmit( {name, columns} )
    }

    return (
        <div
            onMouseDown={ (e) => { if (e.target === e.currentTarget) onClose() } } 
            className="absolute z-10 inset-0 flex justify-center items-center p-4 bg-black/50"
        >
            <FocusTrap>
                <div className="flex flex-col gap-y-6 w-full sm:w-85.75 md:w-120 p-6 md:p-8 bg-white rounded-lg dark:bg-very-dark-grey">
                    <h2 className="text-black text-heading-l dark:text-white">{formHeading}</h2>

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
                                Board Name
                            </label>

                            <div className="relative">
                                <input 
                                    type="text"
                                    value={name}
                                    onChange={ (e) => handleNameChange(e.target.value) }
                                    maxLength={50}
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
                                    <span className="absolute top-2.5 right-2 text-dark-red text-body-l">{formErrors.name}</span>
                                }
                            </div>
                        </div>

                        {/* Columns */}
                        <div className="flex flex-col">
                            <h3 className="text-medium-grey text-[0.75rem] font-bold dark:text-white">Columns</h3>

                            <ul className={`
                                    flex flex-col gap-y-3 mt-2 max-h-25 pr-1.5 overflow-y-auto
                                    ${columns.length > 0 ? "mb-3" : "mb-0"}
                                `}>
                                {
                                    columns.map( (column) => {
                                        return (
                                            <li 
                                                className="flex gap-x-4" 
                                                key={column.id}
                                            >
                                                <div className="relative w-full">
                                                    <input
                                                        type="text"
                                                        value={column.name}
                                                        maxLength={15}
                                                        onChange={ (e) => handleColumnChange(column.id, e.target.value) }
                                                        className={`
                                                            w-full px-4 py-2 text-body-l placeholder-black/25 border outline-0 rounded-sm focus:border-dark-purple dark:text-white dark:placeholder-white/25
                                                                ${
                                                                    formErrors[`column-${column.id}`] ? "border-dark-red focus:border-dark-purple" 
                                                                    : "border-medium-grey/25  hover:border-dark-purple dark:outline-0"
                                                                }
                                                            `} 
                                                    />

                                                    {
                                                        formErrors[`column-${column.id}`] && 
                                                        <span className="absolute top-2.5 right-2 text-dark-red text-body-l">{formErrors[`column-${column.id}`]}</span>
                                                    }
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={ () => handleColumnDelete(column.id) }
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
                                onClick={ () => handleAddColumn() }
                                className="w-full py-2 text-dark-purple text-[0.8125rem] font-bold leading-5.75 bg-dark-purple/10 rounded-full cursor-pointer hover:bg-dark-purple/25 dark:bg-white dark:hover:bg-white"
                            >
                                + Add new column
                            </button>
                        </div>


                        {/* Submit */}
                        <button
                            type="submit"
                            className="w-full py-2 text-white text-[0.8125rem] font-bold leading-5.75 bg-dark-purple rounded-full cursor-pointer hover:bg-light-purple"
                        >
                            {formButtonText}
                        </button>
                    </form>
                </div>
            </FocusTrap>
        </div>
    )
}