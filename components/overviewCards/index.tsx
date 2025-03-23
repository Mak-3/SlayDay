import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';

const OverviewCards = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.row}>
        <View style={styles.cardWhite}>
          {/* Example content */}
          {/* <Text>Redesign 🔥 illustration for new team 😎</Text> */}
        </View>
        <View style={styles.cardLightBlue}>
          {/* Empty */}
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.cardBeige}>
          {/* Empty */}
        </View>
        <View style={styles.cardDark}>
          {/* Example content */}
          {/* <Text style={styles.viewAllText}>View All{'\n'}+8 Task</Text> */}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardWhite: {
    flex: 1,
    height: 200,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginRight: 8,
    padding: 16,
    // Shadows for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    // Elevation for Android
    elevation: 5,
  },
  cardLightBlue: {
    flex: 1,
    height: 200,
    backgroundColor: '#d6f3f0', // Light blue/green tint
    borderRadius: 20,
    marginLeft: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardBeige: {
    flex: 1,
    height: 200,
    backgroundColor: '#f5efe9', // Light beige
    borderRadius: 20,
    marginRight: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardDark: {
    flex: 1,
    height: 200,
    backgroundColor: '#0a0a23', // Dark navy
    borderRadius: 20,
    marginLeft: 8,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  viewAllText: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default OverviewCards;
