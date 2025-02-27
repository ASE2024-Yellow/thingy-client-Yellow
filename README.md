## This is an app that is intended to help people in case of a fall or an accident
This project requires a Thingy which can be placed in a vehicle, on a bike or wheelchair. The Thingy will then send information from the sensors like Temperature, Humidity, Air pressure to be displayed in the app. 

The Thingy senses any Flips that happen and this is considered a fall. For users safety, if a button on the device is not pressed in less than 30s, an Emergency call will be made, to send help.

# Step 1: Clone repo
```
git clone https://github.com/ASE2024-Yellow/thingy-client-Yellow.git 
```
# Step 2: Install Node modules
```
cd thingy-client-Yellow/
npm install
```
## To run this project you need:
- [Node.js](https://nodejs.org/en)
- [MongoDB](https://www.mongodb.com/try/download/community)

# Step 3: start the project
```
npm start
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

If the API is ran first on [http://localhost:3000](http://localhost:3000), you will be asked if you want it opened in another address, press Y for yes

Open [http://localhost:3001](http://localhost:3001) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

-------------------------------------------------------------------- 
# to run the project in Docker container 

# Step 1: Clone repo
```
git clone https://github.com/ASE2024-Yellow/thingy-client-Yellow.git 
```
# Step 2: Build the Docker image
```
cd thingy-client-Yellow/
docker build -t front-end .
```
# Step 2: Run the Docker container
```
docker run -p 3001:3001 --name front-end front-end
```
# Step 3: Access the app

Once the container is running, open your browser and go to http://localhost:3001 to view the app.



