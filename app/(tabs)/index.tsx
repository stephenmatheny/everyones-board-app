import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { logoutUser } from "../../src/api/auth";
import { listCollection } from "../../src/api/collection";

export default function CollectionScreen() {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setErr(null);
    try {
      const data = await listCollection();
      setGames(data);
    } catch (e: any) {
      setErr(e?.response?.data?.message ?? "Failed to load collection");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  async function handleLogout() {
    await logoutUser();
    router.replace("/(auth)/login");
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: "600" }}>My Collection</Text>

      <View style={{ flexDirection: "row", gap: 12 }}>
        <Pressable
          onPress={() => router.push("/(tabs)/scan")}
          style={{ borderWidth: 1, padding: 12, borderRadius: 10 }}
        >
          <Text>Scan Barcode</Text>
        </Pressable>

        <Pressable
          onPress={handleLogout}
          style={{ borderWidth: 1, padding: 12, borderRadius: 10 }}
        >
          <Text>Logout</Text>
        </Pressable>
      </View>

      {err ? <Text style={{ color: "crimson" }}>{err}</Text> : null}
      {loading ? <Text>Loading...</Text> : null}

      <FlatList
        data={games}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 10, borderBottomWidth: 1 }}>
            <Text style={{ fontWeight: "600" }}>{item.name || "Unknown game"}</Text>
            <Text>{item.barcode}</Text>
          </View>
        )}
        ListEmptyComponent={!loading ? <Text>No games yet. Scan your first one!</Text> : null}
      />
    </View>
  );
}
