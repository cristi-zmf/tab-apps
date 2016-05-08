angular.module('gradeBook.elevServices', [])

.factory('Materii', function () {

    var elev = '';
    elev = 'Luca';

    var materii = [{
        id: 1,
        nume: 'Matematica',
        note: [10, 9, 7, 5],
        absente: ['22/03/2016']
         }, {
        id: 2,
        nume: 'Romana',
        note: [4, 6, 9],
        absente: ['22/04/2016']
         }];

    return {
        all: function () {
            return materii;
        },

        get: function (materieId) {
            for (var i = 0; i < materii.length; i++) {
                if (materii[i].id === parseInt(materieId))
                    return materii[i];
            }
        }
    };



});