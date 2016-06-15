angular.module('gradeBook.parinteControllers', ['firebase', 'chart.js'])

.controller('contController', function ($scope, Parinti, DatabaseTables) {
    $scope.parinte = Parinti.getParinteObject();
})

/*Controller pentru lista de elevi
pe care ii poate vedea parintele*/
.controller('eleviController', function ($scope, Parinti, Materii, DatabaseTables) {
    var uidParinte = DatabaseTables.getCurrentUid();
    var ref = Materii.getFirebaseRef();
    ref.$watch(function () {
        $scope.elevi = Parinti.getEleviVizibili(uidParinte);
    });
})


.controller('materiiParinteController', function ($scope, $stateParams, $ionicPopover, Materii, DatabaseTables, CurrentUser) {
    /*Luam materiile */
    var elev = $stateParams.elev;
    var uid = elev.uid;
    /*Ca sa putem sa-l transmitem mai departe*/
    $scope.elev = $stateParams.elev;

    Materii.getMateriiElevSemestrul1ByUid(uid).then(function (materiiArray) {
        $scope.materii = materiiArray;
    });
    /*$scope.materii = Materii.getMateriiElev();*/

    Materii.getMateriiElevSemestrul2ByUid(uid).then(function (materiiArray) {
        $scope.materiiSemestrul2 = materiiArray;
    });

    /*Popover pentru a selecta materia*/
    $ionicPopover.fromTemplateUrl('parinte/popover-detalii-elev.html', {
        scope: $scope
    }).then(function (popover) {
        $scope.popover = popover;
    });



    $scope.openPopover = function ($event, elev, materie) {
        /* $scope.materii = clasa.materii;
         $scope.clasa = clasa;*/
        $scope.materie = materie;
        $scope.elev = elev;
        console.log("asta este uid-ul elevului: ", uid);
        $scope.popover.show($event);
    };
    $scope.closePopover = function () {
        $scope.popover.hide();
    };
})

.controller('materieParinteController', function ($scope, $state, $stateParams, $ionicModal, Materii, DatabaseTables) {
    /*Verificam daca materia aleasa este semestrul 1 sau 2*/
    console.log("asta este elevul: ", $stateParams.elev);
    $scope.elev = $stateParams.elev;
    var firebaseRef = Materii.getFirebaseRef();
    firebaseRef.$watch(function () {
        if ($stateParams.materie.idMaterie.slice(-1) === '1')
            Materii.getMateriiElevSemestrul1ByUid($scope.elev.uid).then(function (materiiArray) {
                $scope.materii = materiiArray;

                $scope.materie = Materii.getSelectedMaterie($stateParams.materie.idMaterie, $scope.materii);
                $scope.note = $scope.materie.note;
                $scope.nume = $scope.materie.numeMaterie;
                console.log("asta e numele materiei: ", $scope.materie.numeMaterie);

                if (!$scope.note) {
                    $scope.note = {};
                }
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
            Materii.getMateriiElevSemestrul2ByUid($scope.elev.uid).then(function (materiiArray) {
                $scope.materii = materiiArray;
                /* console.log("Acestea sunt materiile: ", $scope.materii);
                 console.log("pe asta o selectam: ", $stateParams.materieNume);*/

                $scope.materie = Materii.getSelectedMaterie($stateParams.materie.idMaterie, $scope.materii);
                /* console.log("Aceasta este materia: ", $scope.materie);*/
                $scope.note = $scope.materie.note;
                /*console.log = ("acestea sunt notele: ", $scope.note);*/

                /*Logica pentru pie chart*/
                console.log("asta e numele materiei: ", $scope.materie.numeMaterie);

                if (!$scope.note) {
                    $scope.note = {};
                }
                $scope.note.justGrades = Materii.getGrades($scope.materie.note);
                $scope.pieData = Materii.countOccurence($scope.materie);
                $scope.labels = $scope.pieData.note;
                $scope.data = $scope.pieData.aparitii;
                if ($scope.data.length == 0) {
                    $scope.data.push(100);
                    $scope.labels.push("Fara note");
                }
            });
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

.controller('medieParinteController', function ($scope, $stateParams, Profi, Materii) {

    $scope.materie = $stateParams.materie;
    $scope.medie = Materii.getMedieMaterie($scope.materie);
    var materieGauge = new JustGage({
        id: 'medieGauge',
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
    materieGauge.refresh($scope.medie);

})

.controller('absenteParinteController', function ($scope, $stateParams, Profi, Materii) {
    $scope.materie = $stateParams.materie;
    $scope.absenteMaterie = Materii.calculeazaNrAbsenteMaterie($scope.materie);
    $scope.labels = ["Motivate", "Nemotivate"];

    /*Chart logic*/
    if (!$scope.materie.absente) {
        $scope.pieDataMaterie = [100];
        $scope.labels = ["Fara absente"];
    } else {
        $scope.labels = ["Motivate", "Nemotivate"];
        $scope.pieDataMaterie = [$scope.absenteMaterie.motivate, $scope.absenteMaterie.nemotivate];
    }
})

.controller('mediiParinteCtrl', function ($scope, $stateParams, Materii) {
    var uid = $stateParams.elev.uid;
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
        Materii.getMateriiElevSemestrul1ByUid(uid).then(function (materiiArray) {
            $scope.materiiSemestrul1 = materiiArray;

            $scope.medieGeneralaSemestrul1 = Materii.getMedieGeneralaSemestru($scope.materiiSemestrul1);
            return $scope.medieGeneralaSemestrul1;
        }).then(function (medieGeneralaSemestrul1) {
            Materii.getMateriiElevSemestrul2ByUid(uid).then(function (materiiArray) {
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

.controller('bilantAbsenteController', function ($scope, $stateParams, Materii) {
    var uid = $stateParams.elev.uid;
    $scope.labels = ["Motivate", "Nemotivate"];
    var firebaseRef = Materii.getFirebaseRef();

    /*Punem listener pentru a vedea cand se schimba absentele
    in baza de date*/
    firebaseRef.$watch(function () {

        /*Semestrul 1*/
        Materii.getMateriiElevSemestrul1ByUid(uid).then(function (materiiArray) {
            $scope.materiiSemestrul1 = materiiArray;

            $scope.absenteSemestrul1 = Materii.calculeazaNrAbsenteTotal($scope.materiiSemestrul1);
            return $scope.absenteSemestrul1;
        }).then(function (absenteSemestrul1) {
            Materii.getMateriiElevSemestrul2ByUid(uid).then(function (materiiArray) {
                $scope.materiiSemestrul2 = materiiArray;

                $scope.absenteSemestrul2 = Materii.calculeazaNrAbsenteTotal($scope.materiiSemestrul2);
                $scope.absenteTotal = {};

                $scope.absenteTotal.total = absenteSemestrul1.total + $scope.absenteSemestrul2.total;

                $scope.absenteTotal.motivate = absenteSemestrul1.motivate + $scope.absenteSemestrul2.motivate;

                $scope.absenteTotal.nemotivate = absenteSemestrul1.nemotivate + $scope.absenteSemestrul2.nemotivate;

                $scope.absenteTotal.nemotivabile = absenteSemestrul1.nemotivabile + $scope.absenteSemestrul2.nemotivabile;


                /*Pie chart logic semestrul 1*/
                if ((absenteSemestrul1.motivate + absenteSemestrul1.nemotivate) === 0) {
                    $scope.pieDataSemestrul1 = [100];
                    $scope.labels = ["Fara absente"];

                } else {
                    $scope.pieDataSemestrul1 = [absenteSemestrul1.motivate, absenteSemestrul1.nemotivate];
                }

                /*Pie chart logic semestrul 2*/
                if (($scope.absenteSemestrul2.motivate + $scope.absenteSemestrul2.nemotivate) === 0) {
                    $scope.pieDataSemestrul2 = [100];
                    $scope.labels = ["Fara absente"];
                } else {
                    $scope.pieDataSemestrul2 = [$scope.absenteSemestrul2.motivate, $scope.absenteSemestrul2.nemotivate];
                }

                /*Pie chart logic total*/
                if (($scope.absenteTotal.motivate + $scope.absenteTotal.nemotivate) === 0) {
                    $scope.pieDataTotal = [100];
                    $scope.labels = ["Fara absente"];
                } else {
                    $scope.pieDataTotal = [$scope.absenteTotal.motivate, $scope.absenteTotal.nemotivate];
                }
            });
        });



    });

});
