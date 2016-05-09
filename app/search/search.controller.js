(function () {
    angular
        .module('app.search')
        .controller('SearchController', SearchController);

    /* @ngInject */
    SearchController.$inject = ['$log', 'wikiService', '$mdDialog', '$mdMedia', '$mdToast', '$mdSidenav', '$sce'];
    function SearchController(logger, wikiService, dialog, media, toast, sideNav, $sce) {

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
        var wikiRandom = "https://en.wikipedia.org/wiki/Special:Random";

        vm.navigateTo = navigateTo;
        vm.navTypes = navigations;
        vm.randomWikiUrl = $sce.trustAsResourceUrl(wikiRandom);
        vm.refreshIframe = refreshIframe;
        vm.selection = vm.navTypes[0];
        vm.searchWiki = search;
        vm.showArticle = showArticle;
        vm.toggleNav = toggleSideNav;
        vm.wikiResult = [];

        activate();

        function activate() {
            logger.log('activated');
        };

        function navigateTo(type) {
            vm.selection = type;
        };

        function refreshIframe() {
            vm.randomWikiUrl = $sce.trustAsResourceUrl(wikiRandom + '?v=' + Date.now());
        }

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

                if (!data.query) {
                    toast.show(toast.simple()
                        .textContent('No results found!')
                        .position('top right')
                        .hideDelay(3000));

                    return;
                }
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

        function toggleSideNav() {
            sideNav('nav-left').toggle();
        };
    }
})();