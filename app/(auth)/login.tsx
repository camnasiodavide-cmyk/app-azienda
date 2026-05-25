import { useUser } from "@/context/UserContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

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
    Alert.alert("Info", "Autenticazione reale disponibile dopo integrazione Firebase");
  };

  return (
    <ScrollView contentContainerStyle={{
      flexGrow: 1,
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
        placeholder="Email aziendale"
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
      <Text style={{ color: "#475569", fontSize: 11, marginTop: 30, marginBottom: 10 }}>
        ACCESSO RAPIDO TEST
      </Text>

      <TouchableOpacity
        onPress={() => setUser({ nome: "Super", cognome: "Admin", email: "super@test.it", ruolo: "superadmin", sede: "Cosmelux" })}
        style={{
          width: "100%", padding: 12, borderRadius: 10, marginBottom: 8,
          borderWidth: 1, borderColor: "#7c3aed",
        }}
      >
        <Text style={{ color: "#a78bfa", textAlign: "center", fontSize: 12 }}>
          👑 Super Admin
        </Text>
      </TouchableOpacity>

      <View style={{ flexDirection: "row", gap: 8, width: "100%", marginBottom: 8 }}>
        <TouchableOpacity
          onPress={() => setUser({ nome: "Admin", cognome: "Cosmelux", email: "admin@cosmelux.it", ruolo: "admin", sede: "Cosmelux" })}
          style={{
            flex: 1, padding: 12, borderRadius: 10,
            borderWidth: 1, borderColor: "#2563eb",
          }}
        >
          <Text style={{ color: "#93c5fd", textAlign: "center", fontSize: 11 }}>
            🏢 Admin Cosmelux
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setUser({ nome: "Admin", cognome: "Indeco", email: "admin@indeco.it", ruolo: "admin", sede: "Indeco" })}
          style={{
            flex: 1, padding: 12, borderRadius: 10,
            borderWidth: 1, borderColor: "#2563eb",
          }}
        >
          <Text style={{ color: "#93c5fd", textAlign: "center", fontSize: 11 }}>
            🏢 Admin Indeco
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: "row", gap: 8, width: "100%" }}>
        <TouchableOpacity
          onPress={() => setUser({ nome: "Mario", cognome: "Rossi", email: "mario@cosmelux.it", ruolo: "dipendente", sede: "Cosmelux" })}
          style={{
            flex: 1, padding: 12, borderRadius: 10,
            borderWidth: 1, borderColor: "#374151",
          }}
        >
          <Text style={{ color: "#94a3b8", textAlign: "center", fontSize: 11 }}>
            👤 Dipendente Cosmelux
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setUser({ nome: "Luca", cognome: "Bianchi", email: "luca@indeco.it", ruolo: "dipendente", sede: "Indeco" })}
          style={{
            flex: 1, padding: 12, borderRadius: 10,
            borderWidth: 1, borderColor: "#374151",
          }}
        >
          <Text style={{ color: "#94a3b8", textAlign: "center", fontSize: 11 }}>
            👤 Dipendente Indeco
          </Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}