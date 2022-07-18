module.exports = {
    wallet: {
        user: "moonbust", // bitcoin user
        pass: "j3536YzAeJMXRZXLkt94bqmeWYWaKGNjETtDwAN2rhu",  // bitcoin password
        updateRate: 12000, // Update users deposit // 12000 = 2 Min
        balance: '11640' // Define Site Balance - Example: 11640 bits = 100 USD
    },
    socket: {
        host: "127.0.0.1",
        port: 3004
    },
    rethinkdb: {
        host: 'localhost',
        port: 28015,
        authKey: '',
        db: 'crash_game'
    },
    Base: {
        Title: "Crash",
        URL: ""
    },
    email: {
        user: '', // Gmail User ( full email address)
        pass: '', // Gmail Password
    },
    env: 'pro', //pro
};