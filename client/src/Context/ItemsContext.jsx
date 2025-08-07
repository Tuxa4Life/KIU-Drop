import { createContext, useEffect, useState } from "react";
import { supabase } from "../Utils/supabaseClient";
import { useErrorContext } from "../Hooks/useContext";

const ItemsContext = createContext()
const ItemsProvider = ({ children }) => {
    const [items, setItems] = useState([])
    const [requests, setRequests] = useState([])

    const { openError } = useErrorContext()

    useEffect(() => {
        fetchItems()
        fetchRequests()
    }, [])

    const fetchItems = async () => {
        const {error, data} = await supabase.from('items').select('*')
        
        if (error) {
            openError('Error fetching item', 'There was a problem during item fetch. Please refresh page.', error.message)
            return
        }

        setItems(data)
    }

    const fetchRequests = async () => {
        const {error, data} = await supabase.from('requests').select('*')
        
        if (error) {
            openError('Error fetching request items', 'There was a problem during item fetch. Please refresh page.', error.message)
            return
        }

        setRequests(data)
    }

    const deleteItem = async (id) => {
        const { error } = await supabase.from('items').delete().eq('id', id)
        
        if (error) {
            openError('Cannot delete item!', 'Item is already deleted or cannot be deleted.', error.message)
            return
        }

        setItems(prev => prev.filter(e => e.id !== id))
    }

    const deleteRequest = async (id) => {
        const { error } = await supabase.from('requests').delete().eq('id', id)
        
        if (error) {
            openError('Cannot delete item!', 'Item is already deleted or cannot be deleted.', error.message)
            return
        }

        setRequests(prev => prev.filter(e => e.id !== id))
    }

    const data = { items, requests, fetchItems, fetchRequests, deleteItem, deleteRequest }
    return <ItemsContext.Provider value={data}>
        { children }
    </ItemsContext.Provider>
}

export { ItemsProvider };
export default ItemsContext;