import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PageLayout from '../pageLayout';
import DraggableList from '../draggableList';
import TimelineList from '../timelineList';
import ProgressBar from '../progressBar';
import BackButtonHeader from '../backButtonHeader';

const tasks = [
  { id: '1', text: 'Have a glass of water.', time: '07:00' },
  { id: '2', text: 'Morning jogging.', time: '07:30' },
  { id: '3', text: 'Have lunch with Jenny.', time: '12:00' },
  { id: '4', text: 'Send email to Tim.', time: '13:30' },
  { id: '5', text: 'Supermarket shopping list.', time: '15:00' },
  { id: '6', text: 'Grandma’s birthday.', time: '21:00' },
];

const Sunrise = () => {
  return (
    <PageLayout style={styles.container}>
      <BackButtonHeader/>
        <DraggableList tasksl={{}} checkboxStyles={styles.checkbox} checkedStyles={styles.checked}/>
        {/* <TimelineList/> */}
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF8E7',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  actions: {
    flexDirection: 'row',
  },
  settingsIcon: {
    marginLeft: 16,
  },
  checkbox: {
    borderColor: '#F4A261',
  },
  checked: {
    backgroundColor: '#F4A261',
    borderColor: '#F4A261'
  }
});

export default Sunrise;
