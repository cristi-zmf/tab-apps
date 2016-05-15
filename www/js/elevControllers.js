angular.module('gradeBook.elevControllers', ['firebase', 'chart.js'])

.controller('materiiController', function ($scope, $firebaseArray, $location, $state, Materii) {
    var postsDatabaseRef = new Firebase("https://vivid-fire-1290.firebaseio.com/").child('posts');
    var postsData = $firebaseArray(postsDatabaseRef);
    $scope.materii = Materii.all();

    $scope.goToMaterie = function () {
        $state.go('tab.materie');
    }

})

.controller('materieController', function ($scope, $state, $stateParams, Materii) {
    $scope.materii = Materii.all();
    $scope.materie = Materii.get($stateParams.materieId);



    $scope.count = function (materie) {
        var vector = materie.note;
        var note = [],
            occurs = [],
            prev = 0;
        console.log("Vectorul este");
        console.log(vector);
        note.sort();
        for (var i = 0; i < vector.length; i++) {
            if (vector[i] !== prev) {
                note.push(vector[i].toString());
                console.log("intram aici")
                occurs.push(1);
            } else {
                occurs[occurs.length - 1]++;
            }
            prev = vector[i];
        }
        return {
            note: note,
            aparitii: occurs
        };
    };

    $scope.pieData = Materii.countOccurence($scope.materie);
    $scope.labels = $scope.pieData.note;
    $scope.data = $scope.pieData.aparitii;
    $scope.note = $scope.materii.getGrades($scope.materie.note);
    if ($scope.data.length == 0) {
        $scope.data.push(100);
        $scope.labels.push("Fara note");
    }
    /*$scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
    $scope.data = [300, 500, 100];*/
});
