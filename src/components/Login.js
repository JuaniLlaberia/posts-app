import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthContext } from "../context/AuthContext"
import { faX } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faGoogle } from "@fortawesome/free-brands-svg-icons";
import '../assets/main.css'

const Login = ({setModalOpen}) => {
    const {loginGoogle, loginFacebook} = useAuthContext();

    const handleGoogleLogin = async () => {
        try {
            await loginGoogle();
        } catch(err) {
            console.log(err);
        }
        setModalOpen(false);
    };

    const handleFacebookLogin = async () => {
        try {
            await loginFacebook();
        } catch(err) {
            console.log(err);
        }
        setModalOpen(false);
    };

  return (
    <div className='login-modal'>
      <button className='x-btn' onClick={() => setModalOpen(false)}><FontAwesomeIcon icon={faX}/></button>
      <h3>Login</h3>
      <div className='login-btns'>
        <button className='google-btn' onClick={handleGoogleLogin}><FontAwesomeIcon icon={faGoogle}/> Google</button>
        <p>OR</p>
        <button className='facebook-btn' onClick={handleFacebookLogin}><FontAwesomeIcon icon={faFacebook}/> Facebook</button>
      </div>
    </div>
  )
}

export default Login
