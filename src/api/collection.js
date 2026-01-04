import { api } from "./client";

export async function addToCollection({ barcode, name }) {
  const res = await api.post("/collection/add", {
    barcode,
    name: name || null,
  });
  return res.data.game;
}

export async function listCollection() {
  const res = await api.get("/collection");
  return res.data.games;
}
