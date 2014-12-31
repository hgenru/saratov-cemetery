'use strict';

define(
    ['knockout', 'papaparse', 'fuzzy'],
    function(ko, papa, Fuse) {
        function AppModel() {
            var self = this;

            self.ready = ko.observable(false);

            self.currentSectionId = ko.observable(1);  // Random

            self.departedData = {};
            self.fuses = {};

            self.loadDepartedData = function() {
                papa.parse(
                    'sources/departed.csv',
                    {
                        header: true,
                        fastMode: true,
                        dynamicTyping: true,
                        worker: true,
                        download: true,
                        complete: function(response) {
                            var data = response.data;
                            self.departedData[0] = data;

                            var fuseOptions =  {
                                keys: ['name', 'birthDate', 'deadDate']
                            };

                            self.fuses[0] = new Fuse(data, fuseOptions);

                            var dataIds = [1, 2, 3];
                            var filterFunction = function(el) {
                                if (el.section === i) {
                                    return true;
                                }
                            };
                            for (var i=1; i <= dataIds.length; i++) {
                                var dt = data.filter(filterFunction);
                                self.departedData[i] = dt;
                                self.fuses[i] = new Fuse(dt, fuseOptions);
                            }

                            self.ready(true);
                        }
                    }
                );
            };
    }

    AppModel.instance = function() {
        if (!AppModel._instance) {
            var instance = new AppModel();
            AppModel._instance = instance;
        }
        return AppModel._instance;
    };

    return AppModel;
});
