import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, type Unsubscribe } from "firebase/firestore";
import { db } from "./firebase";

export type UserRecord = { id: string; nome: string; email: string };
function usersCollection() {
  if (!db) throw new Error("Firebase não configurado. Defina as variáveis EXPO_PUBLIC_FIREBASE_* na Vercel.");
  return collection(db, "usuarios");
}

export function subscribeUsers(onData: (users: UserRecord[]) => void, onError: (error: Error & { code?: string }) => void): Unsubscribe {
  return onSnapshot(query(usersCollection(), orderBy("nome")), (snapshot) => {
    onData(snapshot.docs.map((item) => ({ id: item.id, nome: String(item.data().nome ?? ""), email: String(item.data().email ?? "") })));
  }, onError);
}
export async function createUser(nome: string, email: string) {
  await addDoc(usersCollection(), { nome: nome.trim(), email: email.trim().toLowerCase(), createdAt: serverTimestamp() });
}
export async function updateUser(id: string, nome: string, email: string) {
  await updateDoc(doc(usersCollection(), id), { nome: nome.trim(), email: email.trim().toLowerCase(), updatedAt: serverTimestamp() });
}
export async function removeUser(id: string) {
  await deleteDoc(doc(usersCollection(), id));
}
