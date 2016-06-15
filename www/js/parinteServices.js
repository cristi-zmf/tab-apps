angular.module('gradeBook.parinteServices', [])

.factory('Parinti', function ($firebaseArray, $firebaseAuth, $firebaseObject, $ionicPopup, $filter, CurrentUser, DatabaseTables) {

    return {

        getParinteObject: function () {
            var uid = DatabaseTables.getCurrentUid();
            var ref = DatabaseTables.getFirebaseRef();
            ref = ref.child(DatabaseTables.getParintiTableName() + '/' + uid);
            console.log("asta este uid-ul ", uid);
            var parinte = $firebaseObject(ref);
            console.log("Asta este parintele ", parinte);
            return parinte;
        },

        /*Returneaza elevii care au oferit
        permisiune parintelui sa vada*/
        getEleviVizibili: function (uidParinte) {
            var elevi = [];
            var eleviUid = [];
            var ref = DatabaseTables.getFirebaseRef();
            ref = ref.child(DatabaseTables.getParintiTableName() + '/' + uidParinte + '/' + DatabaseTables.getEleviTableName());
            ref.on('value', function (snap) {
                eleviUid = snap.val();
                console.log("Astea sunt uid: ", eleviUid);
            });

            console.log("Astea sunt uid: ", eleviUid);
            if (!eleviUid) {
                return elevi;
            }

            for (var i = 0; i < eleviUid.length; i++) {
                var elev = {};
                var refElevi = DatabaseTables.getFirebaseRef();
                refElevi = refElevi.child(DatabaseTables.getEleviTableName() + eleviUid[i].uid);
                refElevi.on('value', function (snap) {
                    elev = snap.val();
                });
                /*elev = $firebaseObject(refElevi);*/
                console.log("Asta este elevul ", elev);
                /*Gasim parintele si verificam daca are
                permisiune*/
                for (var j = 0; j < elev.parinti.length; j++) {
                    if (elev.parinti[j].uid === uidParinte && elev.parinti[j].permis) {
                        elev.uid = eleviUid[i].uid;
                        elevi.push(elev);
                        break;
                    }
                }
            }

            return elevi;
        }
    };
});
