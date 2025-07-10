/** @type {Detox.DetoxConfig} */
export default {
  testRunner: {
    args: {
      '$0': 'jest',
      config: 'e2e/jest.config.cjs'
    },
    jest: {
      setupFilesAfterEnv: ['<rootDir>/e2e/jest.setup.js']
    }
  },
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/reviewcode.app',
      build: 'npx expo run:ios --configuration Debug --scheme reviewcode --device simulator'
    }
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 15'
      }
    }
  },
  configurations: {
    'ios.sim.debug': {
      device: 'simulator',
      app: 'ios.debug'
    }
  }
};
