import { arrayUnion, deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router"
import { db } from "../firebase_config";
import { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPenToSquare, faBookmark, faHeart, faShareFromSquare, faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import user_placeholder from '../assets/user_placeholder.png'
import { faBookmark as bookmarkFilled, faArrowLeft, faPaperPlane, faHeart as fullHeart } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Comment from "./Comment";
import UpdatePost from "./UpdatePost";
import {v4 as uuidv4} from 'uuid';
import { useFavsContext } from "../context/FavsContext";
import { useLikedContext } from "../context/LikedContext";

const Post = () => {
    const { currentUser } = useAuthContext();
    const [post, setPost] = useState({})
    const [comment, setComment] = useState('');
    const navigate = useNavigate();
    const {id} = useParams();
    const docRef = doc(db, 'posts', id);
    const [showModal, setShowModal] = useState(false);
    const { addToFavs, favPosts, removeFromFavs } = useFavsContext();
    const { likePost, unlikePost } = useLikedContext();
    const [copyMsg, setCopyMsg] = useState(false);

    //RETRIEVE DATA FROM THE POST IN REAL TIME
      useEffect(() => {
        const unsubscribe = onSnapshot(
          docRef,
          (doc) => {
              setPost(doc.data())
          }
        );
        return () => unsubscribe();
      }, []);

    //ADD COMMENTS TO THE POST
    const addComment = async () => {
      if(comment.length < 1) return;

      try {
        await updateDoc(docRef, {
          'comments': arrayUnion({
            createdBy: currentUser?.uid,
            userIMG: currentUser?.photoURL,
            userName: currentUser?.displayName,
            commentBody: comment,
            id: uuidv4(),
          })
        });
      } catch(err) {
        console.log(err);
      }
      setComment('');
    }

    //REMOVE POST
    const handlePostRemove = async () => {
      try {
        await deleteDoc(docRef);
        navigate('/');
      } catch(err) {
        console.log(err);
      }
    };

    //CHECK IF IT IS MY POST
    const isMyPost = currentUser?.uid === post?.createdBy;

    //CHECK IF POST WAS SAVED
    const postToUnFav = favPosts?.some(post => post.data.savedBy.includes(currentUser?.uid) && post.dataID === id);

    //CHECK IF YOU LIKED THE POST
    const likedPost = post?.likedBy?.includes(currentUser?.uid);

    const copyUrl = () => {
      const url = window.location.href;
      navigator.clipboard.writeText(url)
      setCopyMsg(true);
    };

    useEffect(() => {
      setTimeout(() => setCopyMsg(false), 4000)
    }, [copyMsg]);

    const likesNum = () => {
      const likes = post?.likedBy?.length;
      if(likes === 0) return '';
      if(likes > 1000 && likes < 1000000) return `${likes / 1000}K`
      if(likes > 1000000) return `${likes / 1000000}M`
      return likes
    }

  return (
    <>
    <main className='post-page'>
      <section className='post-item'>
        <div className='edit-btns'>
          {likedPost ? <button style={{color:'#fa4b3e', display:'flex', justifyContent:'center', alignItems:'center', gap:'5px'}} onClick={() => unlikePost(id)}>{likesNum()} <FontAwesomeIcon icon={fullHeart}/></button> : <button style={{display:'flex', justifyContent:'center', alignItems:'center', gap:'5px'}} onClick={() => likePost(id)}>{likesNum()} <FontAwesomeIcon icon={faHeart}/></button>}
          <button onClick={copyUrl}><FontAwesomeIcon icon={faShareFromSquare}/></button>
          {postToUnFav ? <button onClick={() => removeFromFavs(id)}><FontAwesomeIcon icon={bookmarkFilled}/></button> : <button onClick={() => addToFavs(id)}><FontAwesomeIcon icon={faBookmark}/></button>}
          {isMyPost && <>
            <button><FontAwesomeIcon icon={faPenToSquare} onClick={() => setShowModal(true)}/></button>
            <button><FontAwesomeIcon icon={faTrashCan} onClick={handlePostRemove}/></button>
          </>}
        </div>
        <div className='post-user-top'>
            <img src={post?.userPhotoURl} draggable={false} alt="profile picture"/>
            <h6>{post?.userName} {post?.updated ? <span className='edited'>(edited)</span> : null}</h6>
        </div>
        <p>{post?.postBody}</p>
      </section>
      <section className='new-comment-section'>
        { currentUser ? <img src={currentUser?.photoURL} draggable={false} alt="profile picture"/> : <img src={user_placeholder} draggable={false}alt="default profile picture"/>}
        <textarea value={comment} className='comment-box' placeholder="Write your comment" maxLength={100} onChange={e => setComment(e.target.value)}/>
        <button onClick={addComment} disabled={comment.length < 1}><FontAwesomeIcon icon={faPaperPlane}/></button>
      </section>
      <ul className='comments-section'>
        <div className='comments-count'>Comments: {post?.comments?.length}</div>
        {post?.comments?.slice().reverse().map(comment => {
          return <Comment key={comment.commentBody} body={comment.commentBody} postId={id} id={comment.id} user={comment.userName} userImg={comment.userIMG} by={comment.createdBy}/>
        })}
      </ul>
      <Link to='/' className='back-home'><FontAwesomeIcon icon={faArrowLeft}/></Link>
      {copyMsg && <div className='copy-msg'><FontAwesomeIcon icon={faCircleCheck}/> <p>Copied</p></div>}
    </main>
    {showModal && <UpdatePost body={post?.postBody} closeModal={() => setShowModal(false)} id={id}/>}
    {showModal && <div className='overlay' onClick={() => setShowModal(false)}></div>}
    </>
  )
}

export default Post
