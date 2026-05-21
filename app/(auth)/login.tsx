import { useUser } from "@/context/UserContext";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Login() {
  const { setUser } = useUser();
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!nome.trim() || !cognome.trim()) {
      Alert.alert("Errore", "Inserisci nome e cognome");
      return;
    }
    if (!email.includes("@")) {
      Alert.alert("Errore", "Inserisci un'email valida");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Errore", "La password deve essere di almeno 6 caratteri");
      return;
    }
    setUser({ nome, cognome, email });
  };

  return (
    <View style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#0f172a",
      padding: 20,
    }}>
      <Text style={{ fontSize: 30, color: "white", marginBottom: 30 }}>
        App Aziendale
      </Text>

      {[
        { placeholder: "Nome", value: nome, onChange: setNome, secure: false },
        { placeholder: "Cognome", value: cognome, onChange: setCognome, secure: false },
        { placeholder: "Email", value: email, onChange: setEmail, secure: false },
        { placeholder: "Password", value: password, onChange: setPassword, secure: true },
      ].map(({ placeholder, value, onChange, secure }) => (
        <TextInput
          key={placeholder}
          placeholder={placeholder}
          placeholderTextColor="#aaa"
          value={value}
          onChangeText={onChange}
          secureTextEntry={secure}
          style={{
            backgroundColor: "#1e293b",
            color: "white",
            width: "100%",
            padding: 12,
            marginBottom: 10,
            borderRadius: 8,
          }}
        />
      ))}

      <TouchableOpacity
        onPress={handleLogin}
        style={{
          backgroundColor: "#2563eb",
          width: "100%",
          padding: 15,
          borderRadius: 10,
          marginTop: 10,
        }}
      >
        <Text style={{ color: "white", textAlign: "center", fontSize: 16 }}>
          Accedi
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setUser({ nome: "Test", cognome: "Utente", email: "test@test.it" })}
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 10,
          marginTop: 10,
          borderWidth: 1,
          borderColor: "#374151",
        }}
      >
        <Text style={{ color: "#94a3b8", textAlign: "center" }}>
          Accesso rapido (test)
        </Text>
      </TouchableOpacity>

    </View>
  );
}
