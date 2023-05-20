import { Link } from 'react-router-dom'

const PostItem = ({id, photo, name, body}) => {
  return (
      <Link key={id} to={`/post/${id}`} className='post-item'>
          <div className='post-head'>
            <img src={photo} draggable={false} alt="profile picture"/>
            <h6>{name}</h6>
          </div>
          <p>{body}</p>
      </Link>
  )
}

export default PostItem
