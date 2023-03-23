import mongoose from 'mongoose';

const connectToMongoDb = async () => {
    try {
        mongoose.set('strictQuery', true);
        const conn = await mongoose.connect('mongodb://localhost:27017/datacense',
            {
                // useFindAndModify: false,
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        );

        console.log(`MongoDB Connected: ${conn.connection.host}`)
        console.log('Database Name: ', conn.connection.name);
    } catch (error) {
        console.error(`Error: ${error.message}`)
    }
}

export default connectToMongoDb;