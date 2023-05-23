import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react"
import { db } from "../firebase_config";
import { useAuthContext } from "../context/AuthContext";
import PostItem from "./PostItem";
import '../assets/main.css';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faWarning } from "@fortawesome/free-solid-svg-icons";
import { ClipLoader } from "react-spinners";

const MyPosts = () => {
    const [myPosts, setMyPosts] = useState([]);
    const { currentUser } = useAuthContext();
    const [isLoading, setIsLoading] = useState(true);

    const collectionRef = collection(db, 'posts');

    //Retrieve all the post that match with the current auth user
    useEffect(() => {
        if(currentUser?.uid === undefined) return;
        const getMyPosts = async () => {
            const q = query(collectionRef, where('createdBy', '==', currentUser?.uid))
            const data = await getDocs(q);
            const tempArr = [];
            data.forEach(item => {
                tempArr.push({
                    data: item.data(),
                    dataID: item.id
                })
            });
            setMyPosts(tempArr);
            setIsLoading(false);
        }
        getMyPosts();
    }, [currentUser?.uid, collectionRef]);

    const postsRender = myPosts?.map(item => {
        return (
          <PostItem key={item.dataID} seconds={item?.data?.date?.seconds} imgPath={item?.data.imgPath} likes={item?.data?.likedBy} id={item.dataID} photo={item.data.userPhotoURl} name={item.data.userName} body={item.data.postBody}/>
        )
      })

  return (
    <>
      <ul className='posts-container'>
          <h1 className='my-posts'>My Profile</h1>
          {currentUser === null ? <p className='error-login'><FontAwesomeIcon icon={faWarning} className='warning-icon'/>You must log in</p> : null}
          <div className='profile'>
            <img src={currentUser?.photoURL} alt='user'/>
            <h6>{currentUser?.displayName}</h6>
          </div>
          {currentUser && <h6 className='my-posts' style={{fontSize: '1rem'}}>My posts</h6>}
          {isLoading && <ClipLoader color="#fa7ce7"/>}
          {!isLoading && postsRender}
      </ul>
      <Link to='/' className='back-home'><FontAwesomeIcon icon={faArrowLeft}/></Link>
    </>
  )
}

export default MyPosts
