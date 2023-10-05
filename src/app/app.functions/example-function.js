// for HubSpot API calls
const hubspot = require('@hubspot/api-client');

// Initialize HubSpot API client
const hubspotClient = new hubspot.Client({
  accessToken: process.env['PRIVATE_APP_ACCESS_TOKEN'],
});

exports.main = (context = {}, sendResponse) => {
  const { text } = context.parameters;
  // const { hs_object_id } = context.properties;
  console.log(context)
  
  // const deal = getDeal(hs_object_id);

  const response = `This is coming from a serverless function! You entered: ${text}`;
  console.log(response);


  try {
    sendResponse(deal);
  } catch (error) {
    sendResponse(error);
  }
};

async function getDeal(dealId) {
  const deal = await hubspotClient.crm.deals.basicApi.getById(dealId, ['dealname', 'amount', 'dealstage']);
  return deal;
}


const AUTH_SLACK = process.env.SLACKTOKEN

async function createChannel(name) {
  let config = {
    method: 'post',
    url: `https://slack.com/api/conversations.create`,
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${AUTH_SLACK}`
    },
    data: {
      name: name.replace(/ /g,"-")
    }
  }
  
  let res = await axios.request(config).catch(err => {console.log(err.data)})
  
  if(res.data.ok) {
    return res.data.channel.id
  }
  else {
    return ""
  }
}

async function getUserId(email) {
  let config = {
    method: 'get',
    url: `https://slack.com/api/users.lookupByEmail?email=${email}`,
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${AUTH_SLACK}`
    }
  }
  
  let res = await axios.request(config).catch(err => {console.log(err.data)})
  
  if(res.data.ok) {
    return res.data.user.id
  }
  return ""
}

async function getIdList(tabEmail) {
  let idList = ""
  for (i in tabEmail) {
    if(idList != "") {
      idList += ","
    }
    idList += await getUserId(tabEmail[i])
  }
  
  return idList
}

async function addUsers(channelId, userList) {
  let config = {
    method: 'post',
    url: `https://slack.com/api/conversations.invite`,
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${AUTH_SLACK}`
    },
    data: {
      channel: channelId,
      users: userList
    }
  }
  
  await axios.request(config)
}

listId = ['alban@agence-copernic.fr', 'leo@agence-copernic.fr']
