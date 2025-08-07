import { useState } from 'react'
import MultipleSelect from '../Components/MultipleSelect'
import { useItemsContext } from '../Hooks/useContext'
import '../Styles/explore.css'
import RequestCard from '../Components/RequestCard'


const building_enums = [
    { key: 'E', value: 'E Block' },
    { key: 'F', value: 'F Block' },
    { key: 'G', value: 'G Block' },
]

const Requests = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [buildings, setBuildings] = useState([])

    const { requests } = useItemsContext()

    const renderedItems = requests.filter((e) => {
        const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase());

        const buildingKeys = buildings.map((b) => b.key);
        const matchesBuilding = buildingKeys.length === 0 || buildingKeys.includes(e.building);

        return matchesSearch && (matchesBuilding || e.building === 'ANY');
    }).map((e) => {
        return <RequestCard key={e.id} id={e.id} images={e.urls || []} title={e.title} start_date={e.start_date} end_date={e.end_date} start_price={e.start_price} end_price={e.end_price} />
    })

    return <div>
        <div className="filter-bar">
            <div className="ui icon input">
                <i className="search icon"></i>
                <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} type="text" placeholder="Search..." />
            </div>

            <MultipleSelect width={'300px'} placeholder='Building' selected={buildings} setSelected={setBuildings} values={building_enums} />
        </div>

        <h1 className='explore-header'>Requested Items</h1>
        <div className="card-container">
            { renderedItems.length !== 0 ? renderedItems : <i>No requests to show.</i> }
        </div>
    </div>
}

export default Requests