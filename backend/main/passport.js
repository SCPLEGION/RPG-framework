import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import dotenv from 'dotenv';

dotenv.config();

var scopes = ['identify', 'email', 'guilds', 'guilds.join'];

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: `${process.env.APP_URL}/auth/discord/callback`,
    scope: scopes
}, (accessToken, refreshToken, profile, done) => {
    // You can save the user to your DB here if needed
    return done(null, profile);
}));

export default passport;