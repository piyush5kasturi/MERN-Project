const mongoose = require('mongoose');

mongoose.connect(`mongodb://localhost:27017/${process.env.COLLECTION_NAME}`)
    .then(() => { console.log("Connection created..") })
    .catch((err) => { console.log(`Error${err}`) })