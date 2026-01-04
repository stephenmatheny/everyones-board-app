import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { getMe, logoutUser } from "../../src/api/auth";

export default function Home() {
  const [label, setLabel] = useState("Loading...");

  useEffect(() => {
    (async () => {
      const u = await getMe();
      setLabel(`Signed in as ${u.first_name} ${u.last_name}`);
    })();
  }, []);

  async function handleLogout() {
    await logoutUser();
    router.replace("/(auth)/login");
  }

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: "600" }}>Everyone’s Board</Text>
      <Text>{label}</Text>

      <Pressable
        onPress={handleLogout}
        style={{ borderWidth: 1, padding: 14, borderRadius: 10, alignItems: "center" }}
      >
        <Text>Logout</Text>
      </Pressable>
    </View>
  );
}
