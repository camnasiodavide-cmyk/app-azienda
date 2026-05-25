import { useUser } from "@/context/UserContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Turni() {
  const router = useRouter();
  const { user } = useUser();

  const isSuperAdmin = user?.ruolo === "superadmin";
  const isAdmin = user?.ruolo === "admin";
  const canUpload = isSuperAdmin || isAdmin;

  const [turni, setTurni] = useState([
    // Dati di esempio — verranno sostituiti da Firebase
    {
      id: "1",
      sede: "Cosmelux",
      settimana: "19 - 25 Maggio 2025",
      tipo: "immagine",
      url: null,
      caricatoDa: "Admin Cosmelux",
      data: "18/05/2025",
    },
    {
      id: "2",
      sede: "Indeco",
      settimana: "19 - 25 Maggio 2025",
      tipo: "pdf",
      url: null,
      caricatoDa: "Admin Indeco",
      data: "18/05/2025",
    },
  ]);

  const [sedeSelezionata, setSedeSelezionata] = useState<"Cosmelux" | "Indeco">(
    isSuperAdmin ? "Cosmelux" : user?.sede as "Cosmelux" | "Indeco"
  );

  const turniFiltrati = isSuperAdmin
    ? turni.filter((t) => t.sede === sedeSelezionata)
    : turni.filter((t) => t.sede === user?.sede);

  const handleCarica = () => {
    Alert.alert(
      "Carica turno",
      "Funzione disponibile dopo integrazione Firebase Storage",
      [{ text: "OK" }]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0f172a" }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>

        <Text style={{ fontSize: 26, color: "white", fontWeight: "bold", marginBottom: 4 }}>
          Turni
        </Text>
        <Text style={{ color: "#94a3b8", fontSize: 13, marginBottom: 24 }}>
          {canUpload ? "Gestisci i turni delle sedi" : `Sede ${user?.sede}`}
        </Text>

        {/* Selettore sede — solo superadmin */}
        {isSuperAdmin && (
          <View style={{ flexDirection: "row", gap: 10, marginBottom: 24 }}>
            {(["Cosmelux", "Indeco"] as const).map((sede) => (
              <TouchableOpacity
                key={sede}
                onPress={() => setSedeSelezionata(sede)}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 10,
                  backgroundColor: sedeSelezionata === sede ? "#2563eb" : "#1e293b",
                  borderWidth: 1,
                  borderColor: sedeSelezionata === sede ? "#2563eb" : "#374151",
                }}
              >
                <Text style={{
                  color: sedeSelezionata === sede ? "white" : "#94a3b8",
                  textAlign: "center",
                  fontWeight: "bold",
                }}>
                  {sede}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Bottone carica — solo admin/superadmin */}
        {canUpload && (
          <TouchableOpacity
            onPress={handleCarica}
            style={{
              backgroundColor: "#2563eb",
              padding: 16,
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
              gap: 8,
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 15 }}>
              + Carica nuovo turno
            </Text>
          </TouchableOpacity>
        )}

        {/* Lista turni */}
        {turniFiltrati.length === 0 ? (
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <Text style={{ color: "#475569", fontSize: 15 }}>
              Nessun turno disponibile per questa sede.
            </Text>
          </View>
        ) : (
          turniFiltrati.map((turno) => (
            <View
              key={turno.id}
              style={{
                backgroundColor: "#1e293b",
                borderRadius: 12,
                padding: 16,
                marginBottom: 14,
                borderLeftWidth: 3,
                borderLeftColor: "#2563eb",
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                <Text style={{ color: "#2563eb", fontWeight: "bold", fontSize: 13 }}>
                  🏢 {turno.sede}
                </Text>
                <Text style={{ color: "#475569", fontSize: 12 }}>
                  {turno.data}
                </Text>
              </View>

              <Text style={{ color: "white", fontSize: 16, fontWeight: "bold", marginBottom: 4 }}>
                Settimana {turno.settimana}
              </Text>

              <Text style={{ color: "#94a3b8", fontSize: 12, marginBottom: 12 }}>
                Caricato da {turno.caricatoDa}
              </Text>

              {/* Anteprima file */}
              <View style={{
                backgroundColor: "#0f172a",
                borderRadius: 8,
                padding: 20,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}>
                <Text style={{ fontSize: 32, marginBottom: 8 }}>
                  {turno.tipo === "pdf" ? "📄" : "🖼️"}
                </Text>
                <Text style={{ color: "#475569", fontSize: 13 }}>
                  {turno.tipo === "pdf" ? "Documento PDF" : "Immagine"} — anteprima disponibile dopo Firebase
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => Alert.alert("Apri", "Disponibile dopo integrazione Firebase Storage")}
                style={{
                  backgroundColor: "#2563eb",
                  padding: 10,
                  borderRadius: 8,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  {turno.tipo === "pdf" ? "Apri PDF" : "Visualizza immagine"}
                </Text>
              </TouchableOpacity>

              {/* Elimina — solo admin/superadmin */}
              {canUpload && (
                <TouchableOpacity
                  onPress={() => Alert.alert("Elimina", "Vuoi eliminare questo turno?", [
                    { text: "Annulla", style: "cancel" },
                    { text: "Elimina", style: "destructive", onPress: () => setTurni(turni.filter(t => t.id !== turno.id)) },
                  ])}
                  style={{ marginTop: 10, alignSelf: "flex-end" }}
                >
                  <Text style={{ color: "#dc2626", fontSize: 12 }}>Elimina</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
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
          <Text style={{ color: "white", textAlign: "center" }}>Torna indietro</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}