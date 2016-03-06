

    var app = angular.module("demoapp", ["leaflet-directive","elasticsearch"],
        ['$locationProvider', function($locationProvider){
    $locationProvider.html5Mode(true);
        }]
        );

app.factory('tweetService',
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
                    "size": 100,
                    "from": (offset || 0) * 100,
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

 
app.controller('MarkersAddRemoveController', 
    ['tweetService', '$scope', '$location', "$http", 
    function(tweets, $scope, $location, $http) {
angular.extend($scope, {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 2
                },  
                layers: {
                    baselayers: {
                        osm: {
                            name: 'OpenStreetMap',
                            type: 'xyz',
                            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                        }
                    },
                    overlays: {
                        realworld: {
                            name: "Real world data",
                            type: "markercluster",
                            visible: true
                        }
                    }
                }
            });

                var initChoices = [
            "m",
            "money",
            "hello",
            "pizza",
            "ok",
            "lol",
            "snow",
            "now"
        ];
        var idx = Math.floor(Math.random() * initChoices.length);

        // Initialize the scope defaults.
        $scope.tweets = [];   
        $scope.searchTerm = $location.search().q || initChoices[idx];
        $scope.search = function(){
            $scope.page = 0;
            $scope.tweets = [];
            $scope.allResults = false;
            $location.search({'q': $scope.searchTerm});
            $scope.loadMore();
        };

        $scope.loadMore = function(){
            tweets.search($scope.searchTerm, $scope.page++).then(function(results){
                if(results.length !== 100){
                    $scope.allResults = true;
                }

                var ii = 0;
                for(;ii < results.length; ii++){
                    $scope.tweets.push(results[ii]);
                }
            mrk = {};
            for(i = 0; i< $scope.tweets.length; i++) {
                msg = "<dl><dt><b>Tweet: </b>" + $scope.tweets[i].status + "</dt><dt><b>Author: </b>" + $scope.tweets[i].author + "</dt><dt><b>Tweet ID: </b>" + $scope.tweets[i].tweetId + "</dt></dl>";
                mrk[i] = {
                            lat: $scope.tweets[i].latitude,
                            lng: $scope.tweets[i].longitude,
                            message: msg,
                            layer: 'realworld'
                        };
            }
            angular.extend($scope, {
                markers: mrk 
            });
            });
        };

        $scope.loadMore();
         

            
            $scope.addMarkers = function() {

            };
            $scope.removeMarkers = function() {
                $scope.markers = {};
            }
        } ]);
