'use strict';
const api = require('./common/api');

module.exports = async (activity) => {
  try {
    var pagination = $.pagination(activity);
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

    api.initialize(activity);
    const response = await api(`/files/search`, requestOptions);

    if ($.isErrorResponse(activity, response)) return;

    activity.Response.Data = convertResponse(response);
  } catch (error) {
    $.handleError(activity, error);
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