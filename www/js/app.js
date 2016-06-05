// Ionic gradeBook App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'gradeBook' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'gradeBook.services' is found in services.js
// 'gradeBook.controllers' is found in controllers.js
angular.module('gradeBook', ['ionic', 'firebase', 'ngSanitize', 'gradeBook.controllers', 'gradeBook.elevControllers','gradeBook.loginController', 'gradeBook.services', 'gradeBook.elevServices', 'gradeBook.generalServices', 'chart.js'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
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

.config(function($stateProvider, $urlRouterProvider) {

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

  .state('tab.absente', {
      url: '/absente',
      views: {
        'tab-absente': {
          templateUrl: 'elev/tab-absente.html',
          controller: 'absenteCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/absente/:chatId',
      views: {
        'tab-absente': {
          templateUrl: 'elev/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'elev/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });



  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
