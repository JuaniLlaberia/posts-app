import { Link } from 'react-router-dom'
import { formatDate } from '../formatDate'

const PostItem = ({id, photo, name, body, seconds}) => {
  const date = formatDate(seconds);

  return (
      <Link key={id} to={`/post/${id}`} className='post-item'>
          <p className='date-post' style={{position:'absolute', right:'5%', display:'flex', justifyContent:'flex-end', width:'2.5vw'}}>{date}</p>
          <div className='post-head'>
            <img src={photo} draggable={false} alt="profile"/>
            <h6>{name}</h6>
          </div>
          <p>{body}</p>
      </Link>
  )
}

export default PostItem
