import { useNavigate, useParams } from "react-router-dom"
import { useAuthContext, useErrorContext, useItemsContext } from "../Hooks/useContext"
import { useEffect, useState } from "react"
import '../Styles/itempage.css'

const ItemPage = () => {
    const { items } = useItemsContext()
    const [item, setItem] = useState({ building: '' })
    const [owner, setOwner] = useState({})

    const navigate = useNavigate()
    const { getUser, loggedIn } = useAuthContext()
    const { openError } = useErrorContext()

    const { id } = useParams()

    const [notFound, setNotFound] = useState(false)
    useEffect(() => {
        if (!items || items.length === 0) return

        const data = items.find(e => e.id === id)
        if (!data) {
            setNotFound(true)
            return
        }

        setItem(data)
    }, [items, id])

    useEffect(() => {
        if (item?.owner_id !== undefined) {
            getUser(item?.owner_id).then(data => {
                setOwner(data[0])
            })
        }
    }, [item])

    const [imageIndex, setImageIndex] = useState(0)

    const renderedSelectionImages = item?.urls?.map((e, i) => (
        <img
            className={imageIndex === i ? 'selected' : ''} onClick={() => setImageIndex(i)} key={i} src={e} alt="error" />
    )) || null

    const [buttonText, setButtonText] = useState('Rent')
    const onRent = () => {
        if (!item.available) {
            setButtonText('Not available!')
            setTimeout(() => setButtonText('Rent'), 2000)
            return
        }

        if (!loggedIn) {
            openError('Cannot proceed!', 'Login first to rent an item.')
            return
        }

        navigate(`/renting/${owner.id}`)
    }

    return <div className="item-page-container">
        <div className="image-half">
            <div className="image-selection">
                {renderedSelectionImages}
            </div>
            <div className="main-image">
                <img src={item?.urls ? item?.urls[imageIndex] : 'https://upload.wikimedia.org/wikipedia/commons/5/59/Empty.png'} alt="" />
            </div>
        </div>

        <div className="details-half">
            <div className="title-price">
                <h1>{item?.title}</h1>
                <p className="price-tag">{item?.price === 0 ? 'Price negotiable.' : `${item?.price} GEL / day`}</p>
            </div>

            <p>{item?.description}</p>
            <p style={{ textTransform: 'capitalize' }}>Category: {item?.category}</p>
            {
                item?.available ? <p><i className="check icon"></i> Available!</p> : <p><i className="times icon"></i> Not available.</p>
            }

            <p>Location: {item?.building.charAt(0).toUpperCase() + item?.building.slice(1).toLowerCase()} Building</p>

            <button onClick={onRent} className="ui button secondary inverted">{buttonText}</button>
            <div className="ui divider"></div>

            <h2>Listed by: {owner?.name} {owner?.verified && <span style={{ fontWeight: '400', fontSize: '11px' }}>(verified)</span>}</h2>
            {owner?.email && <p onClick={() => window.location.href = `mailto:${owner?.email}`} style={{ textDecoration: 'underline', cursor: 'pointer' }}>{owner?.email}</p>}
            {owner?.phone && <p onClick={() => window.location.href = `tel:${owner?.phone}`} style={{ textDecoration: 'underline', cursor: 'pointer' }}>Tel: {owner?.phone}</p>}
            <button className="ui button secondary">Message Owner</button>
        </div>

        {
            notFound && <div style={{ position: 'fixed', top: '7dvh', left: '0', width: '100%', height: '93dvh', zIndex: '4', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <i style={{ fontSize: '120px' }} className="search icon"></i>
                <h1 style={{ margin: '0' }}>Error 404: Item not found.</h1>
                <button onClick={() => navigate('/explore')} className="ui button big secondary inverted" style={{ marginTop: '20px' }}>Return to explore page</button>
            </div>
        }
    </div>
}

export default ItemPage