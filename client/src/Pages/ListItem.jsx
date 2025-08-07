import { useRef, useState } from 'react';
import '../Styles/listitem.css'
import { useApiContext, useAuthContext, useErrorContext, useItemsContext } from '../Hooks/useContext';
import { useNavigate } from 'react-router-dom';

const ListItem = () => {
    const [images, setImages] = useState([])
    const [imgIndex, setImgIndex] = useState(0)
    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')
    const [category, setCategory] = useState('miscellaneous')
    const [price, setPrice] = useState('')
    const [building, setBuilding] = useState('ANY')

    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const uploadRef = useRef(null)
    const { uploadMultiple, uploadColumns } = useApiContext()
    const { fetchItems } = useItemsContext()
    const { loggedIn } = useAuthContext()
    const { openError } = useErrorContext()

    const { user } = useAuthContext()
    const navigate = useNavigate()

    const onUploadClick = () => {
        uploadRef.current.click()
    }

    const onFileChange = (e) => {
        const files = [...images, ...e.target.files]
        setImages(files)
    }

    const renderedImages = images.map((file, i) => {
        const url = URL.createObjectURL(file)
        return <img onClick={() => setImgIndex(i)} className={`img-list-item ${i === imgIndex ? 'selected-img' : ''}`} key={i} src={url} alt="File URL Error" />
    })

    const handlePriceChange = (e) => {
        const value = e.target.value;

        if (/^\d*\.?\d{0,2}$/.test(value)) {
            setPrice(value);
        }
    }

    const submit = () => {
        setSuccess(false)
        if (!loggedIn) {
            openError('Cannot upload item!', 'You need to login first to proceed.')
            return
        }

        if (title === '' || images.length === 0) {
            setError(true)
            return
        }

        setLoading(true)
        uploadMultiple(images).then((data) => {
            const output = {
                owner_id: user.id,
                title,
                description: desc,
                price: parseFloat(price) || 0,
                urls: data,
                available: true,
                category,
                building
            }

            uploadColumns('items', [output]).then((data) => {
                if (data === -1) {
                    setError(true)
                    setLoading(false)
                } else {
                    fetchItems()

                    setSuccess(true)
                    setError(false)
                    setLoading(false)

                    setImages([])
                    setImgIndex(0)
                    setTitle('')
                    setDesc('')
                    setPrice('')
                    setCategory('miscellaneous')
                    setBuilding('ANY')
                }
            })
        })
    }

    return <div className='list-item-container'>
        <div className="image-side">
            <div style={{ display: images.length === 0 ? 'flex' : 'none' }} onClick={onUploadClick} className="ui placeholder segment">
                <i className="image outline icon"></i>
                <h2>Add Photos</h2>
                <i>At least <strong>one</strong> photo is required.</i>
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
                    <textarea placeholder='Description (optional)' value={desc} onChange={e => setDesc(e.target.value)}></textarea>
                </div>

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

                <div className="two fields">
                    <div className="field">
                        <label>Building</label>
                        <select value={building} onChange={(e) => setBuilding(e.target.value)} className="ui fluid dropdown">
                            <option value="ANY">Any</option>
                            <option value="E">E Block</option>
                            <option value="F">F Block</option>
                            <option value="G">G Block</option>
                        </select>
                    </div>
                    <div className="field">
                        <label>Price per hour (GEL)</label>
                        <input onChange={handlePriceChange} value={price} type="text" placeholder="Price (Optional)" />
                    </div>
                </div>

                <div className="ui warning message">
                    <div className="header">Could you check something!</div>
                    <ul className="list" style={{ flexDirection: 'column' }}>
                        <li>Title and category are required.</li>
                        <li>There must be at least one image uploaded.</li>
                        <li>Maximum size of the image must be 32MB.</li>
                    </ul>
                </div>

                <div className="ui success message">
                    <div className="header">Item added successfully!</div>
                    <p>You can check your listed items on your profile page.</p>
                </div>

                <button onClick={submit} type='button' style={{ width: '100%' }} className={`ui button primary ${loading ? 'loading disabled' : ''}`}>List item</button>
                <div className="ui horizontal divider">Or</div>
                <button onClick={() => navigate('/request-item')} type='button' style={{ width: '100%' }} className={`ui button primary inverted`}>Request an item</button>
            </form>
        </div>
    </div>
}

export default ListItem;