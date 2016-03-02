> var client = new elasticsearch.Client({host: '***REMOVED***',log:'trace'});

client.ping({
  // ping usually has a 3000ms timeout
  requestTimeout: Infinity,

  // undocumented params are appended to the query string
  hello: "elasticsearch!"
}, function (error) {
  if (error) {
    console.trace('elasticsearch cluster is down!');
  } else {
    console.log('All is well');
  }
});


client.search({
  index: 'tweets',
  type: 'status',
  body: {
	  query: {
	      match: {
	          status: 'money'
	        }
	    }
	}
}).then(function (resp) {
    var hits = resp.hits.hits;
}, function (err) {
    console.trace(err.message);
});