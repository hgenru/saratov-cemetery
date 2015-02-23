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
                self.map = map;
                window.departedMap = map;
            };

            self.mapInvalidateSize = function() {
                if (self.map) {
                    setTimeout(function() {
                        self.map.invalidateSize();
                        console.log('400');
                    }, 400);
                    setTimeout(function() {
                        self.map.invalidateSize();
                    }, 1000);
                }
            };

            self.app = AppModel.instance();
            self.currentDepartedId = ko.observable();
            self.setCurrentDepartedId = function(newId) {
                self.currentDepartedId(parseInt(newId));
            };
            self.currentDeparted = ko.pureComputed(function() {
                this.app.ready();
                var data = this.app.departedData[0];
                if (!data) {
                    return null;
                }
                var id = this.currentDepartedId();
                var dp = findById(data, id);
                return dp;
            }, this);
            self.delayCurrentDeparted = ko.pureComputed(function() {return self.currentDeparted();}).extend({ throttle: 1000 });
            self.delayCurrentDeparted.subscribe(function(departed) {
                if (!departed) {
                    return;
                }
                if (self.marker) {
                    self.map.removeLayer(self.marker);
                }
                var icon = L.icon({
                    iconUrl: 'images/grave.png',
                    iconSize: [30, 30]
                });
                var marker = new L.Marker([departed.latitude, departed.longitude], {icon: icon});
                self.marker = marker;
                self.map.addLayer(marker);
            });
        }

        return DepartedViewModel;
    }
);
