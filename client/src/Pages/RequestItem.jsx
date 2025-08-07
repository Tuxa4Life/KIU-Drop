import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApiContext, useAuthContext, useErrorContext, useItemsContext } from "../Hooks/useContext";

const RequestItem = () => {
    const [images, setImages] = useState([])
    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')
    const [category, setCategory] = useState('miscellaneous')
    const [building, setBuilding] = useState('ANY')
    const [minPrice, setMinPrice] = useState('')
    const [maxPrice, setMaxPrice] = useState('')
    const [rentDate, setRentDate] = useState('')
    const [returnDate, setReturnDate] = useState('')

    const [imgIndex, setImgIndex] = useState(0)
    const uploadRef = useRef(null)
    const navigate = useNavigate()

    const { user, loggedIn } = useAuthContext()
    const { uploadMultiple, uploadColumns } = useApiContext()
    const { openError } = useErrorContext()
    const { fetchRequests } = useItemsContext()

    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    const onUploadClick = () => {
        uploadRef.current.click()
    }

    const onFileChange = (e) => {
        const files = [...images, ...e.target.files]
        setImages(files)
    }

    const handlePriceChange = (e, n) => {
        const value = e.target.value;

        if (/^\d*\.?\d{0,2}$/.test(value)) {
            if (n === 1) setMinPrice(value);
            else setMaxPrice(value)
        }
    }

    const renderedImages = images.map((file, i) => {
        const url = URL.createObjectURL(file)
        return <img onClick={() => setImgIndex(i)} className={`img-list-item ${i === imgIndex ? 'selected-img' : ''}`} key={i} src={url} alt="File URL Error" />
    })

    const submit = async () => {
        if (!loggedIn) {
            openError('Cannot upload request listing!', 'You need to login first to proceed.')
            return
        }

        if (!title || rentDate > returnDate || minPrice > maxPrice) {
            setError(true)
            return
        }

        setLoading(true)
        let output = {
            requester_id: user.id,
            title,
            description: desc,
            start_price: parseFloat(minPrice),
            end_price: parseFloat(maxPrice),
            urls: null,
            start_date: rentDate || null,
            end_date: returnDate || null,
            building
        }

        if (images.length !== 0) {
            const response = await uploadMultiple(images)
            output.urls = response
        }

        uploadColumns('requests', [output]).then(() => {
            fetchRequests()
        })
        

        setSuccess(true)
        setError(false)
        setLoading(false)
        setTitle('')
        setDesc('')
        setImages([])
        setImgIndex(0)
        setCategory('miscellaneous')
        setBuilding('ANY')
        setRentDate('')
        setRentDate('')
        setMaxPrice('')
        setMinPrice('')
    }

    return <div className='list-item-container'>
        <div className="image-side">
            <div onClick={onUploadClick} style={{ display: images.length === 0 ? 'flex' : 'none' }} className="ui placeholder segment">
                <i className="image outline icon"></i>
                <h2>Add Photos</h2>
                <i>(optional)</i>
                <input onChange={onFileChange} ref={uploadRef} type="file" accept='image/*' multiple style={{ display: 'none' }} />
            </div>

            <div style={{ display: images.length === 0 ? 'none' : 'flex' }} className="main-image">
                <img src={images?.[imgIndex] && URL.createObjectURL(images[imgIndex])} alt="" />
            </div>

            <div style={{ display: images.length === 0 ? 'none' : 'flex' }} className="img-items">
                {renderedImages}
                <div onClick={onUploadClick} className='add-image'>
                    <p>+</p>
                </div>
            </div>
        </div>
        <div className="form-side">
            <form className={`ui form item-form ${error ? 'warning' : ''} ${success ? 'success' : ''}`}>
                <div className="field">
                    <label>Title <span>*</span></label>
                    <div className="field">
                        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
                    </div>
                </div>

                <div className="field">
                    <label>Description</label>
                    <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2} placeholder='Description (optional)'></textarea>
                </div>

                <div className="two fields">
                    <div className="field">
                        <label>Category <span>*</span></label>
                        <select value={category} onChange={e => setCategory(e.target.value)} className="ui fluid dropdown">
                            <option value="electronics">electronics</option>
                            <option value="kitchen">kitchen</option>
                            <option value="furniture">furniture</option>
                            <option value="sports">sports</option>
                            <option value="study">study</option>
                            <option value="entertainment">entertainment</option>
                            <option value="tools">tools</option>
                            <option value="miscellaneous">miscellaneous</option>
                        </select>
                    </div>

                    <div className="field">
                        <label>Building</label>
                        <select value={building} onChange={(e) => setBuilding(e.target.value)} className="ui fluid dropdown">
                            <option value="ANY">Any</option>
                            <option value="E">E Block</option>
                            <option value="F">F Block</option>
                            <option value="G">G Block</option>
                        </select>
                    </div>
                </div>

                <div className="two fields">
                    <div className="field">
                        <label>Minimum target price per hour (GEL)</label>
                        <input value={minPrice} onChange={e => handlePriceChange(e, 1)} type="text" placeholder="Min. Price (optional)" />
                    </div>

                    <div className="field">
                        <label>Maximum target price per hour (GEL)</label>
                        <input value={maxPrice} onChange={e => handlePriceChange(e, 2)} type="text" placeholder="Max. Price (optional)" />
                    </div>
                </div>

                <div className="two fields">
                    <div className="field">
                        <label>Rent date</label>
                        <input value={rentDate} onChange={e => setRentDate(e.target.value)} type="date" />
                    </div>

                    <div className="field">
                        <label>Return date</label>
                        <input value={returnDate} onChange={e => setReturnDate(e.target.value)} type="date" />
                    </div>
                </div>

                <div className="ui warning message">
                    <div className="header">Could you check something!</div>
                    <ul className="list" style={{ flexDirection: 'column' }}>
                        <li>Title and category are required.</li>
                        <li>Check if dates and prices are valid.</li>
                        <li>Maximum size of the image must be 32MB.</li>
                    </ul>
                </div>

                <div className="ui success message">
                    <div className="header">Item requested successfully!</div>
                    <p>You can check your requested items on your profile page.</p>
                </div>

                <button onClick={submit} type='button' style={{ width: '100%' }} className={`ui button primary ${loading ? 'loading disabled' : ''}`}>Request an item</button>
                <div className="ui horizontal divider">Or</div>
                <button onClick={() => navigate('/list-item')} type='button' style={{ width: '100%' }} className={`ui button primary inverted`}>List item</button>
            </form>
        </div>
    </div>
}

export default RequestItem;