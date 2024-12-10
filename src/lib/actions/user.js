import User from "../models/user.model";

import { connect } from "../mongodb/mongoose";


export const createOrUpdateUser = async(
    id,
    first_name,
    last_name,
    image_url,
    email_addresses,
    username
) => {
    try{
        await connect();
        const user = await User.findOneAndUpdate(
            { clerkId: id },
            {
                $set: {
                    prenom: first_name,
                    nom: last_name,
                    profilePhoto: image_url,
                    email: email_addresses[0].email_adress,
                    username
                },
            }, {new: true, upsert: true}
        );
        return user;
    }catch(error){
        console.log("Erreur de la création ou mis à jour de l'user ", error);
    }
};

export const deleteUser = async (id) => {
    try{
        await connect();
        await User.findOneAndDelete({ clerkId: id});
    }catch(error){
        
    }
}