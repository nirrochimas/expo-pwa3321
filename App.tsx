import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { firebaseConfigured } from "./src/firebase";
import { createUser, removeUser, subscribeUsers, updateUser, type UserRecord } from "./src/users";

type Screen = "cadastro" | "lista";
export default function App() {
  const [screen, setScreen] = useState<Screen>("cadastro");
  const [nome, setNome] = useState(""); const [email, setEmail] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null); const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false); const [error, setError] = useState(""); const [notice, setNotice] = useState("");

  useEffect(() => {
    if (Platform.OS === "web" && "serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      window.addEventListener("load", () => { void navigator.serviceWorker.register("/sw.js").catch((e) => console.error("Falha ao registrar service worker:", e)); }, { once: true });
    }
  }, []);
  useEffect(() => {
    if (!firebaseConfigured) { setLoading(false); return; }
    return subscribeUsers((items) => { setUsers(items); setLoading(false); setError(""); }, (e) => {
      setLoading(false); setError(e.message.includes("permission") || e.code === "permission-denied" ? "As regras do Firestore não permitem esta operação. Configure regras seguras no Firebase Console." : `Não foi possível carregar os registros: ${e.message}`);
    });
  }, []);
  function validate() {
    if (!nome.trim()) return "Informe o nome.";
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email.trim())) return "Informe um e-mail válido.";
    return "";
  }
  async function submit() {
    const validation = validate(); if (validation) { setError(validation); setNotice(""); return; }
    setSaving(true); setError(""); setNotice("");
    try {
      if (editingId) { await updateUser(editingId, nome, email); setNotice("Cadastro atualizado com sucesso."); }
      else { await createUser(nome, email); setNotice("Cadastro salvo no Firebase com sucesso."); }
      setNome(""); setEmail(""); setEditingId(null); setScreen("lista");
    } catch (e) { setError(`Falha ao salvar no Firebase: ${e instanceof Error ? e.message : "erro desconhecido"}. Confira a configuração e as regras do Firestore.`); }
    finally { setSaving(false); }
  }
  function startEdit(user: UserRecord) { setNome(user.nome); setEmail(user.email); setEditingId(user.id); setError(""); setNotice(""); setScreen("cadastro"); }
  async function deleteRecord(user: UserRecord) {
    const runDelete = async () => { setError(""); setNotice(""); try { await removeUser(user.id); setNotice("Registro excluído."); } catch (e) { setError(`Falha ao excluir: ${e instanceof Error ? e.message : "erro desconhecido"}`); } };
    if (Platform.OS === "web" && typeof window !== "undefined") { if (window.confirm(`Excluir o cadastro de ${user.nome}?`)) await runDelete(); }
    else Alert.alert("Confirmar exclusão", `Excluir ${user.nome}?`, [{ text: "Cancelar", style: "cancel" }, { text: "Excluir", style: "destructive", onPress: () => { void runDelete(); } }]);
  }
  return <View style={styles.page}>
    <View style={styles.header}><Text style={styles.eyebrow}>EXPO · PWA · FIREBASE</Text><Text style={styles.title}>CRUD de usuários</Text><Text style={styles.subtitle}>Cadastro e persistência no Cloud Firestore.</Text></View>
    <View style={styles.nav}><Pressable onPress={() => { setScreen("cadastro"); setNotice(""); }} style={[styles.navButton, screen === "cadastro" && styles.navActive]}><Text style={[styles.navText, screen === "cadastro" && styles.navTextActive]}>{editingId ? "Editar cadastro" : "Cadastro"}</Text></Pressable><Pressable onPress={() => { setScreen("lista"); setNotice(""); }} style={[styles.navButton, screen === "lista" && styles.navActive]}><Text style={[styles.navText, screen === "lista" && styles.navTextActive]}>Listagem ({users.length})</Text></Pressable></View>
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      {!firebaseConfigured && <View style={styles.warning}><Text style={styles.warningTitle}>Falta configurar o Firebase</Text><Text style={styles.warningText}>Adicione as variáveis EXPO_PUBLIC_FIREBASE_* nas configurações da Vercel e faça um novo deploy. Consulte o README para a lista completa.</Text></View>}
      {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}{!!notice && <Text accessibilityRole="status" style={styles.success}>{notice}</Text>}
      {screen === "cadastro" ? <View style={styles.card}><Text style={styles.sectionTitle}>{editingId ? "Editar usuário" : "Novo usuário"}</Text>
        <Text style={styles.label}>Nome</Text><TextInput accessibilityLabel="Nome" style={styles.input} value={nome} onChangeText={setNome} placeholder="Ex.: Maria Silva" autoCapitalize="words" maxLength={120}/>
        <Text style={styles.label}>E-mail</Text><TextInput accessibilityLabel="E-mail" style={styles.input} value={email} onChangeText={setEmail} placeholder="maria@email.com" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} maxLength={254}/>
        <Pressable disabled={saving || !firebaseConfigured} onPress={() => void submit()} style={[styles.primaryButton, (saving || !firebaseConfigured) && styles.disabled]}>{saving ? <ActivityIndicator color="#fff"/> : <Text style={styles.primaryText}>{editingId ? "Salvar alterações" : "Cadastrar"}</Text>}</Pressable>
        {editingId && <Pressable onPress={() => { setEditingId(null); setNome(""); setEmail(""); setError(""); }} style={styles.cancelButton}><Text style={styles.cancelText}>Cancelar edição</Text></Pressable>}
      </View> : <View style={styles.listWrap}><Text style={styles.sectionTitle}>Registros no Firestore</Text>{loading ? <ActivityIndicator style={{marginTop:24}}/> : users.length === 0 ? <Text style={styles.empty}>{firebaseConfigured ? "Nenhum registro encontrado. Cadastre o primeiro usuário." : "Configure o Firebase para carregar os registros."}</Text> : users.map((user) => <View key={user.id} style={styles.userCard}><View style={styles.userInfo}><Text style={styles.userName}>{user.nome}</Text><Text style={styles.userEmail}>{user.email}</Text></View><View style={styles.actions}><Pressable onPress={() => startEdit(user)} style={styles.smallButton}><Text style={styles.editText}>Editar</Text></Pressable><Pressable onPress={() => void deleteRecord(user)} style={[styles.smallButton, styles.deleteButton]}><Text style={styles.deleteText}>Excluir</Text></Pressable></View></View>)}</View>}
      <Text style={styles.footer}>Dados persistidos no Google Cloud Firestore</Text>
    </ScrollView>
  </View>;
}
const styles = StyleSheet.create({
 page:{flex:1,backgroundColor:"#f8fafc"},header:{backgroundColor:"#0f172a",paddingHorizontal:24,paddingTop:36,paddingBottom:28},eyebrow:{color:"#7dd3fc",fontSize:11,fontWeight:"800",letterSpacing:2},title:{color:"#fff",fontSize:30,fontWeight:"800",marginTop:8},subtitle:{color:"#cbd5e1",fontSize:14,marginTop:6,lineHeight:21},nav:{flexDirection:"row",gap:8,paddingHorizontal:20,paddingTop:18,maxWidth:720,width:"100%",alignSelf:"center"},navButton:{paddingVertical:11,paddingHorizontal:18,borderRadius:10,backgroundColor:"#e2e8f0"},navActive:{backgroundColor:"#0f172a"},navText:{fontSize:14,fontWeight:"700",color:"#334155"},navTextActive:{color:"#fff"},content:{padding:20,paddingBottom:48,width:"100%",maxWidth:720,alignSelf:"center"},card:{backgroundColor:"#fff",borderRadius:18,padding:22,borderWidth:1,borderColor:"#e2e8f0"},sectionTitle:{fontSize:21,fontWeight:"800",color:"#0f172a",marginBottom:20},label:{fontSize:13,fontWeight:"700",color:"#334155",marginBottom:7},input:{borderWidth:1,borderColor:"#cbd5e1",borderRadius:10,paddingHorizontal:14,paddingVertical:13,fontSize:16,color:"#0f172a",backgroundColor:"#fff",marginBottom:17},primaryButton:{backgroundColor:"#0f172a",borderRadius:10,padding:15,alignItems:"center",minHeight:50,justifyContent:"center",marginTop:4},disabled:{opacity:0.5},primaryText:{color:"#fff",fontWeight:"800",fontSize:15},cancelButton:{padding:12,alignItems:"center"},cancelText:{color:"#475569",fontWeight:"700"},listWrap:{gap:12},userCard:{backgroundColor:"#fff",borderWidth:1,borderColor:"#e2e8f0",borderRadius:14,padding:16,gap:14},userInfo:{gap:4},userName:{fontSize:17,fontWeight:"800",color:"#0f172a"},userEmail:{fontSize:14,color:"#475569"},actions:{flexDirection:"row",gap:8},smallButton:{borderWidth:1,borderColor:"#cbd5e1",borderRadius:8,paddingVertical:8,paddingHorizontal:13},editText:{color:"#0369a1",fontWeight:"700"},deleteButton:{borderColor:"#fecaca"},deleteText:{color:"#b91c1c",fontWeight:"700"},empty:{padding:22,textAlign:"center",color:"#64748b",lineHeight:22},warning:{backgroundColor:"#fff7ed",borderColor:"#fed7aa",borderWidth:1,borderRadius:12,padding:15,marginBottom:16,gap:5},warningTitle:{fontSize:15,fontWeight:"800",color:"#9a3412"},warningText:{fontSize:13,lineHeight:20,color:"#9a3412"},error:{backgroundColor:"#fef2f2",borderColor:"#fecaca",borderWidth:1,borderRadius:10,padding:12,color:"#991b1b",marginBottom:14,lineHeight:20},success:{backgroundColor:"#f0fdf4",borderColor:"#bbf7d0",borderWidth:1,borderRadius:10,padding:12,color:"#166534",marginBottom:14},footer:{textAlign:"center",fontSize:12,color:"#94a3b8",marginTop:24}
});
