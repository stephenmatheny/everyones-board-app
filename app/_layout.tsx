import { Redirect, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { getMe } from "../src/api/auth";

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

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

  if (!ready) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {authed ? (
        <>
          <Stack.Screen name="(tabs)" />
          <Redirect href="/(tabs)" />
        </>
      ) : (
        <>
          <Stack.Screen name="(auth)" />
          <Redirect href="/(auth)/login" />
        </>
      )}
    </Stack>
  );
}
