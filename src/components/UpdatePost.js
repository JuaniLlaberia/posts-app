import { faX } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { doc, updateDoc } from "firebase/firestore"
import { useState } from "react"
import { db } from "../firebase_config"

const UpdatePost = ({body, closeModal, id}) => {
    const [newBody, setNewBody] = useState(body);

    const handleChangePost = async e => {
        e.preventDefault()
        if(newBody.length < 1) return;

        let hashtagList;
        hashtagList = newBody.match(/#[A-Za-z0-9]+/g)?.map(tag => tag.slice(1));
        if (hashtagList === undefined) hashtagList = [];

        try {
            await updateDoc(doc(db, 'posts', id), {
                'postBody': newBody,
                'updated': true,
                'hashtags': hashtagList,
            })
            closeModal()
        } catch(err) {
            console.log(err);
        }
    };

  return (
    <div className='update-post-container'>
      <button onClick={closeModal} className='x-icon'><FontAwesomeIcon icon={faX}/></button>
      <h3>Update Post</h3>
            <form onSubmit={handleChangePost}>
                <textarea value={newBody} placeholder='Write your post here' onChange={e => setNewBody(e.target.value)} maxLength={300}/>
                <p>{newBody.length}/300</p>
                <button type="submit" disabled={newBody.length < 1}>Change</button>
            </form>
    </div>
  )
}

export default UpdatePost
