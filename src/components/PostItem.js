import { Link } from 'react-router-dom'
import { formatDate } from '../formatDate'
import { useAuthContext } from '../context/AuthContext';
import { useLikedContext } from '../context/LikedContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faBookmark} from "@fortawesome/free-regular-svg-icons";
import { faHeart as fullHeart, faBookmark as fullBookmark } from "@fortawesome/free-solid-svg-icons";
import { useFavsContext } from '../context/FavsContext';

const PostItem = ({id, photo, name, body, seconds, likes, imgPath}) => {
  const date = formatDate(seconds);
  const { currentUser } = useAuthContext();
  const { likePost, unlikePost } = useLikedContext();
  const { favPosts, removeFromFavs, addToFavs } = useFavsContext();

  const isPostLikedByUser = likes?.includes(currentUser?.uid);
  const isPostFav = favPosts?.some(post => post.data.savedBy.includes(currentUser?.uid) && post.dataID === id);

  

  return (
    <div className='post-item'>
      <Link key={id} to={`/post/${id}`} >
          <p className='date-post' style={{position:'absolute', right:'5%', display:'flex', justifyContent:'flex-end', width:'2.5vw'}}>{date}</p>
          <div className='post-head'>
            <img src={photo} draggable={false} alt="profile"/>
            <h6>{name}</h6>
          </div>
          <p>{body}</p>
          {imgPath ? <img className='img-post' src={imgPath} /> : null}
      </Link>
      <div className='post-item-buttons'>
        {isPostLikedByUser ? <button>{likes?.length ? <span className='likes-num-post'>{likes?.length}</span> : ''} <FontAwesomeIcon  className='liked' size='2x' icon={fullHeart} onClick={() => unlikePost(id)}/></button> : <button onClick={() => likePost(id)}>{likes?.length ? <span className='likes-num-post'>{likes?.length}</span> : ''} <FontAwesomeIcon size='2x' icon={faHeart}/></button>}
        {isPostFav ? <button><FontAwesomeIcon size='2x' icon={fullBookmark} onClick={() => removeFromFavs(id)}/></button> : <button onClick={() => addToFavs(id)}><FontAwesomeIcon size='2x' icon={faBookmark}/></button>}
      </div>
    </div>
  )
}

export default PostItem
