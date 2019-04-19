'use strict';
const api = require('./common/api');

module.exports = async (activity) => {
  try {
    const response = await api('/users/get_current_account');

    activity.Response.Data = {
      success: response && response.statusCode === 200
    };
  } catch (error) {
    $.handleError(activity, error);
    activity.Response.Data.success = false;
  }
};
