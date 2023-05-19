import { arrayUnion, deleteDoc, doc, onSnapshot, query, updateDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router"
import { db } from "../firebase_config";
import { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPenToSquare, faBookmark } from "@fortawesome/free-regular-svg-icons";
import user_placeholder from '../assets/user_placeholder.png'
import { faBookmark as bookmarkFilled, faHouse } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Comment from "./Comment";
import UpdatePost from "./UpdatePost";
import {v4 as uuidv4} from 'uuid';
import { useFavsContext } from "../context/FavsContext";

const Post = () => {
    const { currentUser } = useAuthContext();
    const [post, setPost] = useState({})
    const [comment, setComment] = useState('');
    const navigate = useNavigate();
    const {id} = useParams();
    const docRef = doc(db, 'posts', id);
    const [showModal, setShowModal] = useState(false);
    const { addToFavs, favPosts, removeFromFavs } = useFavsContext();

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
    //Find current post in the favs collection
    const postToUnFav = favPosts?.find(post => post.data.data.postId === id);

  return (
    <>
    <main className='post-page'>
      <section className='post-item'>
        <div className='edit-btns'>
          {postToUnFav ? <button onClick={() => removeFromFavs(postToUnFav.dataID)}><FontAwesomeIcon icon={bookmarkFilled}/></button> : <button onClick={() => addToFavs(post?.userName, post?.createdBy, post?.postBody, post?.userPhotoURl, post?.comments, post?.updated, id)}><FontAwesomeIcon icon={faBookmark}/></button>}
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
        <button onClick={addComment}>Comment</button>
      </section>
      <ul className='comments-section'>
        <div className='comments-count'>Comments: {post?.comments?.length}</div>
        {post?.comments?.slice().reverse().map(comment => {
          return <Comment key={comment.commentBody} body={comment.commentBody} postId={id} id={comment.id} user={comment.userName} userImg={comment.userIMG} by={comment.createdBy}/>
        })}
      </ul>
      <Link to='/' style={{position: 'absolute', left:'30%', top:'5%'}}><FontAwesomeIcon icon={faHouse}/></Link>
    </main>
    {showModal && <UpdatePost body={post?.postBody} closeModal={() => setShowModal(false)} id={id}/>}
    {showModal && <div className='overlay'></div>}
    </>
  )
}

export default Post
