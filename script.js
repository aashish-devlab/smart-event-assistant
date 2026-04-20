// Location Mapping Data
const locationData = {
    "overall": { name: "Overall Venue", level: "Medium", alternate: null },
    "gate-a": { name: "Gate A", level: "High", alternate: "Gate B" },
    "gate-b": { name: "Gate B", level: "Low", alternate: null },
    "food-court": { name: "Food Court", level: "Medium", alternate: null },
    "parking": { name: "Parking", level: "Medium", alternate: null }
};

// DOM Nodes Cache
const locationSelect = document.getElementById("location-select");
const statusDisplay = document.getElementById("status-display");
const crowdBadge = document.getElementById("crowd-badge");
const waitTimeText = document.getElementById("wait-time-text");
const suggestionText = document.getElementById("suggestion-text");
const recommendationText = document.getElementById("recommendation-text");
const loadingSpinner = document.getElementById("loading-spinner");
const chatWindow = document.getElementById("chat-window");
const toastContainer = document.getElementById("toast-container");
const btnFindRoute = document.getElementById("btn-find-route");
const routeDisplay = document.getElementById("route-display");
const routeSteps = document.getElementById("route-steps");
const btnCloseRoute = document.getElementById("btn-close-route");
const chatInput = document.getElementById("chat-input");

let currentContext = null;

// Chat Context Engine
function generateBotResponse(message) {
    const loc = currentContext ? locationData[currentContext] : null;
    const msgLower = message.toLowerCase();

    if (msgLower.includes("where should i go") || msgLower.includes("where is food")) {
        if (loc && loc.level === "High") return `Since you're at ${loc.name} and it's crowded, detour to ${loc.alternate || 'another zone'}. Otherwise, Food Court is steady.`;
        if (loc && loc.level === "Low") return `Since you're checking ${loc.name}, things are clear! The Food Court is also accessible moving inward.`;
        return "The Food Court is centrally located. Simply follow the overhead signs or head inward from any gate!";
    }
    if (msgLower.includes("crowd") || msgLower.includes("busy")) {
        if (loc) return `Right now, ${loc.name} is ${loc.level}. ${loc.level === "High" ? "It is very busy." : "It is steady."}`;
        return "Currently Gate A is very crowded, but Gate B is clear. The rest of the venue is moderate.";
    }
    if (msgLower.includes("exit")) {
        return "Gate B is presently your fastest exit line. It has extremely low wait times.";
    }
    if (msgLower.includes("parking")) {
        if (loc && loc.name === "Parking") return "You are viewing Parking already! Head to Level 2 for the best availability.";
        return "Parking is moderately filled. Bypass Level 1 and drive straight to Level 2.";
    }

    return "I'm ready to assist with Event operations! Try asking about crowds, exits, or food routes.";
}

// Location change tracker
locationSelect.addEventListener("change", (e) => {
    const selected = e.target.value;
    currentContext = selected; 
    
    if (locationData[selected]) {
        const data = locationData[selected];
        
        statusDisplay.style.display = "none";
        loadingSpinner.style.display = "flex";
        
        setTimeout(() => {
            loadingSpinner.style.display = "none";
            
            let waitTimeStr = "";
            let suggestionMessage = "";
            let recommendationMessage = "";

            if (data.level === "High") {
                waitTimeStr = "15-20 mins";
                suggestionMessage = `Traffic is heavy at ${data.name}. We suggest using ${data.alternate} as an alternate.`;
                recommendationMessage = "Avoid unless necessary";
            } else if (data.level === "Medium") {
                waitTimeStr = "5-10 mins";
                suggestionMessage = `${data.name} is moderately busy. Expect a short wait.`;
                recommendationMessage = "Proceed with caution";
            } else if (data.level === "Low") {
                waitTimeStr = "0 mins";
                suggestionMessage = `It's clear at ${data.name}! You can enter immediately.`;
                recommendationMessage = "Path is optimal";
            }

            statusDisplay.style.display = "block";
            
            const levelClass = data.level.toLowerCase();
            crowdBadge.textContent = data.level; // Standard case
            crowdBadge.className = `badge ${levelClass}`;
            waitTimeText.textContent = waitTimeStr;
            
            suggestionText.textContent = suggestionMessage;
            recommendationText.textContent = `💡 ${recommendationMessage}`;
            
            showToast(`Dashboard synced with ${data.name}`);
        }, 500); 
    }
});

// Chatbot functionality
function handleChat(message) {
    if(!message) return;

    appendMessage(message, "user");
    chatWindow.scrollTop = chatWindow.scrollHeight;

    const typingIndicator = showTypingIndicator();
    
    setTimeout(() => {
        removeTypingIndicator(typingIndicator);
        const reply = generateBotResponse(message);
        appendMessage(reply, "bot");
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }, 1500); 
}

function showTypingIndicator() {
    const messageEl = document.createElement("div");
    messageEl.className = "message bot typing";
    messageEl.innerHTML = `
        <div class="ai-avatar"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z"/></svg></div>
        <div class="bubble typing-indicator">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    chatWindow.appendChild(messageEl);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    return messageEl;
}

function removeTypingIndicator(indicator) {
    if (indicator && indicator.parentNode) {
        indicator.parentNode.removeChild(indicator);
    }
}

// Bind custom input
function sendCustomMessage() {
    const val = chatInput.value.trim();
    if (val) {
        handleChat(val);
        chatInput.value = "";
    }
}
chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendCustomMessage();
});

function appendMessage(text, sender) {
    const messageEl = document.createElement("div");
    messageEl.className = `message ${sender}`;
    
    let avatar = "";
    if (sender === "bot") {
        avatar = `<div class="ai-avatar"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z"/></svg></div>`;
    }
    
    messageEl.innerHTML = `${avatar}<div class="bubble">${text}</div>`;
    chatWindow.appendChild(messageEl);
}

// Route functionality
function generateBestRoute() {
    const entries = ["gate-a", "gate-b"];
    const bestEntry = entries.reduce((prev, curr) => locationData[curr].level === "Low" ? curr : prev);
    const amenity = "food-court";

    const stepsHtml = `
        <li class="route-step">
            <div class="route-step-title">1. Map to ${locationData[bestEntry].name}</div>
            <div class="route-step-desc">Lowest queue metrics. Expected delay: negligible.</div>
        </li>
        <li class="route-step">
            <div class="route-step-title">2. Pass via ${locationData[amenity].name}</div>
            <div class="route-step-desc">Status: ${locationData[amenity].level}.</div>
        </li>
        <li class="route-step">
            <div class="route-step-title">3. Destination</div>
            <div class="route-step-desc">Proceed to Main Floor.</div>
        </li>
    `;
    
    routeSteps.innerHTML = stepsHtml;
    routeDisplay.style.display = "block";
}

btnFindRoute.addEventListener("click", generateBestRoute);
btnCloseRoute.addEventListener("click", () => routeDisplay.style.display = "none");

// UI Toasts
function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<span>${message}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.classList.add("fade-out");
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Insight Engine / Bento Grid
function updateSmartInsight() {
    let lowestWait = Infinity;
    let lowestLoc = null;
    let highestWait = -1;
    let highestLoc = null;
    let bestExit = "Gate B"; // Default
    
    for (const key in locationData) {
        if (key === "overall") continue;
        const data = locationData[key];
        const wait = data.level === "High" ? 25 : (data.level === "Medium" ? 10 : 0);
        
        if (wait < lowestWait) {
            lowestWait = wait;
            lowestLoc = data.name;
        }

        if (wait > highestWait) {
            highestWait = wait;
            highestLoc = data.name;
        }
        
        if (data.name.includes("Gate") && wait === 0) {
            bestExit = data.name;
        }
    }
    
    document.getElementById("tile-crowd-heading").textContent = lowestLoc || "N/A";
    document.getElementById("tile-exit-heading").textContent = bestExit;
    document.getElementById("tile-avoid-heading").textContent = highestLoc || "N/A";
}

// Initialize default state
window.addEventListener('DOMContentLoaded', () => {
    updateSmartInsight(); // Trigger insight banner compilation
    locationSelect.value = "overall";
    locationSelect.dispatchEvent(new Event("change"));
    
    // Ensure chat starts at bottom
    chatWindow.scrollTop = chatWindow.scrollHeight;
});
