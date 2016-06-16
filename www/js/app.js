// Ionic gradeBook App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'gradeBook' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'gradeBook.services' is found in services.js
// 'gradeBook.controllers' is found in controllers.js
angular.module('gradeBook', ['ionic', 'firebase', 'ngSanitize', 'gradeBook.controllers', 'gradeBook.elevControllers', 'gradeBook.loginController', 'gradeBook.services', 'gradeBook.elevServices', 'gradeBook.generalServices', 'gradeBook.profesorControllers', 'gradeBook.profServices', 'gradeBook.parinteControllers', 'gradeBook.parinteServices', 'chart.js'])

.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // login page
        .state('login', {
        url: '/login',
        templateUrl: 'main/login.html',
        controller: 'loginController'
    })

    // setup an abstract state for the tabs directive
    .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'elev/tabs.html'
    })

    /*Tabul pentru lista materiilor*/
    .state('tab.materii', {
            url: '/materii',
            views: {
                'tab-materii': {
                    templateUrl: 'elev/tab-materii.html',
                    controller: 'materiiController'
                }
            }

        })
        /*Tabul pentru detalii materie referitor
        la note*/
        .state('tab.materie', {
            url: '/materii/:idMaterie',
            views: {
                'tab-materii': {
                    templateUrl: 'elev/detalii-materie.html',
                    controller: 'materieController'
                }
            }

        })

    /*Tabul pentru medii semestrul 1, 2, generala*/
    .state('tab.medii', {
        url: '/medii',
        views: {
            'tab-medii': {
                templateUrl: 'elev/tab-medii.html',
                controller: 'mediiCtrl'
            }
        }
    })

    /*Tabul pentru lista materiilor referitor la medii*/
    .state('tab.materiiMedie', {
        url: '/medii/materiiMedie',
        views: {
            'tab-medii': {
                templateUrl: 'elev/tab-materii-medie.html',
                controller: 'materiiMedieController'
            }
        }
    })

    /*Tabul pentru detalierea unei materii referitor
    la media acesteia*/
    .state('tab.materieMedie', {
        url: '/medii/materiiMedie/:idMaterie',
        views: {
            'tab-medii': {
                templateUrl: 'elev/detalii-materieMedie.html',
                controller: 'materieMedieController'
            }
        }
    })

    /*Tabul pentru absente*/
    .state('tab.absente', {
        url: '/absente',
        views: {
            'tab-absente': {
                templateUrl: 'elev/tab-absente.html',
                controller: 'absenteCtrl'
            }
        }
    })

    /*Tabul pentru lista materiilor referitor la absente*/
    .state('tab.materiiAbsente', {
        url: '/absente/materiiAbsente',
        views: {
            'tab-absente': {
                templateUrl: 'elev/tab-materii-absente.html',
                controller: 'absenteMateriiCtrl'
            }
        }
    })


    .state('tab.cont', {
        url: '/cont',
        views: {
            'tab-cont': {
                templateUrl: 'elev/tab-cont.html',
                controller: 'contCtrl'
            }
        }
    })

    // Stare abstracta pentru partea de profesor
    .state('tabProfesor', {
        url: '/tabProfesor',
        abstract: true,
        templateUrl: 'profesor/tabs.html'
    })

    .state('tabProfesor.cont', {
        url: '/cont',
        views: {
            'tab-cont': {
                templateUrl: 'profesor/tab-cont.html',
                controller: 'contProfesorCtrl'
            }
        }
    })

    .state('tabProfesor.clase', {
        url: '/clase',
        views: {
            'tab-clase': {
                templateUrl: 'profesor/tab-clase.html',
                controller: 'claseController'
            }
        }
    })

    /*View pentru elevii unei clase*/
    .state('tabProfesor.clasa', {
        url: '/clase/clasa',
        params: {
            numeClasa: null,
            idMaterie: null
        },
        views: {
            'tab-clase': {
                templateUrl: 'profesor/elevi-clasa.html',
                controller: 'clasaController'
            }
        }
    })

    /*View pentru notele unui elev*/
    .state('tabProfesor.note', {
        url: '/clase/clasa/note',
        params: {
            elev: null,
            idMaterie: null
        },
        views: {
            'tab-clase': {
                templateUrl: 'profesor/elev-note.html',
                controller: 'noteController'
            }
        }
    })

    .state('tabProfesor.noteMedie', {
        url: '/clase/clasa/note/medie',
        params: {
            materie: null
        },
        views: {
            'tab-clase': {
                templateUrl: 'profesor/elev-medie.html',
                controller: 'medieController'
            }
        }
    })

    /*View pentru absentele unui elev*/
    .state('tabProfesor.absente', {
        url: '/clase/clasa/absente',
        params: {
            elev: null,
            idMaterie: null
        },
        views: {
            'tab-clase': {
                templateUrl: 'profesor/elev-absente.html',
                controller: 'absenteController'
            }
        }
    })

    .state('tabParinte', {
        url: '/tabParinte',
        abstract: true,
        templateUrl: 'parinte/tabs.html'
    })

    .state('tabParinte.elevi', {
        url: '/elevi',
        views: {
            'tab-elevi': {
                templateUrl: 'parinte/tab-elevi.html',
                controller: 'eleviController'
            }
        }
    })

    .state('tabParinte.cont', {
        url: '/cont',
        views: {
            'tab-cont': {
                templateUrl: 'parinte/tab-cont.html',
                controller: 'contController'
            }
        }
    })

    .state('tabParinte.materii', {
        url: '/elevi/materii',
        params: {
            elev: null
        },
        views: {
            'tab-elevi': {
                templateUrl: 'parinte/elev-materii.html',
                controller: 'materiiParinteController'
            }
        }
    })

    .state('tabParinte.materie', {
        url: '/elevi/materii/materie',
        params: {
            elev: null,
            materie: null
        },
        views: {
            'tab-elevi': {
                templateUrl: 'parinte/elev-materie-note.html',
                controller: 'materieParinteController'
            }
        }
    })

    .state('tabParinte.noteMedie', {
        url: '/elevi/materii/medie',
        params: {
            materie: null
        },
        views: {
            'tab-elevi': {
                templateUrl: 'parinte/elev-medie.html',
                controller: 'medieParinteController'
            }
        }
    })

    .state('tabParinte.absente', {
        url: '/elevi/materii/absente',
        params: {
            materie: null
        },
        views: {
            'tab-elevi': {
                templateUrl: 'parinte/elev-materie-absente.html',
                controller: 'absenteParinteController'
            }
        }
    })


    .state('tabParinte.bilantMedii', {
        url: '/elevi/materii/bilantMedii',
        params: {
            elev: null
        },
        views: {
            'tab-elevi': {
                templateUrl: 'parinte/bilant-medii.html',
                controller: 'mediiParinteCtrl'
            }
        }
    })

     .state('tabParinte.bilantAbsente', {
        url: '/elevi/materii/bilantAbsente',
        params: {
            elev: null
        },
        views: {
            'tab-elevi': {
                templateUrl: 'parinte/bilant-absente.html',
                controller: 'bilantAbsenteController'
            }
        }
    });


    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');

})

/*Activeaza scroll nativ*/
.config(function ($ionicConfigProvider) {
    $ionicConfigProvider.scrolling.jsScrolling(false);
});
