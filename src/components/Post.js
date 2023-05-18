import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams } from "react-router"
import { db } from "../firebase_config";
import { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import user_placeholder from '../assets/user_placeholder.png'
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Post = () => {
    const { currentUser } = useAuthContext();
    const [post, setPost] = useState({})
    const [comment, setComment] = useState('');

    const {id} = useParams();
    const docRef = doc(db, 'posts', id);

    //RETRIEVE DATA FROM THE POST
    useEffect(() => {
        const getData = async () => {
            try {
                const data = await getDoc(docRef);
                setPost(data.data());
            } catch(err) {
                console.log(err);
            }
        }
        getData()
    }, [id]);

    //ADD COMMENTS TO THE POST
    const addComment = async () => {
      try {
        await updateDoc(docRef, {
          'comments': arrayUnion({
            createdBy: currentUser?.uid,
            userIMG: currentUser?.photoURL,
            userName: currentUser?.displayName,
            commentBody: comment
          })
        });
      } catch(err) {
        console.log(err);
      }
      setComment('');
    }

    const isMyPost = currentUser?.uid === post.createdBy;
    console.log(post);

  return (
    <main className='post-page'>
      <section className='post-item'>
        {isMyPost && <div className='edit-btns'>
            <button><FontAwesomeIcon icon={faPenToSquare}/></button>
            <button><FontAwesomeIcon icon={faTrashCan}/></button>
        </div>}
        <div className='post-user-top'>
            <img src={post.userPhotoURl} draggable={false}/>
            <h6>{post.userName}</h6>
        </div>
        <p>{post.postBody}</p>
      </section>
      <section className='new-comment-section'>
        { currentUser ? <img src={currentUser?.photoURL}/> : <img src={user_placeholder}/>}
        <textarea value={comment} className='comment-box' placeholder="Write your comment" maxLength={100} onChange={e => setComment(e.target.value)}/>
        <button onClick={addComment}>Comment</button>
      </section>
      <ul className='comments-section'>
        {post?.comments?.map(comment => {
          return <li key={comment.commentBody}>{comment.commentBody}</li>
        })}
      </ul>
      <Link to='/' style={{position: 'absolute', left:'30%', top:'5%'}}><FontAwesomeIcon icon={faHouse}/></Link>
    </main>
  )
}

export default Post
