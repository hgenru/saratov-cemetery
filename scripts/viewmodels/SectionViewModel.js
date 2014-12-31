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

            self.chunks = ko.pureComputed(function() {
                var data = this.app.departedData[self.app.currentSectionId()],
                    chunks = {};
                if (data) {
                    for (var i=0; i < data.length; i++) {
                        var entry = data[i];
                        if (entry.row in chunks) {
                            chunks[entry.row].push(entry);
                        } else {
                            chunks[entry.row] = [entry];
                        }
                    }
                }
                var array = jquery.map(chunks, function(value) {
                    return [value];
                });
                return array;
            }, this);
        }

        return SectionViewModel;
    }
);
