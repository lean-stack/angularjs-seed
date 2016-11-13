(function () {

  angular.module('app')
    .config(configure);

  function configure($log) {
    $log.log('Configuring the app ...');
  }

})();
