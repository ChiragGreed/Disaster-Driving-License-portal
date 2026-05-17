import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Login from './Features/Login/Pages/Login'
import ServicesPage from './Features/SarthiServices/Pages/ServicesPage'

const AppRoutes = () => {


    return (
        <BrowserRouter>
            <Routes>

                <Route path='/' element={<App />} />
                <Route path='/login' element={<Login />} />
                <Route path='/services' element={<ServicesPage />} />

            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes
