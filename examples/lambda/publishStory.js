const axios = require('axios');

const publishStory = async (json, drupalPublishStoryUrl, options) => {
  const res = await axios.post(drupalPublishStoryUrl, json, options);
  return res;
};

module.exports = publishStory;
