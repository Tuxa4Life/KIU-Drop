import { useState } from "react";
import { useErrorContext } from "../Hooks/useContext";

const Error = () => {
    const { title, message, details, closeError } = useErrorContext()
    const [detailsOpen, setDetailsOpen] = useState(false)

    return <div className="ui cards" style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '7' }}>
        <div className="card">
            <div className="content">
                {title && <div className="header">{title}</div>}
                {message && <div className="description">{message}</div>}
                {detailsOpen && <><div className="ui divider"></div><div className="meta">{details}</div></>}
                {details && <p style={{marginTop: '5px', textDecoration: 'underline', cursor: 'pointer'}} onClick={() => setDetailsOpen(!detailsOpen)}>{detailsOpen ? 'Hide' : 'Show'} details</p>}
            </div>
            <div className="extra content" style={{ display: 'flex', justifyContent: 'right' }}>
                <div className="ui buttons">
                    <div onClick={closeError} className="ui button floated right">Close</div>
                </div>
            </div>
        </div>
    </div>
}

export default Error;