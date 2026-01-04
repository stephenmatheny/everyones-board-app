import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { registerUser } from "../../src/api/auth";

export default function Register() {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleRegister() {
    setErr(null);
    setBusy(true);
    try {
      await registerUser({
        first_name: first,
        last_name: last,
        phone_number: phone || null,
        email,
        password,
      });
      router.replace("/(tabs)");
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ??
        (e?.response?.data?.errors ? JSON.stringify(e.response.data.errors) : null) ??
        "Registration failed";
      setErr(msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: "600" }}>Create account</Text>

      {err ? <Text style={{ color: "crimson" }}>{err}</Text> : null}

      <TextInput placeholder="First name" value={first} onChangeText={setFirst}
        style={{ borderWidth: 1, padding: 12, borderRadius: 10 }} />
      <TextInput placeholder="Last name" value={last} onChangeText={setLast}
        style={{ borderWidth: 1, padding: 12, borderRadius: 10 }} />
      <TextInput placeholder="Phone (optional)" value={phone} onChangeText={setPhone}
        keyboardType="phone-pad"
        style={{ borderWidth: 1, padding: 12, borderRadius: 10 }} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail}
        autoCapitalize="none" keyboardType="email-address"
        style={{ borderWidth: 1, padding: 12, borderRadius: 10 }} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 12, borderRadius: 10 }} />

      <Pressable
        onPress={handleRegister}
        disabled={busy}
        style={{ borderWidth: 1, padding: 14, borderRadius: 10, alignItems: "center" }}
      >
        <Text>{busy ? "Creating..." : "Create account"}</Text>
      </Pressable>

      <Pressable onPress={() => router.back()}>
        <Text style={{ textDecorationLine: "underline" }}>Back</Text>
      </Pressable>
    </View>
  );
}
