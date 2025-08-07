import { createContext, useState } from "react";

const ErrorContext = createContext()
const ErrorProvider = ({ children }) => {
    const [title, setTitle] = useState('')
    const [message, setMessage] = useState('')
    const [details, setDetails] = useState('')

    const [confirmFunction, setConfirmFunction] = useState(() => () => {})

    const [errorOpen, setErrorOpen] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)

    const openError = (title, message, details) => {
        setTitle(title || '')
        setMessage(message || '')
        setDetails(details || '')
        setErrorOpen(true)
    }

    const closeError = () => {
        setTitle('')
        setMessage('')
        setDetails('')
        setErrorOpen(false)
    }

    const openConfirm = (title, message, fun) => {
        setTitle(title || '')
        setMessage(message || '')
        setConfirmFunction(() => fun)
        setConfirmOpen(true)
    }

    const closeConfirm = () => {
        setTitle('')
        setMessage('')
        setConfirmOpen(false)
    }

    const data = { errorOpen, confirmOpen, confirmFunction, title, message, details, openError, openConfirm, closeError, closeConfirm }
    return <ErrorContext.Provider value={data}>
        { children }
    </ErrorContext.Provider>
}

export { ErrorProvider }
export default ErrorContext;