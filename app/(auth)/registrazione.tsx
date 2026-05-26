import { useUser } from "@/context/UserContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Keyboard, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

export default function Registrazione() {
  const { setUser } = useUser();
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confermaPassword, setConfermaPassword] = useState("");
  const [sede, setSede] = useState<"Cosmelux" | "Indeco" | null>(null);

  const handleRegistrazione = () => {
    if (!nome.trim() || !cognome.trim()) { Alert.alert("Errore", "Inserisci nome e cognome"); return; }
    if (!email.includes("@")) { Alert.alert("Errore", "Inserisci un'email valida"); return; }
    if (password.length < 6) { Alert.alert("Errore", "La password deve essere di almeno 6 caratteri"); return; }
    if (password !== confermaPassword) { Alert.alert("Errore", "Le password non coincidono"); return; }
    if (!sede) { Alert.alert("Errore", "Seleziona la tua sede"); return; }
    setUser({ nome, cognome, email, ruolo: "dipendente", sede });
  };

  return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0f172a", padding: 20 }} keyboardShouldPersistTaps="handled">

          <Text style={{ fontSize: 28, color: "white", marginBottom: 6, fontWeight: "bold" }}>Registrazione</Text>
          <Text style={{ color: "#94a3b8", marginBottom: 30, fontSize: 14 }}>Crea il tuo account aziendale</Text>

          {[
            { placeholder: "Nome", value: nome, onChange: setNome, secure: false },
            { placeholder: "Cognome", value: cognome, onChange: setCognome, secure: false },
            { placeholder: "Email aziendale", value: email, onChange: setEmail, secure: false },
            { placeholder: "Password (min. 6 caratteri)", value: password, onChange: setPassword, secure: true },
            { placeholder: "Conferma password", value: confermaPassword, onChange: setConfermaPassword, secure: true },
          ].map(({ placeholder, value, onChange, secure }) => (
            <TextInput key={placeholder} placeholder={placeholder} placeholderTextColor="#aaa" value={value} onChangeText={onChange} secureTextEntry={secure} autoCapitalize="none"
              style={{ backgroundColor: "#1e293b", color: "white", width: "100%", padding: 12, marginBottom: 10, borderRadius: 8 }} />
          ))}

          <Text style={{ color: "#94a3b8", fontSize: 12, alignSelf: "flex-start", marginBottom: 8, marginTop: 4, letterSpacing: 1 }}>SEDE</Text>
          <View style={{ flexDirection: "row", gap: 10, width: "100%", marginBottom: 20 }}>
            {(["Cosmelux", "Indeco"] as const).map((s) => (
              <TouchableOpacity key={s} onPress={() => setSede(s)} style={{ flex: 1, padding: 14, borderRadius: 10, backgroundColor: sede === s ? "#2563eb" : "#1e293b", borderWidth: 1, borderColor: sede === s ? "#2563eb" : "#374151", alignItems: "center" }}>
                <Text style={{ fontSize: 16, marginBottom: 2 }}>🏢</Text>
                <Text style={{ color: sede === s ? "white" : "#94a3b8", fontWeight: "bold", fontSize: 14 }}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity onPress={handleRegistrazione} style={{ backgroundColor: "#2563eb", width: "100%", padding: 15, borderRadius: 10, marginTop: 4 }}>
            <Text style={{ color: "white", textAlign: "center", fontSize: 16, fontWeight: "bold" }}>Registrati</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.replace("/(auth)/login")} style={{ marginTop: 20 }}>
            <Text style={{ color: "#94a3b8", fontSize: 14 }}>Hai già un account? <Text style={{ color: "#2563eb", fontWeight: "bold" }}>Accedi</Text></Text>
          </TouchableOpacity>

        </ScrollView>
      </TouchableWithoutFeedback>
  );
}