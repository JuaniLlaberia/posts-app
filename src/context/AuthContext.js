import { createContext, useContext, useEffect, useState } from "react";
import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase_config";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);

    const loginGoogle = () => {
        const googleProv = new GoogleAuthProvider();
        return signInWithPopup(auth, googleProv);
    };

    const loginFacebook = () => {
        const facebookProv = new FacebookAuthProvider();
        return signInWithPopup(auth, facebookProv);
    };

    const logout = () => signOut(auth);

    useEffect(() => {
        const unsuscribe = onAuthStateChanged(auth, user => {
            setCurrentUser(user)
        });
        return unsuscribe
    }, []);

    return(
        <AuthContext.Provider value={{
            currentUser,
            loginGoogle,
            loginFacebook,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuthContext = () => useContext(AuthContext);