angular.module('apf.dashboardModule')
  .component('pfUtilizationBarChart', {
    bindings: {
      thresholdSet: '&'
    },
    controller: ['$scope', '$element', function ($scope, $element) {
      'use strict';
      var ctrl = this;

      ctrl.$onInit = function () {
        $element[0].addEventListener('thresholdSet', function (ev) {
          if (ctrl.thresholdSet) {
            ctrl.thresholdSet({'event': ev});
          }
        });
      };
    }]
  })
  .controller('dashboardController',
    ['$scope', '$timeout', '$interval',
      function ($scope, $timeout, $interval) {
        'use strict';

        activate();

        function activate () {
          //loading / utilization bar chart
          $scope.loading = false;
          $scope.used = 10;

          $interval(function () {
            if ($scope.used > 100) {
              $scope.used = 10;
            } else {
              $scope.used += 10;
            }
          }, 1900);
        }

        $scope.thresholdSet = function (e) {
          //monitor threshold here!
          var threshold = e.detail.threshold;
        };
      }
    ]);