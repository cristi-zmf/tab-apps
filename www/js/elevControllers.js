/*Modul care ofera functionalitatea pentru taburile din elev*/
angular.module('gradeBook.elevControllers', ['firebase', 'chart.js'])

.controller('materiiController', function ($scope, $firebaseArray, $firebaseObject, $location, $state, Materii, DatabaseTables, CurrentUser) {
    /*Luam materiile */
    var curUser = firebase.auth().currentUser.uid;
    var ref = new Firebase(DatabaseTables.getDatabaseName() + DatabaseTables.getSemestrul1() + curUser);

    Materii.getMateriiElevSemestrul1().then(function (materiiArray) {
        $scope.materii = materiiArray;
    });
    /*$scope.materii = Materii.getMateriiElev();*/

    Materii.getMateriiElevSemestrul2().then(function (materiiArray) {
        $scope.materiiSemestrul2 = materiiArray;
    });

    $scope.goToMaterie = function () {
        $state.go('tab.materie');
    };

})

.controller('materieController', function ($scope, $state, $stateParams, $ionicModal, Materii) {
    /*Verificam daca materia aleasa este semestrul 1 sau 2*/
    if ($stateParams.idMaterie.slice(-1) === '1')
        Materii.getMateriiElevSemestrul1().then(function (materiiArray) {
            $scope.materii = materiiArray;
            /* console.log("Acestea sunt materiile: ", $scope.materii);
             console.log("pe asta o selectam: ", $stateParams.materieNume);*/

            $scope.materie = Materii.getSelectedMaterie($stateParams.idMaterie, $scope.materii);
            /* console.log("Aceasta este materia: ", $scope.materie);*/
            $scope.note = $scope.materie.note;
            /*console.log = ("acestea sunt notele: ", $scope.note);*/
            $scope.nume = $scope.materie.numeMaterie;
            console.log("asta e numele materiei: ", $scope.materie.numeMaterie);
            $scope.note.justGrades = Materii.getGrades($scope.materie.note);
            $scope.pieData = Materii.countOccurence($scope.materie);
            $scope.labels = $scope.pieData.note;
            $scope.data = $scope.pieData.aparitii;
            if ($scope.data.length == 0) {
                $scope.data.push(100);
                $scope.labels.push("Fara note");
            }
        });

    else
        Materii.getMateriiElevSemestrul2().then(function (materiiArray) {
            $scope.materii = materiiArray;
            /* console.log("Acestea sunt materiile: ", $scope.materii);
             console.log("pe asta o selectam: ", $stateParams.materieNume);*/

            $scope.materie = Materii.getSelectedMaterie($stateParams.idMaterie, $scope.materii);
            /* console.log("Aceasta este materia: ", $scope.materie);*/
            $scope.note = $scope.materie.note;
            /*console.log = ("acestea sunt notele: ", $scope.note);*/
            $scope.nume = $scope.materie.numeMaterie;
            console.log("asta e numele materiei: ", $scope.materie.numeMaterie);
            $scope.note.justGrades = Materii.getGrades($scope.materie.note);
            $scope.pieData = Materii.countOccurence($scope.materie);
            $scope.labels = $scope.pieData.note;
            $scope.data = $scope.pieData.aparitii;
            if ($scope.data.length == 0) {
                $scope.data.push(100);
                $scope.labels.push("Fara note");
            }
        });




    /*Constante pentru fereastra modal*/
    $scope.PROVENIENTA = "Provenienta";
    $scope.OBSERVATII = "Observatii";
    $scope.RECOMANDARI = "Recomandari";
    $scope.DATA = "Data notei";
    $scope.TEZA = "Nota Teza";
    $scope.DATA_NOTA = "Data Nota";

    /*Constante pentru a obtine nota, si detaliile acesteia*/
    $scope.GRADE_POSITION = 0;
    $scope.DETAILS_POSITION = 1;

    /*Functie care returneaza un vector cu detaliile fiecarei note*/

    /*Pie chart logic and some grade details for $scope*/



    /*Firebase logic*/

    /*Modal logic*/
    $ionicModal.fromTemplateUrl('elev/nota-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function (nota) {
        $scope.nota = nota;
        $scope.modal.show();
    };
    $scope.closeModal = function () {
        $scope.modal.hide();
    };


});
