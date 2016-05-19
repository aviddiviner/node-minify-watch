(function(self, undefined) {
  'use strict';

  self.bar = function() { console.log('bar') };

}(window.bar = {}));
