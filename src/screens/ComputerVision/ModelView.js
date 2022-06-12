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
import { PushupCounter } from './PushupCounter';
import { useTensorFlowModel } from './useTensorFlow';

export function ModelView() {
  const [predictions, setPredictions] = useState();
  const [pushupCount, setPushupCount] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [countStatus, setCountStatus] = useState("");
  const [isGoingUp, setIsGoingUp] = useState(false);

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
      <PushupCounter
        predictions={predictions}
        setCountStatus={setCountStatus}
        setPushupCount={() => { setPushupCount(pushupCount + 1) }}
        setFeedback={setFeedback}
        isGoingUp={isGoingUp}
        setIsGoingUp={setIsGoingUp}
      />
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
        <ModelCamera model={model} setPredictions={setPredictions} modelRef={modelRef} />
      </View>
    </View>
  );
}

function ModelCamera({ model, setPredictions, modelRef }) {
  const raf = React.useRef(null);
  const size = useWindowDimensions();

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
          setPredictions(predictions);
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
    [setPredictions]
  );

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
