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
  let userEmails = []
  setupAuthentification()

  if(channelId == null) {
    const dealname = context.propertiesToSend.dealname
    const [channelId, res] = await createChannel(dealname);

    if (res.ok) {
      await updateDeal(context.propertiesToSend.hs_object_id, {slack_channel_id: channelId})
      response.message = "Salon crée avec succès !"
      response.type = "info"
    } else {
      response.message = `Erreur lors de la création du salon : ${res.error}`
      response.type = "danger"
    }
  } else {
    response.message = "Salon déjà existant, utilisateurs mis à jour"
    response.type = "warning"
  }

  if(context.propertiesToSend.hubspot_owner_id != null) {
    userEmails.push(await getUsersEmail(context.propertiesToSend.hubspot_owner_id))
  }
  // let userEmails = [await getUsersEmail(context.propertiesToSend.hubspot_owner_id), "alban@agence-copernic.fr"] // Ajouter Mélanie...

  await addChannelUsers(channelId, userEmails)

  try {
    sendResponse(response);
  } catch (error) {
    sendResponse(error);
  }
};

/**
 * Crée un salon Slack
 * @param {*} name Nom du salon
 * @returns identifiant du salon en cas de succès
 */
async function createChannel(name) {
  let config = {
    method: 'post',
    url: `https://slack.com/api/conversations.create`,
    headers: SLACK_HEADER,
    data: {
      name: name.toLowerCase().replace(/ /g,"-")
    }
  }
  
  let res = await effectuerRequete(config)
  
  if(res.data.ok) {
    return [res.data.channel.id, res.data]
  }
  else {
    return ["", res.data]
  }
}

/**
 * Met à jour le deal HubSpot
 * @param {*} dealId Identifiant de la transaction
 * @param {*} data propriétés à mettre à jour
 */
async function updateDeal(dealId, data) {
  let config = {
    method: 'patch',
    url: `https://api.hubapi.com/crm/v3/objects/deals/${dealId}`,
    headers: HS_HEADER,
    data: {
      properties: data
    }
  }

  await effectuerRequete(config)
}

/**
 * Retourne l'adresse mail de l'tuilisateur
 * @param {*} userId Identifiant du owner
 * @returns adresse mail de l'utilisateur
 */
async function getUsersEmail(userId) {
  let config = {
    method: 'get',
    url: `https://api.hubapi.com/crm/v3/owners/${userId}`,
    headers: HS_HEADER,
  }

  let res = await effectuerRequete(config)

  return res.data.email
}

/**
 * Retourne l'utilisateur slack en fonction de l'email
 * @param {*} email Email de l'utilisateur
 * @returns Identifiant Slack de l'utilisateur
 */
async function getUserSlackId(email) {
  let config = {
    method: 'get',
    url: `https://slack.com/api/users.lookupByEmail?email=${email}`,
    headers: SLACK_HEADER
  }
  
  let res = await effectuerRequete(config)
  
  if(res.data.ok) {
    return res.data.user.id
  }
  return ""
}

/**
 * Retourne un tableau d'identifiant d'utilisateur Slack à partir d'une liste de mails
 * @param {*} tabEmail Tableau d'adresses mail
 * @returns Tableau d'identifiants Slack
 */
async function getIdList(tabEmail) {
  let idList = ""
  for (i in tabEmail) {
    if(idList != "") {
      idList += ","
    }
    idList += await getUserSlackId(tabEmail[i])
  }
  
  return idList
}

async function addChannelUsers(channelId, userEmails) {
  let userList = await getIdList(userEmails)

  let config = {
    method: 'post',
    url: `https://slack.com/api/conversations.invite`,
    headers: SLACK_HEADER,
    data: {
      channel: channelId,
      users: userList
    }
  }
  
  await effectuerRequete(config)
}
