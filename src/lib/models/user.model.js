import mongoose from 'mongoose';
import moogoose from 'mongoose';
import { unique } from 'next/dist/build/utils';

const userSchema = new moogoose.Schema({
    clerkId: {
        type: String,
        required: true,
        unique: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    prenom: {
        type: String,
        required: true,
    },
    nom: {
        type: String,
        required: true,
    },

    username: {
        type: String,
        required: true,
        unique: true
    },
    profilePhoto: {
        type: String,
        required: false,
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
}, {timestamps: true});

const User = moogoose.models.User || mongoose.model('User', userSchema);

export default User;