import Header from "@/components/Header";
import { useUser } from "@/context/UserContext";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, FlatList, Keyboard, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Allegato = { nome: string; tipo: "documento" | "immagine"; uri: string };
type Messaggio = { id: string; text: string; autore: string; sede: string; data: string; allegati: Allegato[] };

export default function Comunicazioni() {
  const router = useRouter();
  const { user } = useUser();

  const isSuperAdmin = user?.ruolo === "superadmin";
  const isAdmin = user?.ruolo === "admin";
  const canPublish = isSuperAdmin || isAdmin;

  const [text, setText] = useState("");
  const [allegati, setAllegati] = useState<Allegato[]>([]);
  const [messages, setMessages] = useState<Messaggio[]>([]);

  const selezionaDocumento = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: "*/*", copyToCacheDirectory: true });
    if (!result.canceled && result.assets[0]) {
      const file = result.assets[0];
      setAllegati([...allegati, { nome: file.name, tipo: "documento", uri: file.uri }]);
    }
  };

  const selezionaImmagine = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (!result.canceled && result.assets[0]) {
      const file = result.assets[0];
      const nome = file.uri.split("/").pop() || "immagine.jpg";
      setAllegati([...allegati, { nome, tipo: "immagine", uri: file.uri }]);
    }
  };

  const rimuoviAllegato = (index: number) => {
    setAllegati(allegati.filter((_, i) => i !== index));
  };

  const addMessage = () => {
    if (!text.trim() && allegati.length === 0) {
      Alert.alert("Errore", "Scrivi un testo o allega un file");
      return;
    }
    Keyboard.dismiss();
    setMessages([{
      id: Date.now().toString(),
      text,
      autore: `${user?.nome} ${user?.cognome}`,
      sede: isSuperAdmin ? "Tutte le sedi" : user?.sede as string,
      data: new Date().toLocaleDateString("it-IT"),
      allegati: [...allegati],
    }, ...messages]);
    setText("");
    setAllegati([]);
  };

  const deleteMessage = (id: string) => {
    Alert.alert("Elimina", "Vuoi eliminare questa comunicazione?", [
      { text: "Annulla", style: "cancel" },
      { text: "Elimina", style: "destructive", onPress: () => setMessages(messages.filter((m) => m.id !== id)) },
    ]);
  };

  const iconaAllegato = (tipo: string) => tipo === "immagine" ? "🖼️" : "📄";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0f172a" }}>
      <Header titolo="Comunicazioni" sottotitolo={isSuperAdmin ? "Tutte le sedi" : `Sede ${user?.sede}`} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, padding: 20 }}>

          {canPublish && (
            <View style={{ marginBottom: 16 }}>
              <TextInput value={text} onChangeText={setText} placeholder="Scrivi una comunicazione..." placeholderTextColor="#aaa" multiline
                style={{ backgroundColor: "#1e293b", color: "white", padding: 12, borderRadius: 8, marginBottom: 10, minHeight: 80, textAlignVertical: "top" }} />

              {/* Allegati selezionati */}
              {allegati.length > 0 && (
                <View style={{ marginBottom: 10 }}>
                  {allegati.map((a, i) => (
                    <View key={i} style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#1e293b", padding: 10, borderRadius: 8, marginBottom: 6 }}>
                      <Text style={{ fontSize: 16, marginRight: 8 }}>{iconaAllegato(a.tipo)}</Text>
                      <Text style={{ color: "white", fontSize: 12, flex: 1 }} numberOfLines={1}>{a.nome}</Text>
                      <TouchableOpacity onPress={() => rimuoviAllegato(i)}>
                        <Text style={{ color: "#dc2626", fontSize: 12, marginLeft: 8 }}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              {/* Bottoni allegati */}
              <View style={{ flexDirection: "row", gap: 8, marginBottom: 10 }}>
                <TouchableOpacity onPress={selezionaDocumento} style={{ flex: 1, padding: 10, borderRadius: 8, backgroundColor: "#1e293b", borderWidth: 1, borderColor: "#374151", alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 6 }}>
                  <Text style={{ fontSize: 16 }}>📄</Text>
                  <Text style={{ color: "#94a3b8", fontSize: 12 }}>Documento</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={selezionaImmagine} style={{ flex: 1, padding: 10, borderRadius: 8, backgroundColor: "#1e293b", borderWidth: 1, borderColor: "#374151", alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 6 }}>
                  <Text style={{ fontSize: 16 }}>🖼️</Text>
                  <Text style={{ color: "#94a3b8", fontSize: 12 }}>Immagine</Text>
                </TouchableOpacity>
              </View>

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
                  {item.text ? <Text style={{ color: "white", fontSize: 15, lineHeight: 22, marginBottom: item.allegati.length > 0 ? 10 : 0 }}>{item.text}</Text> : null}
                  {item.allegati.length > 0 && (
                    <View style={{ marginTop: 6 }}>
                      {item.allegati.map((a, i) => (
                        <TouchableOpacity key={i} onPress={() => Alert.alert("Apri", "Disponibile dopo integrazione Firebase Storage")}
                          style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#0f172a", padding: 8, borderRadius: 6, marginBottom: 4 }}>
                          <Text style={{ fontSize: 14, marginRight: 6 }}>{iconaAllegato(a.tipo)}</Text>
                          <Text style={{ color: "#93c5fd", fontSize: 12, flex: 1 }} numberOfLines={1}>{a.nome}</Text>
                          <Text style={{ color: "#475569", fontSize: 11 }}>Apri →</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
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