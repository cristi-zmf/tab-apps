/*Modul cu variabile globale constante*/
angular.module('gradeBook.generalServices', [])

.factory('CurrentUser', function() {
   var loggedUser = {};
    return {
        getLoggedUser : function () {
            return loggedUser;
        },
        setLoggedUser : function (user) {
            loggedUser = user;
        }
    };
});