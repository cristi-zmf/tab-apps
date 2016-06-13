angular.module('gradeBook.profServices', [])

.factory('Profi', function ($firebaseArray, $firebaseAuth, $firebaseObject, CurrentUser, DatabaseTables) {

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
        }

    };

});
