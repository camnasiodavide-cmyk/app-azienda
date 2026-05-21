import { useUser } from "@/context/UserContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Richieste() {
  const router = useRouter();
  const { user } = useUser();

  const [text, setText] = useState("");
  const [requests, setRequests] = useState([]);

  const addRequest = () => {
    if (!text.trim()) return;
    setRequests([{ id: Date.now().toString(), text, nome: user?.nome, cognome: user?.cognome }, ...requests]);
    setText("");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0f172a" }}>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 26, color: "white", marginBottom: 20 }}>Richieste</Text>

        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Scrivi una richiesta"
          placeholderTextColor="#aaa"
          style={{ backgroundColor: "#1e293b", color: "white", padding: 12, borderRadius: 8, marginBottom: 10 }}
        />

        <TouchableOpacity
          onPress={addRequest}
          style={{ backgroundColor: "#2563eb", padding: 15, borderRadius: 10, marginBottom: 20 }}
        >
          <Text style={{ color: "white", textAlign: "center" }}>Invia richiesta</Text>
        </TouchableOpacity>

        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ backgroundColor: "#1e293b", padding: 10, borderRadius: 8, marginBottom: 10 }}>
              <Text style={{ color: "#94a3b8", fontSize: 12 }}>{item.nome} {item.cognome}</Text>
              <Text style={{ color: "white" }}>{item.text}</Text>
            </View>
          )}
        />

        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginTop: 20, backgroundColor: "#374151", padding: 12, borderRadius: 10 }}
        >
          <Text style={{ color: "white", textAlign: "center" }}>Torna indietro</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}