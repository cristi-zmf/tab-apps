angular.module('gradeBook.elevServices', [])

.factory('Materii', function ($firebaseArray, $firebaseAuth, $firebaseObject, CurrentUser, DatabaseTables) {



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
                /*console.log("Suntem la materia: ", materiiArray[i].numeMaterie);*/
                if (materiiArray[i].idMaterie === idMaterie) {
                    /*console.log("am gasit materia: ", materiiArray[i].nume);*/
                    return materiiArray[i];
                }
            }
        },

        getGrades: function (note) {
            var grades = [];
            /*var gradePos = 0;*/
            if (!note) {
                return grades;
            }
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
            if (!materie.note) {
                return 0;
            }
            var grades = this.getGrades(materie.note);
            /*console.log("Astea sunt notele: ", grades);*/
            if (grades) {
                var medieNote = grades.reduce(function (total, number) {
                    return total + number;
                }, 0.0) / grades.length;

                if (materie.areTeza && materie.notaTeza) {
                    /*console.log(materie.notaTeza);*/
                    var fractieNote = 3;
                    var notaTeza = materie.notaTeza.nota;
                    /*console.log("Nota la teza este: ", notaTeza);
                    console.log("Media fara teza: ", medieNote);*/
                    var medieCuTeza = (medieNote * fractieNote + notaTeza) / 4;
                    var roundedMedieCuTeza = Math.round(medieCuTeza);
                    /*console.log("Asta este media cu teza: ", roundedMedieCuTeza)*/
                    return roundedMedieCuTeza;
                } else {
                    /*console.log("Asta este media: ", medieNote)*/
                    return Math.round(medieNote);
                }
            } else
                return 0;
        },

        /*Functie care calculeaza media generala a unui
        vector de materii*/
        getMedieGeneralaSemestru: function (materii) {
            var medieGenerala = 0.0;
            medieGenerala *= 1.0
            var length = materii.length;
            for (var i = 0; i < materii.length; i++) {
                if (!materii[i].note) {
                    length -= 1;
                    continue;
                }

                medieGenerala += this.getMedieMaterie(materii[i]);
            }
            /*console.log("Media generala este: ", medieGenerala);*/
            medieGenerala = medieGenerala / length;
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

        /*Functie care returneaza numarul de  absente total
        motivate, nemotivate*/
        calculeazaNrAbsenteMaterie: function(materie) {
            var absente = {};
            absente.total = 0;
            absente.motivate = 0;
            absente.nemotivate = 0;
            absente.nemotivabile = 0;

            if (!materie.absente) {
                return absente;
            }
            var absenteMaterie = materie.absente;
            absente.total = absenteMaterie.length;

            for (var i = 0; i < absenteMaterie.length; i++) {
                if (absenteMaterie[i].motivata)
                    absente.motivate++;
                else
                    absente.nemotivate++;
                if (absenteMaterie[i].esteNemotivabila)
                    absente.nemotivabile++;
            }
            return absente;
        },

        /*Functie care calculeaza absentele totale
        ale unui vector de materii*/
        calculeazaNrAbsenteTotal: function (materii) {
            var absente = {};
            absente.total = 0;
            absente.motivate = 0;
            absente.nemotivate = 0;
            absente.nemotivabile = 0;

            for (var i = 0; i < materii.length; i++) {
                absenteAux = this.calculeazaNrAbsenteMaterie(materii[i]);
                absente.total += absenteAux.total;
                absente.motivate += absenteAux.motivate;
                absente.nemotivate += absenteAux.nemotivate;
                absente.nemotivabile += absenteAux.nemotivabile;
            }

            return absente;
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

        /*Functie care returneaza obiectele parinte
        ale elevului*/
        getParinti: function (){
            //vector obiect parinti
            var parinti = [];
            var uid = firebase.auth().currentUser.uid;
            console.log("Asta este id-ul eleveului: ", uid);
            var ref = new Firebase(DatabaseTables.getDatabaseName() + DatabaseTables.getEleviTableName() + uid);
            $firebaseArray(ref).$loaded().then(function(elev) {
                var parintiUid = elev.$getRecord("parinti");
                var ref2 = new Firebase(DatabaseTables.getDatabaseName() + DatabaseTables.getParintiTableName());
               /* $firebaseArray(ref2).$loaded().then(function (parintiObiecte, parintiUid) {
                    var i = 0;
                    for (i; i < parintiUid.length; i++) {
                        console.log("Adaugam parintele: ", parintiUid[i]);
                        parinti.push(parintiObiecte.get(parintiUid[i]));
                    }
                });*/
                return parintiUid;
            }).then(function(parintiUid){
                console.log("Acestea sunt uid ale parintilor: ", parintiUid);
                var ref2 = new Firebase(DatabaseTables.getDatabaseName());
                $firebaseArray(ref2.child(DatabaseTables.getParintiTableName())).$loaded().then(function (parintiObiecte) {
                    var i = 0;
                    for (i; i < parintiUid.length; i++) {
                        var parinte = parintiObiecte.$getRecord(parintiUid[i].uid);
                        parinte.permis = parintiUid[i].permis;
                        /*parinti.push(parintiObiecte.$getRecord(parintiUid[i].uid));*/
                        parinti.push(parinte);
                    }
                });
            });

            return parinti;
        },

        getConnectedElev: function () {
            var uid = firebase.auth().currentUser.uid;
            var ref = new Firebase(DatabaseTables.getDatabaseName() + DatabaseTables.getEleviTableName());
            var elevPromise = $firebaseArray(ref).$loaded().then(function (elevi) {
                var elevPromise = elevi.$getRecord(uid);
                return elevPromise;
            });
            return elevPromise;
        },

        salveazaPermisiuneNoua: function (uidParinte, permNoua) {
            var uid = firebase.auth().currentUser.uid;
            var ref = new Firebase(DatabaseTables.getDatabaseName() + DatabaseTables.getEleviTableName() + uid + "/parinti");
            console.log("pula");
            $firebaseArray(ref).$loaded().then(function (parinti) {
                /*console.log("uite ce parinti: ", parinti);*/
                 for (var i = 0; i < parinti.length; i++) {
                     console.log("suntem la parintele: ", parinti[i].uid);
                     console.log("asta este uid-ul pe care il cautam: ", uidParinte);
                     if (parinti[i].uid === uidParinte) {
                         console.log("salvam noua valoare a parintelui", parinti[i].uid);
                         parinti[i].permis = permNoua;
                         parinti.$save(i);
                     }
                 }
            });
        },

        getFirebaseRef: function () {
            var ref = new Firebase(DatabaseTables.getDatabaseName());
            var refArray = $firebaseArray(ref);
            return refArray;
        }
    };



});
