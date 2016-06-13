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
.controller('clasaController', function ($scope, $stateParams, $ionicPopover, Profi) {
    $scope.profesor = Profi.getProfesorObject();
    var clasaAleasaId = $stateParams.numeClasa;
    $scope.numeClasa = clasaAleasaId;
    $scope.idMaterie = $stateParams.idMaterie;
    Profi.getEleviClasa(clasaAleasaId).then(function (elevi) {
        console.log("astia  sunt elevii toti adunati: ", elevi);
        $scope.elevi = elevi;

    });


    /*Popover pentru a selecta materia*/
    $ionicPopover.fromTemplateUrl('profesor/popover-detalii-elev.html', {
        scope: $scope
    }).then(function (popover) {
        $scope.popover = popover;
    });



    $scope.openPopover = function ($event, elev) {
        /* $scope.materii = clasa.materii;
         $scope.clasa = clasa;*/
        $scope.elev = elev;
        $scope.popover.show($event);
    };
    $scope.closePopover = function () {
        $scope.popover.hide();
    };

})

.controller('noteController', function ($scope, $stateParams, $ionicPopover, Profi, Materii) {
    $scope.elev = $stateParams.elev;
    $scope.idMaterie = $stateParams.idMaterie;
    var uid = elev.$id;

    Profi.getMaterieElev(uid, $scope.idMaterie).then(function (materieObject) {
        $scope.materie = materieObject.materie;
        $scope.indexMaterie = materieObject.indexMaterie;
        $scope.note = $scope.materie.note;
        $scope.nume = $scope.materie.numeMaterie;
        $scope.note.justGrades = Materii.getGrades($scope.materie.note);
        $scope.pieData = Materii.countOccurence($scope.materie);
        $scope.labels = $scope.pieData.note;
        $scope.data = $scope.pieData.aparitii;
        if ($scope.data.length == 0) {
            $scope.data.push(100);
            $scope.labels.push("Fara note");
        }
    })

});
