(function () {
    angular
        .module('app.search')
        .controller('SearchController', SearchController);

    /* @ngInject */
    SearchController.$inject = ['$log', 'wikiService', '$mdDialog', '$mdMedia'];
    function SearchController(logger, wikiService, dialog, media) {

        var vm = this;
        var navigations = [
            {
                type: 'search',
                title: 'Search'
            },
            {
                type: 'random',
                title: 'Random'
            }
        ];


        vm.navigateTo = navigateTo;
        vm.navTypes = navigations;
        vm.selection = vm.navTypes[0];
        vm.searchWiki = search;
        vm.wikiResult = [];
        vm.showArticle = showArticle;

        activate();

        function activate() {
            logger.log('activated');
        };

        function navigateTo(type) {
            vm.selection = type;
        };

        function search() {

            var searchTerm = vm.searchTerm;

            if (!searchTerm)
                return;

            vm.wikiResult = [];

            wikiService
                .search(searchTerm)
                .success(successResponse);

            function successResponse(data) {
                var page = 'https://en.wikipedia.org/?curid=';
                var results = [];

                angular.forEach(data.query.pages, function (item) {
                    results.push({
                        title: item.title,
                        desc: item.extract,
                        url: page + item.pageid,
                        thumbnail: item.thumbnail ? item.thumbnail.source : 'assets/svg/wiki-page.svg'
                    });
                });

                vm.wikiResult = results;

            };
        }

        function showArticle(item) {
            dialog.show({
                controller: DialogController,
                controllerAs: 'wikiDialog',
                templateUrl: 'app/search/search.article.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                fullscreen: true,
                locals: {
                    data: item
                },
                bindToController: true
            });


        };

        /* @ngInject */
        DialogController.$inject = ['$mdDialog', '$sce'];
        function DialogController(dialog, $sce) {
            var self = this;

            self.url = $sce.trustAsResourceUrl(self.data.url);
            self.title = self.data.title;

            self.close = function () {
                dialog.hide();
            }
        };
    }
})();