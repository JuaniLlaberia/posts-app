import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../firebase_config'
import PostItem from './PostItem'

const TrendingPage = () => {
    const [trendingPosts, setTrendingPosts] = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(query(collection(db, 'posts'), orderBy('likesNum', 'desc'), limit(25)), snapshot => {
            const res = [];
            snapshot.forEach(doc => {
                res.push({
                    data: doc.data(),
                   id: doc.id,
                  })
            })
            console.log(res);
            setTrendingPosts(res)
        })
        return () => unsubscribe();
    }, []);

    const trendToRender = trendingPosts?.map(item => {
        return (
            <PostItem key={item.id} id={item.id} likes={item?.data?.likedBy} photo={item.data.userPhotoURl} name={item.data.userName} body={item.data.postBody}/>
        )
    })


  return (
    <>
    <ul className='posts-container'>
        <h1 className='my-posts'>Trending Posts</h1>
      {trendToRender}
    </ul>
    <Link to='/' className='back-home'><FontAwesomeIcon icon={faArrowLeft}/></Link>
    </>
  )
}

export default TrendingPage
