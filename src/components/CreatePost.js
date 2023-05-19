import { useEffect, useState } from "react"
import { db } from '../firebase_config';
import { collection, addDoc } from "firebase/firestore";
import { useAuthContext } from "../context/AuthContext";
//Collection is to create a new collection and addDoc is to create a new doc in the database

const CreatePost = () => {
    const [postText, setPostText] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const {currentUser} = useAuthContext();
    const collectionPostsRef = collection(db, 'posts');

    const handleCreatePost = async e => {
        e.preventDefault();
        setError('');
        setMessage('');

        if(currentUser === null) return setError('Must log in');
        if(postText.length < 1) return setError('Min. 1 character');

        try {
            await addDoc(collectionPostsRef, {
                createdBy: currentUser?.uid,
                userPhotoURl: currentUser?.photoURL,
                userName: currentUser?.displayName,
                postBody: postText,
                updated: false,
                comments: []
            })
            setMessage('Post created')
        } catch(err) {
            console.log(err);
            setError('Failed to post')
        }
        setPostText('');
    };

    useEffect(() => {
        setTimeout(() => setError(''), 4000);
    }, [error]);

    useEffect(() => {
        setTimeout(() => setMessage(''), 4000);
    }, [message]);

  return (
    <>
        <div className='create-post-container'>
            <h3>Create new post</h3>
            <form onSubmit={handleCreatePost}>
                <textarea value={postText} placeholder='Write your post here' onChange={e => setPostText(e.target.value)} maxLength={300}/>
                <p>{postText.length}/300</p>
                <button>Post</button>
            </form>
        </div>
        {error && <div>{error}</div>}
        {message && <div>{message}</div>}
    </>
  )
}

export default CreatePost
