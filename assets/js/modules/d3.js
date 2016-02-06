angular.module('d3', []).factory('d3Factory', [
  '$document',
  '$rootScope',
  '$window',
  '$q',
  function ($document, $rootScope, $window, $q) {
    // Callback (err, success)

    // Promise - обещание - конструкция, в которой хранится результат,
    // который станет доступен к какому-то моменту в будущем

    // defer - отложить [на будущее]
    var scriptTag = $document[0].createElement('script');
    scriptTag.async = true;
    scriptTag.type = 'text/javascript';
    scriptTag.src = '../../vendor/d3/d3.js';
    var b = $document[0].body;
    b.appendChild(scriptTag);

    // resolve - разрешить обещание
    // reject - отклонить
    return $q(function(resolve, reject) {
      scriptTag.onload = function(){
        $rootScope.$apply();
        if ($window.d3)
          resolve($window.d3);
        else
          reject($window.d3);
      };
    });
  }
]);
