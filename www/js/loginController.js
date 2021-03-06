/*Modul care se ocupa de logica paginii de login*/

angular.module('gradeBook.loginController', ['firebase', 'chart.js'])

.controller('loginController', function ($scope, $rootScope, $location, $firebase, $firebaseAuth, $firebaseArray, $window, $ionicPopup, $ionicHistory, $ionicViewService, CurrentUser, DatabaseTables) {

    /*$scope.login = function(mailAddress, pass) {

    }*/


    $scope.uid = '';
    $scope.mail = '';
    $scope.password = '';
    $scope.login = function () {
        $location.path('/tab/dash');
    };

    $scope.signIn = function (mail, password) {
        console.log("Intram aici");
        var errorObj;

        firebase.auth().signInWithEmailAndPassword(mail, password).then(function (authData) {
            CurrentUser.setLoggedUser(authData.uid);
            console.log("Ia uite ce avem aici ", authData.uid);

            /*Verificam daca este elev*/
            var ref = new Firebase(DatabaseTables.getDatabaseName() + DatabaseTables.getEleviTableName());
            $firebaseArray(ref).$loaded().then(function (elevi) {
                console.log("asta este recordul de elevi: ", elevi);
                console.log("luam elevii: ", elevi.$getRecord("elevi"));
                if (elevi.$getRecord(authData.uid)) {
                    $location.path('/tab/cont');
                    console.log("Schimbal locatia ca este elev ", elevi.$getRecord(authData.uid));
                }
                else {
                    ref = new Firebase(DatabaseTables.getDatabaseName() + DatabaseTables.getProfesoriTableName());
                    $firebaseArray(ref).$loaded().then(function(profesori) {
                        if (profesori.$getRecord(authData.uid)) {
                            $location.path('/tabProfesor/cont');
                        }
                        else {
                            $location.path('tabParinte/cont');
                        }
                    })
                }
            });

        }).catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            errorObj = error;
            /*console.log("Login failed: ", error);*/
            $ionicPopup.alert({
                title: 'Eroare!',
                template: 'Credentiale gresite'
            });
        });
    };

    $rootScope.signOut = function () {
        firebase.auth().signOut().then(function () {
            var empty = {};
            CurrentUser.setLoggedUser(empty);
            console.log("Ne-am deconectat!");
            $ionicViewService.clearHistory();
            $ionicHistory.clearCache();
            $ionicHistory.clearHistory();
            $location.path('/login');

            console.log("Stergem history");
            $rootScope.$apply();
        });
    };
});
