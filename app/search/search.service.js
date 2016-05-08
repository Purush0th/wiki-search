(function () {
    angular
        .module('app.search')
        .factory('wikiService', wikiService);

    /* @ngInject */
    wikiService.$inject = ['$http'];

    function wikiService($http) {
        return {
            search: function (term) {
                var api = 'https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=';
                var cb = '&callback=JSON_CALLBACK';
                //var page = 'https://en.wikipedia.org/?curid=';

                return $http.jsonp(api + term + cb)
                    .success(function (data) {
                        return data;
                    }).error(function (error) {
                        return error;
                    });
            }
        }
    }
})();