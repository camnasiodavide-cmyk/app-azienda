import { useUser } from "@/context/UserContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Ruolo = "superadmin" | "admin" | "dipendente";
type Utente = {
  id: string;
  nome: string;
  cognome: string;
  email: string;
  ruolo: Ruolo;
  sede: "Cosmelux" | "Indeco";
  attivo: boolean;
};

export default function GestioneUtenti() {
  const router = useRouter();
  const { user } = useUser();

  const isSuperAdmin = user?.ruolo === "superadmin";

  const [ricerca, setRicerca] = useState("");
  const [filtroSede, setFiltroSede] = useState<"Tutte" | "Cosmelux" | "Indeco">("Tutte");
  const [utenteSelezionato, setUtenteSelezionato] = useState<Utente | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [utenti, setUtenti] = useState<Utente[]>([
    { id: "1", nome: "Mario", cognome: "Rossi", email: "mario@cosmelux.it", ruolo: "dipendente", sede: "Cosmelux", attivo: true },
    { id: "2", nome: "Laura", cognome: "Bianchi", email: "laura@cosmelux.it", ruolo: "dipendente", sede: "Cosmelux", attivo: true },
    { id: "3", nome: "Admin", cognome: "Cosmelux", email: "admin@cosmelux.it", ruolo: "admin", sede: "Cosmelux", attivo: true },
    { id: "4", nome: "Luca", cognome: "Verdi", email: "luca@indeco.it", ruolo: "dipendente", sede: "Indeco", attivo: true },
    { id: "5", nome: "Anna", cognome: "Neri", email: "anna@indeco.it", ruolo: "dipendente", sede: "Indeco", attivo: false },
    { id: "6", nome: "Admin", cognome: "Indeco", email: "admin@indeco.it", ruolo: "admin", sede: "Indeco", attivo: true },
  ]);

  const utentiFiltrati = utenti.filter((u) => {
    const matchSede = isSuperAdmin
      ? filtroSede === "Tutte" || u.sede === filtroSede
      : u.sede === user?.sede;
    const matchRicerca =
      u.nome.toLowerCase().includes(ricerca.toLowerCase()) ||
      u.cognome.toLowerCase().includes(ricerca.toLowerCase()) ||
      u.email.toLowerCase().includes(ricerca.toLowerCase());
    return matchSede && matchRicerca;
  });

  const handleCambiaRuolo = (nuovoRuolo: Ruolo) => {
    if (!utenteSelezionato) return;
    Alert.alert(
      "Cambia ruolo",
      `Vuoi impostare il ruolo di ${utenteSelezionato.nome} ${utenteSelezionato.cognome} a "${nuovoRuolo}"?`,
      [
        { text: "Annulla", style: "cancel", onPress: () => setModalVisible(false) },
        {
          text: "Conferma",
          onPress: () => {
            setUtenti(utenti.map((u) =>
              u.id === utenteSelezionato.id ? { ...u, ruolo: nuovoRuolo } : u
            ));
            setModalVisible(false);
            setUtenteSelezionato(null);
          },
        },
      ]
    );
  };

  const handleToggleAttivo = (u: Utente) => {
    Alert.alert(
      u.attivo ? "Sospendi utente" : "Riattiva utente",
      `Vuoi ${u.attivo ? "sospendere" : "riattivare"} ${u.nome} ${u.cognome}?`,
      [
        { text: "Annulla", style: "cancel" },
        {
          text: "Conferma",
          style: u.attivo ? "destructive" : "default",
          onPress: () => setUtenti(utenti.map((ut) =>
            ut.id === u.id ? { ...ut, attivo: !ut.attivo } : ut
          )),
        },
      ]
    );
  };

  const handleElimina = (u: Utente) => {
    Alert.alert(
      "Elimina utente",
      `Sei sicuro di voler eliminare ${u.nome} ${u.cognome}? Questa azione non può essere annullata.`,
      [
        { text: "Annulla", style: "cancel" },
        {
          text: "Elimina",
          style: "destructive",
          onPress: () => setUtenti(utenti.filter((ut) => ut.id !== u.id)),
        },
      ]
    );
  };

  const ruoloBadge = (ruolo: string) => {
    if (ruolo === "superadmin") return { bg: "#7c3aed", text: "#a78bfa", label: "Super Admin" };
    if (ruolo === "admin") return { bg: "#1e40af", text: "#93c5fd", label: "Admin" };
    return { bg: "#1e293b", text: "#94a3b8", label: "Dipendente" };
  };

  const cosmeluxCount = utenti.filter(u => u.sede === "Cosmelux" && u.attivo).length;
  const indecoCount = utenti.filter(u => u.sede === "Indeco" && u.attivo).length;

  const ruoliDisponibili: { ruolo: Ruolo; label: string; color: string; textColor: string }[] = [
    { ruolo: "dipendente", label: "Dipendente", color: "#1e293b", textColor: "#94a3b8" },
    { ruolo: "admin", label: "Admin", color: "#1e40af", textColor: "#93c5fd" },
    ...(isSuperAdmin ? [{ ruolo: "superadmin" as Ruolo, label: "Super Admin", color: "#7c3aed", textColor: "#a78bfa" }] : []),
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0f172a" }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>

        <Text style={{ fontSize: 26, color: "white", fontWeight: "bold", marginBottom: 4 }}>
          Gestione Utenti
        </Text>
        <Text style={{ color: "#94a3b8", fontSize: 13, marginBottom: 20 }}>
          {isSuperAdmin ? "Tutti gli utenti aziendali" : `Utenti — ${user?.sede}`}
        </Text>

        {/* Statistiche */}
        {isSuperAdmin && (
          <View style={{ flexDirection: "row", gap: 10, marginBottom: 20 }}>
            {[
              { label: "Cosmelux", count: cosmeluxCount },
              { label: "Indeco", count: indecoCount },
              { label: "Totale", count: cosmeluxCount + indecoCount },
            ].map(({ label, count }) => (
              <View key={label} style={{ flex: 1, backgroundColor: "#1e293b", borderRadius: 12, padding: 14, alignItems: "center" }}>
                <Text style={{ color: "#2563eb", fontSize: 22, fontWeight: "bold" }}>{count}</Text>
                <Text style={{ color: "#94a3b8", fontSize: 12, marginTop: 2 }}>{label}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Ricerca */}
        <TextInput
          value={ricerca}
          onChangeText={setRicerca}
          placeholder="Cerca per nome o email..."
          placeholderTextColor="#aaa"
          style={{
            backgroundColor: "#1e293b", color: "white", padding: 12,
            borderRadius: 10, marginBottom: 12,
          }}
        />

        {/* Filtro sede */}
        {isSuperAdmin && (
          <View style={{ flexDirection: "row", gap: 8, marginBottom: 20 }}>
            {(["Tutte", "Cosmelux", "Indeco"] as const).map((s) => (
              <TouchableOpacity
                key={s}
                onPress={() => setFiltroSede(s)}
                style={{
                  flex: 1, padding: 10, borderRadius: 10,
                  backgroundColor: filtroSede === s ? "#2563eb" : "#1e293b",
                  borderWidth: 1,
                  borderColor: filtroSede === s ? "#2563eb" : "#374151",
                }}
              >
                <Text style={{ color: filtroSede === s ? "white" : "#94a3b8", textAlign: "center", fontSize: 12, fontWeight: "bold" }}>
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={{ color: "#94a3b8", fontSize: 12, marginBottom: 12, letterSpacing: 1 }}>
          {utentiFiltrati.length} UTENTI
        </Text>

        {/* Lista utenti */}
        {utentiFiltrati.map((u) => {
          const badge = ruoloBadge(u.ruolo);
          return (
            <View
              key={u.id}
              style={{
                backgroundColor: "#1e293b",
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
                opacity: u.attivo ? 1 : 0.6,
                borderLeftWidth: 3,
                borderLeftColor: u.attivo ? "#2563eb" : "#374151",
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                <View>
                  <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
                    {u.nome} {u.cognome}
                  </Text>
                  <Text style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>{u.email}</Text>
                </View>
                {!u.attivo && (
                  <View style={{ backgroundColor: "#374151", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, alignSelf: "flex-start" }}>
                    <Text style={{ color: "#64748b", fontSize: 11 }}>Sospeso</Text>
                  </View>
                )}
              </View>

              <View style={{ flexDirection: "row", gap: 8, marginBottom: 14 }}>
                <View style={{ backgroundColor: badge.bg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 }}>
                  <Text style={{ color: badge.text, fontSize: 11, fontWeight: "bold" }}>{badge.label}</Text>
                </View>
                <View style={{ backgroundColor: "#0f172a", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 }}>
                  <Text style={{ color: "#94a3b8", fontSize: 11 }}>🏢 {u.sede}</Text>
                </View>
              </View>

              <View style={{ flexDirection: "row", gap: 8 }}>
                <TouchableOpacity
                  onPress={() => { setUtenteSelezionato(u); setModalVisible(true); }}
                  style={{ flex: 1, padding: 8, borderRadius: 8, backgroundColor: "#1e40af" }}
                >
                  <Text style={{ color: "#93c5fd", textAlign: "center", fontSize: 12 }}>
                    Cambia ruolo
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleToggleAttivo(u)}
                  style={{ flex: 1, padding: 8, borderRadius: 8, backgroundColor: u.attivo ? "#422006" : "#14532d" }}
                >
                  <Text style={{ color: u.attivo ? "#fb923c" : "#86efac", textAlign: "center", fontSize: 12 }}>
                    {u.attivo ? "Sospendi" : "Riattiva"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleElimina(u)}
                  style={{ padding: 8, borderRadius: 8, backgroundColor: "#450a0a" }}
                >
                  <Text style={{ color: "#fca5a5", fontSize: 12 }}>Elimina</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginTop: 10, backgroundColor: "#374151", padding: 12, borderRadius: 10 }}
        >
          <Text style={{ color: "white", textAlign: "center" }}>Torna indietro</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Modal selezione ruolo */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "rgba(0,0,0,0.6)",
        }}>
          <View style={{
            backgroundColor: "#1e293b",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 24,
          }}>
            <Text style={{ color: "white", fontSize: 18, fontWeight: "bold", marginBottom: 4 }}>
              Cambia ruolo
            </Text>
            <Text style={{ color: "#94a3b8", fontSize: 13, marginBottom: 20 }}>
              {utenteSelezionato?.nome} {utenteSelezionato?.cognome}
            </Text>

            {ruoliDisponibili.map(({ ruolo, label, color, textColor }) => (
              <TouchableOpacity
                key={ruolo}
                onPress={() => handleCambiaRuolo(ruolo)}
                style={{
                  backgroundColor: utenteSelezionato?.ruolo === ruolo ? color : "#0f172a",
                  padding: 16,
                  borderRadius: 12,
                  marginBottom: 10,
                  borderWidth: 1,
                  borderColor: utenteSelezionato?.ruolo === ruolo ? textColor : "#374151",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ color: utenteSelezionato?.ruolo === ruolo ? textColor : "white", fontSize: 15, fontWeight: "bold" }}>
                  {label}
                </Text>
                {utenteSelezionato?.ruolo === ruolo && (
                  <Text style={{ color: textColor, fontSize: 16 }}>✓</Text>
                )}
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={() => { setModalVisible(false); setUtenteSelezionato(null); }}
              style={{ marginTop: 6, padding: 14, borderRadius: 12, backgroundColor: "#374151" }}
            >
              <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>Annulla</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}