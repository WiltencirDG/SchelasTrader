const twilio = require('twilio')
const credentials = require('../credentials/twilio.json')

async function robot(emitter){
    const client = new twilio(credentials.accountSid, credentials.token)
    
    emitter.on('notification', (message)=>{
        
        client.messages.create({
            body: message,
            to: credentials.to,
            from: credentials.from
        })
        
    })
}

module.exports = robot
