const mongoose = require('mongoose');

const connectWithDb = () => {
    mongoose.connect(process.env.DB_URL)
    .then(console.log(`Database connected`))
    .catch(error => {
        console.log(`DB connection issues!!`);
        console.log(error);
        process.exit(1);
    });
}

module.exports = connectWithDb;