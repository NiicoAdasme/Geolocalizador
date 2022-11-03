import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Location from 'expo-location';
import Map from './Map';


export const Localizacion = () => {

    const [locationHook, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [tracking, setTracking] = useState(false);
    const [count, setCount] = useState(0);

    // const [status, requestPermission] = Location.useForegroundPermissions()

    const [coords, setCoords] = useState({
        altitude: null,
        altitudeAccuracy: null,
        accuracy: null,
        latitude: null,
        longitude: null,
        heading: null,
        speed: null,
        speedKmh: null,
        timestamp: null
    });

    const StopTracking = () => {
        setTracking(false);
    }

    const StartTracking = () => {
        setTracking(true);
        console.log(`inicio del tracking: ${tracking}`);
        watchPosition();
    }

    const getLocation = async () => {

        setTracking(true);

        let { status } = await Location.requestForegroundPermissionsAsync()
            .catch(err => console.log(err))
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
        }

        let location = await Location.getCurrentPositionAsync({})
            .catch(err => console.log(err))

        if (location) {

            setLocation(location);

            const { altitude, altitudeAccuracy, latitude, longitude, heading, accuracy, speed, timestamp } = location.coords
            const speedKmh = speed * 3.6
            setCoords({
                altitude,
                altitudeAccuracy,
                latitude,
                longitude,
                heading,
                accuracy,
                speed,
                speedKmh,
                timestamp
            })

        }

    }

    const watchPosition = async () => {

        console.log(`tracking al inicio del watchposition: ${tracking}`);

        const { status } = await Location.requestForegroundPermissionsAsync()
            .catch(err => { throw err })

        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
        }

        const options = {
            accuracy: Location.Accuracy.Highest,
            timeInterval: 100,
            distanceInterval: 1
        };

        const LocationCallback = (position) => {
            console.log(position);
            setLocation(position);
            setCount(c => c + 1);
            const { timestamp } = position;
            const { accuracy, altitude, altitudeAccuracy, heading, latitude, longitude, speed } = position.coords
            let speedKmh;

            if(speed < 1){
                speedKmh = 0;
            }else{
                speedKmh = speed * 3.6;
            }


            const dateNow = new Date();
            const year = dateNow.getFullYear();
            const month = dateNow.getMonth() + 1;
            const day = dateNow.getDate();
            const hours = dateNow.getHours();
            const minutes = dateNow.getMinutes();
            const seconds = dateNow.getSeconds();

            const fullDate = `Fecha: ${day}/${month}/${year} | Hora: ${hours}:${minutes}:${seconds}`

            setCoords({
                accuracy,
                altitude,
                altitudeAccuracy,
                latitude,
                longitude,
                heading,
                speed,
                speedKmh,
                timestamp: fullDate
            })
        }

        // const backPerm = await Location.requestBackgroundPermissionsAsync();

        const foregroundSubscrition = await Location.watchPositionAsync(options, LocationCallback)
            .then(c => console.log(c))
            .catch(err => console.log(err))


            (!tracking) && foregroundSubscrition.remove()

        console.log(`tracking al final del watchposition: ${tracking}`);

    }

    return (
        <View style={styles.mainContainer}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
            >
                <TouchableOpacity
                    onPress={StartTracking}
                    style={{ backgroundColor: '#34DC23' }}>
                    <Text style={{ fontSize: 20, color: '#fff' }}>Obtener Localizacion</Text>
                </TouchableOpacity>

                {
                    (tracking) &&
                    <TouchableOpacity
                        onPress={StopTracking}
                        style={{ backgroundColor: 'red' }}
                    >
                        <Text style={{ fontSize: 20, color: 'white' }}>Detener</Text>
                    </TouchableOpacity>
                }

                <Text> {JSON.stringify(locationHook)} </Text>

                <Text>Latitude: {coords.latitude} </Text>

                <Text>Longitude: {coords.longitude} </Text>

                <Text>altitude: {coords.altitude} </Text>

                <Text>altitudeAccuracy: {coords.altitudeAccuracy} </Text>

                <Text>accuracy: {coords.accuracy} </Text>

                <Text>heading: {coords.heading} </Text>

                <Text>speed: {coords.speed} m/s</Text>

                <Text>speed: {coords.speedKmh} km/h</Text>

                <Text>timestamp: {coords.timestamp} </Text>

                <Text>Cantidad de peticiones: {count} </Text>

                {
                    (coords?.latitude || coords?.longitude) && <Map latitude={coords?.latitude} longitude={coords?.longitude} />
                }

                <StatusBar style="auto" />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        marginVertical: 50
    },
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    contentContainer: {
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    instructions: {
        color: '#888',
        fontSize: 18,
        marginHorizontal: 15,
        marginBottom: 10,
    },
    button: {
        backgroundColor: "blue",
        padding: 20,
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 20,
        color: '#fff',
    },
    logo: {
        width: 50,
        height: 50,
    }
});