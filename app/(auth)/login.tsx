import { useUser } from "@/context/UserContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Login() {
  const { setUser } = useUser();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email.includes("@")) {
      Alert.alert("Errore", "Inserisci un'email valida");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Errore", "La password deve essere di almeno 6 caratteri");
      return;
    }
    // Con Firebase qui faremo la vera autenticazione
    Alert.alert("Info", "Autenticazione reale disponibile dopo integrazione Firebase");
  };

  return (
    <View style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#0f172a",
      padding: 20,
    }}>
      <Text style={{ fontSize: 30, color: "white", marginBottom: 6, fontWeight: "bold" }}>
        App Aziendale
      </Text>
      <Text style={{ color: "#94a3b8", marginBottom: 30, fontSize: 14 }}>
        Accedi al tuo account
      </Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{
          backgroundColor: "#1e293b",
          color: "white",
          width: "100%",
          padding: 12,
          marginBottom: 10,
          borderRadius: 8,
        }}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          backgroundColor: "#1e293b",
          color: "white",
          width: "100%",
          padding: 12,
          marginBottom: 20,
          borderRadius: 8,
        }}
      />

      <TouchableOpacity
        onPress={handleLogin}
        style={{
          backgroundColor: "#2563eb",
          width: "100%",
          padding: 15,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: "white", textAlign: "center", fontSize: 16, fontWeight: "bold" }}>
          Accedi
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/(auth)/registrazione")}
        style={{ marginTop: 20 }}
      >
        <Text style={{ color: "#94a3b8", fontSize: 14 }}>
          Prima volta?{" "}
          <Text style={{ color: "#2563eb", fontWeight: "bold" }}>Registrati</Text>
        </Text>
      </TouchableOpacity>

      {/* Bottoni test — da rimuovere dopo Firebase */}
      <View style={{ flexDirection: "row", gap: 10, width: "100%", marginTop: 30 }}>
        <TouchableOpacity
          onPress={() => setUser({ nome: "Admin", cognome: "Test", email: "admin@test.it", ruolo: "admin" })}
          style={{
            flex: 1, padding: 12, borderRadius: 10,
            borderWidth: 1, borderColor: "#2563eb",
          }}
        >
          <Text style={{ color: "#2563eb", textAlign: "center", fontSize: 12 }}>
            Test Admin
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setUser({ nome: "Mario", cognome: "Rossi", email: "mario@test.it", ruolo: "dipendente" })}
          style={{
            flex: 1, padding: 12, borderRadius: 10,
            borderWidth: 1, borderColor: "#374151",
          }}
        >
          <Text style={{ color: "#94a3b8", textAlign: "center", fontSize: 12 }}>
            Test Dipendente
          </Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}