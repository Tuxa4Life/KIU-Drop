import { useState } from 'react'
import MultipleSelect from '../Components/MultipleSelect'
import ItemCard from '../Components/ItemCard'
import { useItemsContext } from '../Hooks/useContext'
import '../Styles/explore.css'

const category_enums = [
    { key: 'electronics', value: 'Electronics' },
    { key: 'kitchen', value: 'Kitchen' },
    { key: 'furniture', value: 'Furniture' },
    { key: 'sports', value: 'Sports' },
    { key: 'study', value: 'Study' },
    { key: 'entertainment', value: 'Entertainment' },
    { key: 'tools', value: 'Tools' },
    { key: 'miscellaneous', value: 'Miscellaneous' },
]

const building_enums = [
    { key: 'E', value: 'E Block' },
    { key: 'F', value: 'F Block' },
    { key: 'G', value: 'G Block' },
]

const Explore = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [categories, setCategories] = useState([])
    const [buildings, setBuildings] = useState([])

    const { items } = useItemsContext()

    const renderedItems = items.filter((e) => {
        const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase());

        const buildingKeys = buildings.map((b) => b.key);
        const matchesBuilding = buildingKeys.length === 0 || buildingKeys.includes(e.building);

        const categoryKeys = categories.map((c) => c.key);
        const matchesCategory = categoryKeys.length === 0 || categoryKeys.includes(e.category);

        return matchesSearch && (matchesBuilding || e.building === 'ANY') && matchesCategory;
    }).map((e) => (
        <ItemCard key={e.id} id={e.id} images={e.urls} isAvailable={e.available} price={e.price} title={e.title} />
    ))

    return <div>
        <div className="filter-bar">
            <div className="ui icon input">
                <i className="search icon"></i>
                <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} type="text" placeholder="Search..." />
            </div>

            <MultipleSelect width={'400px'} placeholder='Category' selected={categories} setSelected={setCategories} values={category_enums} />
            <MultipleSelect width={'300px'} placeholder='Building' selected={buildings} setSelected={setBuildings} values={building_enums} />
        </div>

        <h1 className='explore-header'>Listed Items</h1>
        <div className="card-container">
            {renderedItems.length !== 0 ? renderedItems : <i>There are no items to show.</i>}
        </div>
    </div>
}

export default Explore