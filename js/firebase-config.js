// Firebase Configuration for Course Corner
// This file can be imported by other modules that need Firebase services

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail, updateProfile } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, doc, setDoc, getDoc, updateDoc, increment, serverTimestamp, Timestamp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBNbL5jxaLcXa7BwIo3_m1TsLTwuIi6Opw",
    authDomain: "course-corner-prod.firebaseapp.com",
    projectId: "course-corner-prod",
    storageBucket: "course-corner-prod.firebasestorage.app",
    messagingSenderId: "1022534308953",
    appId: "1:1022534308953:web:3c56a24fa61d10be974d48",
    measurementId: "G-2F98N1WM4Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Helper function to log custom events
function trackEvent(eventName, eventParams = {}) {
    logEvent(analytics, eventName, eventParams);
    console.log(`📊 Event tracked: ${eventName}`, eventParams);
}

// Helper function to save payment record to Firestore
async function savePaymentRecord(paymentData) {
    try {
        const docRef = await addDoc(collection(db, "payments"), {
            ...paymentData,
            timestamp: new Date().toISOString()
        });
        console.log("💾 Payment saved with ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error saving payment:", error);
        throw error;
    }
}

// Helper function to get payment history
async function getPaymentHistory(phoneNumber) {
    try {
        const payments = [];
        const querySnapshot = await getDocs(collection(db, "payments"));
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.phoneNumber === phoneNumber) {
                payments.push({ id: doc.id, ...data });
            }
        });
        return payments;
    } catch (error) {
        console.error("Error getting payments:", error);
        return [];
    }
}

// Helper function to save user calculation
async function saveCalculation(calculationData) {
    try {
        const docRef = await addDoc(collection(db, "calculations"), {
            ...calculationData,
            timestamp: new Date().toISOString()
        });
        console.log("📝 Calculation saved with ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error saving calculation:", error);
        throw error;
    }
}

// Export everything
export {
    app,
    analytics,
    db,
    trackEvent,
    savePaymentRecord,
    getPaymentHistory,
    saveCalculation,
    doc,
    getDoc,
    updateDoc,
    increment,
    serverTimestamp,
    Timestamp
};

// Make available globally for non-module scripts
window.firebaseApp = app;
window.firebaseAnalytics = analytics;
window.firebaseDb = db;
window.firebaseFirestore = {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    addDoc,
    getDocs,
    increment,
    serverTimestamp,
    Timestamp,
    collection
};
window.firebaseTrackEvent = trackEvent;
window.firebaseSavePayment = savePaymentRecord;
window.firebaseSaveCalculation = saveCalculation;

// Auth Exports
const auth = getAuth(app);
window.firebaseAuthInstance = auth;
window.firebaseAuthFunctions = {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
    updateProfile
};

console.log('🔥 Firebase initialized successfully with Auth exports');
