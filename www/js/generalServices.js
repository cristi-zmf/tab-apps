/*Modul cu variabile globale constante*/
angular.module('gradeBook.generalServices', [])

.factory('CurrentUser', function () {
    var loggedUser = {};
    return {
        getLoggedUser: function () {
            return loggedUser;
        },
        setLoggedUser: function (user) {
            loggedUser = user;
        }
    };

    /*Constante pentru numele intrarilor generale din baza
    de date*/
}).factory('DatabaseTables', function () {
    var elevi = "elevi/";
    var profesori = "profesori";
    var semestrul1 = "";
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
        }
    };
});
