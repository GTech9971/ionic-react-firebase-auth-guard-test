import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'auth-guard-test',
  webDir: 'build',
  bundledWebRuntime: false,
  "plugins": {
    "FirebaseAuthentication": {
      "skipNativeAuth": false,
      "providers": ["apple.com", "facebook.com"]
    }
  }
};

export default config;
