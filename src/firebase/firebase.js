import { initializeApp } from 'firebase/app';
// import { getFunctions } from '@firebase/functions';
// import { getStorage } from '@firebase/storage';
import { initializeAuth } from 'firebase/auth'

// import { getAnalytics } from '@firebase/analytics';
import { getFirestore } from '@firebase/firestore';
import { AsyncStorage } from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyD9jC7AJtNdSXPGLrlhGr-xVdDb1Q8NRCM",
  authDomain: "brainhack2022-33670.firebaseapp.com",
  projectId: "brainhack2022-33670",
  storageBucket: "brainhack2022-33670.appspot.com",
  messagingSenderId: "76484965569",
  appId: "1:76484965569:web:f090cd7eb868b9225c1040",
  measurementId: "G-S6NMX64HVX"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = initializeAuth(firebaseApp, { persistence: AsyncStorage });
export const firebaseFirestore = getFirestore(firebaseApp);
// export const firebaseAnalytics = getAnalytics(firebaseApp);
// export const firebaseDB = getFirestore(firebaseApp);
// export const firebaseFunctions = getFunctions(firebaseApp);
// export const firebaseStorage = getStorage(firebaseApp);
