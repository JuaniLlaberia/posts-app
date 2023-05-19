import { arrayUnion, collection, doc, onSnapshot, query, updateDoc, where, arrayRemove } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase_config";
import { useAuthContext } from "./AuthContext";

const FavsContext = createContext();

export const FavsProvider = ({children}) => {
    const [favPosts, setFavPosts] = useState([]);
    const {currentUser} = useAuthContext();

    useEffect(() => {
        if(currentUser?.uid === undefined) return;
        const unsubscribe = onSnapshot(query(collection(db, 'posts'), where('savedBy', 'array-contains', currentUser?.uid)),
        (snapshot) => {
            const tempArr = [];
            snapshot.forEach(item => {
                tempArr.push({
                    data: item.data(),
                    dataID : item.id})
            })
            setFavPosts(tempArr);
        })
        return () => unsubscribe();
    }, [currentUser?.uid])

    const addToFavs = async (docId) => {
            try {
                await updateDoc(doc(db, 'posts', docId), {
                    'savedBy': arrayUnion(currentUser?.uid)
                })
            } catch(err) {
                console.log(err);
            }
        };

    const removeFromFavs = async (postId) => {
        try {
            await updateDoc(doc(db, 'posts', postId), {
                'savedBy': arrayRemove(currentUser?.uid)
            });
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