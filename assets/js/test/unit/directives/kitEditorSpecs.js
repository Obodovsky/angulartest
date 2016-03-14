describe('Editor specs', function () {
  var $compile, $rootScope, $q, $window;

  beforeEach(function () {
    // Полная форма: angular.mock.module('kitApp')
    module('kitApp');

    module(function ($provide) {
      $provide.factory('d3Factory', function () {
        return $q(function (resolve, reject) {
          resolve(($window.d3));
        });
      });
    });

    angular.mock.inject(function (_$compile_, _$rootScope_, _$q_, _$window_) {
      $compile   = _$compile_;
      $rootScope = _$rootScope_;
      $q         = _$q_;
      $window    = _$window_;
    });
  });

  var editor;

  it('should create a new editor instance', function () {
    editor = $compile('<div class="kit-editor" data-kit-editor></div>')($rootScope);

    $rootScope.$apply();

    // Проверим, что editor !== undefined
    expect(editor).toBeDefined();

    //console.log(editor.scope());
    expect(editor.scope().editor).toBeDefined();
    expect(editor.scope().editor.grid).toEqual({
      sizeXmm: 5,
      sizeYmm: 5
    });
  });

  // Translated to (398.7401418685913;-91.85040473937988) successfully
  it('should move the editor to a new position', function (done) {
    var x = 200;
    var y = 200;

    var promise = editor.scope().translateTo({x: x, y: y});
    var spyHandler = jasmine.createSpy('didTranslate');

    setTimeout(function() {
      promise.then(spyHandler);
      editor.scope().$root.$digest();

      expect(spyHandler).toHaveBeenCalledWith(
        'Translated to (' + x + ';' + y + ') successfully'
      );
      done();
    }, 900);
  });
});
