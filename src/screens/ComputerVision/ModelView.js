import { Camera } from 'expo-camera';
import React, { useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import * as posenet from '@tensorflow-models/posenet';
import * as tf from "@tensorflow/tfjs";

import { CustomTensorCamera } from './CustomTensorCamera';
import { LoadingView } from './LoadingView';
import { PushupCounter } from './PushupCounter';
import { useTensorFlowModel } from './useTensorFlow';

export function ModelView() {
  const [predictions, setPredictions] = useState();
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
      <PushupCounter predictions={predictions} />
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
        const nextImageTensor = images.next().value;
        const predictions = await model.estimateSinglePose(nextImageTensor, { flipHorizontal: true });
        // console.log(predictions);
        setPredictions(predictions);
        raf.current = requestAnimationFrame(loop);
        tf.dispose(nextImageTensor);
        tf.dispose(images);
        tf.dispose(predictions);
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

const styles = StyleSheet.create({
  camera: {
    zIndex: 0,
  },
});
