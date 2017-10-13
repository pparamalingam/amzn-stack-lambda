// Main logic to senf to stackexchange and then Lex
exports.handler = function(event, context, callback) {

  var stackexchange = require('stackexchange');
  var languages = require('./languages.json');

  var options = { version: 2.2 };
  var context = new stackexchange(options);

  var tag = [];
  length = languages.length;
  while(length--) {
     if (event['inputTranscript'].toLowerCase().indexOf(languages[length])!=-1) {
         // one of the langs is in event['inputTranscript']
         tag.push(languages[length])
     }
  }  

  console.log(tag)
  if (tag !== 'undefined' && tag.length > 0){
    var filter = {
      key: process.env['STACKEXCHANGE_KEY'],
      pagesize: 1,
      tagged: tag,
      sort: 'relevance',
      order: 'asc',
      title: event['inputTranscript']
    };
  }
  else{
    var filter = {
      key: process.env['STACKEXCHANGE_KEY'],
      pagesize: 1,
      sort: 'relevance',
      order: 'asc',
      title: event['inputTranscript']
    };
  }

  console.log(filter)

  // Get all the questions (http://api.stackexchange.com/docs/questions)
  context.search.similar(filter, function(err, results){
    if (err){
      console.log(err);
      throw err;
    }
    
    console.log(results.items);
    console.log(results.has_more);

    var link = results.items[0]["link"]
    var title = results.items[0]["title"]
    var response ={
      "dialogAction": {
        "type": "Close",
        "fulfillmentState": "Fulfilled",
        "message": {
          "contentType": "PlainText",
          "content": title + "\n" + link
        }    
      }
    }

    console.log(response)
    callback(null,response)
    
  });

};
