// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCPc3Z8gc1spUHskeJLqVLpC4JhakUXkxQ",
  authDomain: "socialpost-58454.firebaseapp.com",
  projectId: "socialpost-58454",
  storageBucket: "socialpost-58454.appspot.com",
  messagingSenderId: "764030834360",
  appId: "1:764030834360:web:919f2e900aee24f211864d",
  measurementId: "G-8F0Y096W8Z"
};

// Initialize Firebase
export  const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const storage=getStorage(app)