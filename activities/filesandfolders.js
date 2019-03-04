'use strict';

const cfActivity = require('@adenin/cf-activity');
const api = require('./common/api');

module.exports = async function (activity) {

  try {
    api.initialize(activity);

    let requestOptions={
      body: { "path": "" }
    };
    const response = await api('/files/list_folder', requestOptions);

    if (!cfActivity.isResponseOk(activity, response)) {
      return;
    }

    // convert response to items[]
    activity.Response.Data = convertResponse(response);
  } catch (error) {

    cfActivity.handleError(activity, error);
  }
};

//**maps response data*/
function convertResponse (response) {
  let items = [];
  let entries = response.body.entries;

  // iterate through each issue and extract id, title, etc. into a new array

  for (let i = 0; i < entries.length; i++) {
    let raw = entries[i];
    let item = { id: raw.id, title: raw.name, description: raw.path_display, link: 'https://www.dropbox.com/home/' + raw.name, raw: raw }
    items.push(item);
  }

  return { items: items };
}