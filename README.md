# sheets-to-json
Simple tool for creating clean, clear, standalone JSON from Google Sheets data.

Initial commit is for use with AWS Lambda. Request module must be installed: https://www.npmjs.com/package/request.

In Lambda, the script accepts an event object with the following parameters:
{
  "bucketName": "",
  "filePath": "",
  "spreadsheetKey": ""
}

AWS Lambda must be given a role that allows it to access the bucket you're writing to.
You can access the resulting JSON file here: https://s3.[your-region-name].amazonaws.com/[bucketName]/filePath.
