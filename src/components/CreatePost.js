import { useEffect, useState } from "react"
import { db, storage } from '../firebase_config';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuthContext } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import { faImage } from "@fortawesome/free-regular-svg-icons";

const CreatePost = () => {
    const [postText, setPostText] = useState('');
    const [img, setImg] = useState(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const {currentUser} = useAuthContext();
    const collectionPostsRef = collection(db, 'posts');

    const handleCreatePost = async e => {
        e.preventDefault();
        setError('');
        setMessage('');

        if(currentUser === null) return setError('Must log in');

        //Taking care of the IMG
        let filePath = '';
        let imageId = '';

        if(img) {
            imageId = uuidv4();
            const storageRef = ref(storage, `${imageId}.${img?.type?.split('/')[1]}`);
            try {
                await uploadBytes(storageRef, img);
                filePath = await getDownloadURL(storageRef);
            } catch(err) {
                return setError('Problem with img.');
            }
        };

        let hashtagList;
        hashtagList = postText.match(/#[A-Za-z0-9]+/g)?.map(tag => tag.slice(1));
        if (hashtagList === undefined) hashtagList = [];

        //Creating the Post
        try {
            await addDoc(collectionPostsRef, {
                createdBy: currentUser?.uid,
                userPhotoURl: currentUser?.photoURL,
                userName: currentUser?.displayName,
                postBody: postText,
                updated: false,
                comments: [],
                savedBy: [],
                likedBy: [],
                likesNum: 0,
                date: serverTimestamp(),
                imgPath: filePath,
                imgId: imageId,
                hashtags: hashtagList,
            })
            setMessage('Post created');
        } catch(err) {
            setError('Failed to post');
            console.log(err);
        }
        setPostText('');
        setImg(null)
    };

    useEffect(() => {
        setTimeout(() => setError(''), 4000);
    }, [error]);

    useEffect(() => {
        setTimeout(() => setMessage(''), 4000);
    }, [message]);

    useEffect(() => {
        if(!img) return;
        setMessage('Img uploaded');
    }, [img]);

  return (
    <>
        <div className='create-post-container'>
            <h3>Create new post</h3>
            <form onSubmit={handleCreatePost}>
                <textarea value={postText} placeholder='Write your post here' onChange={e => setPostText(e.target.value)} maxLength={300}/>
                <p>{postText.length}/300</p>
                <button disabled={postText.length < 1}>Post</button>
                <label htmlFor='upload-photo' className='img-input'>
                    <FontAwesomeIcon icon={faImage} style={{color: img ? '#73de3a' : ''}}/>
                    <input style={{display:'none'}} accept="image/png, image/gif, image/jpeg" id='upload-photo' type="file" onChange={e => setImg(e.target.files[0])}/>
                </label>
            </form>
        </div>
        {error && <div className='copy-msg error'><FontAwesomeIcon icon={faCircleXmark}/><p>{error}</p></div>}
        {message && <div className='copy-msg'><FontAwesomeIcon icon={faCircleCheck}/><p>{message}</p></div>}
    </>
  )
}

export default CreatePost
