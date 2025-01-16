import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  PermissionsAndroid,
  Platform,
  Modal,
  SafeAreaView
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  addTask,
  markComplete,
  deleteTask,
  addContacts,
  assignToContact
} from "../Slice/taskSlice";
import Contacts from "react-native-contacts";
import { ButtonComponent } from "./ButtonComponent";

const TaskManager = ({ navigation }) => {
  const { tasks, contacts } = useSelector((state) => state.task);
  const dispatch = useDispatch();

  const [input, setInput] = useState("");
  const [showContacts, setShowContacts] = useState(false);
  const [selectedTaskID, setSelectedTaskID] = useState(null);

  useEffect(() => {
    const requestContactsPermission = async () => {
      if (Platform.OS === "ios") {
        const contacts = await Contacts.getAll();
        dispatch(addContacts(contacts));
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: "Contacts Permission",
            message: "This app requires access to your contacts.",
            buttonPositive: "Allow",
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          const contacts = await Contacts.getAll();
          dispatch(addContacts(contacts));
        } else {
          console.warn("Contacts permission denied");
        }
      }
    };

    requestContactsPermission();
  }, []);

  const handleAddTask = () => {
    if (!input.trim()) {
      alert("Task name cannot be empty");
      return;
    }

    const task = {
      name: input.trim(),
      completed: false,
      id: Date.now()
    };
    dispatch(addTask(task));
    setInput("");
  };

  const handleAssignTask = (id) => {
    setShowContacts(true);
    setSelectedTaskID(id);
  };

  const assignTaskToContact = (contact) => {
    if (!contact || !selectedTaskID) {
      alert("No contact selected or task ID is missing");
      return;
    }

    const taskUpdate = {
      id: selectedTaskID,
      ...contact,
    };
    dispatch(assignToContact(taskUpdate));
    setShowContacts(false);
    setSelectedTaskID(null);
  };

  const renderTask = ({ item }) => (
    <View style={styles.taskContainer}>
      <Text style={styles.taskTitle}>{item.name}</Text>
      <Text style={styles.taskStatus}>{item.completed ? "Completed" : "Pending"}</Text>
      <Text style={styles.taskDetails}>Assigned to: {item.givenName || "N/A"}</Text>
      <Text style={styles.taskDetails}>Mobile: {item.phoneNumbers?.[0]?.number || "N/A"}</Text>

      <ButtonComponent
        title="Delete"
        onPress={() => dispatch(deleteTask({ id: item.id }))}
        style={styles.taskButton}
      />

      <ButtonComponent
        title="Complete"
        onPress={() => dispatch(markComplete({ id: item.id }))}
        style={styles.taskButton}
      />

      <ButtonComponent
        title="Assign"
        onPress={() => handleAssignTask(item.id)}
        style={styles.taskButton}
      />
    </View>
  );

  const renderContact = ({ item }) => (
    <TouchableOpacity
      onPress={() => assignTaskToContact(item)}
      style={styles.contactContainer}
    >
      <Text>{item.givenName}</Text>
      <Text>{item.phoneNumbers?.[0]?.number}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Add a Task</Text>
      <TextInput
        value={input}
        onChangeText={setInput}
        placeholder="Enter task name"
        style={styles.input}
      />

      <TouchableOpacity
        onPress={handleAddTask}
        style={[styles.addButton, { backgroundColor: input.trim() ? "tomato" : "grey" }]}
        disabled={!input.trim()}
      >
        <Text style={styles.addButtonText}>Add Task</Text>
      </TouchableOpacity>

      <Text style={styles.sectionHeader}>All Tasks</Text>
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.taskList}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={showContacts}
        onRequestClose={() => setShowContacts(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <FlatList
            data={contacts}
            renderItem={renderContact}
            keyExtractor={(item, index) => index.toString()}
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  headerText: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  addButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  taskList: {
    paddingBottom: 20,
  },
  taskContainer: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  taskStatus: {
    marginTop: 5,
    fontSize: 14,
  },
  taskDetails: {
    fontSize: 12,
    color: "#555",
  },
  taskButton: {
    marginTop: 10,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  contactContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});

export default TaskManager;