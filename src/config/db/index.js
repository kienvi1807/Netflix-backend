require('dotenv').config();
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

async function connect() {
    try {
        await mongoose.connect(
            `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@netflix.7ucmghp.mongodb.net/netflix?retryWrites=true&w=majority`,
        );
        console.log('Connect successfully');
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}

module.exports = { connect };
