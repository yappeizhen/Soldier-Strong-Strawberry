import { Timestamp } from "firebase/firestore";

export type UserProfileData = {
    email: string,
    name: string,
    birthday: Date,
    mostRecentIpptScore: number,
    isDiverCommandoGuards: boolean,
    intendedIpptDate: Date,
    trainingPlan: [],
    pushups: StaticStat[],
    situps: StaticStat[],
    runningData: RunningStat[],
}
export type TrainingPlan = {
    item: string,
    isComplete: boolean
}
export type RunningStat = {
    timing: number;
    distance: number;
    date: Date;
}
export type FirestoreRunningStat = {
    timing: number;
    distance: number;
    date: Timestamp;
}
export type StaticStat = {
    number: number;
    date: Date;
}
export type FirestoreStaticStat = {
    number: number;
    date: Timestamp; // Firestore uses Timestamp, which is not the same as JavaScript's date --> Must be converted before use
}