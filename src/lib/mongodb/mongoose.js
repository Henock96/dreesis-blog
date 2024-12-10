import mongoose from 'mongoose';

let initialized = false;

export const connect = async () => {
    mongoose.set('strictQuery', true);

    if(initialized){
        console.log("Déjà connecté à MongoDB");
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "dreesis-code",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connecté à MongoDB");
        initialized = true
    }catch(error){
        console.lo("Erreur Mongo DB", error);
    }
}