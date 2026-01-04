import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { loginUser } from "../../src/api/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleLogin() {
    setErr(null);
    setBusy(true);
    try {
      await loginUser({ email, password });
      router.replace("/(tabs)");
    } catch (e: any) {
      setErr(e?.response?.data?.message ?? "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: "600" }}>Sign in</Text>

      {err ? <Text style={{ color: "crimson" }}>{err}</Text> : null}

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 12, borderRadius: 10 }}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, padding: 12, borderRadius: 10 }}
      />

      <Pressable
        onPress={handleLogin}
        disabled={busy}
        style={{ borderWidth: 1, padding: 14, borderRadius: 10, alignItems: "center" }}
      >
        <Text>{busy ? "Signing in..." : "Sign in"}</Text>
      </Pressable>

      <Pressable onPress={() => router.push("/(auth)/register")}>
        <Text style={{ textDecorationLine: "underline" }}>Create an account</Text>
      </Pressable>
    </View>
  );
}
