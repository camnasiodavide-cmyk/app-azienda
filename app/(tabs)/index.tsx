import { Text, View, TextInput, Button, FlatList } from "react-native";
import { useState } from "react";

export default function HomeScreen() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const [announcements, setAnnouncements] = useState([]);
  const [requests, setRequests] = useState([]);

  const [newMessage, setNewMessage] = useState("");
  const [newRequest, setNewRequest] = useState("");

  const login = () => {
    if (email && password) {
      setUser({ email, role });
    }
  };

  const logout = () => {
    setUser(null);
  };

  const addAnnouncement = () => {
    if (newMessage) {
      setAnnouncements([{ id: Date.now().toString(), text: newMessage }, ...announcements]);
      setNewMessage("");
    }
  };

  const addRequest = () => {
    if (newRequest) {
      setRequests([{ id: Date.now().toString(), text: newRequest, status: "In attesa" }, ...requests]);
      setNewRequest("");
    }
  };

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0f172a" }}>
        <Text style={{ fontSize: 28, color: "white", marginBottom: 30 }}>App Aziendale</Text>

        <TextInput placeholder="Email" onChangeText={setEmail}
          style={{ backgroundColor: "#1e293b", color: "white", width: "80%", padding: 10, marginBottom: 10 }} />

        <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword}
          style={{ backgroundColor: "#1e293b", color: "white", width: "80%", padding: 10, marginBottom: 20 }} />

        <Button title="Login User" onPress={() => { setRole("user"); login(); }} />
        <Button title="Login Admin" onPress={() => { setRole("admin"); login(); }} />
      </View>
    );
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>Benvenuto {user.email}</Text>
      <Button title="Logout" onPress={logout} />

      <Text style={{ marginTop: 20 }}>Comunicazioni</Text>

      {user.role === "admin" && (
        <>
          <TextInput value={newMessage} onChangeText={setNewMessage} style={{ borderWidth: 1 }} />
          <Button title="Pubblica" onPress={addAnnouncement} />
        </>
      )}

      <FlatList data={announcements} keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text>- {item.text}</Text>} />

      <Text style={{ marginTop: 20 }}>Richieste</Text>

      {user.role === "user" && (
        <>
          <TextInput value={newRequest} onChangeText={setNewRequest} style={{ borderWidth: 1 }} />
          <Button title="Invia" onPress={addRequest} />
        </>
      )}

      <FlatList data={requests} keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text>- {item.text}</Text>} />
    </View>
  );
}