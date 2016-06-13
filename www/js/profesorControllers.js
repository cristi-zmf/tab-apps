angular.module('gradeBook.profesorControllers', ['firebase', 'chart.js'])

.controller('claseController', function($scope, Profi) {
    $scope.profesor = Profi.getProfesorObject();
    $scope.clase = Profi.getProfesorClase();

})


.controller('contProfesorCtrl', function($scope, Profi) {
    $scope.profesor = Profi.getProfesorObject();

})

.controller('clasaController', function($scope, $stateParams, Profi) {
    $scope.profesor = Profi.getProfesorObject();
    var clasaAleasaId = $stateParams.clasaId;
    Profi.getEleviClasa(clasaAleasaId).then(function (elevi) {
        console.log("astia  sunt elevii toti adunati: ", elevi);
        $scope.elevi = elevi;

    })
});
