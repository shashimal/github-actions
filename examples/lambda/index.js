const axios = require('axios');
const unpublishStory = require('./unpublishStory.js');
const publishStory = require('./publishStory.js');
const {
  DRUPAL_API_URL,
  DRUPAL_API_KEY,
  WAITING_TIME_FOR_RECALL,
  DRUPAL_WAITING_TIME,
} = process.env;

exports.handler = async function (event, context) {
  console.log(event, 'event');

  const sleep = (waitTimeInMs) =>
    new Promise((resolve) => setTimeout(resolve, waitTimeInMs));
  try {
    const records = event.Records;
    for (let i = 0; i < records.length; i++) {
      const json = JSON.parse(records?.[i]?.body);
      // find publish or unpublish story
      const isUnPublishedStory = json?.state === 'unpublished';
      // find story Id
      const storyId = json?.data?.context?.id || json.id.split('/').pop();

      if (isUnPublishedStory) {
        console.log('Un published ::::: Story Id:', storyId);
      } else {
        console.log(
          'Cook GraphQL ::::: Story Id:',
          storyId,
          JSON.stringify(json)
        );
      }
      // find publication
      const publicationName =
        json?.data?.resolution?.publication?.name || json?.publication;
      let tryCount = 1;

      // send GraphQL to Drupal
      const sendGraphQLToDrupal = async () => {
        try {
          const options = {
            timeout: DRUPAL_WAITING_TIME,
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': DRUPAL_API_KEY,
            },
          };
          const updatedDrupalApiUrl = isUnPublishedStory
            ? DRUPAL_API_URL.replace('publish', 'unpublish')
            : DRUPAL_API_URL;
          const res = isUnPublishedStory
            ? await unpublishStory(json, updatedDrupalApiUrl, options)
            : await publishStory(json, updatedDrupalApiUrl, options);
          console.log('Drupal Response ::::: Story Id: ', storyId, res.data);

          if (i === records.length - 1) {
            context.done(null, '');
          } else {
            console.log(
              records.length - (i + 1),
              'More messages remaining to process'
            );
          }
        } catch (error) {
          if (tryCount > 3) {
            console.log('Processing Error', ' Story Id: ', storyId, error);
            if (i === records.length - 1) {
              context.done(null, '');
            } else {
              console.log(
                records.length - (i + 1),
                'More messages remaining to process'
              );
            }
          } else {
            console.log('Processing Count', ' Story Id: ', storyId, tryCount);
            console.log('drupal error', ' Story Id: ', storyId, error);
            tryCount++;
            await sleep(WAITING_TIME_FOR_RECALL);
            await sendGraphQLToDrupal();
          }
        }
      };
      await sendGraphQLToDrupal();
    }
  } catch (error) {
    console.log('Error occurred in for loop', error);
    context.done(null, '');
  }
  context.done(null, '');
};
