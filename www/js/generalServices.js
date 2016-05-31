/*Modul cu variabile globale constante*/
angular.module('gradeBook.generalServices', [])

.factory('CurrentUser', function () {
    var loggedUser = {};
    return {
        getLoggedUser: function () {
            var userPromise = firebase.auth().onAuthStateChanged(function (user) {
                return user.uid;
            })
            return userPromise;
        },
        setLoggedUser: function (user) {
            loggedUser = user;
        }
    };

    /*Constante pentru numele intrarilor generale din baza
    de date*/
}).factory('DatabaseTables', function () {
    var elevi = "elevi/";
    var profesori = "profesori/";
    var semestrul1 = "semestrul_1/";
    var semestrul2 = "semestrul_2/";
    var database = "https://gradebook-a87b2.firebaseio.com/";

    return {
        getEleviTableName: function () {
            return elevi;
        },
        getProfesoriTableName: function () {
            return profesori;
        },

        getDatabaseName: function () {
            return database;
        },

        getSemestrul1: function () {
            return semestrul1;
        },

        getSemestrul2: function () {
            return semestrul2;
        }
    };
});
