import { useUser } from "@/context/UserContext";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  const { user, setUser } = useUser();
  const router = useRouter();

  const isSuperAdmin = user?.ruolo === "superadmin";
  const isAdmin = user?.ruolo === "admin";
  const isDipendente = user?.ruolo === "dipendente";

  const badgeColor = isSuperAdmin ? "#7c3aed" : isAdmin ? "#1e40af" : "#1e293b";
  const badgeTextColor = isSuperAdmin ? "#a78bfa" : isAdmin ? "#93c5fd" : "#94a3b8";
  const badgeLabel = isSuperAdmin ? "Super Admin" : isAdmin ? "Amministratore" : "Dipendente";

  const MenuItem = ({ title, subtitle, route }: { title: string; subtitle: string; route: string }) => (
    <TouchableOpacity
      onPress={() => router.push(route)}
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
        <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>{title}</Text>
        <Text style={{ color: "#94a3b8", fontSize: 12, marginTop: 2 }}>{subtitle}</Text>
      </View>
      <Text style={{ color: "#2563eb", fontSize: 20 }}>›</Text>
    </TouchableOpacity>
  );

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
          {isSuperAdmin ? "Pannello Super Admin" : isAdmin ? "Pannello Admin" : "Benvenuto"}
        </Text>
        <Text style={{ fontSize: 26, color: "white", fontWeight: "bold" }}>
          {user?.nome} {user?.cognome}
        </Text>
        <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
          <View style={{
            alignSelf: "flex-start",
            backgroundColor: badgeColor,
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 20,
          }}>
            <Text style={{ color: badgeTextColor, fontSize: 12 }}>{badgeLabel}</Text>
          </View>
          {!isSuperAdmin && (
            <View style={{
              alignSelf: "flex-start",
              backgroundColor: "#1e293b",
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: "#374151",
            }}>
              <Text style={{ color: "#94a3b8", fontSize: 12 }}>🏢 {user?.sede}</Text>
            </View>
          )}
        </View>
      </View>

      {/* ── SUPERADMIN ── */}
      {isSuperAdmin && (
        <>
          <Text style={{ color: "#94a3b8", fontSize: 12, marginBottom: 10, letterSpacing: 1 }}>
            GESTIONE GLOBALE
          </Text>
          <MenuItem title="Gestione Utenti" subtitle="Tutti gli utenti di Cosmelux e Indeco" route="/admin/utenti" />
          <MenuItem title="Comunicazioni" subtitle="Pubblica su Cosmelux, Indeco o entrambe" route="/comunicazioni" />
          <MenuItem title="Turni" subtitle="Carica i turni per entrambe le sedi" route="/turni" />
          <MenuItem title="Segnalazioni" subtitle="Invia o leggi le segnalazioni di tutte le sedi" route="/segnalazioni" />
          <MenuItem title="Giornalino Aziendale" subtitle="Gestisci il giornalino per tutte le sedi" route="/giornalino" />
        </>
      )}

      {/* ── ADMIN ── */}
      {isAdmin && (
        <>
          <Text style={{ color: "#94a3b8", fontSize: 12, marginBottom: 10, letterSpacing: 1 }}>
            GESTIONE — {user?.sede?.toUpperCase()}
          </Text>
          <MenuItem title="Gestione Utenti" subtitle={`Utenti della sede ${user?.sede}`} route="/admin/utenti" />
          <View style={{ height: 1, backgroundColor: "#1e293b", marginVertical: 16 }} />
          <Text style={{ color: "#94a3b8", fontSize: 12, marginBottom: 10, letterSpacing: 1 }}>
            STRUMENTI
          </Text>
          <MenuItem title="Comunicazioni" subtitle="Pubblica comunicazioni ai dipendenti" route="/comunicazioni" />
          <MenuItem title="Turni" subtitle={`Carica i turni per ${user?.sede}`} route="/turni" />
          <MenuItem title="Richieste" subtitle="Gestisci le richieste ricevute" route="/richieste" />
          <MenuItem title="Segnalazioni" subtitle="Leggi le segnalazioni ricevute" route="/segnalazioni" />
          <MenuItem title="Giornalino Aziendale" subtitle="Leggi le ultime notizie aziendali" route="/giornalino" />
        </>
      )}

      {/* ── DIPENDENTE ── */}
      {isDipendente && (
        <>
          <Text style={{ color: "#94a3b8", fontSize: 12, marginBottom: 10, letterSpacing: 1 }}>
            MENU
          </Text>
          <MenuItem title="Comunicazioni" subtitle="Leggi le comunicazioni aziendali" route="/comunicazioni" />
          <MenuItem title="Turni" subtitle="Visualizza i tuoi turni" route="/turni" />
          <MenuItem title="Richieste" subtitle="Invia una nuova richiesta" route="/richieste" />
          <MenuItem title="Segnalazioni" subtitle="Invia una segnalazione anonima o firmata" route="/segnalazioni" />
          <MenuItem title="Giornalino Aziendale" subtitle="Leggi le ultime notizie aziendali" route="/giornalino" />
        </>
      )}

      {/* Logout */}
      <TouchableOpacity
        onPress={() => setUser(null)}
        style={{
          marginTop: 20,
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