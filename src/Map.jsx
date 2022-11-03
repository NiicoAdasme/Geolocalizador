import MapView, { Callout, Circle, Marker } from 'react-native-maps';
import { StyleSheet, Dimensions, Text } from 'react-native';

export default function Map({latitude, longitude}) {
    return (
        <MapView
            style={styles.map}
            initialRegion={{
                latitude:  latitude,
                longitude: longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }}
        >
            <Marker
                coordinate={{latitude: latitude, longitude: longitude}}
                pinColor="gold"
            >
                <Callout>
                    <Text>Este es un Callout</Text>
                </Callout>
            </Marker>

            {/* <Circle 
                center={{latitude, longitude}}
                radius={100}
            /> */}

        </MapView>
    );
}

const styles = StyleSheet.create({
    // map: {
    //     width: Dimensions.get('window').width,
    //     height: Dimensions.get('window').height,
    // },
    map: {
        width: 500,
        height: 500
    }
});