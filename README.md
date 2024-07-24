# Sales-and-Inventory-System

*An offline desktop app for managing sales and inventory. Built with [Electron](https://github.com/atom/electron), React, Typescript and [Realm](https://github.com/realm) as offline database.*

## Features

- View, create, update and delete products.
- Purchase products through cash register.
- Can use barcode scanner for quick item search.
- Manage Gcash(E-wallet) transactions.
- Manage sales.
- Can add users as 'Admin', 'Manager' or 'Staff'.
- Role base restrictions.
- Manage expenses.
- View user activities.
- View sales graph reports.

## How To Use

To clone and run this repository you'll [Node.js](https://nodejs.org/en/download/) (which comes with [npm](https://www.npmjs.com/)) installed on your computer. From your command line:

``` bash
# Clone this repository
git clone https://github.com/mikeale03/Sales-and-Inventory-System.git
```
The app will look for 'realm' folder to store database files. Create an empty 'realm' folder outside of the cloned 'Sales-and-Inventory-System' folder. After that, open the 'Sales-and-Inventory-System' folder.

![qq20160428-0 2x](https://private-user-images.githubusercontent.com/15939080/340893028-6d23bf24-31ad-41af-9a2c-a5a9df08ba6f.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MjE4MjY1NjMsIm5iZiI6MTcyMTgyNjI2MywicGF0aCI6Ii8xNTkzOTA4MC8zNDA4OTMwMjgtNmQyM2JmMjQtMzFhZC00MWFmLTlhMmMtYTVhOWRmMDhiYTZmLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDA3MjQlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwNzI0VDEzMDQyM1omWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWI4MWJlZDIxZjJlMmI2ODQ3YzBkNWEzOWEwNDU0ZDYyZjFlYTVmZGQ2NDIyNjYxODRjZGZjZjBmNmRkYTI5OTgmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.QHAAUuzCpf67VwTJitHiLt7fl9Rawk_2tHOdkMazM2Y)

``` bash
# Go into the repository
cd Sales-and-Inventory-System
# Install dependencies and run the app
npm install && npm start
```

To pack into an app:

``` shell
npm run package
```
