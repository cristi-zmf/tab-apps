angular.module('gradeBook.profServices', [])

.factory('Profi', function ($firebaseArray, $firebaseAuth, $firebaseObject, CurrentUser, DatabaseTables) {

    return {
        /*Functie care returneaza obiect cu detalii despre profesor*/
        getProfesorObject: function() {
            var curUser = firebase.auth().currentUser;
            var uid = curUser.uid;
            var ref = DatabaseTables.getFirebaseRef();
            ref = ref.child(DatabaseTables.getProfesoriTableName() + uid);
            var profesor = $firebaseObject(ref);
            console.log("Asta este profesorul: ", profesor);
            return profesor;
        }

    };

});
