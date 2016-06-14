angular.module('gradeBook.profServices', [])

.factory('Profi', function ($firebaseArray, $firebaseAuth, $firebaseObject, $ionicPopup, CurrentUser, DatabaseTables) {

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
                        break;
                    }
                }
                console.log("aceasta este materia returnata: ", materieObject);
                return materieObject;
            });

            return materiePromise;
        },

        /*Adauga nota in functie de materie,
        uid elev, si daca este teza*/
        adaugaNota: function (nota, materie, uid, esteTeza) {

            var semestrul = '';
            if (idMaterie.slice(-1) === '1') {
                semestrul = DatabaseTables.getSemestrul1();
            } else {
                semestrul = DatabaseTables.getSemestrul2();
            }

            if (!nota.nota) {
                $ionicPopup.alert({
                    title: 'Eroare!',
                    template: 'Nu ati introdus o nota!'
                });
                return;
            }
            /*$ionicPopup.alert({
                title: 'Eroare!',
                template: 'Nota de la teza deja exista. O puteti edita pe aceea'
            });*/
            var ref = DatabaseTables.getFirebaseRef();
            ref = ref.child(semestrul + uid);

            this.getMaterieElev(uid, materie.idMaterie).then(function (materieDatabase) {

            })

        }
    };

});
