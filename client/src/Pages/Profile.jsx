import { useNavigate } from "react-router-dom";
import { useApiContext, useAuthContext, useErrorContext, useItemsContext } from "../Hooks/useContext";
import { useEffect, useRef, useState } from "react";
import ItemCard from "../Components/ItemCard";
import RequestCard from '../Components/RequestCard'
import '../Styles/profile.css'

const Profile = () => {
    const [userRentals, setUserRentals] = useState([])
    const [userItems, setUserItems] = useState([])
    const [userRequests, setUserRequests] = useState([])

    const { user, loggedIn, logOut, updatePicture } = useAuthContext()
    const { items, requests } = useItemsContext()
    const { openConfirm } = useErrorContext()
    const { uploadImage } = useApiContext()

    const navigate = useNavigate()

    const uploadRef = useRef(null)
    const [image, setImage] = useState('https://i.ibb.co/FqD81nqr/a.webp')

    useEffect(() => {
        if (!loggedIn) {
            navigate('/login')
            return
        }

        setImage(user.picture || 'https://i.ibb.co/FqD81nqr/a.webp')
    }, [])

    useEffect(() => {
        setUserItems(items.filter(e => e.owner_id === user.id))
        setUserRequests(requests.filter(e => e.requester_id === user.id))
    }, [items, requests])

    const changePfp = () => {
        uploadRef.current.click()
    }

    const renderedRentals = userRentals.map((e) => {
        return <div key={e?.id}>{e?.id}</div>
    })

    const renderedItems = userItems.map((e) => {
        return <ItemCard key={e.id} id={e.id} images={e.urls} isAvailable={e.available} price={e.price} title={e.title} own/>
    })

    const renderedRequests = userRequests.map((e) => {
        return <RequestCard key={e.id} id={e.id} images={e.urls || []} title={e.title} start_date={e.start_date} end_date={e.end_date} start_price={e.start_price} end_price={e.end_price} own />
    })

    const changeProfilePicture = async (image) => {
        setImage(URL.createObjectURL(image))
        const url = await uploadImage(image)
        await updatePicture(url)
    }

    return <div className="profile-container">
        <div className="profile-card">
            <div className="picture-name">
                <img src={image} alt="" />
                <h1>{user.name}</h1>

                <div onClick={changePfp} className="change-pic">
                    <i className="camera icon"></i>
                    <input onChange={e => changeProfilePicture(e.target.files[0])} style={{ display: 'none' }} ref={uploadRef} accept='image/*' type="file" />
                </div>
            </div>
            <span style={{ color: 'gray', fontSize: '11px', marginTop: '5px' }}>{user.id}</span>
            { user.email && <p><i className="mail icon"></i> {user.email}</p> }
            { user.phone && <p><i className="phone icon"></i> {user.phone}</p> }

            <div className="profile-buttons">
                <button onClick={() => openConfirm('Are you sure?', 'You will be returned to the home page.', logOut)} className="ui button secondary inverted">Log out</button>
            </div>
        </div>


        <div className="item-side">
            <h2>Rented items</h2>
            <div className="rental-list list-container">{renderedRentals.length !== 0 ? renderedRentals : <i>You have no rented items.</i>}</div>
            <div className="ui divider"></div>

            <h2>Listed items</h2>
            <div className="items-list list-container">{renderedItems.length !== 0 ? renderedItems : <i>You have no listed items.</i>}</div>
            <div className="ui divider"></div>

            <h2>Requested items</h2>
            <div className="request-list list-container">{renderedRequests.length !== 0 ? renderedRequests : <i>You have no requested items.</i>}</div>
            <div className="ui divider"></div>
        </div>
    </div>
}

export default Profile;