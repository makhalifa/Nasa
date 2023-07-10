const passport = require('passport')
const {Strategy} = require('passport-google-oauth20')

require('dotenv').config()

const config = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'https://localhost:3000/auth/google/callback',
    scope: ['email', 'profile']
}

function verify(accessToken, refreshToken, profile, cb) {
    console.log('accessToken', accessToken)
    console.log('refreshToken', refreshToken)
    console.log('profile', profile)
    cb(null, profile)
}

export function setupPassport() {
    passport.use(new Strategy(config, verify))
}

export function passportInitialize() {
    return passport.initialize()
}

export function passportSession() {
    return passport.session()
}

export function passportAuthenticate() {
    return passport.authenticate('google', {scope: ['email', 'profile']})
}

export function passportAuthenticateCallback() {
    return passport.authenticate('google', {failureRedirect: '/login'})
}