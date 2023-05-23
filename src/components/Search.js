import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router"
import { db } from "../firebase_config";
import PostItem from "./PostItem";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { ClipLoader } from "react-spinners";

const Search = () => {
    const { tag } = useParams();
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onSnapshot(query(collection(db, 'posts'), where('hashtags', 'array-contains', tag)), snapshot =>{
                const tempArr = [];
                snapshot.forEach(item => {
                    tempArr.push({
                        data: item.data(),
                        dataID : item.id})
                })
                setPosts(tempArr);
                setIsLoading(false);
        })
        return () => unsubscribe
    }, [tag]);

    const postsToRender = posts?.map(item => {
        return (
            <PostItem key={item.dataID} seconds={item.data.date.seconds} imgPath={item.data.imgPath} likes={item.data.likedBy} id={item.dataID} photo={item.data.userPhotoURl} name={item.data.userName} body={item.data.postBody}/>
        )
    });

    return (
        <>
        <ul className='posts-container'>
            <h1 className='my-posts'>Posts #{tag}</h1>
            {isLoading ? <ClipLoader color='rgb(250, 124, 231)'/> : postsToRender}
            {(posts.length < 1 && !isLoading) && <h6 className='zero-posts'>0 posts with that #</h6>}
        </ul>
        <Link to='/' className='back-home'><FontAwesomeIcon icon={faArrowLeft}/></Link>
        </>
  )
}

export default Search
