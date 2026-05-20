import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export default function Richieste() {
  const router = useRouter();

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22 }}>Richieste</Text>

      <Button title="Torna indietro" onPress={() => router.back()} />
    </View>
  );
}