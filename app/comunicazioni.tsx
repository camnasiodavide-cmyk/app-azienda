import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export default function Comunicazioni() {
  const router = useRouter();

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22 }}>Comunicazioni</Text>

      <Button title="Torna indietro" onPress={() => router.back()} />
    </View>
  );
}