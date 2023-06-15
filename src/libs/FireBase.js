// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import {getDownloadURL,ref, uploadBytesResumable,deleteObject} from 'firebase/storage'
import * as APILib from "./APIAccessAndVerification"
import {hashString,hashRandom } from 'react-hash-string'
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



const Convert_URLImageData_ToFile=(ImageUrl)=>
{
  // Example base64-encoded string representing an image
const base64String = ImageUrl;
// Extract the MIME type and base64 data
const match = base64String.match(/^data:(.+);base64,(.*)$/);
const mimeType = match[1];
const base64Data = match[2];

// Decode the base64 data
const decodedData = atob(base64Data);

// Create a new Uint8Array from the decoded data
const dataArray = new Uint8Array(decodedData.length);
for (let i = 0; i < decodedData.length; i++) {
  dataArray[i] = decodedData.charCodeAt(i);
}

// Create a new blob object with the Uint8Array and specify the MIME type
const blob = new Blob([dataArray], { type: mimeType });

const fileExtension = mimeType.split("/")[1] || '';
const fileName = `image.${fileExtension}`;
const file = new File([blob], fileName, { type: mimeType });
return(file);
}


export const Upload_Thumbnail_Image = async (ImageUrl) => {
  if (ImageUrl === null || ImageUrl === "") return;

  let file = Convert_URLImageData_ToFile(ImageUrl);
  let HashedFileName = hashRandom();
  const storageRef = ref(storage, `/VideoThumbnails/${HashedFileName}`);
  // Uploading the new image to Firebase
  const uploadTask = uploadBytesResumable(storageRef, file);

  const snapshot = await new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // This function is executed many times during the upload to indicate progress
      },
      (error) => {
        // This function is executed when there is an error with the upload
        reject(error);
      },
      () => {
        // This function is executed when the state changes, we're going to use it for the state changing to complete
        resolve(uploadTask.snapshot);
      }
    );
  });

  const url = await getDownloadURL(snapshot.ref);
  return url;
};