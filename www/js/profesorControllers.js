angular.module('gradeBook.profesorControllers', ['firebase', 'chart.js'])

.controller('claseController', function ($scope, $ionicPopover, Profi) {
    $scope.profesor = Profi.getProfesorObject();
    $scope.clase = Profi.getProfesorClase();

    /*Popover pentru a selecta materia*/
    $ionicPopover.fromTemplateUrl('profesor/popover-materii.html', {
        scope: $scope
    }).then(function (popover) {
        $scope.popover = popover;
    });


    $scope.openPopover = function ($event, clasa) {
        $scope.materii = clasa.materii;
        $scope.clasa = clasa;
        $scope.popover.show($event);
    };
    $scope.closePopover = function () {
        $scope.popover.hide();
    };

})


.controller('contProfesorCtrl', function ($scope, Profi) {
    $scope.profesor = Profi.getProfesorObject();

})

/*Controller pentru elevii din clasa*/
.controller('clasaController', function ($scope, $stateParams, Profi) {
    $scope.profesor = Profi.getProfesorObject();
    var clasaAleasaId = $stateParams.numeClasa;
    $scope.materieAleasa = $stateParams.idMaterie;
    Profi.getEleviClasa(clasaAleasaId).then(function (elevi) {
        console.log("astia  sunt elevii toti adunati: ", elevi);
        $scope.elevi = elevi;

    });




});
