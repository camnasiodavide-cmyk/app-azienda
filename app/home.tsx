import { useUser } from "@/context/UserContext";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  const { user, setUser } = useUser();
  const router = useRouter();
  const isAdmin = user?.ruolo === "admin";

  return (
    <ScrollView contentContainerStyle={{
      flexGrow: 1,
      backgroundColor: "#0f172a",
      padding: 24,
      justifyContent: "center",
    }}>

      {/* Header */}
      <View style={{ marginBottom: 32 }}>
        <Text style={{ fontSize: 14, color: "#94a3b8", marginBottom: 4 }}>
          {isAdmin ? "Pannello Admin" : "Benvenuto"}
        </Text>
        <Text style={{ fontSize: 26, color: "white", fontWeight: "bold" }}>
          {user?.nome} {user?.cognome}
        </Text>
        <View style={{
          marginTop: 8,
          alignSelf: "flex-start",
          backgroundColor: isAdmin ? "#1e40af" : "#1e293b",
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 20,
        }}>
          <Text style={{ color: isAdmin ? "#93c5fd" : "#94a3b8", fontSize: 12 }}>
            {isAdmin ? "Amministratore" : "Dipendente"}
          </Text>
        </View>
      </View>

      {/* Sezione admin extra */}
      {isAdmin && (
        <View style={{ marginBottom: 24 }}>
          <Text style={{ color: "#94a3b8", fontSize: 12, marginBottom: 10, letterSpacing: 1 }}>
            GESTIONE
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/admin/utenti")}
            style={{
              backgroundColor: "#1e293b",
              padding: 16,
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
              borderLeftWidth: 3,
              borderLeftColor: "#2563eb",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
                Gestione Utenti
              </Text>
              <Text style={{ color: "#94a3b8", fontSize: 12, marginTop: 2 }}>
                Visualizza, promuovi ed elimina utenti
              </Text>
            </View>
            <Text style={{ color: "#2563eb", fontSize: 20 }}>›</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Sezione principale */}
      <Text style={{ color: "#94a3b8", fontSize: 12, marginBottom: 10, letterSpacing: 1 }}>
        {isAdmin ? "STRUMENTI" : "MENU"}
      </Text>

      <TouchableOpacity
        onPress={() => router.push("/comunicazioni")}
        style={{
          backgroundColor: "#1e293b",
          padding: 16,
          borderRadius: 12,
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 12,
          borderLeftWidth: 3,
          borderLeftColor: "#2563eb",
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
            Comunicazioni
          </Text>
          <Text style={{ color: "#94a3b8", fontSize: 12, marginTop: 2 }}>
            {isAdmin ? "Pubblica comunicazioni ai dipendenti" : "Leggi le comunicazioni aziendali"}
          </Text>
        </View>
        <Text style={{ color: "#2563eb", fontSize: 20 }}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/richieste")}
        style={{
          backgroundColor: "#1e293b",
          padding: 16,
          borderRadius: 12,
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 32,
          borderLeftWidth: 3,
          borderLeftColor: "#2563eb",
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
            Richieste
          </Text>
          <Text style={{ color: "#94a3b8", fontSize: 12, marginTop: 2 }}>
            {isAdmin ? "Gestisci le richieste dei dipendenti" : "Invia una nuova richiesta"}
          </Text>
        </View>
        <Text style={{ color: "#2563eb", fontSize: 20 }}>›</Text>
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity
        onPress={() => setUser(null)}
        style={{
          backgroundColor: "#1e293b",
          padding: 14,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#dc2626",
        }}
      >
        <Text style={{ color: "#dc2626", textAlign: "center", fontWeight: "bold" }}>
          Logout
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
}