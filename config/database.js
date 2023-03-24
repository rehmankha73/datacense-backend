import mongoose from 'mongoose';

const connectToMongoDb = async () => {
    try {
        mongoose.set('strictQuery', true);
        const conn = await mongoose.connect(process.env.DATABASE_URL,
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