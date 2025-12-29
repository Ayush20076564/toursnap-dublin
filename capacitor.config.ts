import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'toursnap-dublin',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchShowDuration: 1000,  // ✅ 2 seconds (use 1000 for 1 sec)
      launchAutoHide: false,
      showSpinner: false,
     // backgroundColor: "#4F46E5" // optional: match your theme
    }
  }
};

export default config;
