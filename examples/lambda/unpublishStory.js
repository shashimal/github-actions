const axios = require('axios');

const unpublishStory = async (json, drupalUnpublishStoryUrl, options) => {
  const cueId = json?.id?.split('/').pop();
  const jsonData = {
    cue_id: cueId,
  };
  const res = await axios.post(
    drupalUnpublishStoryUrl,
    JSON.stringify(jsonData),
    options
  );
  return res;
};

module.exports = unpublishStory;
