import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";

export default function Login({ setUser }) {
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#0f172a",
      padding: 20
    }}>

      <Text style={{
        fontSize: 30,
        color: "white",
        marginBottom: 30
      }}>
        Login Aziendale
      </Text>

      <TextInput
        placeholder="Nome"
        placeholderTextColor="#aaa"
        onChangeText={setNome}
        style={{
          backgroundColor: "#1e293b",
          color: "white",
          width: "100%",
          padding: 12,
          marginBottom: 10,
          borderRadius: 8
        }}
      />

      <TextInput
        placeholder="Cognome"
        placeholderTextColor="#aaa"
        onChangeText={setCognome}
        style={{
          backgroundColor: "#1e293b",
          color: "white",
          width: "100%",
          padding: 12,
          marginBottom: 10,
          borderRadius: 8
        }}
      />

      <TextInput
        placeholder="Email"
        placeholderTextColor="#aaa"
        onChangeText={setEmail}
        style={{
          backgroundColor: "#1e293b",
          color: "white",
          width: "100%",
          padding: 12,
          marginBottom: 10,
          borderRadius: 8
        }}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        onChangeText={setPassword}
        style={{
          backgroundColor: "#1e293b",
          color: "white",
          width: "100%",
          padding: 12,
          marginBottom: 20,
          borderRadius: 8
        }}
      />

      <Button
        title="Accedi"
        onPress={() =>
          setUser({
            nome,
            cognome,
            email
          })
        }
      />

    </View>
  );
}