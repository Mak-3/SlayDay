// src/data/dummyData.js

// Dummy Tasks or Events
export const dummyTasks = [
    {
      id: "event-1",
      title: "Design Review Meeting",      // Required
      description: "Discuss new landing page designs.",  // Optional
      deadline: "2025-03-20T10:00:00Z",    // Required
      priority: "High",                    // Optional (Low by default)
      tags: ["design", "review"],          // Optional
      tasks: [                             // Optional subtasks
        { id: "subtask-1", title: "Prepare Slides", completed: false },
        { id: "subtask-2", title: "Gather Feedback", completed: false },
      ],
    },
    {
      id: "event-2",
      title: "Code Refactoring",           // Required
      description: "",                     // Optional (empty)
      deadline: "2025-03-22T14:00:00Z",    // Required
      priority: "Medium",                  // Optional
      tags: [],                            // Optional (empty array)
      tasks: [],                           // Optional (empty array)
    },
    {
      id: "event-3",
      title: "Team Standup",
      description: "Daily sync-up meeting",
      deadline: "2025-03-21T09:00:00Z",
      priority: "Low",
      tags: ["standup", "daily"],
      tasks: [
        { id: "subtask-3", title: "Update Jira board", completed: true },
      ],
    },
  ];
  
  
  // Dummy Routines
  export const dummyRoutines = [
    {
      id: "routine-1",
      routineName: "Morning Routine",      // Required
      description: "Start your day fresh!", // Optional
      tags: ["health", "wellness"],        // Optional
      startTime: "2025-03-16T06:30:00Z",   // Required
      repeatDays: "Mon, Tue, Wed, Thu, Fri", // Optional
      lockSubtaskOrder: true,              // Optional (false by default)
      tasks: [
        { id: "routine-task-1", title: "Meditation", completed: false },
        { id: "routine-task-2", title: "Jogging", completed: false },
      ],
    },
    {
      id: "routine-2",
      routineName: "Evening Study",
      description: "",                     // Optional
      tags: ["study", "focus"],
      startTime: "2025-03-16T19:00:00Z",
      repeatDays: "Mon, Wed, Fri",
      lockSubtaskOrder: false,
      tasks: [
        { id: "routine-task-3", title: "Revise Algorithms", completed: false },
        { id: "routine-task-4", title: "Practice DSA problems", completed: false },
      ],
    },
    {
      id: "routine-3",
      routineName: "Workout Routine",
      description: "Strength training and cardio",
      tags: [],
      startTime: "2025-03-16T17:00:00Z",
      repeatDays: "Tue, Thu, Sat",
      lockSubtaskOrder: true,
      tasks: [],
    },
  ];
  
  export const pomodoroData = [
    {
      id: "pom1",
      taskTitle: "Design App Dashboard 🖌️",
      time: 1500, // 25 mins
      selectedTime: 1500, // picked 25 min option
    },
    {
      id: "pom2",
      taskTitle: "Write Blog on React Performance 🚀",
      time: 3000, // 50 mins
      selectedTime: null, // custom time entered
    },
    {
      id: "pom3",
      taskTitle: "Fix Bugs in Todo App 🐛",
      time: 900, // 15 mins
      selectedTime: 900,
    },
  ];

  
  export const reminderData = [
    {
      id: "rem1",
      title: "Drink Water 💧",
      description: "Stay hydrated! Aim for 8 glasses today.",
      selectedColor: "#1E90FF",
      startDateTime: "2025-03-17T09:00:00Z",
      repeat: true,
      frequency: "Daily",
      tags: ["Health", "Habit"],
    },
    {
      id: "rem2",
      title: "Team Meeting 📅",
      description: "Project sync-up with the dev team.",
      selectedColor: "#8A2BE2",
      startDateTime: "2025-03-18T14:30:00Z",
      repeat: false,
      frequency: "", // optional because repeat is false
      tags: ["Work", "Meeting"],
    },
    {
      id: "rem3",
      title: "Yoga Session 🧘‍♂️",
      description: "",
      selectedColor: "#3CB371",
      startDateTime: "2025-03-19T06:00:00Z",
      repeat: true,
      frequency: "Weekly",
      tags: ["Exercise", "Wellness"],
    },
  ];
  