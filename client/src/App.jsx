import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Auth from './Pages/Auth';
import Login from './Pages/Login';
import Navbar from './Components/Navbar';
import ListItem from './Pages/ListItem';
import RequestItem from './Pages/RequestItem';
import Explore from './Pages/Explore';
import Requests from './Pages/Requests';
import ItemPage from './Pages/ItemPage';
import Error from './Components/Error';
import { useApiContext, useErrorContext } from './Hooks/useContext';
import './Styles/app.css'
import Profile from './Pages/Profile';
import Confirm from './Components/Confirm';
import ProviderStep from './Pages/ProviderStep';
import ConfirmMail from './Pages/ConfirmMail';
import Checkout from './Pages/Checkout';

const App = () => {
    const { pathname } = useLocation()
    const { errorOpen, confirmOpen } = useErrorContext()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])

    return <div>
        <Navbar />

        <div style={{ marginTop: '7dvh', width: '100%' }}></div>
        <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/auth' element={<Auth />} />
            <Route path='/auth/provider' element={<ProviderStep />} />
            <Route path='/auth/confirm-mail' element={<ConfirmMail />} />

            <Route path='/' element={<div>HOMEPAGE <br /> map of kiu <br /> explore stuff with arrow to {'page -->'} <br /> some requests also with arrows <br />and option to list an item <br /><i>if not registered link to profile?? idk idk </i></div>} />
            <Route path='/explore' element={<Explore />} />
            <Route path='/requests' element={<Requests />} />
            <Route path='/list-item' element={<ListItem />} />
            <Route path='/request-item' element={<RequestItem />} />

            <Route path='/profile' element={<Profile />} />

            <Route path='/item/:id' element={<ItemPage />} />
            <Route path='/request/:id' element={<div>REQUSTED ITEM PAGE</div>} />

            <Route path='/renting/:id' element={<Checkout />} />
        </Routes>

        {errorOpen && <Error />}
        {confirmOpen && <Confirm />}
    </div>
}

export default App;