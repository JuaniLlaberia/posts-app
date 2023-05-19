import { useState } from "react";
import { useAuthContext } from "../context/AuthContext"
import Login from "./Login";
import '../assets/main.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

const Sidebar = () => {
    const { logout, currentUser } = useAuthContext();
    const [openModal, setOpenModal] = useState(false);
    const navigate = useNavigate();

    const logoutAcc = () => {
        logout();
        navigate(0);
    }

  return (
    <>
      <nav>
        <h1>LOGO</h1>
        <div className='sidebar-btns'>
            <Link to='/my-posts'>My Posts</Link>
            <button className='theme-icon'><FontAwesomeIcon icon={faSun} size="3x"/></button>
            {currentUser ? <img src={currentUser?.photoURL} className='user-img'/> : <button className='log-btn' onClick={() => setOpenModal(true)}>Login</button>}
            {currentUser ? <button className='log-btn' onClick={logoutAcc}>Log Out</button> : null}
        </div>
      </nav>
      {openModal && <Login setModalOpen={setOpenModal}/>}
      {openModal && <div className='overlay' onClick={() => setOpenModal(false)}></div>}
    </>
  )
}

export default Sidebar
