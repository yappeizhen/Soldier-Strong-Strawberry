import { Timestamp } from "firebase/firestore";

export type StaticStat = {
    number: number;
    date: Date;
}
export type FirestoreStaticStat = {
    number: number;
    date: Timestamp; // Firestore uses Timestamp, which is not the same as JavaScript's date --> Must be converted before use
}