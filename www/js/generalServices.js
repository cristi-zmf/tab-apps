/*Modul cu variabile globale constante*/
angular.module('gradeBook.generalServices', [])

.factory('generalServices', function() {
   var loggedUser = '';
    return {
        getLoggedUser : function () {
            return loggedUser();
        }
    };
});