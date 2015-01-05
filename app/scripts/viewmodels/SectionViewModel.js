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
        function SectionViewModel() {
            var self = this;

            self.app = AppModel.instance();

            self.currentRow = ko.observable(1);
            self.setCurrentRow = function(newRow) {
                self.currentRow(parseInt(newRow));
            };
            self.currentRowData = ko.pureComputed(function() {
                var currentSection = this.app.sectionObjects[self.app.currentSectionId()];
                var rowsData = currentSection.rowsData;
                return rowsData[this.currentRow()];
            }, this);

            self.rowsDataKeys = ko.pureComputed(function() {
                var section = this.app.sectionObjects[self.app.currentSectionId()];
                var rowsData = section.rowsData;
                var keys = [];
                for (var key in rowsData) {
                    if (key === 'length' || !rowsData.hasOwnProperty(key)) {
                        continue;
                    }
                    keys.push(key);
                }
                return keys;
            }, this);
        }

        return SectionViewModel;
    }
);
