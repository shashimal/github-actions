data "archive_file" "cue_drupal_lambda" {
  type        = "zip"
  source_file = "${path.module}/../../../common/lambda/cue/cue-drupal.js"
  output_path = "${path.module}/../../../common/lambda/cue/cue-drupal.zip"
}