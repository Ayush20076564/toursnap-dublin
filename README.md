# TourSnap App 🌍📸  
A simple **Ionic + Angular** travel companion app that lets users **browse places**, view details, and create/edit **offline journal entries** with notes and photos. Built with **Capacitor**, so it can run on **Web**, **Android**, and **iOS** (macOS required for iOS).

---

##  What this app does  
TourSnap helps you:  
- Browse a list of places  
- Open a place to view details  
- Add a journal entry for a place (**notes + photos**)  
- View all saved journal entries  
- Open a journal entry in a modal (**expanded view**)  
- Edit or delete an existing journal entry  
- Store everything **offline** using local storage + filesystem  

---  
  
##  Features  
  
### Places  
- Places list page    
- Place detail page (name, category, description, tips)    
- “Add to Journal” action from the place detail page    
  
### Journal  
- Journal list page showing saved entries    
- Expanded entry preview using **IonModal**    
- Safe navigation: modal closes before routing to Edit page    
- Delete entry with confirmation using **AlertController**   
- Photo preview thumbnails in edit page    
- Offline-first: entries + photo files persist locally    
  
### Safety  
- Safety / SOS page (navigation included)  
  
---  
  
## 🧰 Tech Stack  
- **Ionic Framework** (UI components like `ion-card`, `ion-modal`, `ion-button`)  
- **Angular** (routing, services, standalone pages)  
- **Capacitor** (native bridge for Android/iOS)  
- **Capacitor Filesystem** (store photos offline)  
  
---
  
##  Requirements  
 
### Web + Android  
- **Node.js** (recommended LTS)  
- **npm**    
- **Ionic CLI**  
  ```bash  
  npm i -g @ionic/cli  

  (Optional) Angular CLI  

npm i -g @angular/cli  


Android Studio (for APK builds)  

iOS  
 macOS + Xcode required  

CocoaPods  

sudo gem install cocoapods  


 Windows cannot build a real .ipa directly. You must use macOS + Xcode for iOS builds.  
 
🚀 Getting Started (Run Locally)  
1) Clone the repo  
git clone https://github.com/Ayush20076564/toursnap-dublin  
cd TourSnap-App    
  
2) Install dependencies  
npm install  

3) Run in browser  
ionic serve  
  
 Android Setup  
1) Build and add Android platform  
ionic build
npm install @capacitor/android@7
npx cap add android  
npx cap sync android  
npx cap open android   
  
3) Add Android permissions (Camera / Storage)  
  
Edit:  
android/app/src/main/AndroidManifest.xml  
  
Add required permissions inside <manifest>:  

 ```xml
 <uses-permission android:name="android.permission.INTERNET" />  
    <uses-permission android:name="android.permission.VIBRATE" />  
    <uses-permission android:name="android.permission.READ_CONTACTS" />  
    <uses-permission android:name="android.permission.WRITE_CONTACTS" />  
    <uses-permission android:name="android.permission.CAMERA" />  
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />  
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />  
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />  
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />  
<uses-permission android:name="android.permission.CAMERA" />    
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
```



Note: On older Android versions you may also need:  
```xml
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />  
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

 iOS Setup  
1) Add iOS platform  
ionic build
npm install @capacitor/ios@7  
npx cap add ios  
npx cap sync ios  
npx cap open ios  

3) Add iOS permissions (Camera / Photos)  

Open the iOS project in Xcode, then update:  
ios/App/App/Info.plist  

Add these keys:  

NSCameraUsageDescription  

NSPhotoLibraryUsageDescription  

Example:  

<key>NSCameraUsageDescription</key>  
<string>We need camera access to take photos for your journal entries.</string>  
<key>NSPhotoLibraryUsageDescription</key>  
<string>We need photo library access to attach photos to your journal entries.</string>  

🎨 App Icons + Splash Screen  

npm i @capacitor/splash-screen@7
  
If your project includes:  
  
resources/icon.png  
  
resources/splash.png  
  
Generate assets  
npm install -D @capacitor/assets  
npx capacitor-assets generate  

Sync to platforms  
npx cap sync android  
npx cap sync ios  

📱 Generate APK (Android)  
1) Open Android Studio  
npx cap open android  

2) Build APK  

In Android Studio:  

Build → Build Bundle(s) / APK(s) → Build APK(s)  

Click Locate after the build finishes  

Common output path:  

android/app/build/outputs/apk/debug/app-debug.apk  

📌 Notes  

Journal entries are stored offline (local storage + filesystem)  

Photos are saved locally so entries work without internet  

Navigation is handled safely (modal closes before routing)  
