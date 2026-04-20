// Define locations and their realistic static conditions
const locationData = {
    "gate-a": { 
        name: "Gate A", 
        level: "High", 
        alternate: "Gate B" 
    },
    "gate-b": { 
        name: "Gate B", 
        level: "Low", 
        alternate: null 
    },
    "food-court": { 
        name: "Food Court", 
        level: "Medium", 
        alternate: null 
    },
    "parking": { 
        name: "Parking", 
        level: "Medium", 
        alternate: null 
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
        
        let waitTimeStr = "";
        let suggestionMessage = "";
        let recommendationMessage = "";

        // Smart decision system logic
        if (data.level === "High") {
            waitTimeStr = "15-20 mins";
            suggestionMessage = `Traffic is very heavy at ${data.name}. We suggest using ${data.alternate} as an alternate location for much faster entry.`;
            recommendationMessage = "Best time to visit is after 20 minutes";
        } else if (data.level === "Medium") {
            waitTimeStr = "5-10 mins";
            suggestionMessage = `${data.name} is moderately busy. Please expect a short wait time in the queue.`;
            if (data.name === "Parking") suggestionMessage += " First floor is full, but Level 2 should have spots.";
            if (data.name === "Food Court") suggestionMessage += " Most popular stalls will have small lines.";
            recommendationMessage = "Best time to visit is after 10 minutes";
        } else if (data.level === "Low") {
            waitTimeStr = "0 mins";
            suggestionMessage = `It's completely clear at ${data.name}! You can enter immediately.`;
            recommendationMessage = "Best time to visit is right now";
        }

        // Show the status area
        statusDisplay.style.display = "block";
        
        // Update badge text and color class
        const levelClass = data.level.toLowerCase();
        crowdBadge.textContent = data.level;
        crowdBadge.className = `badge ${levelClass}`;
        
        // Update indicator dot color
        indicatorDot.className = `indicator-dot ${levelClass}`;

        // Update wait time
        waitTimeText.textContent = waitTimeStr;
        
        // Update texts with a subtle animation
        suggestionText.style.opacity = "0";
        recommendationText.style.opacity = "0";
        
        setTimeout(() => {
            suggestionText.textContent = suggestionMessage;
            suggestionText.style.opacity = "1";
            suggestionText.style.transition = "opacity 0.3s ease";
            
            recommendationText.textContent = `💡 ${recommendationMessage}`;
            recommendationText.style.display = "block";
            recommendationText.style.opacity = "1";
            recommendationText.style.transition = "opacity 0.3s ease";
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
    
    // Create the message structure
    messageEl.innerHTML = `
        <div class="avatar">${avatarTxt}</div>
        <div class="bubble">${text}</div>
    `;
    
    chatWindow.appendChild(messageEl);
}
