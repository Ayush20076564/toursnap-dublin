# TourSnap-App
A simple Ionic + Angular travel companion app that lets users browse places, view place details, and create/edit offline journal entries with notes and photos. It includes a clean UI with modal-based entry viewing, safe navigation between pages, and local storage/file saving so the journal works even without internet.
A simple Ionic + Angular mobile app to explore places and save personal travel journal entries offline (notes + photos). Built with Capacitor so it can run as a web app, Android app, and (with a Mac) iOS app.  

---

## ✨ What this app does  
TourSnap helps you:  
- Browse a list of places  
- Open a place to view details  
- Add a journal entry for a place (note + photos)  
- View all saved journal entries  
- Open a journal entry in a modal (expanded view)  
- Edit an existing journal entry  
- Delete a journal entry  
- Save everything **offline** on the device (local storage + filesystem)  
  
---  

## ✅ Features  
### Places  
- Places list page  
- Place detail page (name, category, description, tips)  
- “Add to Journal” from place detail  

### Journal  
- Journal list page showing saved entries  
- Expanded entry preview using **IonModal**  
- “Edit Journal” opens journal-edit page correctly (modal closes before navigation)  
- “Delete” with confirmation using **AlertController**  
- Photo preview thumbnails in journal edit page  
- Offline-first: entries and photo files persist locally  

### Safety  
- Safety / SOS page (navigation included)  

---  

## 🧰 Tech Stack
- **Ionic Framework** (UI components like ion-card, ion-modal, ion-button)  
- **Angular** (standalone pages, routing, services)  
- **Capacitor** (native bridge for Android/iOS)  
- **Filesystem (Capacitor plugin)** for storing photos offline  
  
---  
  
## 📦 Project Requirements  
Make sure you have these installed:  
  
### Required (Web + Android dev)  
- **Node.js** (recommended LTS)  
- **npm**  
- **Ionic CLI**  
  ```bash  
  npm i -g @ionic/cli  
Angular CLI (optional but useful)  
  
bash  
Copy code  
npm i -g @angular/cli  
For Android builds  
Android Studio  

Android SDK / platform tools  

JAVA (Android Studio bundles its own usually)  

For iOS builds  
✅ You must use macOS + Xcode  

Windows cannot produce a real .ipa build directly (details below)  

🚀 Getting Started (Run Locally)  
1) Clone the repo  
bash  
Copy code
git clone [https://github.com/Ayush20076564/TourSnap-App.git](https://github.com/Ayush20076564/toursnap-dublin)  
cd TourSnap-App  
2) Install dependencies  
bash  
Copy code  
npm install  
3) Run in browser  
bash  
Copy code  
ionic serve  
This runs the app as a web app at a local URL.  
