import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; // Or MaterialIcons, FontAwesome, etc.

interface TaskStatusCardProps{
    title: string,
    tasks: number,
    bgColor: string,
    iconName: string,
    bgIconName: string,
}
const TaskStatusCard: React.FC<TaskStatusCardProps> = ({ title, tasks, bgColor, iconName, bgIconName }) => {
  return (
    <View style={[styles.card, { backgroundColor: bgColor }]}>
      
      <Icon
        name={bgIconName}
        size={120}           
        color="rgba(0,0,0,0.05)"
        style={styles.bgIcon}
      />

      <Icon
        name={iconName}
        size={32}
        color="#333"
        style={styles.mainIcon}
      />

      <Text style={styles.tasks}>{tasks} tasks</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    maxWidth: 200,
    height: 160,
    borderRadius: 24,
    padding: 24,
    justifyContent: 'flex-start',
    overflow: 'hidden',
    position: 'relative',
  },
  bgIcon: {
    position: 'absolute',
    bottom: 20,
    right: -50,
    transform: [{ rotate: '-30deg' }]
  },
  mainIcon: {
    marginBottom: 12,
  },
  tasks: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default TaskStatusCard;