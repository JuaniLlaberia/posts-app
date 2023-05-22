import { useEffect, useState } from "react"
import CreatePost from "./CreatePost"
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from "../firebase_config";
import PostItem from "./PostItem";

const PostContainer = () => {
  const [posts, setPosts] = useState([]);
  const collectionPostsRef = collection(db, 'posts');

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collectionPostsRef, orderBy('date', 'desc')),
      (snapshot) => {
        const res = [];
        snapshot.forEach((doc) => {
          res.push({
            data: doc.data(),
           id: doc.id,
          });
        });
        setPosts(res);
      }
    );
    return () => unsubscribe();
  }, []);

  const postsRender = posts?.map(item => {
    return (
      <PostItem key={item.id} id={item.id} photo={item.data.userPhotoURl} seconds={item?.data?.date?.seconds} name={item.data.userName} body={item.data.postBody}/>
    )
  })

  return (
    <ul className='posts-container'>
      <CreatePost />
      {postsRender}
    </ul>
  )
}

export default PostContainer
