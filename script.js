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

// Dynamic Bot Response Engine
let currentContext = null;

function generateBotResponse(message) {
    const loc = currentContext ? locationData[currentContext] : null;

    switch (message) {
        case "Where should I go now?":
            if (loc && loc.level === "High") {
                return `Since you're checking ${loc.name} and it's extremely crowded, I highly recommend detouring to ${loc.alternate || 'another gate'}.`;
            } else if (loc && loc.level === "Medium") {
                return `You're currently viewing ${loc.name}. The lines are moving, but the Food Court is a great place to stop and wait it out.`;
            } else if (loc && loc.level === "Low") {
                return `Since ${loc.name} is completely clear, head there immediately! It's the best option right now.`;
            }
            return "Based on the overall event traffic, Gate B and the Food Court are your best bets. Select a location in the tracker for personalized advice!";
            
        case "Is it crowded?":
            if (loc) {
                return `Currently, the crowd level at ${loc.name} is ${loc.level}. ${loc.level === "High" ? "Expect very long queues." : "You should have a pretty smooth path."}`;
            }
            return "Overall, the venue has a moderate crowd. Gate A is the busiest right now. Select a location to check its specific status.";
            
        case "Fastest exit?":
            if (loc && loc.name.includes("Gate")) {
                if (loc.level === "Low") return `You're already looking at ${loc.name}, which is presently the absolute fastest way out!`;
                if (loc.alternate) return `Avoid ${loc.name} right now. The fastest exit is definitely bypassing that and going to ${loc.alternate}.`;
            }
            return "Gate B currently has the lowest traffic and is the absolute best route for a quick exit.";
            
        case "Where is parking?":
            if (loc && loc.name === "Parking") {
                return `You're currently checking the Parking status! It's moderately full, but Level 2 still has plenty of open space. Go straight there.`;
            }
            return "Parking is located on the West side of the venue. The main structure's first level is filling up, but head to Level 2 for guaranteed open spots.";
            
        default:
            return "I'm not exactly sure about that. Try selecting a location first, or asking one of the suggested queries!";
    }
}

// DOM Elements
const locationSelect = document.getElementById("location-select");
const statusDisplay = document.getElementById("status-display");
const crowdBadge = document.getElementById("crowd-badge");
const indicatorDot = document.getElementById("indicator-dot");
const waitTimeText = document.getElementById("wait-time-text");
const suggestionText = document.getElementById("suggestion-text");
const recommendationText = document.getElementById("recommendation-text");
const chatWindow = document.getElementById("chat-window");

const btnFindRoute = document.getElementById("btn-find-route");
const routeDisplay = document.getElementById("route-display");
const routeSteps = document.getElementById("route-steps");

// Location Tracker Logic
locationSelect.addEventListener("change", (e) => {
    const selected = e.target.value;
    currentContext = selected; // Store the context for AI logic
    
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
    chatWindow.scrollTop = chatWindow.scrollHeight;

    // Add immediate "Thinking" indicator
    const typingId = "typing-" + Date.now();
    appendMessage(". . .", "bot", typingId, true);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    // Simulate think block
    setTimeout(() => {
        // remove typing indicator
        const typingEl = document.getElementById(typingId);
        if (typingEl) typingEl.remove();

        const reply = generateBotResponse(message);
        typeOutMessage(reply, "bot");
    }, 500 + Math.random() * 500); 
}

function typeOutMessage(text, sender) {
    const messageEl = document.createElement("div");
    messageEl.className = `message ${sender}`;
    const avatarTxt = "AI";
    
    const bubbleId = "bubble-" + Date.now();
    messageEl.innerHTML = `
        <div class="avatar">${avatarTxt}</div>
        <div class="bubble" id="${bubbleId}"></div>
    `;
    chatWindow.appendChild(messageEl);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    const bubbleEl = document.getElementById(bubbleId);
    let i = 0;
    
    // Play character by character effect
    const interval = setInterval(() => {
        if (i < text.length) {
            bubbleEl.textContent += text.charAt(i);
            i++;
            chatWindow.scrollTop = chatWindow.scrollHeight;
        } else {
            clearInterval(interval);
        }
    }, 20); // ms per character
}

function appendMessage(text, sender, id = null, isStatus = false) {
    const messageEl = document.createElement("div");
    messageEl.className = `message ${sender}`;
    if (id) messageEl.id = id;
    
    const avatarTxt = sender === "user" ? "You" : "AI";
    
    // Create the message structure
    messageEl.innerHTML = `
        <div class="avatar">${avatarTxt}</div>
        <div class="bubble" ${isStatus ? 'style="font-style: italic; color: #a1a1aa; background: transparent; border: none; padding: 0.75rem 0;"' : ''}>${text}</div>
    `;
    
    chatWindow.appendChild(messageEl);
}

// Best Route Generator Logic
function generateBestRoute() {
    // Basic decision making logic based on current data
    const entries = ["gate-a", "gate-b"];
    
    // Find the gate with the lowest wait time or crowd level
    const bestEntry = entries.reduce((prev, curr) => {
        return locationData[curr].level === "Low" ? curr : prev;
    });
    
    // Choose an amenity to visit. Food Court is standard, or just exit.
    // For this simulation, we hardcode the structural steps but make data dynamic:
    const amenity = "food-court";

    const stepsHtml = `
        <li class="route-step">
            <div class="route-step-title">1. Enter via ${locationData[bestEntry].name}</div>
            <div class="route-step-desc">Currently clear with the lowest wait time.</div>
        </li>
        <li class="route-step">
            <div class="route-step-title">2. Pass through ${locationData[amenity].name}</div>
            <div class="route-step-desc">${locationData[amenity].level === "Medium" ? "Moderate crowd, but moving steadily." : "Enjoy the clear space."}</div>
        </li>
        <li class="route-step">
            <div class="route-step-title">3. Head to the Main Event Floor</div>
            <div class="route-step-desc">Follow the signs from the Food Court to your seats. path is optimal.</div>
        </li>
    `;
    
    routeSteps.innerHTML = stepsHtml;
    routeDisplay.style.display = "block";
}

btnFindRoute.addEventListener("click", generateBestRoute);
