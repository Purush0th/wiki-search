(function () {
    'use strict';

    angular
        .module('app')
        .config(config);

    config.$inject = ['$mdIconProvider'];
    /* @ngInject */
    function config($mdIconProvider) {

        $mdIconProvider
            .icon('menu', './assets/svg/menu.svg', 24)
            .icon('search', './assets/svg/search.svg', 24)
            .icon('random', './assets/svg/shuffle.svg', 24)
            .icon('logo', './assets/svg/logo.svg', 24)
            .icon('share', './assets/svg/share.svg', 24)
            .icon('copy', './assets/svg/copy.svg', 24)
            .icon('cancel', './assets/svg/cancel.svg', 24);
    }
})();