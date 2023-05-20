import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { createContext, useContext } from "react";
import { db } from "../firebase_config";
import { useAuthContext } from "./AuthContext";

const LikedContext = createContext();

export const LikedProvider = ({children}) => {
    const {currentUser} = useAuthContext();

    const likePost = async (postId) => {
        try {
            await updateDoc(doc(db, 'posts', postId), {
                'likedBy': arrayUnion(currentUser?.uid)
            })
        } catch(err) {
            console.log(err);
        }
    };

    const unlikePost = async (postId) => {
        try {
            await updateDoc(doc(db, 'posts', postId), {
                'likedBy': arrayRemove(currentUser?.uid)
            })
        } catch(err) {
            console.log(err);
        }
    };

    return(
        <LikedContext.Provider value={{
            likePost,
            unlikePost
        }}>
            {children}
        </LikedContext.Provider>
    )
};

export const useLikedContext = () => useContext(LikedContext);