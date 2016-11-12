(function () {

  angular.module('app',[])
    .run(kickOff);

  function kickOff() {
    console.log('App running ...');
  }
})();
