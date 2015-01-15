'use strict';

define(
    [
        'knockout', 'jquery', 'leaflet',

        'models/AppModel'
    ],
    function(
        ko, jquery, L,

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

            self.mapOptions = {
                zoomControl: false,
                dragging: false,
                touchZoom: false,
                doubleClickZoom: false,
                scrollWheelZoom: false,
                boxZoom: false,
                keyboard: false
            };

            self.latitude = 51.5430289;
            self.longitude = 45.9886676;
            self.zoom = 17;

            self.map = null;

            self.callbackWithMapInit = function(map) {
                var icon = L.icon({
                    iconUrl: '//cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/images/marker-icon-2x.png',
                    iconSize: [30, 50]
                });
                var marker = new L.Marker([self.latitude, self.longitude], {icon: icon});
                map.addLayer(marker);
                self.marker = marker;
                self.map = map;
            };

            self.mapInvalidateSize = function() {
                self.map.invalidateSize();
            };

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
