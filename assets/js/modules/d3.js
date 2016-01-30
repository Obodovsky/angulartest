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
    var d = $q.defer();

    var scriptTag = $document[0].createElement('script');
    scriptTag.async = true;
    scriptTag.type = 'text/javascript';
    scriptTag.src = '../../vendor/d3/d3.js';

    // resolve - разрешить обещание
    // reject - отклонить
    scriptTag.onload = function(){
      $rootScope.$apply(function(){d.resolve($window.d3);})
    };

    var b = $document[0].body;

    b.appendChild(scriptTag);

    return {
      d3: function(){
        return d.promise;
      }
    }

  }
]);
