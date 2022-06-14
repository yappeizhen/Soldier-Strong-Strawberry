# Soldier-Strong

## Features
- [x] Swipeable bottom tab navigation (default)
- [x] Shifting bottom tab navigation
- [x] Stack navigation and modal
- [x] Drawer navigation
- [x] Linked to Firebase
- [x] Sign up
- [x] Basic log in and log out
- [x] Input validation
- [x] Success and error messages

## Simulated ELISS System using Computer Vision
Prototype build using Mediapipe model. Deployed Posenet lighting model on Tensorflow.js via React Native for real-time cilent-side inference while protecting user privacy.

#### Push Up Demo

https://user-images.githubusercontent.com/69728128/173635633-76432b30-ce6d-4aa2-8f8f-4de619f25cc9.mp4


#### Sit Up Demo

https://user-images.githubusercontent.com/69728128/173635693-923858e1-e192-4336-881d-adaadc5a108e.mp4

#### PoseNet Tensorflow.js Pushup Screen on Application

![Push Up Screen](https://user-images.githubusercontent.com/69728128/173638256-a136d788-d25c-4adc-9d8b-5dd4d5b93ac3.jpg)


## Use of App

### Login/Signup
<img width="516" alt="Screenshot 2022-06-15 at 01 16 29" src="https://user-images.githubusercontent.com/68325028/173637743-40019c78-fa8c-4698-a80e-adecdffd47b6.png">
<img width="516" alt="Screenshot 2022-06-15 at 01 17 18" src="https://user-images.githubusercontent.com/68325028/173637850-1150c57e-05f8-402f-8159-47bbd465a84f.png">

###

## Getting Started

### `npm install`

Installs all dependencies or devDependencies from package.json file

### `npm run start`

Runs your app in development mode.

Open it in the [Expo Go app](https://expo.io) on your phone to view it by scanning the displayed QR code upon running. It will reload if you save edits to your files, and you will see build errors and logs in the terminal.

Sometimes you may need to reset or clear the React Native packager's cache. To do so, you can pass the `--reset-cache` flag to the start script:

```
npm run start --reset-cache
# or
yarn run start --reset-cache
```

#### `npm test`

Runs the [jest](https://github.com/facebook/jest) test runner on your tests.

#### `npm run ios`

Like `npm start`, but also attempts to open your app in the iOS Simulator if you're on a Mac and have it installed.

#### `npm run android`

Like `npm start`, but also attempts to open your app on a connected Android device or emulator. Requires an installation of Android build tools (see [React Native docs](https://facebook.github.io/react-native/docs/getting-started.html) for detailed setup). We also recommend installing Genymotion as your Android emulator. Once you've finished setting up the native build environment, there are two options for making the right copy of `adb` available to Create React Native App:

## Personalisation

Use `toggles.ts` in the src folder to configure customisations such as enabling authentication, and switching between bottom tab configurations.

## Hooks

### `useAuthState`

Checks if the user is logged in, and if so, returns the corresponding user information

### `useColorScheme`

Checks the color scheme (dark or light) of the user's device
