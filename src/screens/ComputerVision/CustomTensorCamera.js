import { Camera, CameraType } from 'expo-camera';
import React from 'react';
import { StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';

const TEXTURE_SIZE = { width: 1080, height: 1920 };

const TENSOR_WIDTH = 152;

const CAMERA_RATIO = TEXTURE_SIZE.height / TEXTURE_SIZE.width;

const TENSOR_SIZE = {
  width: TENSOR_WIDTH,
  height: TENSOR_WIDTH * CAMERA_RATIO,
};

const TensorCamera = cameraWithTensors(Camera);

export function CustomTensorCamera({ style, width, ...props }) {
  const [type, setType] = React.useState(CameraType.back)
  const size = useWindowDimensions();

  const sizeStyle = React.useMemo(() => {
    const ratio = width / TEXTURE_SIZE.width;
    const cameraWidth = TEXTURE_SIZE.width * ratio;
    const cameraHeight = TEXTURE_SIZE.height * ratio;
    return {
      maxWidth: cameraWidth,
      minWidth: cameraWidth,
      maxHeight: cameraHeight,
      minHeight: cameraHeight,
    };
  }, [width]);

  return (
    <>
      <TensorCamera
        {...props}
        type={type}
        zoom={0}
        style={[style, sizeStyle]}
        cameraTextureWidth={size.width}
        cameraTextureHeight={size.height}
        resizeWidth={300}
        resizeHeight={400}
        resizeDepth={3}
        autorender={true}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.cameraButton}
          onPress={() => {
            setType(type === CameraType.back ? CameraType.front : CameraType.back);
          }}>
          <MaterialCommunityIcons name="camera-flip-outline" size={36} color="white" />
        </TouchableOpacity>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    bottom: 140,
    right: -140,
    zIndex: 100,
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  cameraButton: {
    flex: 0.9,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  cameraButtonText: {
    fontSize: 18,
    color: 'white',
  },
})