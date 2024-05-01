import { initializeApp } from "firebase/app";

const firebaseConfig = {
	apiKey: "AIzaSyCyBwxSpRJXlAWzcfwrzTfPvnRJyNtxpp0",
	authDomain: "firstproject-3f252.firebaseapp.com",
	databaseURL: "https://firstproject-3f252-default-rtdb.firebaseio.com",
	projectId: "firstproject-3f252",
	storageBucket: "firstproject-3f252.appspot.com",
	messagingSenderId: "736551406590",
	appId: "1:736551406590:web:7523a7f10de659efa2ceaf",
	measurementId: "G-XKD5F45BLW",
};

export const app = initializeApp(firebaseConfig);
