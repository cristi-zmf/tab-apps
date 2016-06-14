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

.controller('noteController', function ($scope, $stateParams, $ionicPopover, $ionicModal, $ionicListDelegate, $filter, DatabaseTables, Profi, Materii) {
    $scope.TEZA = "Nota Teza";
    $scope.descriere = "Adaugare nota ";
    $scope.elev = $stateParams.elev;
    $scope.idMaterie = $stateParams.idMaterie;
    $scope.uid = elev.$id;
    var uid = elev.$id;

    var firebaseRef = Materii.getFirebaseRef()
    firebaseRef.$watch(function () {
        Profi.getMaterieElev(uid, $scope.idMaterie).then(function (materieObject) {
            $scope.materie = materieObject.materie;
            $scope.indexMaterie = materieObject.indexMaterie;
            $scope.materie.indexMaterie = $scope.indexMaterie;
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
        });
    });

    $ionicModal.fromTemplateUrl('profesor/nota-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function (esteTeza) {
        $scope.esteTeza = esteTeza;
        $scope.nota = {};
        $scope.nota.nota = null;
        $scope.nota.data = new Date();
        $scope.nota.provenienta = "";
        $scope.nota.observatii = "";
        $scope.nota.recomandari = "";
        $scope.modal.show();
    };
    $scope.closeModal = function () {
        $scope.modal.hide();
    };

    $scope.adaugaNota = function (nota, materie, uid, esteTeza, indexMaterie) {
        $scope.nota.nota = parseInt($scope.nota.nota);
        if (Profi.adaugaNota(nota, materie, uid, esteTeza, indexMaterie) != -1)
            $scope.modal.hide();
    };

    $scope.stergeNota = function (nota, materie, uid, esteTeza, indexNota) {
        Profi.stergeNota(nota, materie, uid, esteTeza, indexNota);
        $ionicListDelegate.closeOptionButtons();
    };

    $ionicModal.fromTemplateUrl('profesor/nota-modal-editare.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modalEditare = modal;
    });
    $scope.openModalEditare = function (esteTeza, nota, indexNota) {
        $scope.indexNota = indexNota;
        $scope.esteTeza = esteTeza;
        $scope.notaEditare = nota;
        /* console.log("asta este data: ", $scope.notaEditare.data);*/
        $scope.notaEditare.data = DatabaseTables.toDate($scope.notaEditare.data);
        /*console.log("asta este data: ", $scope.notaEditare.data);*/
        $scope.modalEditare.show();
    };
    $scope.closeModalEditare = function () {
        $scope.modalEditare.hide();
    };

    $scope.editeazaNota = function (notaEditare, materie, uid, esteTeza, indexNota) {
        if (Profi.editeazaNota(notaEditare, materie, uid, esteTeza, indexNota) != -1)
            $scope.modalEditare.hide();
    }

})

.controller('medieController', function ($scope, $stateParams, $ionicPopover, Profi, Materii) {

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

});
