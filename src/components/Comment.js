import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthContext } from "../context/AuthContext";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

const Comment = ({body, user, userImg, by}) => {
  const { currentUser } = useAuthContext();

  const IsMyComment = currentUser?.uid === by;

  return (
    <li className='comment'>
        {IsMyComment ? <button><FontAwesomeIcon icon={faTrashCan}/></button> : null}
        <img src={userImg} draggable={false}/>
        <div>
            <h6>{user}</h6>
            <p>{body}</p>
        </div>
    </li>
  )
};

export default Comment
