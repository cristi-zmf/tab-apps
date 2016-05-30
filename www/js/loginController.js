/*Modul care se ocupa de logica paginii de login*/

angular.module('gradeBook.loginController', ['firebase', 'chart.js'])

.controller('loginController', function ($scope, $location, $firebase, $firebaseAuth, $firebaseArray, $ionicPopup, CurrentUser, DatabaseTables) {

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
                if (elevi.$getRecord(authData.uid)) {
                    $location.path('/tab/dash');
                    console.log("Schimbal locatia ca este elev ", elevi.$getRecord(authData.uid));
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
});
