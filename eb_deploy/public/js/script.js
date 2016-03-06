/**
 * Create the module. Set it up to use html5 mode.
 */
var TwittMap = angular.module('twittMap', ['elasticsearch'],
    ['$locationProvider', function($locationProvider){
        $locationProvider.html5Mode(true);
    }]
);
// var app = TwittMap;
// TwittMap.directive('helloWorld', function() {
//   return {
//     restrict: 'AE',
//     replace: 'true',
//     template: '<h3>Hello World!!</h3>'
//     // restrict: 'AE',
//     // replace: true,
//     // template: '<p> console.log("hello"); L.marker([{{tweet.longitude}},{{tweet.latitude}}]).addTo(map);</p>'
//   };
// });


// TwittMap.directive('helloWorld', function() {
//   return {
//       restrict: 'AE',
//       replace: 'true',
//       template: '<h3>Hello World!!</h3>'
//   };
// });


/**
 * Create a service to power calls to Elasticsearch. We only need to
 * use the _search endpoint.
 */
TwittMap.factory('tweetService',
    ['$q', 'esFactory', '$location', function($q, elasticsearch, $location){
        var client = elasticsearch({
            host: ":80"
        });

        /**
         * Given a term and an offset, load another round of 10 recipes.
         *
         * Returns a promise.
         */
        var search = function(term, offset){
            var deferred = $q.defer();
            var query = {
                "match": {
                    "_all": term
                }
            };

            client.search({
                "index": 'tweets',
                "type": 'status',
                "body": {
                    "size": 10,
                    "from": (offset || 0) * 10,
                    "query": query
                }
            }).then(function(result) {
                var ii = 0, hits_in, hits_out = [];
                hits_in = (result.hits || {}).hits || [];
                for(;ii < hits_in.length; ii++){
                    hits_out.push(hits_in[ii]._source);
                }
                deferred.resolve(hits_out);
            }, deferred.reject);

            return deferred.promise;
        };


        return {
            "search": search
        };
    }]
);

/**
 * Create a controller to interact with the UI.
 */
TwittMap.controller('twittCtrl',
    ['tweetService', '$scope', '$location', function(tweets, $scope, $location){
        // Provide some nice initial choices
        var initChoices = [
            "rendang",
            "nasi goreng",
            "pad thai",
            "pizza",
            "lasagne",
            "ice cream",
            "schnitzel",
            "hummous"
        ];
        var idx = Math.floor(Math.random() * initChoices.length);

        // Initialize the scope defaults.
        $scope.tweets = [];        // An array of recipe results to display
        $scope.page = 0;            // A counter to keep track of our current page
        $scope.allResults = false;  // Whether or not all results have been found.

        // And, a random search term to start if none was present on page load.
        $scope.searchTerm = $location.search().q || initChoices[idx];

        /**
         * A fresh search. Reset the scope variables to their defaults, set
         * the q query parameter, and load more results.
         */
        $scope.search = function(){
            $scope.page = 0;
            $scope.tweets = [];
            $scope.allResults = false;
            $location.search({'q': $scope.searchTerm});
            $scope.loadMore();
        };

        /**
         * Load the next page of results, incrementing the page counter.
         * When query is finished, push results onto $scope.recipes and decide
         * whether all results have been returned (i.e. were 10 results returned?)
         */
        $scope.loadMore = function(){
            tweets.search($scope.searchTerm, $scope.page++).then(function(results){
                if(results.length !== 10){
                    $scope.allResults = true;
                }

                var ii = 0;
                for(;ii < results.length; ii++){
                    $scope.tweets.push(results[ii]);
                }
            });
        };

        // Load results on first run
        $scope.loadMore();
    }]
);
// L.marker([51.5, -0.09]).addTo(map)


