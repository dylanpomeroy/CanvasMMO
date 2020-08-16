# CanvasMMO Client

## Run/Build

To run the react client w/ inspect and hot reload:
- first time: `npm install`
- `npm start`
- first time: add the following VSCode config in `{projectDir}/.vscode/launch.json`
```
{
    "name": "Client Chrome",
    "type": "chrome",
    "request": "launch",
    "url": "http://localhost:3000",
    "webRoot": "${workspaceRoot}/client/src",
    "sourceMapPathOverrides": {
      "webpack:///./*": "${webRoot}/*",
      "webpack:///src/*": "${webRoot}/*",
      "webpack:///*": "*",
      "webpack:///./~/*": "${webRoot}/node_modules/*",
      "meteor://💻app/*": "${webRoot}/*"
    }
  }
```
- Run the config "Client Chrome"
- VSCode will now attach to the process for setting breakpoints etc.