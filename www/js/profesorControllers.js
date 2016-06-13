angular.module('gradeBook.profesorControllers', ['firebase', 'chart.js'])

.controller('claseController', function($scope, Profi) {
    $scope.profesor = Profi.getProfesorObject();
    $scope.clase = profesor.clase;

})


.controller('contProfesorCtrl', function($scope, Profi) {
    $scope.profesor = Profi.getProfesorObject();

});
