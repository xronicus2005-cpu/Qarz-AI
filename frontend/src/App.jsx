import { Route, Routes,} from 'react-router-dom'
import './App.css'
import { ToastContainer } from "react-toastify";

//here is pages
import Home from "./pages/Home"
import Add from './components/Add'
import RegisterOrLoginPage from './pages/RegisterOrLogingPage'
import "react-toastify/dist/ReactToastify.css";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<RegisterOrLoginPage />} />
        <Route path="/add" element={<Add />} />
        


      
      
      
      </Routes>

        <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </>
  )
}

export default App
