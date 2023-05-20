import { Link } from "react-router-dom";
import { useFavsContext } from "../context/FavsContext"
import PostItem from "./PostItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const MyFavs = () => {
    const {favPosts} = useFavsContext();

    const favsToRender = favPosts?.map(item => {
        return (
            <PostItem key={item.dataID} id={item.dataID} photo={item.data.userPhotoURl} name={item.data.userName} body={item.data.postBody}/>
        )
    })

  return (
    <>
    <ul className='posts-container'>
        <h1 className='my-posts'>Saved Posts</h1>
      {favsToRender}
    </ul>
    <Link to='/' className='back-home'><FontAwesomeIcon icon={faArrowLeft}/></Link>
    </>
  )
}

export default MyFavs
