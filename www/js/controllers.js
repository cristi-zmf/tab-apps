angular.module('gradeBook.controllers', ['firebase'])


.controller('ChatDetailCtrl', function ($scope, $stateParams, absente) {
    $scope.chat = absente.get($stateParams.chatId);
})



.controller('contCtrl', function ($scope) {
    $scope.settings = {
        enableFriends: true
    }
});

