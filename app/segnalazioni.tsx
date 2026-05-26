import Header from "@/components/Header";
import { useUser } from "@/context/UserContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Keyboard, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CATEGORIE = ["Sicurezza", "Ambiente", "Comportamento", "Amministrazione", "Altro"];

export default function Segnalazioni() {
  const router = useRouter();
  const { user } = useUser();

  const isSuperAdmin = user?.ruolo === "superadmin";
  const isAdmin = user?.ruolo === "admin";
  const canView = isSuperAdmin || isAdmin;

  const [testo, setTesto] = useState("");
  const [categoria, setCategoria] = useState("");
  const [anonima, setAnonima] = useState(false);
  const [inviata, setInviata] = useState(false);

  const [segnalazioni, setSegnalazioni] = useState([
    { id: "1", testo: "Il corridoio del magazzino è spesso bagnato e scivoloso.", categoria: "Sicurezza", anonima: false, mittente: "Mario Rossi", sede: "Cosmelux", data: "20/05/2025", letta: false },
    { id: "2", testo: "Alcuni colleghi fumano vicino all'ingresso principale.", categoria: "Comportamento", anonima: true, mittente: "Anonimo", sede: "Indeco", data: "19/05/2025", letta: true },
  ]);

  const segnalazioniFiltrate = isSuperAdmin ? segnalazioni : segnalazioni.filter((s) => s.sede === user?.sede);

  const handleInvia = () => {
    if (!testo.trim()) { Alert.alert("Errore", "Scrivi il testo della segnalazione"); return; }
    if (!categoria) { Alert.alert("Errore", "Seleziona una categoria"); return; }
    Keyboard.dismiss();
    setSegnalazioni([{ id: Date.now().toString(), testo, categoria, anonima, mittente: anonima ? "Anonimo" : `${user?.nome} ${user?.cognome}`, sede: user?.sede as string, data: new Date().toLocaleDateString("it-IT"), letta: false }, ...segnalazioni]);
    setTesto(""); setCategoria(""); setAnonima(false); setInviata(true);
    setTimeout(() => setInviata(false), 3000);
  };

  const categoriaColor = (cat: string) => ({ Sicurezza: "#dc2626", Ambiente: "#16a34a", Comportamento: "#d97706", Amministrazione: "#2563eb", Altro: "#64748b" }[cat] || "#64748b");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0f172a" }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">

          <Header titolo="Segnalazioni" sottotitolo={canView ? "Segnalazioni ricevute" : "Invia una segnalazione"} />

          {!isAdmin && (
            <View style={{ marginBottom: 24 }}>
              {inviata && (
                <View style={{ backgroundColor: "#14532d", padding: 12, borderRadius: 10, marginBottom: 14 }}>
                  <Text style={{ color: "#86efac", textAlign: "center", fontWeight: "bold" }}>✅ Segnalazione inviata</Text>
                </View>
              )}
              <Text style={{ color: "#94a3b8", fontSize: 12, marginBottom: 8, letterSpacing: 1 }}>CATEGORIA</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  {CATEGORIE.map((cat) => (
                    <TouchableOpacity key={cat} onPress={() => setCategoria(cat)} style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: categoria === cat ? categoriaColor(cat) : "#1e293b", borderWidth: 1, borderColor: categoria === cat ? categoriaColor(cat) : "#374151" }}>
                      <Text style={{ color: categoria === cat ? "white" : "#94a3b8", fontSize: 13 }}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
              <Text style={{ color: "#94a3b8", fontSize: 12, marginBottom: 8, letterSpacing: 1 }}>TESTO</Text>
              <TextInput value={testo} onChangeText={setTesto} placeholder="Descrivi la segnalazione..." placeholderTextColor="#aaa" multiline
                style={{ backgroundColor: "#1e293b", color: "white", padding: 12, borderRadius: 8, marginBottom: 14, minHeight: 100, textAlignVertical: "top" }} />
              <Text style={{ color: "#94a3b8", fontSize: 12, marginBottom: 8, letterSpacing: 1 }}>MITTENTE</Text>
              <View style={{ flexDirection: "row", gap: 10, marginBottom: 16 }}>
                <TouchableOpacity onPress={() => setAnonima(false)} style={{ flex: 1, padding: 12, borderRadius: 10, backgroundColor: !anonima ? "#2563eb" : "#1e293b", borderWidth: 1, borderColor: !anonima ? "#2563eb" : "#374151" }}>
                  <Text style={{ color: !anonima ? "white" : "#94a3b8", textAlign: "center", fontWeight: "bold" }}>✍️ Firmata</Text>
                  <Text style={{ color: !anonima ? "#93c5fd" : "#475569", textAlign: "center", fontSize: 11, marginTop: 2 }}>{user?.nome} {user?.cognome}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setAnonima(true)} style={{ flex: 1, padding: 12, borderRadius: 10, backgroundColor: anonima ? "#374151" : "#1e293b", borderWidth: 1, borderColor: anonima ? "#64748b" : "#374151" }}>
                  <Text style={{ color: anonima ? "white" : "#94a3b8", textAlign: "center", fontWeight: "bold" }}>🕵️ Anonima</Text>
                  <Text style={{ color: anonima ? "#94a3b8" : "#475569", textAlign: "center", fontSize: 11, marginTop: 2 }}>Il tuo nome non sarà visibile</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={handleInvia} style={{ backgroundColor: "#2563eb", padding: 15, borderRadius: 12, alignItems: "center" }}>
                <Text style={{ color: "white", fontWeight: "bold", fontSize: 15 }}>Invia segnalazione</Text>
              </TouchableOpacity>
            </View>
          )}

          {canView && (
            <>
              <Text style={{ color: "#94a3b8", fontSize: 12, marginBottom: 12, letterSpacing: 1 }}>{segnalazioniFiltrate.length} SEGNALAZIONI RICEVUTE</Text>
              {segnalazioniFiltrate.length === 0 ? (
                <View style={{ alignItems: "center", marginTop: 20 }}>
                  <Text style={{ color: "#475569", fontSize: 15 }}>Nessuna segnalazione ricevuta.</Text>
                </View>
              ) : (
                segnalazioniFiltrate.map((s) => (
                  <View key={s.id} style={{ backgroundColor: "#1e293b", borderRadius: 12, padding: 16, marginBottom: 12, borderLeftWidth: 3, borderLeftColor: categoriaColor(s.categoria), opacity: s.letta ? 0.7 : 1 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                      <View style={{ backgroundColor: categoriaColor(s.categoria), paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 }}>
                        <Text style={{ color: "white", fontSize: 11, fontWeight: "bold" }}>{s.categoria}</Text>
                      </View>
                      <Text style={{ color: "#475569", fontSize: 11 }}>{s.data}</Text>
                    </View>
                    <Text style={{ color: "white", fontSize: 14, lineHeight: 20, marginBottom: 10 }}>{s.testo}</Text>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={{ color: "#94a3b8", fontSize: 12 }}>{s.anonima ? "🕵️ Anonimo" : `✍️ ${s.mittente}`}</Text>
                      <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
                        {isSuperAdmin && <Text style={{ color: "#475569", fontSize: 11 }}>🏢 {s.sede}</Text>}
                        <Text style={{ color: s.letta ? "#16a34a" : "#d97706", fontSize: 11 }}>{s.letta ? "✅ Letta" : "🔴 Nuova"}</Text>
                      </View>
                    </View>
                  </View>
                ))
              )}
            </>
          )}

        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}