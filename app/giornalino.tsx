import Header from "@/components/Header";
import { useUser } from "@/context/UserContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Keyboard, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CATEGORIE = ["Notizie", "Eventi", "Risultati", "Benvenuto", "Altro"];
type Articolo = { id: string; titolo: string; contenuto: string; autore: string; sede: string; data: string; categoria: string; };

export default function Giornalino() {
  const router = useRouter();
  const { user } = useUser();

  const isSuperAdmin = user?.ruolo === "superadmin";
  const isAdmin = user?.ruolo === "admin";
  const canPublish = isSuperAdmin || isAdmin;

  const [articoli, setArticoli] = useState<Articolo[]>([
    { id: "1", titolo: "Benvenuti nel nuovo portale aziendale!", contenuto: "Siamo felici di annunciare il lancio della nuova app aziendale. Da oggi potrete consultare turni, comunicazioni e molto altro direttamente dal vostro telefono.", autore: "Super Admin", sede: "Tutte", data: "20/05/2025", categoria: "Notizie" },
    { id: "2", titolo: "Evento di team building — Giugno 2025", contenuto: "Il prossimo mese organizzeremo una giornata di team building per tutti i dipendenti. Maggiori dettagli verranno comunicati a breve.", autore: "Admin Cosmelux", sede: "Cosmelux", data: "18/05/2025", categoria: "Eventi" },
  ]);

  const [titolo, setTitolo] = useState("");
  const [contenuto, setContenuto] = useState("");
  const [categoria, setCategoria] = useState("");
  const [sedeTarget, setSedeTarget] = useState<"Cosmelux" | "Indeco" | "Tutte">(isSuperAdmin ? "Tutte" : user?.sede as "Cosmelux" | "Indeco");
  const [mostraForm, setMostraForm] = useState(false);
  const [articoloAperto, setArticoloAperto] = useState<string | null>(null);

  const articoliFiltrati = isSuperAdmin ? articoli : articoli.filter((a) => a.sede === user?.sede || a.sede === "Tutte");

  const handlePubblica = () => {
    if (!titolo.trim()) { Alert.alert("Errore", "Inserisci un titolo"); return; }
    if (!contenuto.trim()) { Alert.alert("Errore", "Inserisci il contenuto"); return; }
    if (!categoria) { Alert.alert("Errore", "Seleziona una categoria"); return; }
    Keyboard.dismiss();
    setArticoli([{ id: Date.now().toString(), titolo, contenuto, autore: `${user?.nome} ${user?.cognome}`, sede: sedeTarget, data: new Date().toLocaleDateString("it-IT"), categoria }, ...articoli]);
    setTitolo(""); setContenuto(""); setCategoria(""); setMostraForm(false);
  };

  const categoriaColor = (cat: string) => ({ Notizie: "#2563eb", Eventi: "#7c3aed", Risultati: "#16a34a", Benvenuto: "#d97706", Altro: "#64748b" }[cat] || "#64748b");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0f172a" }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">

          <Header titolo="Giornalino Aziendale" sottotitolo={canPublish ? "Pubblica e gestisci articoli" : "Ultime notizie aziendali"} />

          {canPublish && (
            <TouchableOpacity onPress={() => setMostraForm(!mostraForm)} style={{ backgroundColor: mostraForm ? "#374151" : "#2563eb", padding: 14, borderRadius: 12, alignItems: "center", marginBottom: 20 }}>
              <Text style={{ color: "white", fontWeight: "bold", fontSize: 15 }}>{mostraForm ? "Annulla" : "+ Pubblica articolo"}</Text>
            </TouchableOpacity>
          )}

          {canPublish && mostraForm && (
            <View style={{ backgroundColor: "#1e293b", borderRadius: 12, padding: 16, marginBottom: 24 }}>
              <Text style={{ color: "#94a3b8", fontSize: 12, marginBottom: 8, letterSpacing: 1 }}>CATEGORIA</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  {CATEGORIE.map((cat) => (
                    <TouchableOpacity key={cat} onPress={() => setCategoria(cat)} style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: categoria === cat ? categoriaColor(cat) : "#0f172a", borderWidth: 1, borderColor: categoria === cat ? categoriaColor(cat) : "#374151" }}>
                      <Text style={{ color: categoria === cat ? "white" : "#94a3b8", fontSize: 13 }}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              {isSuperAdmin && (
                <>
                  <Text style={{ color: "#94a3b8", fontSize: 12, marginBottom: 8, letterSpacing: 1 }}>PUBBLICA PER</Text>
                  <View style={{ flexDirection: "row", gap: 8, marginBottom: 14 }}>
                    {(["Tutte", "Cosmelux", "Indeco"] as const).map((s) => (
                      <TouchableOpacity key={s} onPress={() => setSedeTarget(s)} style={{ flex: 1, padding: 10, borderRadius: 10, backgroundColor: sedeTarget === s ? "#2563eb" : "#0f172a", borderWidth: 1, borderColor: sedeTarget === s ? "#2563eb" : "#374151" }}>
                        <Text style={{ color: sedeTarget === s ? "white" : "#94a3b8", textAlign: "center", fontSize: 12 }}>{s}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              <TextInput value={titolo} onChangeText={setTitolo} placeholder="Titolo articolo" placeholderTextColor="#aaa" style={{ backgroundColor: "#0f172a", color: "white", padding: 12, borderRadius: 8, marginBottom: 10 }} />
              <TextInput value={contenuto} onChangeText={setContenuto} placeholder="Scrivi il contenuto dell'articolo..." placeholderTextColor="#aaa" multiline style={{ backgroundColor: "#0f172a", color: "white", padding: 12, borderRadius: 8, marginBottom: 14, minHeight: 120, textAlignVertical: "top" }} />
              <TouchableOpacity onPress={handlePubblica} style={{ backgroundColor: "#2563eb", padding: 14, borderRadius: 10, alignItems: "center" }}>
                <Text style={{ color: "white", fontWeight: "bold", fontSize: 15 }}>Pubblica</Text>
              </TouchableOpacity>
            </View>
          )}

          {articoliFiltrati.length === 0 ? (
            <View style={{ alignItems: "center", marginTop: 40 }}>
              <Text style={{ color: "#475569", fontSize: 15 }}>Nessun articolo pubblicato.</Text>
            </View>
          ) : (
            articoliFiltrati.map((articolo) => (
              <TouchableOpacity key={articolo.id} onPress={() => setArticoloAperto(articoloAperto === articolo.id ? null : articolo.id)} style={{ backgroundColor: "#1e293b", borderRadius: 12, padding: 16, marginBottom: 12, borderLeftWidth: 3, borderLeftColor: categoriaColor(articolo.categoria) }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                  <View style={{ backgroundColor: categoriaColor(articolo.categoria), paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 }}>
                    <Text style={{ color: "white", fontSize: 11, fontWeight: "bold" }}>{articolo.categoria}</Text>
                  </View>
                  <Text style={{ color: "#475569", fontSize: 11 }}>{articolo.data}</Text>
                </View>
                <Text style={{ color: "white", fontSize: 16, fontWeight: "bold", marginBottom: 6 }}>{articolo.titolo}</Text>
                {articoloAperto === articolo.id ? (
                  <>
                    <Text style={{ color: "#cbd5e1", fontSize: 14, lineHeight: 22, marginBottom: 10 }}>{articolo.contenuto}</Text>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={{ color: "#94a3b8", fontSize: 12 }}>✍️ {articolo.autore} · {articolo.sede === "Tutte" ? "Tutte le sedi" : articolo.sede}</Text>
                      {canPublish && (
                        <TouchableOpacity onPress={() => Alert.alert("Elimina", "Vuoi eliminare questo articolo?", [{ text: "Annulla", style: "cancel" }, { text: "Elimina", style: "destructive", onPress: () => setArticoli(articoli.filter(a => a.id !== articolo.id)) }])}>
                          <Text style={{ color: "#dc2626", fontSize: 12 }}>Elimina</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </>
                ) : (
                  <Text style={{ color: "#64748b", fontSize: 13 }} numberOfLines={2}>{articolo.contenuto}</Text>
                )}
              </TouchableOpacity>
            ))
          )}

        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}