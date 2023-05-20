import { useState } from "react";
import { useAuthContext } from "../context/AuthContext"
import Login from "./Login";
import '../assets/main.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faSun } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { useThemeContext } from "../context/ThemeContext";

const Sidebar = () => {
    const { logout, currentUser } = useAuthContext();
    const [openModal, setOpenModal] = useState(false);
    const navigate = useNavigate();
    const {theme, toggleTheme} = useThemeContext();

    const logoutAcc = () => {
        logout();
        navigate(0);
    }

  return (
    <>
      <nav>
        <Link to='/' className='logo'>PostIt</Link>
        <div className='sidebar-btns'>
            <Link to='/saved'><FontAwesomeIcon size="2x" icon={faBookmark}/></Link>
            <button className='theme-icon' onClick={() => toggleTheme(!theme)}><FontAwesomeIcon icon={faSun} size="3x"/></button>
            {currentUser ? <Link to='/my-posts' ><img src={currentUser?.photoURL} className='user-img'/></Link> : <button className='log-btn' onClick={() => setOpenModal(true)}>Login</button>}
            {currentUser ? <button className='log-btn' onClick={logoutAcc}>Log Out</button> : null}
        </div>
      </nav>
      {openModal && <Login setModalOpen={setOpenModal}/>}
      {openModal && <div className='overlay' onClick={() => setOpenModal(false)}></div>}
    </>
  )
}

export default Sidebar
