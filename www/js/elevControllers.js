/*Modul care ofera functionalitatea pentru taburile din elev*/
angular.module('gradeBook.elevControllers', ['firebase', 'chart.js'])

.controller('materiiController', function ($scope, $firebaseArray, $firebaseObject, $interpolate, $location, $state, Materii, DatabaseTables, CurrentUser) {
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

            /*Logica pentru pie chart*/
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

            $scope.$evalAsync(function () {
                    $scope.nume = $scope.materie.numeMaterie;
                })
                /*Logica pentru pie chart*/
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

    $scope.$evalAsync();

    /**/
    if (!$scope.$$phase) {
        $scope.$apply();
    }

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


})

.controller('mediiCtrl', function ($scope, $firebaseArray, Materii) {

    /*Gauges pentru semestre si medie generala*/
    var semestrul1Gauge = new JustGage({
        id: 'semestrul1',
        value: 0,
        min: 0,
        max: 10,
        decimals: 2,
        symbol: '',
        pointer: true,
        gaugeWidthScale: 0.6,
        startAnimationTime: 2000,
        startAnimationType: ">",
        refreshAnimationTime: 2000,
        refreshAnimationType: "bounce",

    });


    /*Calculam media generala pentru semestrul 1*/
    var firebaseRef = Materii.getFirebaseRef();

    /*Punem listener pentru a vedea cand se schimba o nota in baza de date*/
    firebaseRef.$watch(function () {

        /*Semestrul 1*/
        Materii.getMateriiElevSemestrul1().then(function (materiiArray) {
            $scope.materiiSemestrul1 = materiiArray;

            $scope.medieGeneralaSemestrul1 = Materii.getMedieGeneralaSemestru($scope.materiiSemestrul1);
            return $scope.medieGeneralaSemestrul1;
        }).then(function (medieGeneralaSemestrul1) {
            Materii.getMateriiElevSemestrul2().then(function (materiiArray) {
                $scope.materiiSemestrul2 = materiiArray;

                $scope.medieGeneralaSemestrul2 = Materii.getMedieGeneralaSemestru($scope.materiiSemestrul2);
                $scope.medieGenerala = (medieGeneralaSemestrul1 + $scope.medieGeneralaSemestrul2) / 2;

                /*Gauge logic*/
                /*Gauge semestrul 1*/

              semestrul1Gauge.refresh(medieGeneralaSemestrul1);

            });
        });



    });
});
