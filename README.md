# Packer
Packer is a simple but powerful bootstrap for web applications with your custom choices.

# Get started
Install necessary dependencies:

```sh
npm install
```

Run the CLI:

```sh
node packer.js
```

To get more information, use the verbose mode:

```sh
node packer.js -v
```

Then follow the instructions to setup your web application.

# Process
The process of building the application are:
- Resolve (Prepare files and directories)
- BuildDirs, BuildFiles (Creating directories, copying template files)
- Glue (Modifying the template files based on the framework choices)
- PreBuild (Before build, optional)
- Build (Build backend and frontend, install dependencies)
- PostBuild (After build, optional)

# Support
### Backend
- flask
- express

### Frontend
- react

### Database
- MySQL
- MongoDB
- PostgreSQL (in progress)