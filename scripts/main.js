'use strict';

require(
    [
        'knockout', 'pager', 'bootstrap',

        'models/AppModel',

        'viewmodels/AppViewModel',
        'viewmodels/MapViewModel',
        'viewmodels/DepartedViewModel',
        'viewmodels/SectionViewModel',

        'bindings/leafletBinding'
    ],
    function(
        ko, pager, bootstrap,

        AppModel,

        AppViewModel,
        MapViewModel,
        DepartedViewModel,
        SectionViewModel,

        leafletBinding
    ) {
        // Custom Bindings
        ko.bindingHandlers.leaflet = leafletBinding;
        // App seutp
        var appModel = AppModel.instance();
        appModel.loadDepartedData();
        // General App ViewModel
        var appViewModel = new AppViewModel();
        // Setup other ViewModel
        appViewModel.mapViewModel = new MapViewModel();
        appViewModel.departedViewModel = new DepartedViewModel();
        appViewModel.sectionViewModel = new SectionViewModel();
        // Pager setup
        pager.extendWithPage(appViewModel);
        ko.applyBindings(appViewModel);
        pager.Href.hash = '#!/';
        pager.start();
    }
);
