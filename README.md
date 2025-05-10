# Tadawi

![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-active-success)
![Stars](https://img.shields.io/github/stars/Sarah-alj/Tadawi)
![Node](https://img.shields.io/badge/node.js-18.x-brightgreen)
![Mongo](https://img.shields.io/badge/MongoDB-database-success)
![Security](https://img.shields.io/badge/security-secure-blue)

Tadawi (تداوي) is a clinical trial and donation platform that bridges the gap between patients, healthcare providers, and donors in Saudi Arabia. This project is part of a senior software engineering project focused on digital healthcare transformation.

---

## 🚀 Project Overview

Tadawi is designed to:
- Connect **patients** with relevant clinical trials.
- Allow **doctors** to manage trials and view patient matches.
- Enable **donors** to share medical equipment with those in need.

Built with a secure and scalable architecture, Tadawi aims to revolutionize how clinical trials and donations are accessed in the Kingdom and beyond.

---

## 🔧 Key Features

### 1. Account Creation
Custom registration process for patients and healthcare professionals with tailored profile fields.

### 2. Profile Management
Update medical history, preferences, or trial details depending on user type.

### 3. Clinical Trial Match
Smart trial recommendation engine based on patient data.

### 4. Lab Scheduling and Booking
Doctors can schedule lab appointments for trial-related testing.

### 5. Donation Tab
List, request, or acquire donated medical equipment.

### 6. Search Preferences
Filter trials or donations by medical condition, region, duration, and more.

### 7. Notification System
Get notified about matches, messages, appointments, and donations.

### 8. Help and Contact Support
Easy access to help documentation and platform support.

### 9. Chatbox
Real-time communication between patients, doctors, and support.

### 10. Feedback
Collect user feedback to improve the platform continuously.

### 11. AI Chat Box
24/7 virtual assistant for answering platform-related questions.  Powered by a local knowledge base stored in `chatbot-knowledgebase.txt`.

### 12. Natural Remedies Help Page
Educates users on traditional Saudi herbs and safe practices.

### 13. Automatic Match Suggestion
Automated system for recommending trials and donations.

### 14. Donation & Clinical Trial Management
Edit, delete, and manage listings or trials easily.

### 15. Multi-User Homepages
Customized dashboards for patients, doctors, and donors.

### 16. Secure Authentication & Authorization
Although not previously listed, Tadawi includes secure user authentication using roles (e.g., patient, doctor) and token verification. This ensures access is strictly controlled and sensitive medical data is protected across all interactions.

---

## 🌐 Tech Stack

### Programming Languages
- **Node.js:** Backend runtime used to build Tadawi’s server-side logic and APIs.
- **JavaScript:** Powers both frontend and backend logic.
- **HTML:** Structures content for Tadawi's interface.
- **CSS:** Styles and formats responsive layouts.

### Tools
- **Visual Studio Code:** Main editor for development and debugging.
- **GitHub:** Version control, collaboration, and issue tracking.
- **Canva:** Used to design visual assets and UI mockups for the Tadawi platform. 

### Database
- **MongoDB:** NoSQL database for storing users, trials, and donation data.

### Templating Engine
- **EJS:** Used for rendering dynamic HTML content on the server.

### Frameworks
- **Express.js:** Web framework for handling routes, middleware, and server logic.

### Architecture & Communication
- **REST API:** Used for frontend-backend communication using JSON and HTTP methods.

### Authentication & Session Management
- **bcrypt.js:** Secure password hashing.
- **express-session:** Manages user session data securely.

### Testing Tools
- **Selenium WebDriver:** Used for automated testing of features like login, profile editing, and logout.
- **ChromeDriver:** Simulates browser actions during test cases.
- **Jest:** JavaScript testing framework mainly used for unit and integration testing.
- **Supertest:** HTTP assertion library that is commonly used alongside Jest for testing RESTful APIs.
- **Puppeteer:** headless browser automation tool built by the Chrome team.

### Animations
- **GSAP:** (GreenSock Animation Platform) was used to create smooth and engaging animations across the Tadawi interface.

---


## 💡 How to Run Locally

```bash
# Clone the repository
git clone https://github.com/Sarah-alj/Tadawi.git
cd Tadawi

# Install dependencies
npm install

# Create a .env file based on the example
cp .env.example .env
# Fill in the required environment variables

# Start the server
node server.js
```

All dependencies are listed in `package.json`.

---

## 📚 Environment Variables
Make sure to create a `.env` file in the root directory. Here's an example (`.env.example`) you can base yours on:

```env
MONGO_URI=
SESSION_SECRET=
NODE_ENV=development
PORT=5000

EMAIL_USER=
EMAIL_PASSWORD=
EMAIL_PORT=587
EMAIL_HOST=smtp.gmail.com
CLIENT_URL=http://localhost:5000
EMAIL_FROM=noreply.Tadawi@gmail.com
EMAIL_ACTIVE=true

OPEN_AI_API_KEY=
```

> Do not commit your real `.env` file to version control!

---

## ✉️ Contact
If you have questions, suggestions, or feedback:
- GitHub Issues
- Email: Saraljurbua@gmail.com

---

## ✅ License
This project is licensed under the MIT License.
