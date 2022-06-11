import { Timestamp } from "firebase/firestore";

export type UserProfileData = {
    email: string,
    name: string,
    birthday: Date | null,
    isMale: boolean,
    mostRecentIpptScore: number | null,
    isDiverCommandoGuards: boolean,
    intendedIpptDate: Date | null,
    trainingPlan: TrainingItem[],
    pushups: StaticStat[],
    situps: StaticStat[],
    runningData: RunningStat[],
}
export type TrainingItem = {
    item: string,
    isComplete: boolean
}
export type IPPTScore = {
    score: number;
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