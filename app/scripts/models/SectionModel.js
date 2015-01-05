'use strict';

define(
    [],
    function() {
        function SectionModel(rowsData) {
            var self = this;

            self.rowsData = rowsData || {};
        }

        return SectionModel;
    }
);
