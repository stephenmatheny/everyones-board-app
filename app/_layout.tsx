import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { getMe } from "../src/api/auth";

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        await getMe();
        setAuthed(true);
      } catch {
        setAuthed(false);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!ready) return;

    router.replace(authed ? "/(tabs)" : "/(auth)/login");
  }, [ready, authed, router]);

  if (!ready) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)" />
    </Stack>
  );
}
