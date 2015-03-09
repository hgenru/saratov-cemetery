'use strict';

define(
    ['jquery', 'leaflet', 'pager'],
    function(jquery, L, pager) {
        function MapViewModel() {
            var self = this;

            self.mapOptions = {
                zoomControl: true,
                dragging: true,
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
                jquery.ajax({
                    type: 'GET',
                    url: 'sources/celemetry-section.json',
                    dataType: 'json',
                    success: function(response) {
                        L.geoJson(
                            response,
                            {
                                onEachFeature: function(feature, layer) {
                                    layer.on('click', function() {
                                        pager.navigate('#!/sections/' + feature.properties.section);
                                        layer.bindPopup(feature.properties.section);
                                    });
                                }
                            }
                        ).addTo(map);
                        var mapSectionLabel = L.marker([51.5428688, 45.9875947], {
                            icon: L.divIcon({
                                className: 'map-section-label',
                                html: '1'
                            }),
                            zIndexOffset: 1000
                        });
                        map.addLayer(mapSectionLabel);

                        var mapSectionLabel2 = L.marker([51.5432791, 45.9876055], {
                            icon: L.divIcon({
                                className: 'map-section-label',
                                html: '2'
                            }),
                            zIndexOffset: 1000
                        });
                        map.addLayer(mapSectionLabel2);

                        var mapSectionLabel3 = L.marker([51.5440865, 45.9881687], {
                            icon: L.divIcon({
                                className: 'map-section-label',
                                html: '3'
                            }),
                            zIndexOffset: 1000
                        });
                        map.addLayer(mapSectionLabel3);

                        var mapSectionLabel4 = L.marker([51.5442533, 45.9877181], {
                            icon: L.divIcon({
                                className: 'map-section-label',
                                html: '4'
                            }),
                            zIndexOffset: 1000
                        });
                        map.addLayer(mapSectionLabel4);
                    }
                });
                self.map = map;
            };

            self.mapInvalidateSize = function() {
                // FIXME: Я хз что тут происходит
                var mapElement = document.getElementById('saratov-cemetery-map');
                if (!mapElement) { return; }
                var map = mapElement.myMapProperty;
                if (map) {
                    setTimeout(function() {
                        map.invalidateSize();
                    }, 400);
                    setTimeout(function() {
                        map.invalidateSize();
                    }, 1000);
                    setTimeout(function() {
                        map.invalidateSize();
                    }, 3000);
                }
            };
        }

        return MapViewModel;
    }
);
