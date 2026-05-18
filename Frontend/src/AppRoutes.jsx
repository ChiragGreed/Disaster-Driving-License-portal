import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Login from './Features/Authentication/Pages/Login'
import Register from './Features/Authentication/Pages/Register'
import ServicesPage from './Features/SarthiServices/Pages/ServicesPage'

const AppRoutes = () => {


    return (
        <BrowserRouter>
            <audio src="/Sounds/Radio sound.mp3" autoPlay loop style={{ display: 'none' }} />
            <Routes>
                <Route path='/' element={<App />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/services' element={<ServicesPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes
