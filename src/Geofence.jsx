import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Constants } from 'expo';
import * as Location from 'expo-location';

import * as TaskManager from 'expo-task-manager';

// You can import from local files
import AssetExample from './AssetExample';

// or any pure javascript modules available in npm
import { Card } from 'react-native-paper';

export default class Geofence extends React.Component {

  componentDidMount() {
    let region = {identifier:1, latitude:59.899489, longitude: 10.611103, radius:10}
    Location.startGeofencingAsync("LOCATION_GEOFENCE", [region])

    TaskManager.defineTask("LOCATION_GEOFENCE", ({ data: { eventType, region }, error }) => {
        if (error) {
          // check `error.message` for more details.
          return;
        }
        if (eventType === Location.GeofencingEventType.Enter) {
          alert("enter in region!")
          console.log("You've entered region:", region);
        } else if (eventType === Location.GeofencingEventType.Exit) {
          console.log("You've left region:", region);
        }
      });
    }
  
  
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>
          Change code in the editor and watch it change on your phone! Save to get a shareable url.
        </Text>
        <Card>
          <AssetExample />
        </Card>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 10,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
