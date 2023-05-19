import { useFavsContext } from "../context/FavsContext"
import PostItem from "./PostItem";

const MyFavs = () => {
    const {favPosts} = useFavsContext();

    const favsToRender = favPosts?.map(item => {
        return (
            <PostItem key={item.dataID} id={item.dataID} photo={item.data.userPhotoURl} name={item.data.userName} body={item.data.postBody}/>
        )
    })

  return (
    <ul className='posts-container'>
        <h1 className='my-posts'>Saved Posts</h1>
      {favsToRender}
    </ul>
  )
}

export default MyFavs
