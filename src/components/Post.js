import { arrayUnion, deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router"
import { db, storage } from "../firebase_config";
import React, { useEffect, useState } from "react";
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
import { formatDate } from "../formatDate";
import { deleteObject, ref } from "firebase/storage";
import { ClipLoader } from "react-spinners";

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
    const [commentMsg, setCommentMsg] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    //RETRIEVE DATA FROM THE POST IN REAL TIME
      useEffect(() => {
        const unsubscribe = onSnapshot(
          docRef,
          (doc) => {
              setPost(doc.data())
              setIsLoading(false)
          }
        );
        return () => unsubscribe();
      }, [docRef]);

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
        setCommentMsg('Comment sent');
      } catch(err) {
        console.log(err);
      }
      setComment('');
    };

    //REMOVE POST
    const handlePostRemove = async () => {
      try {
        if(post?.imgPath) await deleteObject(ref(storage, post?.imgPath));
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

    useEffect(() => {
      setTimeout(() => setCommentMsg(''), 4000)
    }, [commentMsg]);

    const likesNum = () => {
      const likes = post?.likedBy?.length;
      if(likes === 0) return '';
      if(likes > 1000 && likes < 1000000) return `${likes / 1000}K`;
      if(likes > 1000000) return `${likes / 1000000}M`;
      return likes;
    };

    const formatedDate = formatDate(post?.date?.seconds);

    const renderPostContent = (content, hashtags) => {
      const contentParts = content.split(' ');
    
      const renderedContent = contentParts.map((part, index) => {
        if (hashtags.includes(part.replace(/#/g, ''))) {
          return (
            <Link to={`/search/${part.replace(/#/g, '')}`} style={{color:'rgb(250, 124, 231)'}} key={index}>
              {part}
            </Link>
          );
        }
        return <React.Fragment key={index}> {part} </React.Fragment>;
      });
    
      return <div>{renderedContent}</div>;
    };

  return (
    <>
    <main className='post-page'>
      <section className='post-item'>
        {isLoading ? <ClipLoader color='#fa7ce7'/> : <>
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
              <img src={post?.userPhotoURl} draggable={false} alt="user"/>
              <h6>{post?.userName} {post?.updated ? <span className='edited'>(edited)</span> : null}</h6>
              <Link to='/' className='back-home-post'><FontAwesomeIcon icon={faArrowLeft}/></Link>
              <p className='post-date'>{formatedDate}</p>
          </div>
          <p>{renderPostContent(post?.postBody, post?.hashtags)}</p>
          {post?.imgPath ? <img className='img-post' src={post?.imgPath} alt=''/> : null}
        </>}
      </section>
      <section className='new-comment-section'>
        { currentUser ? <img src={currentUser?.photoURL} draggable={false} alt="user"/> : <img src={user_placeholder} draggable={false}alt="default user"/>}
        <textarea value={comment} className='comment-box' placeholder="Write your comment" maxLength={100} onChange={e => setComment(e.target.value)}/>
        <button onClick={addComment} disabled={comment.length < 1}><FontAwesomeIcon icon={faPaperPlane}/></button>
      </section>
      <ul className='comments-section'>
        <div className='comments-count'>Comments: {post?.comments?.length}</div>
        {post?.comments?.slice().reverse().map(comment => {
          return <Comment key={comment.id} setMsg={setCommentMsg} body={comment.commentBody} postId={id} id={comment.id} user={comment.userName} userImg={comment.userIMG} by={comment.createdBy}/>
        })}
      </ul>
      {copyMsg && <div className='copy-msg'><FontAwesomeIcon icon={faCircleCheck}/> <p>Copied</p></div>}
      {commentMsg && <div className='copy-msg'><FontAwesomeIcon icon={faCircleCheck}/> <p>{commentMsg}</p></div>}
    </main>
    {showModal && <UpdatePost body={post?.postBody} closeModal={() => setShowModal(false)} id={id}/>}
    {showModal && <div className='overlay' onClick={() => setShowModal(false)}></div>}
    </>
  )
}

export default Post
