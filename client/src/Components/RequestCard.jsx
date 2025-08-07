import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext, useErrorContext, useItemsContext } from "../Hooks/useContext";

const RequestCard = ({ id, title, start_price, end_price, start_date, end_date, images, own }) => {
    const navigate = useNavigate()
    const [priceText, setPriceText] = useState('')
    const [dateText, setDateText] = useState('')

    const { user } = useAuthContext()
    const { openError, openConfirm } = useErrorContext()
    const { deleteRequest } = useItemsContext()

    const onMessageClick = () => {
        if (user.id === id) {
            openError('Cannot message!', 'You cannot proceed with your own listings.')
            return
        }

        alert('do this functionality retard')
    }

    useEffect(() => {
        if (start_price && end_price) {
            setPriceText(`${start_price} - ${end_price} GEL / day`)
        } else if (start_price && !end_price) {
            setPriceText(`From ${start_price} GEL / day`)
        } else if (!start_price && end_price) {
            setPriceText(`To ${start_price} GEL / day`)
        } else {
            setPriceText('Price negotiable')
        }

        if (start_date && end_date) {
            setDateText(`From ${formatDate(start_date)} - To ${formatDate(end_date)}`)
        } else if (start_date && !end_date) {
            setDateText(`Rent date: ${formatDate(start_date)}`)
        } else if (!start_date && end_date) {
            setDateText(`Return date: ${formatDate(end_date)}`)
        } else {
            setDateText('')
        }
    }, [])

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        const day = date.getDate()
        const month = date.toLocaleString('en-US', { month: 'short' })
        return `${day} ${month}`
    }

    const onDelete = async () => {
        openConfirm('Are you sure?', 'Deleted item cannot be retrieved.', () => deleteRequest(id))
    }

    return <div className="item-card">
        <div className="img-wrapper">
            <img src={images.length !== 0 ? images[0] : 'https://i.ibb.co/mpW6P0F/No-Image-Available.jpg'} alt="" />
        </div>
        <div className="card-details">
            <h2 className="title">{title}</h2>
            <p>{priceText}</p>
            <p>{dateText}</p>
        </div>
        <div className="card-buttons">
            {own ? <button onClick={onDelete} className={`ui button red inverted`}>Delete</button> : <button onClick={onMessageClick} className='ui button secondary inverted'>Message</button>}
            <button onClick={() => navigate(`/request/${id}`)} className='ui button'>More</button>
        </div>
    </div>
}

export default RequestCard;