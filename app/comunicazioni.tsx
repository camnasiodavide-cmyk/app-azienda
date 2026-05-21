import { useUser } from "@/context/UserContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Comunicazioni() {
  const router = useRouter();
  const { user } = useUser();
  const isAdmin = user?.ruolo === "admin";

  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  const addMessage = () => {
    if (!text.trim()) return;
    setMessages([
      {
        id: Date.now().toString(),
        text,
        autore: `${user?.nome} ${user?.cognome}`,
        data: new Date().toLocaleDateString("it-IT"),
      },
      ...messages,
    ]);
    setText("");
  };

  const deleteMessage = (id: string) => {
    Alert.alert("Elimina", "Vuoi eliminare questa comunicazione?", [
      { text: "Annulla", style: "cancel" },
      {
        text: "Elimina",
        style: "destructive",
        onPress: () => setMessages(messages.filter((m) => m.id !== id)),
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0f172a" }}>
      <View style={{ padding: 20, flex: 1 }}>

        <Text style={{ fontSize: 26, color: "white", marginBottom: 20 }}>
          Comunicazioni
        </Text>

        {/* Solo admin può scrivere */}
        {isAdmin && (
          <View style={{ marginBottom: 20 }}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Scrivi una comunicazione..."
              placeholderTextColor="#aaa"
              multiline
              style={{
                backgroundColor: "#1e293b",
                color: "white",
                padding: 12,
                borderRadius: 8,
                marginBottom: 10,
                minHeight: 80,
                textAlignVertical: "top",
              }}
            />
            <TouchableOpacity
              onPress={addMessage}
              style={{
                backgroundColor: "#2563eb",
                padding: 14,
                borderRadius: 10,
              }}
            >
              <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>
                Pubblica comunicazione
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Lista comunicazioni */}
        {messages.length === 0 ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: "#475569", fontSize: 15 }}>
              {isAdmin ? "Nessuna comunicazione pubblicata." : "Nessuna comunicazione ricevuta."}
            </Text>
          </View>
        ) : (
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={{
                backgroundColor: "#1e293b",
                padding: 14,
                borderRadius: 10,
                marginBottom: 10,
              }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
                  <Text style={{ color: "#2563eb", fontSize: 12, fontWeight: "bold" }}>
                    {item.autore}
                  </Text>
                  <Text style={{ color: "#475569", fontSize: 12 }}>
                    {item.data}
                  </Text>
                </View>
                <Text style={{ color: "white", fontSize: 15, lineHeight: 22 }}>
                  {item.text}
                </Text>

                {/* Solo admin può eliminare */}
                {isAdmin && (
                  <TouchableOpacity
                    onPress={() => deleteMessage(item.id)}
                    style={{ marginTop: 10, alignSelf: "flex-end" }}
                  >
                    <Text style={{ color: "#dc2626", fontSize: 12 }}>
                      Elimina
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          />
        )}

        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            marginTop: 10,
            backgroundColor: "#374151",
            padding: 12,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: "white", textAlign: "center" }}>
            Torna indietro
          </Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}