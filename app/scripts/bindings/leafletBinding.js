'use strict';

define(
    ['knockout', 'leaflet'],
    function(ko, L) {
        var leafletBinding = {
            init: function(element, valueAccessor){
                var valueUnWrapped = ko.unwrap(valueAccessor()),
                    callback = valueUnWrapped.callback,
                    options = valueUnWrapped.options;

                var realElementId = element.parentNode.id;  // TODO: REMOVE THIS, КОСТЫЛЬ: LEAFLET BUG
                element.parentNode.id = 'important-display-block';

                var map = L.map(element, options);
                element.myMapProperty = map;
                L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);

                map.whenReady(function() {
                    element.parentNode.id = realElementId;  // TODO: REMOVE THIS, КОСТЫЛЬ: LEAFLET BUG
                    if (callback) {
                        callback(this);
                    }
                });

                ko.utils.domNodeDisposal.addDisposeCallback(
                  map, function() { element.myMapProperty.remove(); });

            },

            update: function(element, valueAccessor) {
                var existingMap = element.myMapProperty;

                var valueUnWrapped = ko.unwrap(valueAccessor());
                var latitude = ko.unwrap(valueUnWrapped.latitude);
                var longitude = ko.unwrap(valueUnWrapped.longitude);
                var zoom = ko.unwrap(valueUnWrapped.zoom);

                existingMap.setView([latitude, longitude], zoom);
            }
        };

        return leafletBinding;
    }
);
