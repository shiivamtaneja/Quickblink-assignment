# Project Setup Guide

This guide outlines the steps to set up and run the project on your local machine.

## Getting the Project

You can access the project by either cloning the repository from [GitHub](https://github.com/shiivamtaneja/Quickblink-assignment) or by downloading .zip file and extracting its contents.

## Backend Setup

1. Navigate to the 'backend' directory in your terminal or command prompt.
2. Run the following command to install the necessary dependencies:

```
yarn install
```

3. Once the dependencies are installed, start the server by running:
```
yarn dev
```
4. Note the server's PORT number; if it's not running on the default port '3000', take note of the specific port.

## Frontend Setup

1. Move to the 'frontend' directory using the terminal or command prompt.
2. Install the required frontend dependencies:
```
yarn install
```

3. Start the frontend server by executing:
```
yarn dev
```
4. Once the server is up, the console will display a localhost URL. Open this URL in your browser to access the application.

## Configuration Adjustment (if needed)

- If the backend server is running on a port other than the default '3000':
- Navigate to the 'endpoint.ts' file in the 'utils' folder of the frontend.
- Modify the `PORT` variable in 'endpoint.ts' to reflect the specific port the server is running on.

Following these steps will ensure a successful setup and enable you to run the application locally.
