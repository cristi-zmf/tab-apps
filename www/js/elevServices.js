angular.module('gradeBook.elevServices', [])

.factory('Materii', function ($firebaseArray, $firebaseAuth, CurrentUser, DatabaseTables) {

    var elev = '';
    elev = 'Luca';

    var materii = [{
        id: 1,
        nume: 'Matematica',
        are_teza: true,
        note: [[10, {
                "Provenienta": "Lucrare",
                "Observatii": "Nu e bine!",
                "Recomandari": "SUPER, NIMIC DE ZIS!"
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

    /*Firebase logic*/
    var curUser = firebase.auth().currentUser.uid;
    var ref = new Firebase(DatabaseTables.getDatabaseName() + DatabaseTables.getSemestrul1() + curUser);
    var materii2 = $firebaseArray(ref);

    //Se returneaza notele din vectorul de note si observatii
    /*  materii.getGrades = function (note) {
          var grades = [];
          var gradePos = 0;

          for (var i = 0; i < note.length; i++) {
              var nota = note[i];
              grades.push(nota[gradePos]);
          }
          return grades;
      };*/

    return {
        all: function () {
            return materii;
        },

        /*Functie care returneaza materiile de pe semestrul 1*/
        getMateriiElevSemestrul1: function () {
            /*var ref = new Firebase(DatabaseTables.getDatabaseName() + DatabaseTables.getSemestrul1() + CurrentUser.getLoggedUser());
            var materiiPromise = $firebaseArray(ref);*/

            var ref = new Firebase(DatabaseTables.getDatabaseName());
            var authObj = $firebaseAuth(ref);
            var curUser = firebase.auth().currentUser;
            var userUid = curUser.uid;
            /*console.log("Avem uid-ul urmator in serviciu: ", userUid);*/
            ref = new Firebase(DatabaseTables.getDatabaseName() + DatabaseTables.getSemestrul1() + userUid);
            var materiiPromise = $firebaseArray(ref).$loaded().then(function (materiiArray) {
                /*console.log("avem materiile: ", materiiArray);*/
                return materiiArray;
            });
            return materiiPromise;
        },
        get: function (materieId) {
            for (var i = 0; i < materii.length; i++) {
                if (materii[i].id === parseInt(materieId))
                    return materii[i];
            }
        },

        /*Functie care returneaza materiile de pe semestrul 2*/
        getMateriiElevSemestrul2: function () {
            var ref = new Firebase(DatabaseTables.getDatabaseName());
            var authObj = $firebaseAuth(ref);
            var curUser = firebase.auth().currentUser;
            var userUid = curUser.uid;
            /*console.log("Avem uid-ul urmator in serviciu: ", userUid);*/
            ref = new Firebase(DatabaseTables.getDatabaseName() + DatabaseTables.getSemestrul2() + userUid);
            var materiiPromise = $firebaseArray(ref).$loaded().then(function (materiiArray) {
                /*console.log("avem materiile: ", materiiArray);*/
                return materiiArray;
            });
            return materiiPromise;
        },
        get: function (materieId) {
            for (var i = 0; i < materii.length; i++) {
                if (materii[i].id === parseInt(materieId))
                    return materii[i];
            }
        },

        getSelectedMaterie: function (idMaterie, materiiArray) {
            for (var i = 0; i < materiiArray.length; i++) {
                console.log("Suntem la materia: ", materiiArray[i].numeMaterie);
                if (materiiArray[i].idMaterie === idMaterie) {
                    console.log("am gasit materia: ", materiiArray[i].nume);
                    return materiiArray[i];
                }
            }
        },

        getGrades: function (note) {
            var grades = [];
            /*var gradePos = 0;*/

            for (var i = 0; i < note.length; i++) {
                var nota = note[i].nota;
                grades.push(nota);
            }
            return grades;
        },
        /*Functie care numara de cate ori apare o nota
            @in:materie = materia la care vrem sa numaram notele
            @out: note = vector cu notele
            @out: occurs = vector cu nr de aparitii al fiecarui vector
            indexul din note corespunde cu indexul din occurs*/

        countOccurence: function (materie) {
            var vector = this.getGrades(materie.note);
            var note = [],
                occurs = [],
                prev;

            vector.sort();
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
