import { addDoc, collection, deleteDoc, doc, onSnapshot, query, where } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase_config";
import { useAuthContext } from "./AuthContext";

const FavsContext = createContext();

export const FavsProvider = ({children}) => {
    const [favPosts, setFavPosts] = useState([]);
    const {currentUser} = useAuthContext();

    const collectionRef = collection(db, 'favoritePosts');

    useEffect(() => {
        if(currentUser?.uid === undefined) return;
        const unsubscribe = onSnapshot(query(collectionRef, where('savedBy', '==', currentUser?.uid)),
        (snapshot) => {
            const tempArr = [];
            snapshot.forEach(item => {
                tempArr.push({
                    data: item.data(),
                    dataID: item.id
                })
            })
            setFavPosts(tempArr);
        })
        return () => unsubscribe();
    }, [currentUser?.uid])

    const addToFavs = async (name, by, body, photo, comments, updated, id) => {
        try {
            await addDoc(collectionRef, {
                data: {userName: name,
                createdBy: by,
                postBody: body,
                postId: id,
                userPhotoURl: photo,
                comments: comments,
                updated:updated},
                savedBy: currentUser?.uid
            })
        } catch(err) {
            console.log(err);
        }
    };

    const removeFromFavs = async (postFavId) => {
        try {
            await deleteDoc(doc(db, 'favoritePosts', postFavId));
        } catch(err) {
            console.log(err);
        }
    };

    return (
        <FavsContext.Provider value={{
            addToFavs,
            favPosts,
            removeFromFavs
        }}>
            {children}
        </FavsContext.Provider>
    )
}

export const useFavsContext = () => useContext(FavsContext);