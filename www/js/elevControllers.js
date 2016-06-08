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

            $scope.materie = Materii.getSelectedMaterie($stateParams.idMaterie, $scope.materii);
            $scope.note = $scope.materie.note;
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
        title: 'Medie generala semestrul 1',
        titleFontColor: "#886aea",
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
        levelColors: [
          "#e60000",
          "#33cd5f"
        ]
    });

    var semestrul2Gauge = new JustGage({
        id: 'semestrul2',
        title: 'Medie generala semestrul 2',
        titleFontColor: "#886aea",
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
        levelColors: [
          "#e60000",
          "#33cd5f"
        ]
    });

    var generalGauge = new JustGage({
        id: 'general',
        title: 'Medie generala finala',
        titleFontColor: "#886aea",
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
        levelColors: [
          "#e60000",
          "#33cd5f"
        ]
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
                semestrul2Gauge.refresh($scope.medieGeneralaSemestrul2);
                generalGauge.refresh($scope.medieGenerala);
            });
        });



    });
})

.controller('materiiMedieController', function ($scope, Materii) {
    Materii.getMateriiElevSemestrul1().then(function (materiiArray) {
        $scope.materii = materiiArray;
    });

    Materii.getMateriiElevSemestrul2().then(function (materiiArray) {
        $scope.materiiSemestrul2 = materiiArray;
    });

})

.controller('materieMedieController', function ($scope, $state, $stateParams, $ionicPopup, $ionicModal, Materii) {

    /*Modal logic*/
    $ionicModal.fromTemplateUrl('elev/modal-note-necesare.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function (noteNecesare) {
        $scope.noteNecesareModal = noteNecesare;
        $scope.modal.show();
    };
    $scope.closeModal = function () {
        $scope.modal.hide();
    };

    /*Functie pentru detectarea unui numar*/
    var isNumber = function (n) {
        return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
    };

    /*Popup pentru calculare medie dorita*/
    $scope.showMediePopup = function (materie) {
            $scope.medieDorita = {};

            var myPopup = $ionicPopup.show({
                template: '<input type="value" name="Medie dorita" min="1" max="5" ng-model="medieDorita.nota" placeholder="Nota">',
                title: 'Introduceti media dorita',
                subTitle: 'Numar de la 1 la 10',
                scope: $scope,
                buttons: [
                    {
                        text: 'Anuleaza'
                    },
                    {
                        text: '<b>Calculeaza</b>',
                        type: 'button-royal',
                        onTap: function (e) {
                            if (!$scope.medieDorita.nota) {
                                $ionicPopup.alert({
                                    title: 'Eroare',
                                    template: 'Medie dorita necompletta'
                                });
                                e.preventDefault();
                            } else {
                                console.log("Avem tipuul cand nu e null: ", typeof $scope.medieDorita.nota);
                                if (!isNumber($scope.medieDorita.nota)) {
                                    $ionicPopup.alert({
                                        title: 'Eroare',
                                        template: 'Nu ati introdus un numar corespunzator'
                                    });
                                    e.preventDefault();
                                } else {
                                    $scope.noteNecesare = Materii.calculeazaNotePentruMedie($scope.medieDorita.nota, materie);
                                    /* $ionicPopup.alert({
                                         title: 'Note necesare',
                                         template: $scope.noteNecesare
                                     });*/
                                    $scope.openModal($scope.noteNecesare);
                                }
                            }
                        }
                    }
            ]
            })
        }
        /*Gauges pentru semestre si medie generala*/
    var materieGauge = new JustGage({
        id: 'materieGauge',
        title: 'Medie materie curenta',
        titleFontColor: "#886aea",
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
        levelColors: [
          "#e60000",
          "#33cd5f"
        ]
    });

    /*Watcher pentru actualizari in timp real
    de la firebase*/
    var firebaseRef = Materii.getFirebaseRef();

    firebaseRef.$watch(function () {
        /*Verificam daca materia aleasa este semestrul 1 sau 2*/
        if ($stateParams.idMaterie.slice(-1) === '1')
            Materii.getMateriiElevSemestrul1().then(function (materiiArray) {
                $scope.materii = materiiArray;
                $scope.materie = Materii.getSelectedMaterie($stateParams.idMaterie, $scope.materii);
                $scope.medieMaterie = Materii.getMedieMaterie($scope.materie);
                $scope.nume = $scope.materie.numeMaterie
                materieGauge.refresh($scope.medieMaterie);
            });

        else
            Materii.getMateriiElevSemestrul2().then(function (materiiArray) {
                $scope.materii = materiiArray;
                $scope.materie = Materii.getSelectedMaterie($stateParams.idMaterie, $scope.materii);
                $scope.medieMaterie = Materii.getMedieMaterie($scope.materie);
                $scope.nume = $scope.materie.numeMaterie;
                materieGauge.refresh($scope.medieMaterie);

            });

    });
})

.controller('absenteCtrl', function ($scope, Materii) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    $scope.labels = ["Motivate", "Nemotivate"];
    var firebaseRef = Materii.getFirebaseRef();

    /*Punem listener pentru a vedea cand se schimba absentele
    in baza de date*/
    firebaseRef.$watch(function () {

        /*Semestrul 1*/
        Materii.getMateriiElevSemestrul1().then(function (materiiArray) {
            $scope.materiiSemestrul1 = materiiArray;

            $scope.absenteSemestrul1 = Materii.calculeazaNrAbsenteTotal($scope.materiiSemestrul1);
            return $scope.absenteSemestrul1;
        }).then(function (absenteSemestrul1) {
            Materii.getMateriiElevSemestrul2().then(function (materiiArray) {
                $scope.materiiSemestrul2 = materiiArray;

                $scope.absenteSemestrul2 = Materii.calculeazaNrAbsenteTotal($scope.materiiSemestrul2);
                $scope.absenteTotal = {};

                $scope.absenteTotal.total = absenteSemestrul1.total + $scope.absenteSemestrul2.total;

                $scope.absenteTotal.motivate = absenteSemestrul1.motivate + $scope.absenteSemestrul2.motivate;

                $scope.absenteTotal.nemotivate = absenteSemestrul1.nemotivate + $scope.absenteSemestrul2.nemotivate;

                $scope.absenteTotal.nemotivabile = absenteSemestrul1.nemotivabile + $scope.absenteSemestrul2.nemotivabile;


                /*Pie chart logic semestrul 1*/
                $scope.pieDataSemestrul1 = [absenteSemestrul1.motivate, absenteSemestrul1.nemotivate];

                /*Pie chart logic semestrul 2*/
                $scope.pieDataSemestrul2 = [$scope.absenteSemestrul2.motivate, $scope.absenteSemestrul2.nemotivate];

                /*Pie chart logic total*/
                $scope.pieDataTotal = [$scope.absenteTotal.motivate, $scope.absenteTotal.nemotivate];
            });
        });



    });

})

.controller('absenteMateriiCtrl', function ($scope, $ionicModal, Materii) {
    Materii.getMateriiElevSemestrul1().then(function (materiiArray) {
        $scope.materii = materiiArray;
    });

    Materii.getMateriiElevSemestrul2().then(function (materiiArray) {
        $scope.materiiSemestrul2 = materiiArray;
    });

    /*Modal logic*/
    $ionicModal.fromTemplateUrl('elev/absente-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function (materie) {
        //semestrul 1
        $scope.materie = materie;
        $scope.absenteMaterie = Materii.calculeazaNrAbsenteMaterie(materie);
        $scope.labels = ["Motivate", "Nemotivate"];

        /*Chart logic*/
        $scope.labels = ["Motivate", "Nemotivate"];
        $scope.pieDataMaterie = [$scope.absenteMaterie.motivate, $scope.absenteMaterie.nemotivate];

        $scope.modal.show();
    };
    $scope.closeModal = function () {
        $scope.modal.hide();
    };

});
