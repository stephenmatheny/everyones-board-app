import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { addToCollection } from "../../src/api/collection";

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [busy, setBusy] = useState(false);
  const scannedRef = useRef(false);
  const [lastCode, setLastCode] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    scannedRef.current = false;
  }, []);

  async function handleBarcode({ data }: { data: string }) {
    if (busy || scannedRef.current) return;

    scannedRef.current = true;
    setBusy(true);
    setErr(null);
    setLastCode(data);

    try {
      await addToCollection({ barcode: data });
      router.back(); // go back to collection list
    } catch (e: any) {
      setErr(e?.response?.data?.message ?? "Failed to add barcode");
      // allow rescan after error
      scannedRef.current = false;
    } finally {
      setBusy(false);
    }
  }

  if (!permission) return null;

  if (!permission.granted) {
    return (
      <View style={{ flex: 1, padding: 16, gap: 12, justifyContent: "center" }}>
        <Text style={{ fontSize: 18, fontWeight: "600" }}>Camera permission needed</Text>
        <Pressable
          onPress={requestPermission}
          style={{ borderWidth: 1, padding: 12, borderRadius: 10, alignItems: "center" }}
        >
          <Text>Grant permission</Text>
        </Pressable>
        <Pressable onPress={() => router.back()}>
          <Text style={{ textDecorationLine: "underline" }}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        style={{ flex: 1 }}
        barcodeScannerSettings={{
          barcodeTypes: [
            "ean13",
            "ean8",
            "upc_a",
            "upc_e",
            "code128",
            "code39",
            "qr",
          ],
        }}
        onBarcodeScanned={handleBarcode}
      />

      <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 16, gap: 8 }}>
        {err ? <Text style={{ color: "crimson" }}>{err}</Text> : null}
        <Text style={{ color: "white" }}>
          {busy ? `Adding ${lastCode ?? ""}...` : "Point camera at barcode"}
        </Text>

        <Pressable
          onPress={() => router.back()}
          style={{ backgroundColor: "white", padding: 12, borderRadius: 10, alignItems: "center" }}
        >
          <Text>Cancel</Text>
        </Pressable>
      </View>
    </View>
  );
}
