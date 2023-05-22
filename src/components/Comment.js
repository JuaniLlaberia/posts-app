import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthContext } from "../context/AuthContext";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { FieldValue, arrayRemove, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase_config";

const Comment = ({body, user, userImg, by, id, postId}) => {
  const { currentUser } = useAuthContext();

  const IsMyComment = currentUser?.uid === by;

  const postRef = doc(db, 'posts', postId);

  const handleCommentRemoval = async () => {
    try {
      console.log('Removing comment with ID:', id);
      console.log('Post reference:', postRef);
  
      await updateDoc(postRef, {
        'comments': arrayRemove(id)
     });
  
      console.log('Comment removed successfully');
    } catch (err) {
      console.error('Error removing comment:', err);
    }
  };

  return (
    <li className='comment'>
        {IsMyComment ? <button onClick={handleCommentRemoval}><FontAwesomeIcon icon={faTrashCan}/></button> : null}
        <img src={userImg} draggable={false}/>
        <div>
            <h6>{user}</h6>
            <p>{body}</p>
        </div>
    </li>
  )
};

export default Comment
