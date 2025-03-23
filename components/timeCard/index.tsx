import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Task = {
  time: string;
  task: string;
};

type TasksData = {
  [key: string]: Task[];
};

type TimeCardProps = {
  selectedDate: string;
};

const TimeCard: React.FC<TimeCardProps> = ({ selectedDate }) => {
  const tasks: TasksData = {
    '2025-03-03': [
      { time: '09:00', task: 'Task 1' },
      { time: '11:00', task: 'Task 2' },
      { time: '13:00', task: 'Task 3' },
      { time: '17:00', task: 'Task 4' },
      { time: '20:00', task: 'Task 5' },
    ],
  };

  return (
    <View>
      {tasks['2025-03-03'].map((item, index) => (
        <View style={[styles.taskCard, index & 1 ? {left: 60} : {}]}>
            <Text>
                {item.time}
            </Text>
            <View style={styles.taskItem}>
                <Text>
                    {item.task}
                </Text>
            </View>
            </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
    taskCard: {
        flexDirection: 'row',
        gap: 10,
        marginVertical: 10
    },
    taskTime: {
        
    },
    taskItem: {
        width: '75%',
        maxWidth: 350,
        height: 80,
        backgroundColor: 'red',
        borderRadius: 10,
        padding: 8
    }
})
export default TimeCard;