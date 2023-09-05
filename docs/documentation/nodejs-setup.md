# Initialization Without `package.json`

<br>

If the `package.json` file is missing, you can initialize one and install the necessary dependencies as follows:


1. Open a PowerShell terminal and navigate to the project directory.

2. Create an empty JSON file.

```bash
type nul > package.json
```

2. Reformat the file as follows.
``` JSON
{
  "name": "online-poker",
  "version": "1.0.0",
  "description": "",
  "main": "server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  },
  "author": "",
  "license": "ISC",
}
```

3. Install required production dependencies
```
npm install express socket.io
```

4. Install development dependencies
```
npm install --save-dev nodemon
```