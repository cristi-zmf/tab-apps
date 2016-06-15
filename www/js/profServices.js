angular.module('gradeBook.profServices', [])

.factory('Profi', function ($firebaseArray, $firebaseAuth, $firebaseObject, $ionicPopup, $filter, CurrentUser, DatabaseTables) {
    var constante = {};
    constante.MOTIVEAZA = 0;
    constante.DEMOTIVEAZA = 1;
    constante.NEMOTIVABILA = 2;
    constante.STERGE = 3;
    return {
        /*Functie care returneaza obiect cu detalii despre profesor*/
        getProfesorObject: function () {
            var curUser = firebase.auth().currentUser;
            var uid = curUser.uid;
            var ref = DatabaseTables.getFirebaseRef();
            ref = ref.child(DatabaseTables.getProfesoriTableName() + uid);
            var profesor = $firebaseObject(ref);
            console.log("Asta este profesorul: ", profesor);
            return profesor;
        },

        /*Functie care returneaza clasele profesorului*/
        getProfesorClase: function () {
            var uid = firebase.auth().currentUser.uid;
            var ref = DatabaseTables.getFirebaseRef();
            ref = ref.child(DatabaseTables.getProfesoriTableName() + uid + "/clase");
            var clase = $firebaseArray(ref);
            console.log("Astea sunt clasele: ", clase);
            return clase;
        },

        /*Functie care returneaza elevii unei clase*/
        getEleviClasa: function (clasaId) {
            var uid = firebase.auth().currentUser.uid;
            var ref = DatabaseTables.getFirebaseRef();
            var eleviObjs = [];
            ref = ref.child(DatabaseTables.getClaseTableName() + clasaId);
            var eleviPromise = $firebaseArray(ref).$loaded().then(function (eleviUid) {
                console.log("Am luat elevii toti: ", eleviUid);
                var ref2 = new Firebase(DatabaseTables.getDatabaseName() + DatabaseTables.getEleviTableName());

                var eleviPromise = $firebaseArray(ref2).$loaded().then(function (elevi) {

                    for (var i = 0; i < eleviUid.length; i++) {
                        elev = elevi.$getRecord(eleviUid[i].$value);
                        console.log("Am gasit un elev: ", elev);
                        eleviObjs.push(elev);
                    }
                    console.log("elevi: la sfarsit", elevi);
                    return eleviObjs;
                });
                return eleviPromise;
            });

            return eleviPromise;
        },

        /*Functie care returneaza materia aleasa */
        getMaterieElev: function (uid, idMaterie) {

            var semestrul = '';
            if (idMaterie.slice(-1) === '1') {
                semestrul = DatabaseTables.getSemestrul1();
            } else {
                semestrul = DatabaseTables.getSemestrul2();
            }

            var ref = DatabaseTables.getFirebaseRef();
            ref = ref.child(semestrul + uid);

            var materiePromise = $firebaseArray(ref).$loaded().then(function (materii) {
                var materieObject = {};
                var indexMaterie = 0;
                for (var i = 0; i < materii.length; i++) {
                    if (materii[i].idMaterie === idMaterie) {
                        materieObject.materie = materii[i];
                        materieObject.indexMaterie = i;
                        /*console.log("astea sunt notele ", materieObject.materie.note);*/
                        break;
                    }
                }
                /*console.log("aceasta este materia returnata: ", materieObject);*/
                return materieObject;
            });

            return materiePromise;
        },

        /*Adauga nota in functie de materie,
        uid elev, si daca este teza*/
        adaugaNota: function (nota, materie, uid, esteTeza, indexMaterie) {
            nota.data = $filter('date')(nota.data, 'dd/MM/yyyy');
            console.log("Asta este uid-ul necesar: ", uid);
            var semestrul = '';
            if (materie.idMaterie.slice(-1) === '1') {
                semestrul = DatabaseTables.getSemestrul1();
            } else {
                semestrul = DatabaseTables.getSemestrul2();
            }

            var isNumber = function (n) {
                return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
            };

            if (!isNumber(nota.nota)) {
                $ionicPopup.alert({
                    title: 'Eroare!',
                    template: 'Nu ati introdus un numar!'
                });
                return -1;
            }
            /* nota.nota = parseInt(nota.nota);*/
            console.log("avem nota ", nota.nota);
            if (nota.nota < 0 || nota.nota > 10) {
                $ionicPopup.alert({
                    title: 'Eroare!',
                    template: 'Nu ati introdus un numar intre 0 si 10'
                });
                return -1;
            }

            if (!nota.nota) {
                $ionicPopup.alert({
                    title: 'Eroare!',
                    template: 'Nu ati introdus o nota!'
                });
                return -1;
            }
            /*$ionicPopup.alert({
                title: 'Eroare!',
                template: 'Nota de la teza deja exista. O puteti edita pe aceea'
            });*/
            if (esteTeza) {
                if (materie.notaTeza) {
                    $ionicPopup.alert({
                        title: 'Eroare!',
                        template: 'Nota de la teza deja exista. O puteti edita pe aceea'
                    });
                    return -1;
                }

                var ref = DatabaseTables.getFirebaseRef();
                ref = ref.child(semestrul + uid + '/' + indexMaterie);
                var tezaKey = DatabaseTables.getTezaName();
                /*var detaliiMaterie = $firebaseArray(ref);*/
                ref.child(tezaKey).set(nota);
                console.log("Adaugam nota la teza ");
            } else {

                var ref = DatabaseTables.getFirebaseRef();
                var path = semestrul + uid + '/' + indexMaterie + '/' + DatabaseTables.getNoteTableName();
                console.log("Asta este full pathul: ", path);
                ref = ref.child(semestrul + uid + '/' + indexMaterie + '/' + DatabaseTables.getNoteTableName());
                var materieNote = [];
                ref.on('value', function (snap) {
                    materieNote = snap.val();
                });

                console.log("asta este filstru ", $filter('date')(nota.data, 'dd/MM/yyyy'));
                if (!materieNote) {
                    materieNote = [];
                }
                materieNote.push(nota);
                ref.set(materieNote);
            }
        },

        /*Sterge o nota relativ la materie si uid elevului*/
        stergeNota: function (nota, materie, uid, esteTeza, indexNota) {
            $ionicPopup.confirm({
                title: 'Stergere nota',
                template: 'Sunteti sigur ca vrei sa stergeti nota?'
            }).then(function (resp) {
                if (resp) {
                    var semestrul = '';
                    if (materie.idMaterie.slice(-1) === '1') {
                        semestrul = DatabaseTables.getSemestrul1();
                    } else {
                        semestrul = DatabaseTables.getSemestrul2();
                    }

                    if (esteTeza) {
                        var ref = DatabaseTables.getFirebaseRef();
                        ref = ref.child(semestrul + uid + '/' + materie.indexMaterie + '/' + DatabaseTables.getTezaName());
                        ref.remove();

                    } else {
                        var ref = DatabaseTables.getFirebaseRef();
                        ref = ref.child(semestrul + uid + '/' + materie.indexMaterie + '/' + DatabaseTables.getNoteTableName());
                        var path = semestrul + uid + '/' + materie.indexMaterie + '/' + DatabaseTables.getNoteTableName();
                        console.log("Pathul este acesta: ", path);
                        var note = [];
                        ref.on('value', function (snap) {
                            note = snap.val();
                        });
                        /* console.log("astea sunt notele ", note)
                         console.log("Asta este indexul notei: ", nota.$index)*/
                        note.splice(indexNota, 1);
                        console.log("indexul notei de sters este: ", indexNota);
                        ref.set(note);
                    }
                }
            });


        },

        /*Editeaza o nota*/
        editeazaNota: function (nota, materie, uid, esteTeza, indexNota) {
            nota.nota = parseInt(nota.nota);
            nota.data = $filter('date')(nota.data, 'dd/MM/yyyy');
            var isNumber = function (n) {
                return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
            };

            if (!isNumber(nota.nota)) {
                $ionicPopup.alert({
                    title: 'Eroare!',
                    template: 'Nu ati introdus un numar!'
                });
                return -1;
            }
            /* nota.nota = parseInt(nota.nota);*/
            console.log("avem nota ", nota.nota);
            if (nota.nota < 0 || nota.nota > 10) {
                $ionicPopup.alert({
                    title: 'Eroare!',
                    template: 'Nu ati introdus un numar intre 0 si 10'
                });
                return -1;
            }

            if (!nota.nota) {
                $ionicPopup.alert({
                    title: 'Eroare!',
                    template: 'Nu ati introdus o nota!'
                });
                return -1;
            }

            var semestrul = '';
            if (materie.idMaterie.slice(-1) === '1') {
                semestrul = DatabaseTables.getSemestrul1();
            } else {
                semestrul = DatabaseTables.getSemestrul2();
            }

            if (esteTeza) {
                var ref = DatabaseTables.getFirebaseRef();
                ref = ref.child(semestrul + uid + '/' + materie.indexMaterie + '/' + DatabaseTables.getTezaName());
                ref.set(nota);
            } else {
                var ref = DatabaseTables.getFirebaseRef();
                ref = ref.child(semestrul + uid + '/' + materie.indexMaterie + '/' + DatabaseTables.getNoteTableName());
                var path = semestrul + uid + '/' + materie.indexMaterie + '/' + DatabaseTables.getNoteTableName();
                console.log("Pathul este acesta: ", path);
                var note = [];
                ref.on('value', function (snap) {
                    note = snap.val();
                });
                /* console.log("astea sunt notele ", note)
                 console.log("Asta este indexul notei: ", nota.$index)*/
                note[indexNota] = nota;
                /*console.log("indexul notei de sters este: ", indexNota);*/
                ref.set(note);
            }

        },

        /*Se adauga o absenta la materia si elevul
        cu uid-ul dat*/
        adaugaAbsenta: function (absenta, materie, uid) {
            console.log("Am primit absenta: ", absenta);
            absenta.data = $filter('date')(absenta.data, 'dd/MM/yyyy');
            var semestrul = '';
            if (materie.idMaterie.slice(-1) === '1') {
                semestrul = DatabaseTables.getSemestrul1();
            } else {
                semestrul = DatabaseTables.getSemestrul2();
            }
            var ref = DatabaseTables.getFirebaseRef();
            ref = ref.child(semestrul + uid + '/' + materie.indexMaterie + '/' + DatabaseTables.getAbsenteTableName());
            path = semestrul + uid + '/' + materie.indexMaterie + '/' + DatabaseTables.getAbsenteTableName();
            console.log("Asta este pathul: ", path);
            var absente = [];
            ref.on('value', function (snap) {
                absente = snap.val();
            });

            /*Cand nu avemm absente*/
            if (!absente) {
                absente = [];
            }
            absente.push(absenta);
            ref.set(absente);
        },

        /*Modifica absenta, sau o sterge
        in functie de parametrul actiune*/
        modificaAbsenta: function (materie, uid, indexAbsenta, actiune) {
            console.log("Asta este actiunea ", actiune);
            if (materie.idMaterie.slice(-1) === '1') {
                semestrul = DatabaseTables.getSemestrul1();
            } else {
                semestrul = DatabaseTables.getSemestrul2();
            }

            var ref = DatabaseTables.getFirebaseRef();
            ref = ref.child(semestrul + uid + '/' + materie.indexMaterie + '/' + DatabaseTables.getAbsenteTableName());
            var absente = [];
            ref.on('value', function (snap) {
                absente = snap.val();
            });

            switch (actiune) {
                case constante.MOTIVEAZA:
                    console.log("Motivam absenta: ");
                    absente[indexAbsenta].motivata = true;
                    absente[indexAbsenta].esteNemotivabila = false;
                    break;

                case constante.DEMOTIVEAZA:
                    console.log("Demotivam absenta: ");
                    absente[indexAbsenta].motivata = false;
                    absente[indexAbsenta].esteNemotivabila = false;
                    break;

                case constante.NEMOTIVABILA:
                    console.log("Nemotivabila absenta: ");
                    absente[indexAbsenta].motivata = false;
                    absente[indexAbsenta].esteNemotivabila = true;
                    break;

                case constante.STERGE:
                    console.log("Stergam absenta: ");
                    absente.splice(indexAbsenta, 1);
                    break;
            }
            ref.set(absente);
        },

        getConstante: function() {
            return constante;
        }
    };

});
