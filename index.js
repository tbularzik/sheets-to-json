//This pulls Google Sheet data and converts it to a readable JSON format
//Then saves it to an AWS bucket.

var request = require('request');

//AWS
var AWS = require('aws-sdk');

exports.handler = (event, context, callback) => {
//end AWS
  function convertFeed(inputRecords) {

    var outputRecords = []; //Empty array of new objects
    for (var i = 0; i < inputRecords.length; i++){ // Go though every record in input
      var outputRecord = {}; //each output record starts out blank
      var inputRecord = inputRecords[i]; // each input record is specified
      Object.keys(inputRecord).forEach(function(recordKey){ //for each key in the input object
          if (recordKey.startsWith('gsx$')){ // if it starts with gsx$
            outputRecord[recordKey.replace('gsx$','')] = inputRecord[recordKey].$t; //save the input record value's $t property in the output record under the correct key
          }
      });
      outputRecords.push(outputRecord); //push each record to the outputRecords array
    }
    var JSONdoc = JSON.stringify(outputRecords); //Convert JS object to JSON document
    console.log("converted");

    //AWS
    var s3 = new AWS.S3();

    var params = {
      Bucket: event.bucketName,
      Key: event.filePath,
      Body: JSONdoc,
      ACL: 'public-read',
      ContentType: 'application/json'};

    s3.putObject(params, function (err, data) {
      if (err)
        console.log(err)
      else
        console.log("Successfully saved object to " + event.bucketName + "/" + event.filePath);
    });
    //end AWS
  }

var url = "https://spreadsheets.google.com/feeds/list/" + event.spreadsheetKey + "/od6/public/values?alt=json";

//Program execution begins here
request(url, function(err, res, body) {
  if (res.statusCode == 200){
    console.log("received");
    var data = JSON.parse(body);
    var records = data.feed.entry;
  }
  //If status code is not 200, abort script
  else {
    throw new Error("Status code indicates error. Execution terminated.");
  }

  convertFeed(records);
});

} //AWS this line
