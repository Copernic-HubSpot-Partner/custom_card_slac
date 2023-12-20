// for HubSpot API calls
const hubspot = require('@hubspot/api-client');
const axios = require('axios');

// Initialize HubSpot API client
// const hubspotClient = new hubspot.Client({
//   accessToken: AUTH_HS,
// });

let HS_HEADER
let SLACK_HEADER

/**
 * Chargement du .env
 */
function setupAuthentification() {
    HS_HEADER = {
        'content-type': 'application/json',
        Authorization: `Bearer ${process.env['PRIVATE_APP_ACCESS_TOKEN']}`
    }

    SLACK_HEADER = {
        'content-type': 'application/json',
        Authorization: `Bearer ${process.env["SLACKTOKEN"]}`
    }
}

/**
 * Effectue une requête axios avec gestion de l'erreur
 * @param {*} config Configuration de la requête
 * @returns Résultat de la requête
 */
const effectuerRequete = async (config) => {
    let succes = 0
    let res

    while (!succes) {
        try {
            res = await axios.request(config)
            succes = 1
        } catch (error) {
            if (error.response && error.response.status === 429) {
                await delay(11000)
            }
            else {
                console.log("ERREUR requête : \n" + JSON.stringify(error.response.data))
                succes = 1
            }
        }
    }
    return res
}

exports.main = async (context = {}, sendResponse) => {
    // const { text } = context.parameters;
    // const { hs_object_id } = context.properties;
    let response = { message: "", type: "tip" }
    let channelId = context.propertiesToSend.slack_channel_id
    setupAuthentification()

    let messages = await getMessages(channelId)

    console.log(messages)

    try {
        sendResponse(messages);
    } catch (error) {
        sendResponse(error);
    }
};

async function getMessages(channelId) {
    let config = {
        method: 'post',
        url: `https://slack.com/api/conversations.history`,
        headers: SLACK_HEADER,
        data: {
            channel: channelId
        }
    }
  
    let res = await axios.request(config)
  
    if (res.data.ok) {
        let messages = res.data.messages.map(msg => {
            return {
                content: msg.text,
                timestamp: msg.ts,
                user: msg.user
            };
        });
  
        return messages
  
    }
  }
