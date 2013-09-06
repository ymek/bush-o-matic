'use strict';

// Basic app config and routing
angular.module('demoApp', ['ngRoute', 'ngAnimate', 'demoApp.animations', 'demoApp.controllers']).//, '$strap.directives']).
  config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider.
      when('/', { controller: 'HomeController' }).
      otherwise({
        redirectTo: '/'
      });
  });

angular.module('demoApp.controllers', []).
  controller('HomeController', function($scope, $http) {
    // ping the server to set our cookie
    $http.get('/helo');

    $scope.left_pane = null;
    $scope.right_pane = null;

    $scope.slideshow= function() {
      if ($scope.left_pane != null || $scope.right_pane != null) {
        $scope.reset_panes();
      }
      $scope.gen_left_pane();
    };

    $scope.reset_panes = function() {
      $scope.right_pane = null;
      $scope.left_pane = null;
    };

    $scope.api_call = function(data_handler) {
      $http.get('/ehlo').success(data_handler);
    };

    $scope.gen_left_pane = function() {
      $scope.api_call(function(data) {
        $scope.left_pane = data;
      });
    };

    $scope.gen_right_pane = function() {
      $http.get('/ehlo').success(function(data) {
        $scope.right_pane = data;
      });
    };

    $scope.$on('animationComplete', function() {
      $scope.gen_right_pane();
      $scope.$apply();
    });
  });


angular.module('demoApp.animations', []).
  animation('.quote-animation', ['$window', function($window) {
    return {
      enter: function(element, done) {
        jQuery(element).css({
          left: $window.document.width,
          opacity: 0,
        });
        jQuery(element).animate({
          left: 20,
          opacity: 1,
        }, done);

        return function(cancelled) {
          if(cancelled) {
            jQuery(element).stop();
          }

          // show right pane after animation completes
          angular.element(element).scope().$parent.$broadcast('animationComplete')
        }
      },

      move: function(element, done) {
        jQuery(element).css({
          opacity: 0.5
        });
        jQuery(element).animate({
          opacity: 1
        })
      }
    }
  }]);

