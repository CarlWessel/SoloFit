import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { styles } from "../styles";
import { MaterialIcons } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";
import WorkoutService from "../services/WorkoutService";

export default function Profile({ navigation }) {
  const [username, setUsername] = useState("TestUser");

  // Progress tracking state
  const [exercisesInHistory, setExercisesInHistory] = useState([]);
  const [selectedGraphExercise, setSelectedGraphExercise] = useState(null);
  const [graphMetric, setGraphMetric] = useState("volume"); // "volume" or "maxWeight"
  const [timeFilter, setTimeFilter] = useState("month"); // "week", "month", "year"
  const [chartData, setChartData] = useState(null);

  // Load exercises that appear in workout history
  const loadExercisesFromHistory = async () => {
    try {
      const history = await WorkoutService.getWorkoutHistory();
      
      // Extract unique exercises from history
      const exerciseMap = new Map();
      history.forEach((workout) => {
        workout.exercises.forEach((ex) => {
          if (!exerciseMap.has(ex.exerciseId)) {
            exerciseMap.set(ex.exerciseId, ex.name);
          }
        });
      });

      const exercises = Array.from(exerciseMap.entries()).map(([id, name]) => ({
        id,
        name,
      }));

      setExercisesInHistory(exercises);
      if (exercises.length > 0 && !selectedGraphExercise) {
        setSelectedGraphExercise(exercises[0].id);
      }
    } catch (err) {
      console.error("Failed to load history exercises:", err);
    }
  };

  // Calculate progress data for selected exercise
  const calculateProgressData = async () => {
    if (!selectedGraphExercise) return;

    try {
      const history = await WorkoutService.getWorkoutHistory();
      
      // Filter workouts containing the selected exercise
      const relevantWorkouts = history
        .map((workout) => {
          const exercise = workout.exercises.find(
            (ex) => ex.exerciseId === selectedGraphExercise
          );
          if (!exercise) return null;

          const date = new Date(workout.startDateTime);
          
          // Calculate metrics
          const volume = exercise.sets.reduce(
            (sum, set) => sum + set.reps * set.weight,
            0
          );
          const maxWeight = Math.max(...exercise.sets.map((set) => set.weight));

          return {
            date,
            volume,
            maxWeight,
          };
        })
        .filter(Boolean)
        .sort((a, b) => a.date - b.date); // Sort by date ascending

      if (relevantWorkouts.length === 0) {
        setChartData(null);
        return;
      }

      // TRISH NOTE: Filter by time range - week, month, year relative to current device's date
      // So that's 7 entries, 4 entries, 12 entries respectively
      const now = new Date();
      let filteredWorkouts = [];
      
      if (timeFilter === "week") {
        // Last 7 days
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        filteredWorkouts = relevantWorkouts.filter(w => w.date >= weekAgo);
      } else if (timeFilter === "month") {
        // Last 30 days, group by week (take max per week)
        const monthAgo = new Date(now);
        monthAgo.setDate(now.getDate() - 30);
        const inRange = relevantWorkouts.filter(w => w.date >= monthAgo);
        
        // Group by week
        const weekMap = new Map();
        inRange.forEach(w => {
          const weekStart = new Date(w.date);
          weekStart.setDate(w.date.getDate() - w.date.getDay()); // Start of week (Sunday)
          const weekKey = weekStart.toISOString().split('T')[0];
          
          if (!weekMap.has(weekKey)) {
            weekMap.set(weekKey, []);
          }
          weekMap.get(weekKey).push(w);
        });
        
        // Take max value per week
        filteredWorkouts = Array.from(weekMap.entries()).map(([weekKey, workouts]) => {
          const metric = graphMetric === "volume" ? "volume" : "maxWeight";
          const maxWorkout = workouts.reduce((max, w) => 
            w[metric] > max[metric] ? w : max
          );
          return maxWorkout;
        }).sort((a, b) => a.date - b.date);
        
      } else if (timeFilter === "year") {
        // Last 365 days, group by month (take max per month)
        const yearAgo = new Date(now);
        yearAgo.setFullYear(now.getFullYear() - 1);
        const inRange = relevantWorkouts.filter(w => w.date >= yearAgo);
        
        // Group by month
        const monthMap = new Map();
        inRange.forEach(w => {
          const monthKey = `${w.date.getFullYear()}-${(w.date.getMonth() + 1).toString().padStart(2, '0')}`;
          
          if (!monthMap.has(monthKey)) {
            monthMap.set(monthKey, []);
          }
          monthMap.get(monthKey).push(w);
        });
        
        // Take max value per month
        filteredWorkouts = Array.from(monthMap.entries()).map(([monthKey, workouts]) => {
          const metric = graphMetric === "volume" ? "volume" : "maxWeight";
          const maxWorkout = workouts.reduce((max, w) => 
            w[metric] > max[metric] ? w : max
          );
          return maxWorkout;
        }).sort((a, b) => a.date - b.date);
      }

      if (filteredWorkouts.length === 0) {
        setChartData(null);
        return;
      }

      // Format labels based on time filter
      const labels = filteredWorkouts.map((w) => {
        if (timeFilter === "week") {
          // Show day of week for week view
          const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          return days[w.date.getDay()];
        } else if (timeFilter === "month") {
          // Show month/day for month view
          const month = (w.date.getMonth() + 1).toString().padStart(2, '0');
          const day = w.date.getDate().toString().padStart(2, '0');
          return `${month}/${day}`;
        } else {
          // Show month abbreviation and year for year view
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const year = w.date.getFullYear().toString().slice(-2);
          return `${months[w.date.getMonth()]} '${year}`;
        }
      });

      // Get data based on selected metric
      const data =
        graphMetric === "volume"
          ? filteredWorkouts.map((w) => w.volume)
          : filteredWorkouts.map((w) => w.maxWeight);

      setChartData({
        labels,
        datasets: [{ data }],
      });
    } catch (err) {
      console.error("Failed to calculate progress:", err);
    }
  };

  useEffect(() => {
    loadExercisesFromHistory();
  }, []);

  // Refresh data when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadExercisesFromHistory();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (selectedGraphExercise) {
      calculateProgressData();
    }
  }, [selectedGraphExercise, graphMetric, timeFilter]);

  const chartConfig = {
    backgroundGradientFrom: "#333742",
    backgroundGradientFromOpacity: 0.8,
    backgroundGradientTo: "#522687",
    backgroundGradientToOpacity: 0.9,
    color: (opacity = 1) => `rgba(168, 174, 188, ${opacity})`,
    strokeWidth: 3,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    propsForDots: {
      r: "5",
      strokeWidth: "2",
      stroke: "#522687",
    },
    propsForBackgroundLines: {
      strokeDasharray: "",
      stroke: "#6D7381",
      strokeWidth: 1,
    },
    decimalPlaces: 0,
  };

  const screenWidth = Dimensions.get("window").width;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerLeft}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back-ios-new" style={styles.headerText} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Profile</Text>
      </View>

      {/* Content */}
      <View style={styles.main}>
        <Text style={styles.listHeader}>Logged in as:</Text>
        <Text style={styles.text}>{username}</Text>

        {/* Progress Graphs Section */}
        <View style={{ width: "100%", marginTop: 40, paddingHorizontal: 20 }}>
          <Text style={[styles.listHeader, { marginBottom: 15 }]}>
            📊 Progress Graph
          </Text>

          {exercisesInHistory.length === 0 ? (
            <View
              style={{
                backgroundColor: "#333742",
                padding: 20,
                borderRadius: 10,
                alignItems: "center",
              }}
            >
              <Text style={[styles.text, { opacity: 0.7, textAlign: "center" }]}>
                No workout history yet.{"\n"}Complete some workouts to see your
                progress!
              </Text>
            </View>
          ) : (
            <>
              {/* Exercise Selector */}
              <View
                style={{
                  backgroundColor: "#333742",
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: "#522687",
                  marginBottom: 15,
                  overflow: "hidden",
                }}
              >
                <Text
                  style={[
                    styles.text,
                    {
                      paddingHorizontal: 15,
                      paddingTop: 10,
                      fontSize: 14,
                      color: "#A8AEBC",
                    },
                  ]}
                >
                  Select Exercise:
                </Text>
                <Picker
                  selectedValue={selectedGraphExercise}
                  onValueChange={(value) => setSelectedGraphExercise(value)}
                  style={{
                    color: "#fff",
                    backgroundColor: "transparent",
                  }}
                  dropdownIconColor="#A8AEBC"
                >
                  {exercisesInHistory.map((ex) => (
                    <Picker.Item
                      key={ex.id}
                      label={ex.name}
                      value={ex.id}
                    />
                  ))}
                </Picker>
              </View>

              {/* Time Filter Selector */}
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  marginBottom: 15,
                }}
              >
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor:
                      timeFilter === "week" ? "#522687" : "#6D7381",
                    padding: 12,
                    borderRadius: 10,
                    alignItems: "center",
                  }}
                  onPress={() => setTimeFilter("week")}
                >
                  <Text style={[styles.text, { fontSize: 14 }]}>
                    Week
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor:
                      timeFilter === "month" ? "#522687" : "#6D7381",
                    padding: 12,
                    borderRadius: 10,
                    alignItems: "center",
                  }}
                  onPress={() => setTimeFilter("month")}
                >
                  <Text style={[styles.text, { fontSize: 14 }]}>
                    Month
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor:
                      timeFilter === "year" ? "#522687" : "#6D7381",
                    padding: 12,
                    borderRadius: 10,
                    alignItems: "center",
                  }}
                  onPress={() => setTimeFilter("year")}
                >
                  <Text style={[styles.text, { fontSize: 14 }]}>
                    Year
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Metric Selector */}
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  marginBottom: 20,
                }}
              >
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor:
                      graphMetric === "volume" ? "#522687" : "#6D7381",
                    padding: 15,
                    borderRadius: 10,
                    alignItems: "center",
                  }}
                  onPress={() => setGraphMetric("volume")}
                >
                  <Text style={[styles.text, { fontWeight: "bold" }]}>
                    Total Volume
                  </Text>
                  <Text style={[styles.text, { fontSize: 12, opacity: 0.8 }]}>
                    (reps x weight)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor:
                      graphMetric === "maxWeight" ? "#522687" : "#6D7381",
                    padding: 15,
                    borderRadius: 10,
                    alignItems: "center",
                  }}
                  onPress={() => setGraphMetric("maxWeight")}
                >
                  <Text style={[styles.text, { fontWeight: "bold" }]}>
                    Max Weight
                  </Text>
                  <Text style={[styles.text, { fontSize: 12, opacity: 0.8 }]}>
                    (heaviest set)
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Chart */}
              {chartData && chartData.datasets[0].data.length > 0 ? (
                <View
                  style={{
                    backgroundColor: "#333742",
                    borderRadius: 10,
                    padding: 10,
                    alignItems: "center",
                  }}
                >
                  <LineChart
                    data={chartData}
                    width={screenWidth - 60}
                    height={280}
                    chartConfig={chartConfig}
                    bezier
                    style={{
                      borderRadius: 10,
                    }}
                    withInnerLines={true}
                    withOuterLines={true}
                    withVerticalLines={false}
                    withHorizontalLines={true}
                    withDots={true}
                    withShadow={false}
                    yAxisSuffix={graphMetric === "volume" ? "" : "lb"}
                    formatYLabel={(value) => Math.round(value).toString()}
                  />
                  <Text
                    style={[
                      styles.text,
                      { marginTop: 10, fontSize: 12, opacity: 0.7 },
                    ]}
                  >
                    {timeFilter === "week" 
                      ? "Last 7 days" 
                      : timeFilter === "month"
                      ? "Last 30 days (weekly peaks)"
                      : "Last year (monthly peaks)"}
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    backgroundColor: "#333742",
                    padding: 20,
                    borderRadius: 10,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={[styles.text, { opacity: 0.7, textAlign: "center" }]}
                  >
                    No data available for this time period.
                  </Text>
                </View>
              )}
            </>
          )}
        </View>

        {/* Personal Records Section (Placeholder) */}
        <Text style={[styles.listHeader, { marginTop: 40 }]}>
          🏆 Personal Records
        </Text>
        <View
          style={{
            backgroundColor: "#333742",
            padding: 20,
            borderRadius: 10,
            marginTop: 10,
            width: "90%",
            alignItems: "center",
            marginBottom: 30,
          }}
        >
          <Text style={[styles.text, { opacity: 0.7 }]}>
            Coming soon: Track your all-time bests!
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
