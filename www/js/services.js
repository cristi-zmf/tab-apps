angular.module('gradeBook.services', [])

.factory('absente', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
var absente = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return absente;
    },
    remove: function(chat) {
      absente.splice(absente.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < absente.length; i++) {
        if (absente[i].id === parseInt(chatId)) {
          return absente[i];
        }
      }
      return null;
    }
  };
});
