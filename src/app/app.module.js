(function () {

  angular.module('leanApp',[])
    .run(kickOff);

  function kickOff($log) {
    $log.log('App running ...');
  }
})();
