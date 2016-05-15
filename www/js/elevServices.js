angular.module('gradeBook.elevServices', [])

.factory('Materii', function () {

    var elev = '';
    elev = 'Luca';

    var materii = [{
        id: 1,
        nume: 'Matematica',
        are_teza: true,
        note: [[10, {
                "Provenienta": "Lucrare",
                "Observatii": "Nu e bine!",
                "Recomandari": ""
        }], [5, {
                "Provenienta": "Lucrare",
                "Observatii": "Nu e bine!",
                "Recomandari": ""
        }], [3, {
                "Provenienta": "Lucrare",
                "Observatii": "Nu e bine!",
                "Recomandari": ""
        }], [8, {
                "Provenienta": "Lucrare",
                "Observatii": "Nu e bine!",
                "Recomandari": ""
        }],
            [8, {
                "Provenienta": "Lucrare",
                "Observatii": "Nu e bine!",
                "Recomandari": ""
        }]],
        absente: ['22/03/2016']
         }, {
        id: 2,
        nume: 'Romana',
        are_teza: false,
        note: [[10, {
            "Provenienta": "Lucrare",
            "Observatii": "Nu e bine!",
            "Recomandari": ""
        }], [9, {
            "Provenienta": "Lucrare",
            "Observatii": "Nu e bine!",
            "Recomandari": ""
        }], [8, {
            "Provenienta": "Lucrare",
            "Observatii": "Nu e bine!",
            "Recomandari": ""
        }], [5, {
            "Provenienta": "Lucrare",
            "Observatii": "Nu e bine!",
            "Recomandari": ""
        }]],
        absente: ['22/04/2016']
         }];

    //Se returneaza notele din vectorul de note si observatii
     materii.getGrades = function (note) {
        var grades = [];
        var gradePos = 0;

        for (var i = 0; i < note.length; i++) {
            var nota = note[i];
            grades.push(nota[gradePos]);
        }
        return grades;
    };

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
            var vector = materii.getGrades(materie.note);
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
