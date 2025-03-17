import { CameraView,  useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, Pressable, StyleSheet, Text,  View } from 'react-native';

export default function CameraScreen() {
  //const {facing, setFacing} = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('front');

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    if(facing == 'front')
    {
        setFacing('back');
    }
    else{
        setFacing('front');
    }
  }

  function takePhoto() {
    
    
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing}>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={takePhoto}>
            <Text style={styles.text}>Take Photo</Text>
          </Pressable>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
