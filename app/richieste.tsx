import { useUser } from "@/context/UserContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Richieste() {
  const router = useRouter();
  const { user } = useUser();
  const isAdmin = user?.ruolo === "admin";

  const [text, setText] = useState("");
  const [requests, setRequests] = useState([]);

  const addRequest = () => {
    if (!text.trim()) return;
    setRequests([
      {
        id: Date.now().toString(),
        text,
        nome: user?.nome,
        cognome: user?.cognome,
        data: new Date().toLocaleDateString("it-IT"),
        stato: "In attesa",
      },
      ...requests,
    ]);
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
      <View style={{ padding: 20, flex: 1 }}>

        <Text style={{ fontSize: 26, color: "white", marginBottom: 20 }}>
          {isAdmin ? "Richieste ricevute" : "Le mie richieste"}
        </Text>

        {/* Solo dipendente può inviare richieste */}
        {!isAdmin && (
          <View style={{ marginBottom: 20 }}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Scrivi una richiesta..."
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
              onPress={addRequest}
              style={{
                backgroundColor: "#2563eb",
                padding: 14,
                borderRadius: 10,
              }}
            >
              <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>
                Invia richiesta
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Lista richieste */}
        {requests.length === 0 ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: "#475569", fontSize: 15 }}>
              {isAdmin ? "Nessuna richiesta ricevuta." : "Non hai ancora inviato richieste."}
            </Text>
          </View>
        ) : (
          <FlatList
            data={requests}
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
                    {item.nome} {item.cognome}
                  </Text>
                  <Text style={{ color: "#475569", fontSize: 12 }}>
                    {item.data}
                  </Text>
                </View>

                <Text style={{ color: "white", fontSize: 15, lineHeight: 22, marginBottom: 10 }}>
                  {item.text}
                </Text>

                {/* Stato richiesta */}
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <Text style={{ color: statoColor(item.stato), fontSize: 12, fontWeight: "bold" }}>
                    ● {item.stato}
                  </Text>

                  {/* Solo admin può cambiare stato */}
                  {isAdmin && (
                    <View style={{ flexDirection: "row", gap: 8 }}>
                      <TouchableOpacity
                        onPress={() => setStato(item.id, "Approvata")}
                        style={{
                          backgroundColor: "#16a34a",
                          paddingHorizontal: 10,
                          paddingVertical: 5,
                          borderRadius: 6,
                        }}
                      >
                        <Text style={{ color: "white", fontSize: 11 }}>Approva</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setStato(item.id, "Rifiutata")}
                        style={{
                          backgroundColor: "#dc2626",
                          paddingHorizontal: 10,
                          paddingVertical: 5,
                          borderRadius: 6,
                        }}
                      >
                        <Text style={{ color: "white", fontSize: 11 }}>Rifiuta</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
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