# Smart Event Assistant

## Problem
Managing large crowds efficiently at events can be challenging. Attendees frequently deal with bottlenecks at popular gates, crowded food courts, and difficulty finding free parking, leading to frustration.

## Solution
The **Smart Event Assistant** is a lightweight, frontend-only web application that dynamically provides attendees with live crowd updates and smart suggestions to enhance their event experience. 

## Features
1. **Live Location Tracker**: Dropdown menu allows users to select locations like Gate A, Gate B, Food Court, and Parking.
2. **Dynamic Crowd Levels**: Shows whether a location's crowd is Low, Medium, or High.
3. **Smart Suggestions**: Intelligently recommends actions:
   - High Crowd $\rightarrow$ Suggests an alternate location (e.g., Use Gate B instead).
   - Medium Crowd $\rightarrow$ Provides estimated wait times.
   - Low Crowd $\rightarrow$ Gives the clear to proceed.
4. **AI Chatbot Assistant**: A convenient chat UI giving quick predefined answers for finding food, the best exit, crowd status, and parking.
5. **Modern UI**: Designed with an immersive, glassmorphism aesthetic, sleek dark mode, and subtle micro-animations for a premium user experience.

## How it Works
This project uses vanilla HTML, CSS, and JavaScript. There are no heavy frameworks or external libraries, ensuring a minimal footprint (<10MB).

### To run the project locally:
1. Clone or download the repository.
2. Open `index.html` in any modern web browser.
3. Alternatively, if using Visual Studio Code, you can use an extension like **Live Server** to run it on a local development server for automatic reloading.
