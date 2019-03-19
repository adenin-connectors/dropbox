'use strict';
const api = require('./common/api');
const logger = require('@adenin/cf-logger');
const cfActivity = require('@adenin/cf-activity');

module.exports = async (activity) => {
  try {
    api.initialize(activity);

    var pagination = cfActivity.pagination(activity);
    let pageSize = parseInt(pagination.pageSize);
    let offset = (parseInt(pagination.page) - 1) * pageSize;

    let requestOptions = {
      body: {
        "path": "",
        "start": offset,
        "max_results": pageSize,
        "query": activity.Request.Query.query || ""
      }
    };

    const response = await api(`/files/search`, requestOptions);

    if (!cfActivity.isResponseOk(activity, response)) {
      return;
    }
    activity.Response.Data = convertResponse(response);
  } catch (error) {
    cfActivity.handleError(error, activity);
  }
};

//**maps response data*/
function convertResponse(response) {
  let items = [];
  let results = response.body.matches;

  for (let i = 0; i < results.length; i++) {
    let raw = results[i].metadata;
    let item = {
      id: raw.id.split(":")[1],
      title: raw.name,
      description: raw.path_display,
      link: 'https://www.dropbox.com/home' + raw.path_display,
      raw: raw
    };
    items.push(item);
  }

  return { items: items };
}