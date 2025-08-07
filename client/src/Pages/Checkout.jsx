import { useEffect } from "react";
import { useParams } from "react-router-dom";

const Checkout = () => {
    const { id } = useParams()

    return <div className="item-page-container">
        <div style={{ position: 'fixed', top: '7dvh', left: '0', width: '100%', height: '93dvh', zIndex: '4', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <i style={{ fontSize: '120px' }} className="window close outline icon"></i>
            <h1 style={{ margin: '0' }}>Payments in this region are unavailable.</h1>
            <button onClick={() => alert('CHATZE GADADI -> id: ' + id)} className="ui button big secondary inverted" style={{ marginTop: '20px' }}>Message item owner instead</button>
        </div>
    </div>
}

export default Checkout;