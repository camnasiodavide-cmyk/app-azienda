import Header from "@/components/Header";
import { useUser } from "@/context/UserContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Keyboard, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Richieste() {
  const router = useRouter();
  const { user } = useUser();

  const isSuperAdmin = user?.ruolo === "superadmin";
  const isAdmin = user?.ruolo === "admin";
  const isDipendente = user?.ruolo === "dipendente";

  const [text, setText] = useState("");
  const [requests, setRequests] = useState<{id: string; text: string; nome: string; cognome: string; sede: string; data: string; stato: string}[]>([]);

  const addRequest = () => {
    if (!text.trim()) return;
    Keyboard.dismiss();
    setRequests([{ id: Date.now().toString(), text, nome: user?.nome || "", cognome: user?.cognome || "", sede: user?.sede || "", data: new Date().toLocaleDateString("it-IT"), stato: "In attesa" }, ...requests]);
    setText("");
  };

  const setStato = (id: string, stato: string) => {
    setRequests(requests.map((r) => r.id === id ? { ...r, stato } : r));
  };

  const statoColor = (stato: string) => {
    if (stato === "Approvata") return "#16a34a";
    if (stato === "Rifiutata") return "#dc2626";
    return "#d97706";
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0f172a" }}>
      <Header titolo="Richieste" sottotitolo={isSuperAdmin || isAdmin ? "Richieste ricevute" : "Le mie richieste"} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, padding: 20 }}>
          {isDipendente && (
            <View style={{ marginBottom: 16 }}>
              <TextInput value={text} onChangeText={setText} placeholder="Scrivi una richiesta..." placeholderTextColor="#aaa" multiline
                style={{ backgroundColor: "#1e293b", color: "white", padding: 12, borderRadius: 8, marginBottom: 10, minHeight: 90, textAlignVertical: "top" }} />
              <TouchableOpacity onPress={addRequest} style={{ backgroundColor: "#2563eb", padding: 14, borderRadius: 10, alignItems: "center" }}>
                <Text style={{ color: "white", fontWeight: "bold" }}>Invia richiesta</Text>
              </TouchableOpacity>
            </View>
          )}

          {requests.length === 0 ? (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <Text style={{ color: "#475569", fontSize: 15 }}>{isDipendente ? "Non hai ancora inviato richieste." : "Nessuna richiesta ricevuta."}</Text>
            </View>
          ) : (
            <FlatList data={requests} keyExtractor={(item) => item.id} keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <View style={{ backgroundColor: "#1e293b", padding: 14, borderRadius: 10, marginBottom: 10 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
                    <Text style={{ color: "#2563eb", fontSize: 12, fontWeight: "bold" }}>{item.nome} {item.cognome}</Text>
                    <Text style={{ color: "#475569", fontSize: 12 }}>{item.data}</Text>
                  </View>
                  <Text style={{ color: "#94a3b8", fontSize: 11, marginBottom: 6 }}>🏢 {item.sede}</Text>
                  <Text style={{ color: "white", fontSize: 15, lineHeight: 22, marginBottom: 10 }}>{item.text}</Text>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={{ color: statoColor(item.stato), fontSize: 12, fontWeight: "bold" }}>● {item.stato}</Text>
                    {(isAdmin || isSuperAdmin) && (
                      <View style={{ flexDirection: "row", gap: 8 }}>
                        <TouchableOpacity onPress={() => setStato(item.id, "Approvata")} style={{ backgroundColor: "#16a34a", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 }}>
                          <Text style={{ color: "white", fontSize: 11 }}>Approva</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setStato(item.id, "Rifiutata")} style={{ backgroundColor: "#dc2626", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 }}>
                          <Text style={{ color: "white", fontSize: 11 }}>Rifiuta</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              )}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}