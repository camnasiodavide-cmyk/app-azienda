import { useUser } from "@/context/UserContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Keyboard, KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

const PRIVACY_TESTO = `INFORMATIVA SUL TRATTAMENTO DEI DATI PERSONALI
App Aziendale — uso interno · ai sensi del Regolamento UE 2016/679 (GDPR)

1. TITOLARE DEL TRATTAMENTO
Il Titolare del trattamento è Cosmelux / Indeco.
Per informazioni: [inserire email aziendale]

2. DATI PERSONALI RACCOLTI
Nell'ambito dell'utilizzo dell'App vengono raccolti i seguenti dati:
• Nome e cognome — identificazione dell'utente
• Email aziendale — autenticazione e comunicazioni
• Sede di appartenenza — visualizzazione contenuti pertinenti
• Ruolo aziendale — gestione dei permessi
• Contenuto di richieste e segnalazioni — gestione comunicazioni interne

3. BASE GIURIDICA
Il trattamento è fondato sul legittimo interesse aziendale alla gestione delle comunicazioni interne (art. 6, par. 1, lett. f GDPR) e sull'esecuzione del contratto di lavoro (art. 6, par. 1, lett. b GDPR).

4. CONSERVAZIONE DEI DATI
I dati sono conservati per tutta la durata del rapporto di lavoro e per il tempo necessario ad adempiere agli obblighi di legge. Richieste e segnalazioni vengono conservate per un massimo di 2 anni.

5. DESTINATARI
I dati sono accessibili esclusivamente al personale autorizzato. Non vengono comunicati a terzi, fatta eccezione per Google Firebase (infrastruttura tecnica), con cui sono stati stipulati appositi accordi nel rispetto del GDPR. I dati sono archiviati su server nell'Unione Europea.

6. DIRITTI DELL'INTERESSATO
Hai il diritto di accedere, rettificare, cancellare, limitare e opporti al trattamento dei tuoi dati. Per esercitare i tuoi diritti scrivi a: [inserire email aziendale]. Puoi inoltre proporre reclamo al Garante per la Protezione dei Dati Personali (www.garanteprivacy.it).

7. SICUREZZA
I dati sono cifrati in transito (HTTPS) e a riposo sui server Firebase, certificati ISO 27001 e SOC 2.

8. AGGIORNAMENTI
L'informativa può essere aggiornata periodicamente. In caso di modifiche sostanziali, i dipendenti saranno informati tramite l'App o via email aziendale.

Versione 1.0`;

export default function Registrazione() {
  const { setUser } = useUser();
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confermaPassword, setConfermaPassword] = useState("");
  const [sede, setSede] = useState<"Cosmelux" | "Indeco" | null>(null);
  const [accettaPrivacy, setAccettaPrivacy] = useState(false);
  const [mostraPrivacy, setMostraPrivacy] = useState(false);

  const handleRegistrazione = () => {
    if (!nome.trim() || !cognome.trim()) { Alert.alert("Errore", "Inserisci nome e cognome"); return; }
    if (!email.includes("@")) { Alert.alert("Errore", "Inserisci un'email valida"); return; }
    if (password.length < 6) { Alert.alert("Errore", "La password deve essere di almeno 6 caratteri"); return; }
    if (password !== confermaPassword) { Alert.alert("Errore", "Le password non coincidono"); return; }
    if (!sede) { Alert.alert("Errore", "Seleziona la tua sede"); return; }
    if (!accettaPrivacy) { Alert.alert("Errore", "Devi accettare l'informativa privacy per continuare"); return; }
    setUser({ nome, cognome, email, ruolo: "dipendente", sede });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
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

          {/* Privacy */}
          <View style={{ width: "100%", backgroundColor: "#1e293b", borderRadius: 12, padding: 14, marginBottom: 20 }}>
            <Text style={{ color: "#94a3b8", fontSize: 12, marginBottom: 10, letterSpacing: 1 }}>INFORMATIVA PRIVACY</Text>

            <TouchableOpacity
              onPress={() => setMostraPrivacy(true)}
              style={{ backgroundColor: "#0f172a", padding: 12, borderRadius: 8, marginBottom: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
            >
              <Text style={{ color: "#93c5fd", fontSize: 13 }}>📄 Leggi l'informativa privacy</Text>
              <Text style={{ color: "#2563eb", fontSize: 16 }}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setAccettaPrivacy(!accettaPrivacy)}
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <View style={{
                width: 22, height: 22, borderRadius: 6, borderWidth: 2,
                borderColor: accettaPrivacy ? "#2563eb" : "#374151",
                backgroundColor: accettaPrivacy ? "#2563eb" : "transparent",
                alignItems: "center", justifyContent: "center",
              }}>
                {accettaPrivacy && <Text style={{ color: "white", fontSize: 13, fontWeight: "bold" }}>✓</Text>}
              </View>
              <Text style={{ color: "#94a3b8", fontSize: 13, flex: 1 }}>
                Ho letto e accetto l'informativa sul trattamento dei dati personali
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleRegistrazione}
            style={{ backgroundColor: accettaPrivacy ? "#2563eb" : "#1e293b", width: "100%", padding: 15, borderRadius: 10, marginTop: 4, opacity: accettaPrivacy ? 1 : 0.5 }}
          >
            <Text style={{ color: accettaPrivacy ? "white" : "#64748b", textAlign: "center", fontSize: 16, fontWeight: "bold" }}>Registrati</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.replace("/(auth)/login")} style={{ marginTop: 20 }}>
            <Text style={{ color: "#94a3b8", fontSize: 14 }}>Hai già un account? <Text style={{ color: "#2563eb", fontWeight: "bold" }}>Accedi</Text></Text>
          </TouchableOpacity>

        </ScrollView>
      </TouchableWithoutFeedback>

      {/* Modal Privacy */}
      <Modal visible={mostraPrivacy} animationType="slide" transparent onRequestClose={() => setMostraPrivacy(false)}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "flex-end" }}>
          <View style={{ backgroundColor: "#1e293b", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, maxHeight: "90%" }}>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>Informativa Privacy</Text>
              <TouchableOpacity onPress={() => setMostraPrivacy(false)}>
                <Text style={{ color: "#94a3b8", fontSize: 20 }}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ marginBottom: 16 }} showsVerticalScrollIndicator>
              <Text style={{ color: "#cbd5e1", fontSize: 13, lineHeight: 22 }}>{PRIVACY_TESTO}</Text>
            </ScrollView>

            <TouchableOpacity
              onPress={() => Alert.alert("Download", "Disponibile dopo integrazione Firebase Storage")}
              style={{ backgroundColor: "#0f172a", padding: 12, borderRadius: 10, alignItems: "center", marginBottom: 10, flexDirection: "row", justifyContent: "center", gap: 8 }}
            >
              <Text style={{ fontSize: 16 }}>⬇️</Text>
              <Text style={{ color: "#93c5fd", fontWeight: "bold" }}>Scarica PDF</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => { setAccettaPrivacy(true); setMostraPrivacy(false); }}
              style={{ backgroundColor: "#2563eb", padding: 14, borderRadius: 10, alignItems: "center" }}
            >
              <Text style={{ color: "white", fontWeight: "bold", fontSize: 15 }}>Ho letto, accetto</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </KeyboardAvoidingView>
  );
}