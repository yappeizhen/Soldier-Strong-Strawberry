import React, { useState } from "react";
import { StyleSheet } from "react-native";

import { LoadingView } from "./LoadingView";

export function PushupCounter({ predictions, setPushupCount, setFeedback, setCountStatus, isGoingUp, setIsGoingUp }) {

  let isReady = false;

  let angles = { elbow: 0, shoulder: 0, hip: 0, knee: 0 }

  if (!predictions) {
    return <LoadingView />
  }
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
    const B = getCoordinates(landmarkIndexMap[first]);
    const A = getCoordinates(landmarkIndexMap[second]);
    const C = getCoordinates(landmarkIndexMap[third]);
    // Each angle has the format {x, y}
    let AB = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
    let BC = Math.sqrt(Math.pow(B.x - C.x, 2) + Math.pow(B.y - C.y, 2));
    let AC = Math.sqrt(Math.pow(C.x - A.x, 2) + Math.pow(C.y - A.y, 2));
    return Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB)) * (180 / Math.PI);
    // const angle = Math.atan2(p3.y - center.y, p3.x - center.x) - atan2(p2.y - center.y, p2.x - center.x);
    // return Math.min(angle, 360 - angle);
  }
  const isCorrectForm = () => {
    angles.elbow = findAngle("elbow", "wrist", "shoulder");
    angles.shoulder = findAngle("shoulder", "elbow", "hip");
    angles.hip = findAngle("hip", "shoulder", "knee");
    angles.knee = findAngle("knee", "hip", "ankle");
    if (angles.elbow > 120
      && angles.shoulder > 20
      && angles.hip > 140 && angles.hip < 190
      && angles.knee > 140) {
      isReady = true;
      //console.log("IM READYYYYYYYYY")
    }
  }
  const getPushUpStatus = () => {
    if (isReady) {
      if (angles.elbow < 100) {
        if (angles.elbow <= 100
          && angles.hip > 120 && angles.hip < 190
          && angles.knee > 120) {
          setFeedback("Go Up");
          if (!isGoingUp) {
            setIsGoingUp(true);
            setCountStatus("");
          } else {
            setCountStatus("No Count");
          }
        } else if (angles.elbow > 70) {
          setFeedback("Lower Body");
          setCountStatus("No Count!");
        } else if (angles.hip <= 120 || angles.hip >= 190) {
          setFeedback("Straighten Back");
          setCountStatus("No Count");
        } else if (angles.knee <= 120) {
          setFeedback("Straighten Knee");
          setCountStatus("No Count");
        } else {
          setFeedback("Fix Form");
          setCountStatus("No Count");
        }
      }
      if (angles.elbow > 120) {
        if (angles.elbow > 120 && angles.shoulder > 40 && angles.hip > 120 && angles.hip < 190 && angles.knee > 120) {
          setCountStatus("");
          setFeedback("Go Down");
          if (isGoingUp) {
            setPushupCount();
            setIsGoingUp(false);
            setCountStatus("Success!");
          }
        } else if (angles.elbow <= 120) {
          setFeedback("Straighten Elbows");
          setCountStatus("No Count");
        } else if (angles.hip <= 120 && angles.hip >= 190) {
          setFeedback("Straighten Back");
          setCountStatus("No Count");
        } else if (angles.knee <= 120) {
          setFeedback("Straighten Knee");
          setCountStatus("No Count");
        }
      }
    }
  }
  if (!isReady) {
    isCorrectForm();
  }
  getPushUpStatus();
  //console.log(angles);

  return (
    <>
    </>
  );
}
const margin = 24;
const styles = StyleSheet.create({
  container: {
    zIndex: 1,
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
  keypointcontainer: {
    zIndex: 2,
    position: "absolute",
    backgroundColor: "transparent",
    alignItems: "center",
    height: 100,
    width: 100
  }
});
