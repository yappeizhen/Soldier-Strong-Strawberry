import { Camera } from 'expo-camera';
import React, { useState } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Svg, {
  Circle,
  Rect,
} from 'react-native-svg';

import * as posenet from '@tensorflow-models/posenet';
import * as tf from "@tensorflow/tfjs";

import { CustomTensorCamera } from './CustomTensorCamera';
import { LoadingView } from './LoadingView';
import { useTensorFlowModel } from './useTensorFlow';

export function ModelView() {
  const [pushupCount, setPushupCount] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [countStatus, setCountStatus] = useState("");
  const isGoingUp = React.useRef(false);
  const modelRef = React.useRef(null);
  const model = useTensorFlowModel(posenet);

  modelRef.current = model;
  if (!model) {
    return <LoadingView message="Loading TensorFlow model" />;
  }

  return (
    <View
      style={{ flex: 1, backgroundColor: "black", justifyContent: "center" }}
    >
      <View style={styles.keypointcontainer}>
        <Svg height="50" width="50">
          <Circle
            cx="50"
            cy="50"
            r="45"
            stroke="blue"
            strokeWidth="2.5"
            fill="green"
          />
          <Rect
            x="15"
            y="15"
            width="70"
            height="70"
            stroke="red"
            strokeWidth="2"
            fill="yellow"
          />
        </Svg>
      </View>
      <View style={styles.container}>
        <Text style={styles.text}>{countStatus}</Text>
        <Text style={styles.text}>{feedback}</Text>
        <Text style={styles.text}>{pushupCount}</Text>
      </View>
      <View style={{ borderRadius: 20, overflow: "hidden" }}>
        <ModelCamera model={model}
          modelRef={modelRef}
          setCountStatus={setCountStatus}
          setPushupCount={() => { setPushupCount(pushupCount + 1) }}
          setFeedback={setFeedback}
          isGoingUp={isGoingUp.current}
          setIsGoingUp={() => {
            isGoingUp.current = !isGoingUp.current;
          }} />
      </View>
    </View>
  );
}

function ModelCamera({
  model,
  modelRef,
  setPushupCount,
  setFeedback,
  setCountStatus,
  isGoingUp,
  setIsGoingUp }) {
  const raf = React.useRef(null);
  const size = useWindowDimensions();

  let isReady = false;
  let currentIsGoingUp = isGoingUp;
  let angles = { elbow: 0, shoulder: 0, hip: 0, knee: 0 }
  let currPreds;
  let landmarkIndexMap;
  const leftLandmarkIndexes = [1, 3, 5, 7, 9, 11, 13, 15];
  const rightLandmarkIndexes = [2, 4, 6, 8, 10, 12, 14, 16];
  let leftVisibilitySum = 0;
  let rightVisibilitySum = 0;

  React.useEffect(() => {
    return () => {
      cancelAnimationFrame(raf.current);
      if (modelRef.current) {
        console.log("Cleaning");
        modelRef.current.dispose();
      }
    };
  }, []);

  const onReady = React.useCallback(
    (images) => {
      const loop = async () => {
        try {
          const nextImageTensor = images.next().value;
          const predictions = await model.estimateSinglePose(nextImageTensor, { flipHorizontal: true });
          if (predictions) {
            currPreds = predictions;
            initialiseKeypointMap();
            if (!isReady) {
              isCorrectForm();
            }
            getPushUpStatus();
            // console.log(angles);
          }
          raf.current = requestAnimationFrame(loop);
          tf.dispose(nextImageTensor);
          tf.dispose(images);
          tf.dispose(predictions);
        } catch (err) {
          console.log(err.message);
        }
      };
      loop();
    },
    []
  );

  const initialiseKeypointMap = () => {
    for (let i = 0; i < leftLandmarkIndexes.length; i++) {
      leftVisibilitySum += currPreds.keypoints[leftLandmarkIndexes[i]].score;
      rightVisibilitySum += currPreds.keypoints[leftLandmarkIndexes[i]].score;
    }
    const landmarkIndexes = leftVisibilitySum > rightVisibilitySum ? leftLandmarkIndexes : rightLandmarkIndexes
    landmarkIndexMap = {
      eye: landmarkIndexes[0],
      ear: landmarkIndexes[1],
      shoulder: landmarkIndexes[2],
      elbow: landmarkIndexes[3],
      wrist: landmarkIndexes[4],
      hip: landmarkIndexes[5],
      knee: landmarkIndexes[6],
      ankle: landmarkIndexes[7]
    }
  }
  const getCoordinates = (index) => {
    return {
      x: currPreds.keypoints[index].position.x,
      y: currPreds.keypoints[index].position.y
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
    let newAngles = angles;
    newAngles.elbow = findAngle("elbow", "wrist", "shoulder");
    newAngles.shoulder = findAngle("shoulder", "elbow", "hip");
    newAngles.hip = findAngle("hip", "shoulder", "knee");
    newAngles.knee = findAngle("knee", "hip", "ankle");
    if (newAngles.elbow > 120
      && newAngles.shoulder > 20
      && newAngles.hip > 140 && angles.hip < 190
      && newAngles.knee > 140) {
      isReady = true;
      console.log("IM READYYYYYYYYY")
    }
    return newAngles;
  }
  const getPushUpStatus = () => {
    if (isReady) {
      if (angles.elbow < 100) {
        if (angles.elbow <= 100
          && angles.hip > 120 && angles.hip < 190
          && angles.knee > 120) {
          setFeedback("Go Up");
          if (!currentIsGoingUp) {
            currentIsGoingUp = true;
            setIsGoingUp();
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
          if (!currentIsGoingUp) {
            setPushupCount();
            currentIsGoingUp = false;
            setIsGoingUp();
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

  return React.useMemo(
    () => (
      <CustomTensorCamera
        width={size.width}
        style={styles.camera}
        type={Camera.Constants.Type.back}
        onReady={onReady}
        autorender
      />
    ),
    [onReady, size.width]
  );
}
const margin = 24;
const styles = StyleSheet.create({
  camera: {
    zIndex: 0,
  },
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
