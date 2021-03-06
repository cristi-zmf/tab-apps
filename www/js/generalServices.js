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
}).factory('DatabaseTables', function ($filter) {
    var elevi = "elevi/";
    var profesori = "profesori/";
    var semestrul1 = "semestrul_1/";
    var semestrul2 = "semestrul_2/";
    var database = "https://gradebook-a87b2.firebaseio.com/";

    var parinti = "parinti";
    var eleviEntity = "elevi";
    var clase = "clase/";
    var tezaName = "notaTeza";
    var noteName = "note/";
    var absentaName = "absente/";

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
        },

        /*Sa avem grija cand folosim
        aceasta functie sa punem si "/"
        dupa ea*/
        getParintiTableName: function () {
            return parinti;
        },

        getEleviEntity: function () {
            return eleviEntity;
        },

        getFirebaseRef: function () {
            return new Firebase(this.getDatabaseName());
        },

        getClaseTableName: function () {
            return clase;
        },

        getTezaName: function () {
            return tezaName;
        },

        getNoteTableName: function () {
            return noteName;
        },

        getAbsenteTableName: function () {
            return absentaName;
        },

        getCurrentUid: function () {
            return firebase.auth().currentUser.uid;
        },

        toDate: function (dataString) {
            dataString = $filter('date')(dataString, 'dd/MM/yyyy');
            var componente = dataString.split("/");
            console.log("componentele: ", componente);
            var data = new Date(componente[2], componente[1] - 1, componente[0]);
            /*data = $filter('date')(data, 'dd/MM/yyyy');*/
            return data;
        }
    };
});
