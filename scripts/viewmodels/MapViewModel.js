'use strict';

define(
    ['jquery', 'leaflet', 'pager'],
    function(jquery, L, pager) {
        function MapViewModel() {
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
            self.zoom = 19;

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
                        var myTextLabel = L.marker([51.5428454, 45.9877101], {
                            icon: L.divIcon({
                                className: 'map-section-label',
                                html: '1'
                            }),
                            zIndexOffset: 1000
                        });
                        map.addLayer(myTextLabel);

                        var myTextLabel2 = L.marker([51.5432274, 45.9877369], {
                            icon: L.divIcon({
                                className: 'map-section-label',
                                html: '2'
                            }),
                            zIndexOffset: 1000
                        });
                        map.addLayer(myTextLabel2);

                        var myTextLabel3 = L.marker([51.5436645, 45.9877664], {
                            icon: L.divIcon({
                                className: 'map-section-label',
                                html: '3'
                            }),
                            zIndexOffset: 1000
                        });
                        map.addLayer(myTextLabel3);
                    }
                });
            };
        }

        return MapViewModel;
    }
);
