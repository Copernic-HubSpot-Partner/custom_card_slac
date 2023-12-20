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

  let messages = getMessages(channelId)

  let userEmails = [await getUsersEmail(context.propertiesToSend.hubspot_owner_id), "alban@agence-copernic.fr"] // Ajouter Mélanie...

  await addChannelUsers(channelId, userEmails)

  try {
    sendResponse(response);
  } catch (error) {
    sendResponse(error);
  }
};

async function getMessages(slackId) {
  let config = {
    method: 'get',
    url: `https://slack.com/api/users.lookupByEmail`,
    headers: SLACK_HEADER
  }
  
  let res = await effectuerRequete(config)
  
  if(res.data.ok) {
    return res.data.user.id
  }
  return ""
}

