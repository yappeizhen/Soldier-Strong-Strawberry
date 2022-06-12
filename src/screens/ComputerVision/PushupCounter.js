import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { atan2 } from "@tensorflow/tfjs";

import { LoadingView } from "./LoadingView";

export function PushupCounter({ predictions }) {
  const [isFormCorrect, setIsFormCorrect] = useState(false);
  const [isGoingUp, setIsGoingUp] = useState(false);
  const [pushupCount, setPushupCount] = useState(0);

  const [feedback, setFeedback] = useState("");
  const [countStatus, setCountStatus] = useState("");

  let angles = { elbow: 0, shoulder: 0, hip: 0, knee: 0, wrist: 0, ankle: 0 }

  if (!predictions) {
    return <LoadingView />
  }
  console.log(predictions);
  //let nose = predictions.keypoints[0];
  //let leftEye = predictions.keypoints[1];
  //let rightEye = predictions.keypoints[2];
  //let leftEar = predictions.keypoints[3];
  //let rightEar = predictions.keypoints[4];
  //let leftShoulder = predictions.keypoints[5];
  //let rightShoulder = predictions.keypoints[6];
  // let leftElbow = predictions.keypoints[7];
  //let rightElbow = predictions.keypoints[8];
  //let leftWrist = predictions.keypoints[9];
  //let rightWrist = predictions.keypoints[10];
  //let leftHip = predictions.keypoints[11];
  //let rightHip = predictions.keypoints[12];
  //let leftKnee = predictions.keypoints[13];
  //let rightKnee = predictions.keypoints[14];
  //let leftAnkle = predictions.keypoints[15];
  //let rightAnkle = predictions.keypoints[16];

  // Determine whether the left side or right side is more visible
  const leftLandmarkIndexes = [1, 3, 5, 7, 9, 11, 13, 15];
  const rightLandmarkIndexes = [2, 4, 6, 8, 10, 12, 14, 16];
  let leftVisibilitySum = 0;
  let rightVisibilitySum = 0;
  for (let i = 0; i < leftLandmarkIndexes.length; i++) {
    leftVisibilitySum += predictions.keypoints[leftLandmarkIndexes[i]].score;
    rightVisibilitySum += predictions.keypoints[leftLandmarkIndexes[i]].score;
  }
  const landmarkIndexes = leftVisibilitySum > rightVisibilitySum ? leftLandmarkIndexes : rightLandmarkIndexes
  const landmarkIndexMap = {
    eye: landmarkIndexes[0],
    ear: landmarkIndexes[1],
    shoulder: landmarkIndexes[2],
    elbow: landmarkIndexes[3],
    wrist: landmarkIndexes[4],
    hip: landmarkIndexes[5],
    knee: landmarkIndexes[6],
    ankle: landmarkIndexes[7]
  }
  const getCoordinates = (index) => {
    return {
      x: predictions.keypoints[index].position.x,
      y: predictions.keypoints[index].position.y
    };
  };
  const findAngle = (first, second, third) => {
    const center = getCoordinates(landmarkIndexMap[first]);
    const p2 = getCoordinates(landmarkIndexMap[second]);
    const p3 = getCoordinates(landmarkIndexMap[third]);
    // Each angle has the format {x, y}
    const angle = Math.atan2(p3.y - center.y, p3.x - center.x) - atan2(p2.y - center.y, p2.x - center.x);
    return Math.min(angle, 360 - angle);
  }
  const isCorrectForm = () => {
    angles.elbow = findAngle("elbow", "wrist", "shoulder");
    angles.shoulder = findAngle("shoulder", "elbow", "hip");
    angles.hip = findAngle("hip", "shoulder", "knee");
    angles.knee = findAngle("knee", "hip", "ankle");
    if (angles.elbow > 160
      && angles.shoulder > 40
      && angles.hip > 160 && angles.hip < 190
      && angles.knee > 160) {
      setIsFormCorrect(true);
      return true;
    }
    return false;
  }
  const getPushUpStatus = () => {
    if (isCorrectForm) {
      const elbowPercentage = (angles.elbow / 160) * 100;
      if (elbowPercentage === 0) {
        if (angles.elbow <= 90
          && angles.hip > 160 && angles.hip < 190
          && angles.knee > 160) {
          setFeedback("Go Up");
          if (!isGoingUp) { // TODO: check this
            setIsGoingUp(true);
            setCountStatus("");
          } else {
            setCountStatus("No Count");
          }
        } else if (angles.elbow > 90) {
          setFeedback("Lower Body");
          setCountStatus("No Count!");
        } else if (angles.hip <= 160 || hip >= 190) {
          setFeedback("Straighten Back");
          setCountStatus("No Count");
        } else if (knee <= 160) {
          setFeedback("Straighten Knee");
          setCountStatus("No Count");
        } else {
          setFeedback("Fix Form");
          setCountStatus("No Count");
        }
      }
      if (elbowPercentage === 100) {
        if (angles.elbow > 160 && angles.shoulder > 40 && angles.hip > 160 && angles.hip < 190 && angles.knee > 160) {
          setCountStatus("");
          setFeedback("Go Down");
          if (isGoingUp) {
            setPushupCount(pushupCount + 1);
            setIsGoingUp(false);
            setCountStatus("");
          } else {
            setCountStatus("No Count")
          }
        } else if (angles.elbow <= 160) {
          setFeedback("Straighten Elbows");
          setCountStatus("No Count");
        } else if (angles.hip <= 160 && angles.hip >= 190) {
          setFeedback("Straighten Back");
          setCountStatus("No Count");
        } else if (angles.knee <= 160) {
          setFeedback("Straighten Knee");
          setCountStatus("No Count");
        }
      }
    }
  }

  getPushUpStatus();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{countStatus}</Text>
      <Text style={styles.text}>{feedback}</Text>
      <Text style={styles.text}>{pushupCount}</Text>
    </View>
  );
}
const margin = 24;
const styles = StyleSheet.create({
  container: {
    zIndex: 100,
    position: "absolute",
    bottom: margin,
    left: margin,
    right: margin,
    backgroundColor: "rgba(255,255,255,0.8)",
    padding: 8,
    borderRadius: 20,
    alignItems: "center",
  },
  text: {
    paddingVertical: 2,
    fontSize: 20,
  },
});
