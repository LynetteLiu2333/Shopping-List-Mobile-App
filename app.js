// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// Firebase app configuration
const appSettings = {
    databaseURL: "https://shopping-list-mobile-app-513ea-default-rtdb.firebaseio.com/"
};

// Initialize Firebase app
const app = initializeApp(appSettings);

// Get a reference to the database
const database = getDatabase(app);

// Reference to the shopping list in the database
const shoppingListInDB = ref(database, "shoppingList");

// DOM elements
const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");

// Event listener for add button
addButtonEl.addEventListener("click", () => {
    const inputValue = inputFieldEl.value.trim(); // Trim whitespace from input
    
    if (inputValue !== "") {
        push(shoppingListInDB, inputValue); // Add item to Firebase
        
        clearInputField(); // Clear input field after adding
    }
});

// Listen for changes in the shopping list in Firebase
onValue(shoppingListInDB, (snapshot) => {
    if (snapshot.exists()) {
        const itemsArray = Object.entries(snapshot.val());

        clearShoppingList(); // Clear existing list items

        itemsArray.forEach((item) => {
            appendItemToShoppingList(item); // Append each item to the shopping list
        });
    } else {
        shoppingListEl.innerHTML = "No items here... yet";
    }
});

// Function to clear the shopping list
function clearShoppingList() {
    shoppingListEl.innerHTML = "";
}

// Function to clear the input field
function clearInputField() {
    inputFieldEl.value = "";
}

// Function to append an item to the shopping list
function appendItemToShoppingList(item) {
    const [itemID, itemValue] = item;

    const newEl = document.createElement("li");
    newEl.textContent = itemValue;

    newEl.addEventListener("click", () => {
        const exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);
        remove(exactLocationOfItemInDB); // Remove item from Firebase
    });

    shoppingListEl.appendChild(newEl);
}
