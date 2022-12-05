// This is a dummy handler function which is used for infra deployment.
// Actual source code can be found from https://github.com/SPHTech/st-cue-drupal-publish
exports.handler = async function (event, context) {
    console.log("EVENT: \n" + JSON.stringify(event, null, 2))
    return context.logStreamName
}
