// Data for locations
const locationData = {
    "gate-a": {
        level: "High",
        waitTime: 25,
        recommendation: "Best time to visit is after 30 minutes",
        suggestion: "Gate A is currently experiencing high traffic. Please consider using Gate B for a faster entry."
    },
    "gate-b": {
        level: "Low",
        waitTime: 0,
        recommendation: "Best time to visit is right now",
        suggestion: "It's clear here! You can enter directly without any waiting."
    },
    "food-court": {
        level: "Medium",
        waitTime: 15,
        recommendation: "Best time to visit is after 15 minutes",
        suggestion: "Expect an estimated wait time of 10-15 minutes for most food stalls."
    },
    "parking": {
        level: "Medium",
        waitTime: 10,
        recommendation: "Best time to visit is after 10 minutes",
        suggestion: "Level 1 is nearly full. Head straight to Level 2 for plenty of parking space."
    }
};

// Chatbot Responses
const botResponses = {
    "Where is food?": "The Food Court is located at the center of the venue, behind the main stage. Just follow the orange signs!",
    "Best exit?": "Gate B currently has the lowest traffic and is the best route for a quick exit.",
    "Crowd status?": "Overall, the venue is moderately crowded. Gate A is the busiest right now.",
    "Parking?": "Parking is filling up. Level 2 of the main structure still has ample space."
};

// DOM Elements
const locationSelect = document.getElementById("location-select");
const statusDisplay = document.getElementById("status-display");
const crowdBadge = document.getElementById("crowd-badge");
const indicatorDot = document.getElementById("indicator-dot");
const waitTimeText = document.getElementById("wait-time-text");
const suggestionText = document.getElementById("suggestion-text");
const recommendationText = document.getElementById("recommendation-text");
const chatWindow = document.getElementById("chat-window");

// Location Tracker Logic
locationSelect.addEventListener("change", (e) => {
    const selected = e.target.value;
    if (locationData[selected]) {
        const data = locationData[selected];
        
        // Show the status area
        statusDisplay.style.display = "block";
        
        // Update badge text and color class
        const levelClass = data.level.toLowerCase();
        crowdBadge.textContent = data.level;
        crowdBadge.className = `badge ${levelClass}`;
        
        // Update indicator dot color
        indicatorDot.className = `indicator-dot ${levelClass}`;

        // Update wait time
        waitTimeText.textContent = `${data.waitTime} mins`;
        
        // Update texts with a subtle animation
        suggestionText.style.opacity = "0";
        recommendationText.style.opacity = "0";
        setTimeout(() => {
            suggestionText.textContent = data.suggestion;
            suggestionText.style.opacity = "1";
            suggestionText.style.transition = "opacity 0.3s ease";
            
            if (data.recommendation) {
                recommendationText.textContent = `💡 ${data.recommendation}`;
                recommendationText.style.display = "block";
                recommendationText.style.opacity = "1";
                recommendationText.style.transition = "opacity 0.3s ease";
            } else {
                recommendationText.style.display = "none";
            }
        }, 150);
    }
});

// Chatbot Logic
function handleChat(message) {
    if(!message) return;

    // Append user message
    appendMessage(message, "user");

    // Scroll to bottom
    chatWindow.scrollTop = chatWindow.scrollHeight;

    // Simulate typing delay
    setTimeout(() => {
        const reply = botResponses[message] || "I'm not sure about that. How else can I help you regarding the event?";
        appendMessage(reply, "bot");
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }, 600);
}

function appendMessage(text, sender) {
    const messageEl = document.createElement("div");
    messageEl.className = `message ${sender}`;
    
    const avatarTxt = sender === "user" ? "You" : "AI";
    
    messageEl.innerHTML = `
        <div class="avatar">${avatarTxt}</div>
        <div class="bubble">${text}</div>
    `;
    
    chatWindow.appendChild(messageEl);
}
