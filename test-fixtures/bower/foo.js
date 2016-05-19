(function(self, undefined) {
  'use strict';

  self.foo = function() { console.log('foo') };

}(window.foo = {}));
