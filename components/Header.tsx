import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  titolo: string;
  sottotitolo?: string;
};

export default function Header({ titolo, sottotitolo }: Props) {
  const router = useRouter();

  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, backgroundColor: "#0f172a" }}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "flex-start",
          backgroundColor: "#1e293b",
          paddingHorizontal: 14,
          paddingVertical: 10,
          borderRadius: 20,
          marginBottom: 16,
          gap: 6,
        }}
      >
        <Text style={{ color: "white", fontSize: 18, lineHeight: 22 }}>‹</Text>
        <Text style={{ color: "white", fontSize: 15, fontWeight: "600" }}>Indietro</Text>
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