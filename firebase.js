import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, collection, addDoc, doc, setDoc, onSnapshot, query, orderBy, limit,
  serverTimestamp, increment } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {

  apiKey: "AIzaSyAVVoMFbFzON_7tHIAyatCwWMKLnoQXB9I",

  authDomain: "vie-de-la-nat.firebaseapp.com",

  projectId: "vie-de-la-nat",

  storageBucket: "vie-de-la-nat.firebasestorage.app",

  messagingSenderId: "572532360688",

  appId: "1:572532360688:web:eb0247c9183a6288a30935",

  measurementId: "G-CN2VC91M1Q"

};


export const db = getFirestore(initializeApp(firebaseConfig));
export { collection, addDoc, doc, setDoc, onSnapshot, query, orderBy, limit, serverTimestamp, increment };

/* STRUCTURE FIRESTORE
 annonces/{auto}  : titre, matiere, prix (texte: "5 €" ou "Gratuit"), contact, createdAt (timestamp)
 votes/{AAAA-MM-JJ}: likes (nombre), dislikes (nombre)       ← créé automatiquement au 1er vote
 sondages/{id}    : votes: { "0": n, "1": n, ... }           ← index des options de config.js
*/
