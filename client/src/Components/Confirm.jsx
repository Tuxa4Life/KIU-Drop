import { useErrorContext } from "../Hooks/useContext"

const Confirm = () => {
    const { title, message, confirmFunction, closeConfirm } = useErrorContext()

    return <div className="ui cards" style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '7' }}>
        <div className="card">
            <div className="content">
                {title && <div className="header">{title}</div>}
                {message && <div className="description">{message}</div>}
            </div>
            <div className="extra content" style={{ display: 'flex', justifyContent: 'right' }}>
                <div className="ui buttons">
                    <div onClick={() => { confirmFunction(); closeConfirm()}} className="ui button primary">Ok</div>
                    <div onClick={closeConfirm} className="ui button floated right">Close</div>
                </div>
            </div>
        </div>
    </div>
}

export default Confirm