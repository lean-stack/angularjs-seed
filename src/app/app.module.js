(function () {

  angular.module('app',[])
    .run(kickOff);

  function kickOff($log) {
    $log.log('App running ...');
  }
})();
