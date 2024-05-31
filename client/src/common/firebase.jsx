import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAsXlsG_eIViS_8iywDjmNtDBWDRulPJ8s",
  authDomain: "blog-c4839.firebaseapp.com",
  projectId: "blog-c4839",
  storageBucket: "blog-c4839.appspot.com",
  messagingSenderId: "990007969075",
  appId: "1:990007969075:web:4dcf78f971f5ffab966a46",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//Google

const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () => {
  let user = null;
  await signInWithPopup(auth, provider)
    .then((result) => {
      user = result.user;
    })
    .catch((err) => {
      console.log(err);
    });

  return user;
};
