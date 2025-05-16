import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    discordId: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    money: {
        type: Number,
        default: 1000,
    },
    stats: {
        health: {
            type: Number,
            default: 100,
        },
        stamina: {
            type: Number,
            default: 100,
        },
        experience: {
            type: Number,
            default: 0,
        },
    },
    inventory: {
        type: [String],
        default: [],
    },
});

const User = mongoose.model('User', userSchema);

export default User;