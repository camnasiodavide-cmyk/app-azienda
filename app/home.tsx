import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Home({ user, setUser }) {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0f172a",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Text
        style={{
          fontSize: 28,
          color: "white",
          marginBottom: 10,
        }}
      >
        Benvenuto
      </Text>

      <Text
        style={{
          color: "#94a3b8",
          marginBottom: 40,
          fontSize: 16,
        }}
      >
        {user.nome} {user.cognome}
      </Text>

      <TouchableOpacity
        onPress={() => router.push("/richieste")}
        style={{
          width: "90%",
          backgroundColor: "#2563eb",
          padding: 15,
          borderRadius: 10,
          marginBottom: 15,
        }}
      >
        <Text style={{ color: "white", textAlign: "center", fontSize: 16 }}>
          Vai a richieste
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/comunicazioni")}
        style={{
          width: "90%",
          backgroundColor: "#2563eb",
          padding: 15,
          borderRadius: 10,
          marginBottom: 20,
        }}
      >
        <Text style={{ color: "white", textAlign: "center", fontSize: 16 }}>
          Vai a comunicazioni
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setUser(null)}
        style={{
          width: "90%",
          backgroundColor: "#dc2626",
          padding: 15,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: "white", textAlign: "center", fontSize: 16 }}>
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
}
``