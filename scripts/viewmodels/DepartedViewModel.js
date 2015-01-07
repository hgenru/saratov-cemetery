'use strict';

define(
    [
        'knockout', 'jquery',

        'models/AppModel'
    ],
    function(
        ko, jquery,

        AppModel
    ) {
        function findById(source, id) {
            for (var i = 0; i < source.length; i++) {
                if (source[i].id === id) {
                    return source[i];
                }
            }
        }

        function DepartedViewModel() {
            var self = this;

            self.app = AppModel.instance();
            self.currentDepartedId = ko.observable();
            self.setCurrentDepartedId = function(newId) {
                self.currentDepartedId(parseInt(newId));
            };
            self.currentDeparted = ko.pureComputed(function() {
                var data = this.app.departedData[0];
                if (!data) {
                    return null;
                }
                var id = this.currentDepartedId();
                return findById(data, id);
            }, this);
        }

        return DepartedViewModel;
    }
);
