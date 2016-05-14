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
        note: [4, 6, 9, 9, 9],
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
        },

        countOccurence: function (materie) {
            var vector = materie.note;
            var note = [],
                occurs = [],
                prev;

            note.sort();
            for (var i = 0; i < vector.length; i++) {
                if (vector[i] !== prev) {
                    note.push(vector[i].toString());
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
        }
    };



});
