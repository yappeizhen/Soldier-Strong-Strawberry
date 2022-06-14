import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Button
} from "react-native";
import MapView, {
  Marker,
  AnimatedRegion,
  Polyline,
  PROVIDER_GOOGLE
} from "react-native-maps";
import haversine from "haversine";
import { useEffect, useState } from "react";
import * as Location from "expo-location"
import {Stopwatch} from 'react-native-stopwatch-timer';

let foregroundSubscription: any = null

export default function RunsScreen({navigation}: any) {
  const LATITUDE_DELTA = 0.009;
  const LONGITUDE_DELTA = 0.009;
  const LATITUDE = 37.78825;
  const LONGITUDE = -122.4324;

  const [latitude, setLatitude] = useState<number>(LATITUDE);
  const [longitude, setLongitude] = useState<number>(LONGITUDE);
  const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);
  let [distanceTravelled, setDistanceTravelled] = useState<number>(0);
  let [prevLatLng, setPrevLatLng] = useState<any>({});
  const [newCoordinate, setNewCoordinate] = useState<any>({})
  const [coordinate, setCoordinate] = useState<AnimatedRegion>(
    new AnimatedRegion({
      latitude: LATITUDE,
      longitude: LONGITUDE,
      latitudeDelta: 0,
      longitudeDelta: 0
    })
  )
  let [isTiming, setIsTiming] = useState<boolean>()
  let [isReset, setReset] = useState<boolean>()

  useEffect(() => {
    const requestPermissions = async () => {
      const foreground = await Location.requestForegroundPermissionsAsync()
    }
    requestPermissions()
  }, [])

  const startForegroundUpdate = async () => {
    isTiming = true
    setIsTiming(isTiming)
    setReset(false)
    const { granted } = await Location.getForegroundPermissionsAsync()
    if (!granted) {
      console.log('permission not granted')
      return
    }

    foregroundSubscription?.remove()

    foregroundSubscription = await Location.watchPositionAsync(
      {accuracy: Location.Accuracy.Highest},
      location => {
        const newCoordinate = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        }

        coordinate.timing(newCoordinate).start()

        setLatitude(location.coords.latitude)
        setLongitude(location.coords.longitude)
        routeCoordinates.concat([newCoordinate])
        distanceTravelled = distanceTravelled + calcDistance(newCoordinate)
        setDistanceTravelled(distanceTravelled)
        prevLatLng = newCoordinate
        setPrevLatLng(prevLatLng)
      }
    )
  }

  const stopForegroundUpdate = () => {
    isTiming = false
    setIsTiming(isTiming)
    setReset(false)
    foregroundSubscription?.remove()
    // firebase
  }

  const getMapRegion = () => ({
    latitude: latitude,
    longitude: longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA
  })

  const calcDistance = (newLatLng: {}) => {
    return haversine(prevLatLng, newLatLng) || 0
  }

  const reset = () => {
    setIsTiming(false)
    setReset(true)
  }

  return (
    <View style={styles.container}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          followsUserLocation={true}
          loadingEnabled
          region={getMapRegion()}
        >
          <Marker
            coordinate={{
              latitude: 0,
              longitude: 0
            }}
          />
        </MapView>
        <View style={styles.startStopContainer}>
          <View style={[styles.bubble, styles.button]}>
            <Button 
              onPress={startForegroundUpdate}
              title="Start"
              color="green"
            />
            <Button 
              onPress={stopForegroundUpdate}
              title="Stop"
              color="red"
            />
            <Button
              onPress={reset}
              title="Reset"
              color="orange"
            />
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.bubble, styles.button]}>
            <Text>
              {distanceTravelled.toFixed(2)} km
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.startStopContainer}>
          <TouchableOpacity style={[styles.bubble, styles.button]}>
            <Stopwatch
                laps
                msecs
                start={isTiming}
                //To start
                reset={isReset}
                //To reset
                options={options}
                //options for the styling
                getTime={(time: any) => {
                  console.log(time);
                }}
              />
            </TouchableOpacity>
          </View>
      </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  bubble: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.7)",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20
  },
  latlng: {
    width: 200,
    alignItems: "stretch"
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: "center",
    marginHorizontal: 10
  },
  buttonContainer: {
    flexDirection: "row",
    marginVertical: 20,
    backgroundColor: "transparent"
  },
  startStopContainer: {
    flexDirection: "row",
    backgroundColor: "transparent"
  }
});

const options = {
  container: {
    backgroundColor: 'transparent',
    alignItems: 'center',
  }
};