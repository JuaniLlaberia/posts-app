import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react"
import { db } from "../firebase_config";
import { useAuthContext } from "../context/AuthContext";
import PostItem from "./PostItem";
import '../assets/main.css';

const MyPosts = () => {
    const [myPosts, setMyPosts] = useState([]);
    const { currentUser } = useAuthContext();

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
            })
            setMyPosts(tempArr);
        }
        getMyPosts()
    }, [currentUser?.uid]);

    const postsRender = myPosts?.map(item => {
        return (
          <PostItem key={item.dataID} id={item.dataID} photo={item.data.userPhotoURl} name={item.data.userName} body={item.data.postBody}/>
        )
      })

  return (
    <ul className='posts-container'>
        <h1 className='my-posts'>My Posts</h1>
      {postsRender}
    </ul>
  )
}

export default MyPosts
