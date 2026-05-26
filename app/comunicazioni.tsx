import Header from "@/components/Header";
import { useUser } from "@/context/UserContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, FlatList, Keyboard, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Comunicazioni() {
  const router = useRouter();
  const { user } = useUser();

  const isSuperAdmin = user?.ruolo === "superadmin";
  const isAdmin = user?.ruolo === "admin";
  const canPublish = isSuperAdmin || isAdmin;

  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  const addMessage = () => {
    if (!text.trim()) return;
    Keyboard.dismiss();
    setMessages([{ id: Date.now().toString(), text, autore: `${user?.nome} ${user?.cognome}`, sede: isSuperAdmin ? "Tutte le sedi" : user?.sede, data: new Date().toLocaleDateString("it-IT") }, ...messages]);
    setText("");
  };

  const deleteMessage = (id: string) => {
    Alert.alert("Elimina", "Vuoi eliminare questa comunicazione?", [
      { text: "Annulla", style: "cancel" },
      { text: "Elimina", style: "destructive", onPress: () => setMessages(messages.filter((m) => m.id !== id)) },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0f172a" }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, padding: 20 }}>

          <Header titolo="Comunicazioni" sottotitolo={isSuperAdmin ? "Tutte le sedi" : `Sede ${user?.sede}`} />

          {canPublish && (
            <View style={{ marginBottom: 16 }}>
              <TextInput value={text} onChangeText={setText} placeholder="Scrivi una comunicazione..." placeholderTextColor="#aaa" multiline
                style={{ backgroundColor: "#1e293b", color: "white", padding: 12, borderRadius: 8, marginBottom: 10, minHeight: 90, textAlignVertical: "top" }} />
              <TouchableOpacity onPress={addMessage} style={{ backgroundColor: "#2563eb", padding: 14, borderRadius: 10, alignItems: "center" }}>
                <Text style={{ color: "white", fontWeight: "bold" }}>Pubblica</Text>
              </TouchableOpacity>
            </View>
          )}

          {messages.length === 0 ? (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <Text style={{ color: "#475569", fontSize: 15 }}>{canPublish ? "Nessuna comunicazione pubblicata." : "Nessuna comunicazione ricevuta."}</Text>
            </View>
          ) : (
            <FlatList data={messages} keyExtractor={(item) => item.id} keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <View style={{ backgroundColor: "#1e293b", padding: 14, borderRadius: 10, marginBottom: 10 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
                    <Text style={{ color: "#2563eb", fontSize: 12, fontWeight: "bold" }}>{item.autore}</Text>
                    <Text style={{ color: "#475569", fontSize: 12 }}>{item.data}</Text>
                  </View>
                  <Text style={{ color: "#94a3b8", fontSize: 11, marginBottom: 6 }}>🏢 {item.sede}</Text>
                  <Text style={{ color: "white", fontSize: 15, lineHeight: 22 }}>{item.text}</Text>
                  {canPublish && (
                    <TouchableOpacity onPress={() => deleteMessage(item.id)} style={{ marginTop: 10, alignSelf: "flex-end" }}>
                      <Text style={{ color: "#dc2626", fontSize: 12 }}>Elimina</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}