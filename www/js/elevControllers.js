/*Modul care ofera functionalitatea pentru taburile din elev*/
angular.module('gradeBook.elevControllers', ['firebase', 'chart.js'])

.controller('materiiController', function ($scope, $firebaseArray, $location, $state, Materii) {
    var postsDatabaseRef = new Firebase("https://vivid-fire-1290.firebaseio.com/").child('posts');
    var postsData = $firebaseArray(postsDatabaseRef);
    $scope.materii = Materii.all();

    $scope.goToMaterie = function () {
        $state.go('tab.materie');
    }

})

.controller('materieController', function ($scope, $state, $stateParams, $ionicModal, Materii) {
    $scope.materii = Materii.all();
    $scope.materie = Materii.get($stateParams.materieId);
    /*Constante pentru fereastra modal*/
    $scope.PROVENIENTA = "Provenienta";
    $scope.OBSERVATII = "Observatii";
    $scope.RECOMANDARI = "Recomandari"

    /*Constante pentru a obtine nota, si detaliile acesteia*/
    $scope.GRADE_POSITION = 0;
    $scope.DETAILS_POSITION = 1;

    /*Functie care returneaza un vector cu detaliile fiecarei note*/

    /*Pie chart logic and some grade details for $scope*/
    $scope.pieData = Materii.countOccurence($scope.materie);
    $scope.labels = $scope.pieData.note;
    $scope.data = $scope.pieData.aparitii;
    $scope.note = $scope.materie.note;
    $scope.note.justGrades = $scope.materii.getGrades($scope.materie.note);
    if ($scope.data.length == 0) {
        $scope.data.push(100);
        $scope.labels.push("Fara note");
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
   

});
