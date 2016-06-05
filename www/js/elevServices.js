angular.module('gradeBook.elevServices', [])

.factory('Materii', function ($firebaseArray, $firebaseAuth, CurrentUser, DatabaseTables) {



    return {

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
                if (note[i].nota) {
                    var nota = note[i].nota;
                    grades.push(nota);
                }
            }
            return grades;
        },

        /*Calculam media generala a unei materii*/
        getMedieMaterie: function (materie) {
            var grades = this.getGrades(materie.note);
            console.log("Astea sunt notele: ", grades);
            if (grades) {
                var medieNote = grades.reduce(function (total, number) {
                    return total + number;
                }, 0.0) / grades.length;

                if (materie.areTeza && materie.notaTeza.nota) {
                    var fractieNote = 3;
                    var notaTeza = materie.notaTeza.nota;
                    console.log("Nota la teza este: ", notaTeza);
                    console.log("Media fara teza: ", medieNote);
                    var medieCuTeza = (medieNote * fractieNote + notaTeza) / 4;
                    var roundedMedieCuTeza = Math.round(medieCuTeza);
                    console.log("Asta este media cu teza: ", roundedMedieCuTeza)
                    return roundedMedieCuTeza;
                } else {
                    console.log("Asta este media: ", medieNote)
                    return medieNote;
                }
            } else
                return 0;
        },

        /*Functie care calculeaza media generala a unui
        vector de materii*/
        getMedieGeneralaSemestru: function (materii) {
            var medieGenerala = 0.0;
            medieGenerala *= 1.0
            for (var i = 0; i < materii.length; i++) {
                medieGenerala += this.getMedieMaterie(materii[i]);
                console.log()
            }
            console.log("Media generala este: ", medieGenerala);
            medieGenerala = medieGenerala / materii.length;
            return medieGenerala;
        },

        /*Functie care returneaza notele necesare
        pentru a obtine o anumita medie*/
        calculeazaNotePentruMedie: function (medieDorita, materie) {
            medieDorita = parseInt(medieDorita);
            var noteMaterie = this.getGrades(materie.note);
            var noteNecesare = [];
            var vectorNotePentruCalcul = noteMaterie;
            var medieActuala = this.getMedieMaterie(materie);
            var nrNoteNecesareMax = 20;
            var nrNoteNecesareActual = 1;
            var notaActuala = medieActuala;
            var medieEstimata = 0;
            var preaMulteNote = "peste 20 de note";

            if (medieActuala >= medieDorita) {
                /*Se returneaza vid cand avem deja
                media dorita sau peste*/
                return noteNecesare;
            }

            noteNecesare.push(notaActuala);
            while (nrNoteNecesareActual <= nrNoteNecesareMax) {

                vectorNotePentruCalcul.push(notaActuala);
                medieEstimata = vectorNotePentruCalcul.reduce(function (total, number) {
                    return total + number;
                }, 0.0) / vectorNotePentruCalcul.length;

                if (materie.areTeza && materie.notaTeza.nota)
                    medieEstimata = ((medieEstimata * 3) + materie.notaTeza.nota) / 4;
                console.log("Media estimata este ", medieEstimata);
                console.log("Notele necesare curente sunt ", noteNecesare);
                if (Math.round(medieEstimata) >= medieDorita)
                    return noteNecesare;
                else if (notaActuala == 10) {
                    nrNoteNecesareActual++;
                    notaActuala = medieActuala;
                    noteNecesare.push(notaActuala);
                } else {
                    vectorNotePentruCalcul.pop();
                    noteNecesare.pop();
                    notaActuala++;
                    noteNecesare.push(notaActuala);
                }

            }

            return noteNecesare;

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
        },

        getFirebaseRef: function () {
            var ref = new Firebase(DatabaseTables.getDatabaseName());
            var refArray = $firebaseArray(ref);
            return refArray;
        }
    };



});
