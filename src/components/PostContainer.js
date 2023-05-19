import { useEffect, useState } from "react"
import CreatePost from "./CreatePost"
import { collection, onSnapshot, query } from 'firebase/firestore'
import { db } from "../firebase_config";
import { Link } from "react-router-dom";

const PostContainer = () => {
  const [posts, setPosts] = useState([]);
  const collectionPostsRef = collection(db, 'posts');

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collectionPostsRef),
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
      <Link key={item.id} to={`/post/${item.id}`} className='post-item'>
        <div className='post-head'>
          <img src={item.data.userPhotoURl} draggable={false} alt="profile picture"/>
          <h6>{item.data.userName}</h6>
        </div>
        <p>{item.data.postBody}</p>
    </Link>
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
