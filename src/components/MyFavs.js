import { Link } from "react-router-dom";
import { useFavsContext } from "../context/FavsContext"
import PostItem from "./PostItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBookmark, faWarning } from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "../context/AuthContext";

const MyFavs = () => {
    const {favPosts} = useFavsContext();
    const {currentUser} = useAuthContext();

    const favsToRender = favPosts?.map(item => {
        return (
            <PostItem key={item.dataID} seconds={item.data.date.seconds} imgPath={item.data.imgPath} likes={item.data.likedBy} id={item.dataID} photo={item.data.userPhotoURl} name={item.data.userName} body={item.data.postBody}/>
        )
    });

  return (
    <>
    <ul className='posts-container'>
        <h1 className='my-posts'>Saved Posts</h1>
        {currentUser === null ? <p className='error-login'><FontAwesomeIcon icon={faWarning} className='warning-icon'/>You must log in</p> : null}
      {!favPosts.length < 1 ? favsToRender : <p className='fav-msg'>Use the <FontAwesomeIcon icon={faBookmark}/> to save posts</p>}
    </ul>
    <Link to='/' className='back-home'><FontAwesomeIcon icon={faArrowLeft}/></Link>
    </>
  )
}

export default MyFavs
