import { useState } from "react";
import { useAuthContext } from "../context/AuthContext"
import Login from "./Login";
import '../assets/main.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBars, faSun, faHouse, faMoon } from "@fortawesome/free-solid-svg-icons";
import { faBookmark, faStar } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { useThemeContext } from "../context/ThemeContext";

const Sidebar = () => {
    const { logout, currentUser } = useAuthContext();
    const [openModal, setOpenModal] = useState(false);
    const navigate = useNavigate();
    const {theme, toggleTheme} = useThemeContext();
    const [isActive, setIsActive] = useState(false);
    const logoutAcc = () => {
        logout();
        navigate(0);
    };

  return (
    <>
      <nav className={isActive ? 'active' : ''} >
        <div className="sidebar-btns not-center">
          <Link to='/' className='logo' onClick={() => setIsActive(false)}>PostIt</Link>
          <Link to='/' onClick={() => setIsActive(false)}><FontAwesomeIcon icon={faHouse}/> Home</Link>
          <Link to='/saved' onClick={() => setIsActive(false)}><FontAwesomeIcon icon={faBookmark}/> Saved</Link>
          <Link to='/trending' onClick={() => setIsActive(false)}><FontAwesomeIcon icon={faStar}/> Popular</Link>
        </div>
            <button className='toggle-nav' onClick={() => setIsActive(!isActive)}><FontAwesomeIcon size="2x" icon={isActive ? faArrowLeft : faBars}/></button>
        <div className='sidebar-btns' onClick={() => setIsActive(false)}>
            <button className='theme-icon' onClick={() => toggleTheme(!theme)}><FontAwesomeIcon icon={theme === 'light' ? faSun : faMoon} size="3x"/></button>
            {currentUser ? <Link to='/my-posts' ><img src={currentUser?.photoURL} className='user-img' alt='user'/></Link> : <button className='log-btn' onClick={() => setOpenModal(true)}>Login</button>}
            {currentUser ? <button className='log-btn' onClick={logoutAcc}>Log Out</button> : null}
        </div>
      </nav>
      {openModal && <Login setModalOpen={setOpenModal}/>}
      {openModal && <div className='overlay' onClick={() => setOpenModal(false)}></div>}
      {isActive && <div className='overlay' onClick={() => setIsActive(false)}></div>}
    </>
  )
}

export default Sidebar
