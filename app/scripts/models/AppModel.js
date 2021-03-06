'use strict';

define(
    [
        'knockout', 'papaparse', 'fuzzy',

        'models/SectionModel'
    ],
    function(
        ko, papa, Fuse,

        SectionModel
    ) {
        function AppModel() {
            var self = this;

            self.ready = ko.observable(false);

            self.currentSectionId = ko.observable(1);

            self.departedData = {};
            self.fuses = {};

            self.sectionObjects = {};

            self.loadDepartedData = function() {
                papa.parse(
                    'sources/departed.csv',
                    {
                        header: true,
                        fastMode: false,
                        dynamicTyping: true,
                        worker: true,
                        download: true,
                        complete: function(response) {
                            var allData = response.data;  // {'id': id, 'name': name ...}

                            var dataI = 0;
                            var departedData = self.departedData;
                            var sectionObjects = self.sectionObjects;
                            for (dataI; dataI < allData.length; dataI++) {
                                var entry = allData[dataI];
                                var section = entry.section;
                                var row = entry.row;
                                var col = entry.col;
                                // Тут возникает довольно жуткая избыточность данных,
                                // Но если считать это всё динамически слабые компы умрут
                                if (departedData[section]) {
                                    departedData[section].push(entry);
                                } else {
                                    departedData[section] = [entry];
                                }
                                if (sectionObjects[section]) {
                                    if (sectionObjects[section].rowsData[row]) {
                                        if (sectionObjects[section].rowsData[row][col]) {
                                            sectionObjects[section].rowsData[row][col].push(entry);
                                        } else {
                                            sectionObjects[section].rowsData[row][col] = [entry];
                                        }
                                    } else {
                                        var colSon = {};
                                        colSon[col] = [entry];
                                        sectionObjects[section].rowsData[row] = colSon;
                                    }
                                } else {
                                    var cols = {};
                                    var elements = {};
                                    cols[col] = [entry];
                                    elements[row] = cols;
                                    sectionObjects[section] = new SectionModel(elements);
                                }
                            }
                            departedData[0] = allData;

                            var fuseOptions =  {
                                keys: ['name', 'birthDate', 'deadDate']
                            };

                            var sectionI = 0;
                            var sectionNames = [];
                            for (var key in departedData) {
                                if (key === 'length' || !departedData.hasOwnProperty(key)) {
                                    continue;
                                }
                                sectionNames.push(key);
                            }
                            for (sectionI; sectionI < sectionNames.length; sectionI++) {
                                var sectionName = sectionNames[sectionI];
                                var dt = departedData[sectionName];
                                // Precess search
                                self.fuses[sectionName] = new Fuse(dt, fuseOptions);
                            }
                            self.fuses[0] = new Fuse(allData, fuseOptions);

                            console.log('App is ready');
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
