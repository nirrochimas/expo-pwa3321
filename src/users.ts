import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, type Unsubscribe } from "firebase/firestore";
import { db } from "./firebase";

export type UserRecord = { id: string; nome: string; email: string };
const usersCollection = collection(db, "usuarios");

export function subscribeUsers(onData: (users: UserRecord[]) => void, onError: (error: Error) => void): Unsubscribe {
  return onSnapshot(query(usersCollection, orderBy("nome")), (snapshot) => {
    onData(snapshot.docs.map((item) => ({ id: item.id, nome: String(item.data().nome ?? ""), email: String(item.data().email ?? "") })));
  }, onError);
}
export async function createUser(nome: string, email: string) {
  await addDoc(usersCollection, { nome: nome.trim(), email: email.trim().toLowerCase(), createdAt: serverTimestamp() });
}
export async function updateUser(id: string, nome: string, email: string) {
  await updateDoc(doc(db, "usuarios", id), { nome: nome.trim(), email: email.trim().toLowerCase(), updatedAt: serverTimestamp() });
}
export async function removeUser(id: string) {
  await deleteDoc(doc(db, "usuarios", id));
}
