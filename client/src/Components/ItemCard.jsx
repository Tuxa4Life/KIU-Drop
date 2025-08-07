import { useNavigate } from "react-router-dom";
import { useAuthContext, useErrorContext, useItemsContext } from '../Hooks/useContext'
import { useState } from "react";

const ItemCard = ({id, images, title, price, isAvailable, own}) => {
    const navigate = useNavigate()
    const { user } = useAuthContext()
    const { openError, openConfirm } = useErrorContext()
    const { deleteItem } = useItemsContext()


    const onMessageClick = () => {
        if (user.id === id) {
            openError('Cannot message!', 'You cannot proceed with your own listings.')
            return
        }

        alert('do this functionality retard')
    }

    const onDelete = async () => {
        await openConfirm('Are you sure?', 'Deleted item cannot be retrieved.', () => deleteItem(id))
    }

    return <div className="item-card">
        <div className="img-wrapper">
            <img src={images[0]} alt="" />
        </div>
        <div className="card-details">
            <h2 className="title">{title}</h2>
            <p className="price">
                {
                    price === 0 ? <>Price negotiable</> : <>{parseFloat(price).toFixed(2)} GEL / day</>
                }
            </p>
            <p className="available">
                {
                    isAvailable ?
                    <><i className="check icon"></i> Available</> :
                    <><i className="times icon"></i> Not available</>
                }    
            </p>
        </div>
        <div className="card-buttons">
            {own ? <button onClick={onDelete} className={`ui button red inverted `}>Delete</button> : <button onClick={onMessageClick} className='ui button secondary inverted'>Message</button>}
            <button onClick={() => navigate(`/item/${id}`)} className='ui button'>More</button>
        </div>
    </div>
}

export default ItemCard;