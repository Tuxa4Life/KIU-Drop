import { useEffect, useRef, useState } from "react";

const MultipleSelect = ({ selected, values, setSelected, placeholder, width }) => {
    const [open, setOpen] = useState(false)

    const selectRef = useRef();

    useEffect(() => {
        const closeSelect = (e) => {
            if (selectRef.current && !selectRef.current.contains(e.target)) {
                setOpen(false)
            }
        }

        document.addEventListener('mousedown', closeSelect)
        return () => document.removeEventListener('mousedown', closeSelect)
    }, [])

    const renderedOptions = values.map((e, i) => {
        const add = () => {
            if (!selected.find(s => s.key === e.key)) {
                setSelected([...selected, e])
            }
        }

        return <div onClick={add} key={i} className="option-item">{e.value}</div>
    })

    const renderedSelected = selected.map((e, i) => {
        const remove = (ev) => {
            ev.stopPropagation()
            const tmp = selected.filter(s => s.key !== e.key)
            setSelected([...tmp])
        }

        return <div key={e.key + i} className="list-item">{e.value} <i onClick={remove} className="times icon"></i></div>
    })

    return <div style={{width}} ref={selectRef} className="multiple-select">
        <div onClick={() => setOpen(!open)} className="select-list">
            { selected.length === 0 ? <p style={{margin: '0', color: 'rgba(0, 0, 0, 0.35)'}}>{placeholder}</p> : renderedSelected }

            <i className={`chevron ${open ? 'up' : 'down'} icon`}></i>
        </div>

        { open && <div className="options-list">{ renderedOptions }</div> }
    </div>
}

export default MultipleSelect;