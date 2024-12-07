# groupfinder
## Why use groupfinder:
Do you need a group for your CS35L project? Simply install this project locally, and we ensure you'll have a group in no time!

## Installation
Start off by cloning our repo.
```bash
git clone https://github.com/steffimathew33/groupfinder.git
```


Download Node.js from this link: https://nodejs.org/en/download/prebuilt-installer.


Navigate to the backend folder and install the necessary node modules.
```bash
cd backend
npm install
```


Navigate to the frontend folder and install the necessary node modules.
```bash
cd frontend
npm install
```

To access information from the server, you will also need an authentication key. 
Navigate to your backend folder and create a file called config.env.
Inside config.env, enter this:

```
ATLAS_URI=mongodb+srv://public:12345@groupfinderdb.97hq3.mongodb.net/?retryWrites=true&w=majority&appName=GroupFinderDB
SECRETKEY=supersecretkeythatcannotbeguessedbyanyone
```


## Starting up the website
In your terminal, navigate to the backend folder and start up the server:
```bash
cd backend
node server.js
```


In a separate terminal, navigate to the frontend folder to start up the app:
```bash
cd frontend
npm start
```


You will be prompted with the message: `Would you like to run the app on another port instead? » (Y/n)`

Answer with `Y` 


And there you go! Your server and your app should be running on two different ports. You can view the website in your browser at http://localhost:3001.

## Note
Make sure to run these instructions on eduroam wifi to avoid authentication issues with the server.

## About
We created this app to help future CS35L students find a group for their project (as this is something that we all struggled with at the beginning of the quarter)! We hope this helps you find your future project members :)

## Contributors
Katie Dinh

Alyssa Ko

Steffi Mathew

Tyler Taylor
