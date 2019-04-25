'use strict';
const api = require('./common/api');

module.exports = async function (activity) {
  try {
    let pagination = $.pagination(activity);

    let requestOptions = null;
    let continueUrl = '';
    if (pagination.nextpage) {
      continueUrl = '/continue';
      requestOptions = {
        body: {
          "cursor": pagination.nextpage
        }
      };
    } else {
      requestOptions = {
        body: {
          "path": "",
          "limit": pagination.pageSize
        }
      };
    }
    api.initialize(activity);
    const response = await api(`/files/list_folder${continueUrl}`, requestOptions);
    if ($.isErrorResponse(activity, response)) return;

    activity.Response.Data = convertResponse(response);

    if (response.body.has_more == true) {
      activity.Response.Data._nextpage = response.body.cursor;
    }
  } catch (error) {
    $.handleError(activity, error);
  }
};

//**maps response data*/
function convertResponse(response) {
  let items = [];
  let entries = response.body.entries;

  for (let i = 0; i < entries.length; i++) {
    let raw = entries[i];
    let item = {
      id: raw.id,
      title: raw.name,
      description: raw.path_display,
      link: 'https://www.dropbox.com/home' + raw.path_display,
      raw: raw
    }
    items.push(item);
  }

  return { items: items };
}