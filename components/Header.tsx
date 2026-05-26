import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  titolo: string;
  sottotitolo?: string;
};

export default function Header({ titolo, sottotitolo }: Props) {
  const router = useRouter();

  return (
    <View style={{ marginBottom: 20 }}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}
      >
        <Text style={{ color: "#2563eb", fontSize: 22, marginRight: 6 }}>‹</Text>
        <Text style={{ color: "#2563eb", fontSize: 15 }}>Indietro</Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 26, color: "white", fontWeight: "bold", marginBottom: 4 }}>
        {titolo}
      </Text>
      {sottotitolo && (
        <Text style={{ color: "#94a3b8", fontSize: 13 }}>{sottotitolo}</Text>
      )}
    </View>
  );
}