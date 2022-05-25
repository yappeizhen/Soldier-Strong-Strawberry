import { initializeApp } from 'firebase/app';
// import { getAnalytics } from '@firebase/analytics';
// import { getFirestore } from '@firebase/firestore';
// import { getFunctions } from '@firebase/functions';
// import { getStorage } from '@firebase/storage';
import { getAuth } from 'firebase/auth'

// Import firebase packages we want
// import 'firebase/compat/analytics';

// import 'firebase/compat/firestore';
// import 'firebase/compat/functions';
// import 'firebase/compat/remote-config';
// import 'firebase/compat/storage';



const firebaseConfig = {
  apiKey: "AIzaSyAj-BgoRMB5unYIF3TAaHXlVQ539moXzhI",
  authDomain: "react-native-expo-template.firebaseapp.com",
  projectId: "react-native-expo-template",
  storageBucket: "react-native-expo-template.appspot.com",
  messagingSenderId: "353708685817",
  appId: "1:353708685817:web:920313181f14b9d3d0e528",
  measurementId: "G-PG2RWVJ2VN"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
// export const firebaseAnalytics = getAnalytics(firebaseApp);
// export const firebaseDB = getFirestore(firebaseApp);
// export const firebaseFunctions = getFunctions(firebaseApp);
// export const firebaseStorage = getStorage(firebaseApp);
