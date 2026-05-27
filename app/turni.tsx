import Header from "@/components/Header";
import { useUser } from "@/context/UserContext";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Allegato = { nome: string; tipo: "documento" | "immagine"; uri: string };
type Turno = { id: string; sede: string; settimana: string; allegati: Allegato[]; caricatoDa: string; data: string };

export default function Turni() {
  const router = useRouter();
  const { user } = useUser();

  const isSuperAdmin = user?.ruolo === "superadmin";
  const isAdmin = user?.ruolo === "admin";
  const canUpload = isSuperAdmin || isAdmin;

  const [turni, setTurni] = useState<Turno[]>([
    { id: "1", sede: "Cosmelux", settimana: "19 - 25 Maggio 2025", allegati: [{ nome: "turno_cosmelux.pdf", tipo: "documento", uri: "" }], caricatoDa: "Admin Cosmelux", data: "18/05/2025" },
    { id: "2", sede: "Indeco", settimana: "19 - 25 Maggio 2025", allegati: [{ nome: "turno_indeco.jpg", tipo: "immagine", uri: "" }], caricatoDa: "Admin Indeco", data: "18/05/2025" },
  ]);

  const [sedeSelezionata, setSedeSelezionata] = useState<"Cosmelux" | "Indeco">(
    isSuperAdmin ? "Cosmelux" : user?.sede as "Cosmelux" | "Indeco"
  );

  const [nuoviAllegati, setNuoviAllegati] = useState<Allegato[]>([]);
  const [mostraForm, setMostraForm] = useState(false);

  const turniFiltrati = isSuperAdmin
    ? turni.filter((t) => t.sede === sedeSelezionata)
    : turni.filter((t) => t.sede === user?.sede);

  const selezionaDocumento = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: "*/*", copyToCacheDirectory: true });
    if (!result.canceled && result.assets[0]) {
      const file = result.assets[0];
      setNuoviAllegati([...nuoviAllegati, { nome: file.name, tipo: "documento", uri: file.uri }]);
    }
  };

  const selezionaImmagine = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (!result.canceled && result.assets[0]) {
      const file = result.assets[0];
      const nome = file.uri.split("/").pop() || "immagine.jpg";
      setNuoviAllegati([...nuoviAllegati, { nome, tipo: "immagine", uri: file.uri }]);
    }
  };

  const rimuoviAllegato = (index: number) => {
    setNuoviAllegati(nuoviAllegati.filter((_, i) => i !== index));
  };

  const handleCarica = () => {
    if (nuoviAllegati.length === 0) {
      Alert.alert("Errore", "Seleziona almeno un file");
      return;
    }
    const nuovoTurno: Turno = {
      id: Date.now().toString(),
      sede: isSuperAdmin ? sedeSelezionata : user?.sede as string,
      settimana: "Settimana corrente",
      allegati: [...nuoviAllegati],
      caricatoDa: `${user?.nome} ${user?.cognome}`,
      data: new Date().toLocaleDateString("it-IT"),
    };
    setTurni([nuovoTurno, ...turni]);
    setNuoviAllegati([]);
    setMostraForm(false);
    Alert.alert("✅", "Turno caricato. Dopo Firebase il file sarà disponibile a tutti.");
  };

  const iconaAllegato = (tipo: string) => tipo === "immagine" ? "🖼️" : "📄";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0f172a" }}>
      <Header titolo="Turni" sottotitolo={canUpload ? "Gestisci i turni delle sedi" : `Sede ${user?.sede}`} />
      <ScrollView contentContainerStyle={{ padding: 20 }}>

        {isSuperAdmin && (
          <View style={{ flexDirection: "row", gap: 10, marginBottom: 20 }}>
            {(["Cosmelux", "Indeco"] as const).map((sede) => (
              <TouchableOpacity key={sede} onPress={() => setSedeSelezionata(sede)} style={{ flex: 1, padding: 12, borderRadius: 10, backgroundColor: sedeSelezionata === sede ? "#2563eb" : "#1e293b", borderWidth: 1, borderColor: sedeSelezionata === sede ? "#2563eb" : "#374151" }}>
                <Text style={{ color: sedeSelezionata === sede ? "white" : "#94a3b8", textAlign: "center", fontWeight: "bold" }}>{sede}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {canUpload && (
          <TouchableOpacity onPress={() => setMostraForm(!mostraForm)} style={{ backgroundColor: mostraForm ? "#374151" : "#2563eb", padding: 14, borderRadius: 12, alignItems: "center", marginBottom: 16 }}>
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 15 }}>{mostraForm ? "Annulla" : "+ Carica nuovo turno"}</Text>
          </TouchableOpacity>
        )}

        {canUpload && mostraForm && (
          <View style={{ backgroundColor: "#1e293b", borderRadius: 12, padding: 16, marginBottom: 20 }}>
            <Text style={{ color: "#94a3b8", fontSize: 12, marginBottom: 12, letterSpacing: 1 }}>SELEZIONA FILE</Text>

            <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
              <TouchableOpacity onPress={selezionaDocumento} style={{ flex: 1, padding: 14, borderRadius: 10, backgroundColor: "#0f172a", borderWidth: 1, borderColor: "#374151", alignItems: "center", gap: 4 }}>
                <Text style={{ fontSize: 24 }}>📄</Text>
                <Text style={{ color: "#94a3b8", fontSize: 12 }}>PDF / Doc</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={selezionaImmagine} style={{ flex: 1, padding: 14, borderRadius: 10, backgroundColor: "#0f172a", borderWidth: 1, borderColor: "#374151", alignItems: "center", gap: 4 }}>
                <Text style={{ fontSize: 24 }}>🖼️</Text>
                <Text style={{ color: "#94a3b8", fontSize: 12 }}>Immagine</Text>
              </TouchableOpacity>
            </View>

            {nuoviAllegati.length > 0 && (
              <View style={{ marginBottom: 12 }}>
                {nuoviAllegati.map((a, i) => (
                  <View key={i} style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#0f172a", padding: 10, borderRadius: 8, marginBottom: 6 }}>
                    <Text style={{ fontSize: 16, marginRight: 8 }}>{iconaAllegato(a.tipo)}</Text>
                    <Text style={{ color: "white", fontSize: 12, flex: 1 }} numberOfLines={1}>{a.nome}</Text>
                    <TouchableOpacity onPress={() => rimuoviAllegato(i)}>
                      <Text style={{ color: "#dc2626", fontSize: 12, marginLeft: 8 }}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            <TouchableOpacity onPress={handleCarica} style={{ backgroundColor: "#2563eb", padding: 14, borderRadius: 10, alignItems: "center" }}>
              <Text style={{ color: "white", fontWeight: "bold" }}>Carica turno</Text>
            </TouchableOpacity>
          </View>
        )}

        {turniFiltrati.length === 0 ? (
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <Text style={{ color: "#475569", fontSize: 15 }}>Nessun turno disponibile.</Text>
          </View>
        ) : (
          turniFiltrati.map((turno) => (
            <View key={turno.id} style={{ backgroundColor: "#1e293b", borderRadius: 12, padding: 16, marginBottom: 14, borderLeftWidth: 3, borderLeftColor: "#2563eb" }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                <Text style={{ color: "#2563eb", fontWeight: "bold", fontSize: 13 }}>🏢 {turno.sede}</Text>
                <Text style={{ color: "#475569", fontSize: 12 }}>{turno.data}</Text>
              </View>
              <Text style={{ color: "white", fontSize: 16, fontWeight: "bold", marginBottom: 4 }}>{turno.settimana}</Text>
              <Text style={{ color: "#94a3b8", fontSize: 12, marginBottom: 12 }}>Caricato da {turno.caricatoDa}</Text>

              {turno.allegati.map((a, i) => (
                <TouchableOpacity key={i} onPress={() => Alert.alert("Apri", "Disponibile dopo integrazione Firebase Storage")}
                  style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#0f172a", padding: 12, borderRadius: 8, marginBottom: 6 }}>
                  <Text style={{ fontSize: 20, marginRight: 10 }}>{iconaAllegato(a.tipo)}</Text>
                  <Text style={{ color: "#93c5fd", fontSize: 13, flex: 1 }} numberOfLines={1}>{a.nome}</Text>
                  <Text style={{ color: "#475569", fontSize: 12 }}>Apri →</Text>
                </TouchableOpacity>
              ))}

              {canUpload && (
                <TouchableOpacity onPress={() => Alert.alert("Elimina", "Vuoi eliminare questo turno?", [{ text: "Annulla", style: "cancel" }, { text: "Elimina", style: "destructive", onPress: () => setTurni(turni.filter(t => t.id !== turno.id)) }])} style={{ marginTop: 10, alignSelf: "flex-end" }}>
                  <Text style={{ color: "#dc2626", fontSize: 12 }}>Elimina</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}

      </ScrollView>
    </SafeAreaView>
  );
}