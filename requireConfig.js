require.config({
    baseUrl: './scripts',
    paths: {
        'knockout': '//cdnjs.cloudflare.com/ajax/libs/knockout/3.2.0/knockout-min',
        'pager': '//cdn.jsdelivr.net/pager.js/1.0.1/pager.min',
        'papaparse': '../vendor/papaparse',
        'leaflet': '//cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/leaflet',
        'fuzzy': 'http://kiro.me/javascript/projects/fuse.min',

        'jquery': '//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min',
        'bootstrap': '//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.1/js/bootstrap.min',
    },
    shim: {
        'leaflet.label': {
            deps: ['leaflet'],
            exports: 'leaflet'
        },
        'bootstrap': {
            deps: ['jquery']
        },
    }
});
