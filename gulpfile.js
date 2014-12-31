'use strict';
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task(
    'styles',
    function() {
        return gulp.src('app/styles/main.css')
            .pipe($.autoprefixer('last 1 version'))
            .pipe(gulp.dest('.tmp/styles'));
    }
);

gulp.task(
    'jshint',
    function() {
        return gulp.src(['app/**/*.js', '*.js'])
            .pipe($.jshint())
            .pipe($.jshint.reporter('jshint-stylish'))
            .pipe($.jshint.reporter('fail'));
    }
);

gulp.task(
    'jscs',
    function() {
        return gulp.src(['app/**/*.js', '*.js'])
            .pipe($.jscs());
    }
);

gulp.task(
    'html', ['styles'],
    function() {
        var assets = $.useref.assets({searchPath: '{.tmp,app}'});

        return gulp.src('app/*.html')
            .pipe(assets)
            .pipe($.if('*.js', $.uglify()))
            .pipe($.if('*.css', $.csso()))
            .pipe(assets.restore())
            .pipe($.useref())
            .pipe(gulp.dest('dist'));
    }
);

gulp.task(
    'images',
    function() {
        return gulp.src('app/images/**/*')
            .pipe($.cache($.imagemin({
                progressive: true,
                interlaced: true
            })))
            .pipe(gulp.dest('dist/images'));
    }
);

gulp.task(
    'fonts',
    function() {
        return gulp.src(require('main-bower-files')().concat('app/fonts/**/*'))
            .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
            .pipe($.flatten())
            .pipe(gulp.dest('dist/fonts'));
    }
);

gulp.task(
    'extras',
    function() {
        return gulp.src(['app/**/*.*', '!app/*.html'], {dot: true})
            .pipe(gulp.dest('dist'));
    }
);

gulp.task('clean', require('del').bind(null, ['.tmp', 'dist']));

gulp.task(
    'copy_bower_components',
    function() {
        gulp.src(['bower_components/**'], { base:'.' })
            .pipe(gulp.dest('dist'));
    }
);

gulp.task(
    'connect',
    function() {
        var serveStatic = require('serve-static');
        var serveIndex = require('serve-index');
        var app = require('connect')()
            .use(require('connect-livereload')({port: 35729}))
            .use(serveStatic('app'))
            .use(serveStatic('.tmp'))
            // paths to bower_components should be relative to the current file
            // e.g. in app/index.html you should use ../bower_components
            .use('/bower_components', serveStatic('bower_components'))
            .use(serveIndex('app'));

        require('http').createServer(app)
            .listen(9000)
            .on('listening', function() {
                console.log('Started connect web server on http://localhost:9000');
            });
    }
);

gulp.task(
    'serve', ['connect'],
    function() {
        require('opn')('http://localhost:9000');
    }
);

// inject bower components
gulp.task('wiredep', function() {
    var wiredep = require('wiredep').stream;

    gulp.src('app/*.html')
        .pipe(
            wiredep({
                directory: 'bower_components'
            })
        )
        .pipe(gulp.dest('app'));
});

gulp.task(
    'watch', ['connect', 'serve'],
    function() {
        $.livereload.listen();

        // watch for changes
        gulp.watch([
            'app/*.html',
            '.tmp/styles/**/*.css',
            'app/scripts/**/*.js',
            'app/models/*.js',
            'app/viewmodels/**/*.js',
            'app/views/**/*.html',
            'app/images/**/*'
        ]).on('change', $.livereload.changed);

        gulp.watch('app/styles/**/*.css', ['styles']);
        gulp.watch('bower.json', ['wiredep']);
    }
);

gulp.task(
    'build',
    ['jshint', 'jscs', 'html', 'images', 'fonts', 'extras', 'copy_bower_components'],
    function() {
        return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
    }
);

gulp.task(
    'default', ['clean'],
    function() {
        gulp.start('build');
    }
);
