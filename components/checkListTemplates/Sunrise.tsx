import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PageLayout from '../pageLayout';
import DraggableList from '../draggableList';
import TimelineList from '../timelineList';
import BackButtonHeader from '../backButtonHeader';

const Sunrise = ({checklistData}: any) => {
  const tasks = checklistData.tasks;
  return (
    <PageLayout style={styles.container}>
      <BackButtonHeader title={checklistData.title}/>
        <DraggableList checklistID={checklistData._id} items={tasks} checkboxStyles={styles.checkbox} checkedStyles={styles.checked}/>
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
