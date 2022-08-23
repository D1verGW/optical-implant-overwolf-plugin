# Description

Cyberpunk 2077 Optical Implant frontend part includes overwolf plugin with on-screen definition of start and end of hack-protocol mini-game.

## Setting up
In order to run the app, you must first complete several steps:

1. Download and install [NodeJS](https://nodejs.org/) and [Yarn](https://yarnpkg.com/).
After installing, run the following commands in a terminal of your choice:
```
node -v
yarn -v
```
If they run successfully, proceed to the next steps.

2. Download and install the [Overwolf desktop client](https://download.overwolf.com/install/Download).

3. Download the repository as a zip file and extract it.

4. In your terminal, run the following commands:
```
cd <insert path to your extracted 'ts' folder here>
yarn install
yarn build
```

5. Open the Overwolf desktop client settings (by right-clicking the client and selecting
"Support" or by clicking on the wrench icon in the dock and going to the "Support" tab).

6. Click on "Development options".

7. In the opened window, click on "Load unpacked extension" and select the `dist/` folder.
This will add the app to your dock.

8. Click on the app's icon in your dock.

## Building an .opk for distribution
When you run ```yarn build``` in your terminal, an .opk is created in releases/ directory

## Changing the version number quickly
We have included a webpack plugin that can change the .opk version quickly with just a command line argument. Simply add ```--env setVersion=1.0.1``` to your build command.
Example:
```
yarn build --env setVersion=1.0.1
```

This will change the app version both in package.json and app's manifest.json

## What will you find inside?

### public/
All of the static resources used by the app, like icons, images and CSS

##### public/manifest.json
This file defines all of the aspects of the app.
Read all about Overwolf's manifest.json mechanism [here](https://overwolf.github.io/docs/api/manifest-json#welcome-to-the-manifestjson-file).
In our manifest.json file, we have [```{ "start_window": "background" }```](https://overwolf.github.io/docs/api/manifest-json#start_window) defined.
This sets our [background](###windows/background) window as the app's starting point.
All of this app's windows' properties can be found under the [```windows```](https://overwolf.github.io/docs/api/manifest-json#window-data) object.
Please refer to the [dev site](https://overwolf.github.io/docs/api/manifest-json#welcome-to-the-manifestjson-file) to learn more about each property.

#### src/
Source .html & .ts files for the app

## Notes
Editing the author or app name in the manifest will prevent loading the app as an unpacked app.

For any further information or questions, contact gribok.personal@gmail.com
