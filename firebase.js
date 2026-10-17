import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, collection, addDoc, doc, setDoc, onSnapshot, query, orderBy, limit,
  serverTimestamp, increment } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// 🔑 Collez ici la config de votre projet (Console Firebase > Paramètres > Vos applications > Web)
const firebaseConfig = {
  apiKey: "VOTRE_API_KEY",
  authDomain: "VOTRE-PROJET.firebaseapp.com",
  projectId: "VOTRE-PROJET",
  storageBucket: "VOTRE-PROJET.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:xxxxxxxx"
};

export const db = getFirestore(initializeApp(firebaseConfig));
export { collection, addDoc, doc, setDoc, onSnapshot, query, orderBy, limit, serverTimestamp, increment };

/* STRUCTURE FIRESTORE
 annonces/{auto}  : titre, matiere, prix (texte: "5 €" ou "Gratuit"), contact, createdAt (timestamp)
 votes/{AAAA-MM-JJ}: likes (nombre), dislikes (nombre)       ← créé automatiquement au 1er vote
 sondages/{id}    : votes: { "0": n, "1": n, ... }           ← index des options de config.js
*/
