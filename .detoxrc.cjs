/** @type {Detox.DetoxConfig} */
module.exports = {
  testRunner: {
    args: {
      '$0': 'jest',
      config: 'e2e/jest.config.cjs'
    },
    jest: {
      setupTimeout: 120000
    }
  },
  apps: {
    'expo.ios': {
      type: 'ios.app',
      binaryPath: '/Users/nguyenquangkhai/Library/Developer/Xcode/DerivedData/reviewcode-gpithffgziiqyrghqaehlvzcjmwn/Build/Products/Debug-iphonesimulator/reviewcode.app',
      build: 'npx expo run:ios --configuration Debug'
    },
    'expo.android': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      build: 'npx expo run:android --variant debug',
      reversePorts: [8082]
    }
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 15'
      }
    },
    emulator: {
      type: 'android.emulator',
      device: {
        avdName: 'Pixel_3a_API_30_x86'
      }
    }
  },
  configurations: {
    'ios.sim.debug': {
      device: 'simulator',
      app: 'expo.ios'
    },
    'android.emu.debug': {
      device: 'emulator',
      app: 'expo.android'
    }
  }
};
