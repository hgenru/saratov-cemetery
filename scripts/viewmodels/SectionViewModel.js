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

            self.currentRow = ko.observable();
            self.setCurrentRow = function(newRow) {
                var valueFloat = parseFloat(newRow);
                var valueInt = parseInt(newRow);
                var value = null;
                if (valueFloat === valueInt) {
                    value = valueInt;
                } else {
                    value = valueFloat;
                }
                if (!value) {
                    value = newRow;
                }
                self.currentRow(value);
            };

            self.setCurrentSectionId = function(newId) {
                self.app.currentSectionId(parseInt(newId));
            };

            self.setCurrentSectionIdAndClearCurrentRow = function(newId) {
                self.currentRow(undefined);
                self.setCurrentSectionId(newId);
            };

            self.currentRowData = ko.pureComputed(function() {
                var currentSection = this.app.sectionObjects[self.app.currentSectionId()];
                var rowsData = currentSection.rowsData;
                return rowsData[this.currentRow()];
            }, this);

            self.rowsDataKeys = ko.pureComputed(function() {
                var section = this.app.sectionObjects[self.app.currentSectionId()];
                var rowsData = section.rowsData;
                var keys = Object.keys(rowsData);
                return keys;
            }, this);
        }

        return SectionViewModel;
    }
);
