import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const data = {
  labels: ["28.10", "28.10", "28.10", "28.10", "28.10", "30.10", "30.10"],
  datasets: [
    {
      data: [3.2, 6.0, 4.0, 7.5, 8.5, 13.0, 12.8],
      color: () => "rgba(255, 94, 58, 1)",
      strokeWidth: 3,
    },
  ],
};

const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  color: () => `rgba(255, 94, 58, 1)`,
  labelColor: () => "#888",
  propsForDots: {
    r: "5",
    strokeWidth: "2",
    stroke: "#fff",
  },
};

const LineChartComponent = () => {
  return (
    <View style={styles.card}>
      <LineChart
        data={data}
        width={screenWidth - 10}
        height={220}
        chartConfig={chartConfig}
        bezier
        withDots
        withShadow={true}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
        withInnerLines={false}
        withOuterLines={false}
        transparent
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  date: {
    color: "#888",
    fontSize: 12,
  },
  menu: {
    fontSize: 18,
    color: "#888",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  completed: {
    fontSize: 28,
    fontWeight: "bold",
  },
  label: {
    color: "#888",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#FF5E3A",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default LineChartComponent;
