import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthContext } from "../context/AuthContext";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase_config";

const Comment = ({body, user, userImg, by, id, postId, setMsg}) => {
  const { currentUser } = useAuthContext();

  const IsMyComment = currentUser?.uid === by;

  const postRef = doc(db, 'posts', postId);

  const handleCommentRemoval = async () => {
    try {
      const postDoc = await getDoc(postRef);

      if (postDoc.exists()) {
        const comments = postDoc.data().comments || [];

        const updatedComments = comments.filter(comment => comment.id !== id);

        await updateDoc(postRef, {
          comments: updatedComments
        });

        setMsg('Comment removed');
      } else {
        console.log('Not found');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <li className='comment'>
        {IsMyComment ? <button onClick={handleCommentRemoval}><FontAwesomeIcon icon={faTrashCan}/></button> : null}
        <img src={userImg} draggable={false} alt='user'/>
        <div>
            <h6>{user}</h6>
            <p>{body}</p>
        </div>
    </li>
  )
};

export default Comment
