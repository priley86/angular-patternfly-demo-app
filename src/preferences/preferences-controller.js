angular.module('apf.preferencesModule')
  .component('pfTabs', {
    bindings: {
      tabChanged: '&'
    },
    controller: ['$scope', '$element', '$rootScope', function ($scope, $element) {
      'use strict';
      var ctrl = this;

      ctrl.setActive = function (tabTitle) {
        $element[0].setActiveTab(tabTitle || '');
      };

      ctrl.$onInit = function () {
        $element[0].addEventListener('tabChanged', function (ev) {
          $scope.$parent.$broadcast('notifyTabs', {'data': ev});
          if (ctrl.tabChanged) {
            ctrl.tabChanged({'event': ev});
          }
        });
      };
    }]
  })
  .component('pfTab', {
    require: {
      parent: '^pfTabs'
    },
    bindings: {
      isActive: '='
    },
    controller: ['$scope', '$element', '$rootScope', function ($scope, $element) {
      'use strict';
      var ctrl = this, prevIsActive;

      ctrl.$onInit = function () {
        prevIsActive = ctrl.isActive;
      };

      ctrl.$doCheck = function () {
        if (prevIsActive !== ctrl.isActive) {
          prevIsActive = ctrl.isActive;
          if (ctrl.isActive) {
            this.parent.setActive($element[0].attributes.tabtitle.value);
            $element[0].setAttribute('active', 'true');
          } else {
            $element[0].removeAttribute('active');
          }
        }
      };

      $scope.$on('notifyTabs', function (ev, args) {
        //ensure parent scope stays in sync
        $scope.$applyAsync(function () {
          ctrl.isActive = args.data.detail === $element[0].attributes.tabtitle.value;
        });
      });
    }]
  })
  .component('pfTooltip', {
    controller: ['$scope', '$element', function ($scope, $element) {
      'use strict';
      var ctrl = this;

      ctrl.$onInit = function () {
        //observe DOM changes and notify pf-tooltip CE
        var observer = new MutationObserver(function (mutations) {
          $element[0].dispatchEvent(new CustomEvent('handleContentChanged',{}));
        });
        observer.observe($element[0], {
          childList: true,
          subtree: true,
          characterData: true
        });
      };
    }]
  })
  .controller('preferencesController',
  ['$scope', '$timeout', '$interval',
    function ($scope, $timeout, $interval) {
      'use strict';

      activate();

      function activate () {
        //switch plugin
        $("#push-notification-switch").bootstrapSwitch();

        //tabs
        $scope.tabOne = {active: true, title: 'User Settings'};
        $scope.tabTwo = {active: false, title: 'Notification Settings'};

        //success alert
        $scope.successAlertVisible = false;
        $scope.isPersistent = true;

        //tooltip text binding
        $scope.firstNameTooltipText = "Your first name";
      }

      $scope.nextBtnClick = function () {
        $scope.tabOne.active = false;
        $scope.tabTwo.active = true;
      };

      $scope.cancelBtnClick = function () {
        $scope.tabOne.active = true;
        $scope.tabTwo.active = false;
        $scope.successAlertVisible = false;
      };

      $scope.saveBtnClick = function () {
        $scope.successAlertVisible = true;
      };

      $scope.tabChanged = function (ev) {
        alert('holy guacamole! Active tab is now:' + ev.detail);
      };
    }
  ]);