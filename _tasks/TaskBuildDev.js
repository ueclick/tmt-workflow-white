var del = require('del');
var ejs = require('gulp-ejs');
// var path = require('path');
// var template  = require('gulp-art-include');
var less = require('gulp-less');
var gulpif = require('gulp-if');
var util = require('./lib/util');
var ejshelper = require('tmt-ejs-helper');
var tmodjs = require('gulp-tmod');
var inject = require('gulp-inject');
var bs = require('browser-sync').create();  // 自动刷新浏览器
var lazyImageCSS = require('gulp-lazyimagecss');  // 自动为图片样式添加 宽/高/background-size 属性
var postcss = require('gulp-postcss');   // CSS 预处理
var postcssPxtorem = require('postcss-pxtorem'); // CSS 转换 `px` 为 `rem`
var posthtml = require('gulp-posthtml');  // HTML 预处理
var posthtmlPx2rem = require('posthtml-px2rem');  // HTML 内联 CSS 转换 `px` 为 `rem`

var paths = {
    src: {
        dir: './src',
        img: './src/img/**/*.{JPG,jpg,png,gif}',
        slice: './src/slice/**/*.png',
        js: ['./src/js/**/*.js','./src/js/**/*.json'],
        media: './src/media/**/*',
        less: './src/css/style-*.less',
        lessAll: './src/css/**/*.less',
        template: './src/template/**/*.html',
        html: ['./src/html/**/*.html', '!./src/html/_*/**.html', '!./src/html/_*/**/**.html'],
        htmlAll: './src/html/**/*.html',
        index: './src/*.html'
    },
    dev: {
        dir: './dev',
        css: './dev/css',
        html: './dev/html',
        template: './dev/js'
    }
};

module.exports = function (gulp, config) {

    var lazyDir = config.lazyDir || ['../slice'];
    var remConfig = config.remConfig || {rootValue: 75,unitPrecision: 10, minPixelValue: 2};

    // 复制操作
    var copyHandler = function (type, file) {
        file = file || paths['src'][type];

        return gulp.src(file, {base: paths.src.dir})
            .pipe(gulp.dest(paths.dev.dir))
            .on('end', reloadHandler);
    };

    // 自动刷新
    var reloadHandler = function(){
        config.livereload && bs.reload();
    };

    //清除目标目录
    function delDev() {
        return del([paths.dev.dir]);
    }

    //复制操作 start
    function copyImg() {
        return copyHandler('img');
    }

    function copySlice() {
        return copyHandler('slice');
    }

    function copyJs() {
        return copyHandler('js');
    }

    function copyMedia() {
        return copyHandler('media');
    }

    //复制操作 end

    //编译 less
    function compileLess() {
        return gulp.src(paths.src.less)
            .pipe(less())
            .on('error', function (error) {
                console.log(error.message);
            })
            .pipe(gulpif(
                config.supportREM,
                postcss([
                    postcssPxtorem(remConfig)
                ])
            ))
            .pipe(lazyImageCSS({imagePath: lazyDir}))
            .pipe(gulp.dest(paths.dev.css))
            .on('data', function () {
            })
            .on('end', reloadHandler)
    }

    // 判断是否执行 art-template 模板预编译 white++
    function supportTmod() {
        if (config['tmod']) {
            return gulp.series(
                artTemplate
            );
        } else {
            return function noTmod(cb) {
                cb();
            };
        }
    }

    //art Template 预编译 white++
    function artTemplate() {
        // console.log("compileTemplate: "+config.tmod);
        var temp_path = process.cwd() + '/src/template';
        return gulp.src(paths.src.template)
            .pipe(tmodjs({
                output: false,
                templateBase: temp_path
            }))
            .pipe(gulp.dest(paths.dev.template))
            .on('data', function () {
            })
            .on('end', reloadHandler);
    }

    //编译 根目录html
    function compileRootHtml() {
        // console.log(gulp.src('./dev/js/template.js'));
        return gulp.src(paths.src.index)
            .pipe(gulpif(
                config.tmod,
                inject(gulp.src('./js/template.js', {read: false,cwd: process.cwd() +'/dev'}), {addRootSlash: false,addPrefix:'.', name: 'template'}))  //,cwd: process.cwd() +'/dev'
            )
            .pipe(ejs(ejshelper()).on('error', function (error) {
                console.log(error.message);
            }))
            .pipe(gulpif(
                config.supportREM,
                posthtml(
                    posthtmlPx2rem(remConfig)
                ))
            )
            .pipe(gulp.dest(paths.dev.dir))
            .on('data', function () {
            })
            .on('end', reloadHandler)
    }

    //编译 html
    function compileHtml() {
        // console.log(process.cwd() +'/dev');
        return gulp.src(paths.src.html)
            .pipe(gulpif(
                config.tmod,
                inject(gulp.src('./js/template.js', {read: false,cwd: process.cwd() +'/dev'}), {addRootSlash: false,addPrefix:'..', name: 'template'}))  //,cwd: process.cwd() +'/dev'
            )
            .pipe(ejs(ejshelper()).on('error', function (error) {
                console.log(error.message);
            }))
            .pipe(gulpif(
                config.supportREM,
                posthtml(
                    posthtmlPx2rem(remConfig)
                ))
            )
            .pipe(gulp.dest(paths.dev.html))
            .on('data', function () {
            })
            .on('end', reloadHandler)
    }

    //启动 livereload
    function startServer() {
        bs.init({
            ui: {
                port: 8081
            },
            open: "external",
            server: paths.dev.dir,
            port: config['livereload']['port'] || 8080,
            startPath: config['livereload']['startPath'] || '/html',
            reloadDelay: 0,
            notify: {      //自定制livereload 提醒条
                styles: [
                    "margin: 0",
                    "padding: 5px",
                    "position: fixed",
                    "font-size: 10px",
                    "z-index: 9999",
                    "bottom: 0px",
                    "right: 0px",
                    "border-radius: 0",
                    "border-top-left-radius: 5px",
                    "background-color: rgba(60,197,31,0.5)",
                    "color: white",
                    "text-align: center"
                ]
            }
        });
    }

    var watchHandler = function (type, file) {
        // console.log(file);
        // src/index.html
        var sec_match = file.match(/^src[\/|\\](.*?)[\/|\\]/);
        var root_match = file.match(/^src[\/|\\](.*)\.(html|htm)$/i);
        // console.log(sec_match,root_match);
        var isRoot = sec_match?false:true;
        var target;

        if(isRoot){
            target = root_match[2];
            // console.log(target);
            switch (target) {
                case 'html':
                    if (type === 'removed') {
                        var tmp = file.replace('src/', 'dev/');
                        del([tmp]).then(function () {
                            util.loadPlugin('BuildDev');
                        });
                    } else {
                        compileRootHtml();
                    }

                    if (type === 'add') {
                        setTimeout(function () {
                            util.loadPlugin('BuildDev');
                        }, 500);
                    }

                    break;
            }
        }else{
            target = sec_match[1];
            switch (target) {
                case 'img':
                    if (type === 'removed') {
                        var tmp = file.replace('src/', 'dev/');
                        del([tmp]);
                    } else {
                        copyHandler('img', file);
                    }
                    break;

                case 'slice':
                    if (type === 'removed') {
                        var tmp = file.replace('src/', 'dev/');
                        del([tmp]);
                    } else {
                        copyHandler('slice', file);
                    }
                    break;

                case 'js':
                    if (type === 'removed') {
                        var tmp = file.replace('src/', 'dev/');
                        del([tmp]);
                    } else {
                        copyHandler('js', file);
                    }
                    break;

                case 'media':
                    if (type === 'removed') {
                        var tmp = file.replace('src/', 'dev/');
                        del([tmp]);
                    } else {
                        copyHandler('media', file);
                    }
                    break;

                case 'css':
                    if (type === 'removed') {
                        var tmp = file.replace('src/', 'dev/').replace('.less', '.css');
                        del([tmp]);
                    } else {
                        compileLess();
                    }

                    break;

                case 'html':
                    if (type === 'removed') {
                        var tmp = file.replace('src/', 'dev/');
                        del([tmp]).then(function () {
                            util.loadPlugin('BuildDev');
                        });
                    } else {
                        compileHtml();
                    }

                    if (type === 'add') {
                        setTimeout(function () {
                            util.loadPlugin('BuildDev');
                        }, 500);
                    }

                    break;
            }
        }


    };

    //监听文件
    function watch(cb) {
        var watcher = gulp.watch([
                paths.src.img,
                paths.src.slice,
                paths.src.js,
                paths.src.media,
                paths.src.lessAll,
                paths.src.htmlAll,
                paths.src.index
            ],
            {ignored: /[\/\\]\./}
        );

        watcher
            .on('change', function (file) {
                util.log(file + ' has been changed');
                watchHandler('changed', file);
            })
            .on('add', function (file) {
                util.log(file + ' has been added');
                watchHandler('add', file);
            })
            .on('unlink', function (file) {
                util.log(file + ' is deleted');
                watchHandler('removed', file);
            });

        cb();
    }

    //加载插件
    function loadPlugin(cb) {
        util.loadPlugin('build_dev');
        cb();
    }

    //注册 build_dev 任务
    gulp.task('build_dev', gulp.series(
        delDev,
        gulp.series(
            copyImg,
            copySlice,
            copyJs,
            copyMedia,
            compileLess,
            supportTmod(),
            compileHtml,
            compileRootHtml
        ),
        gulp.parallel(
            watch,
            loadPlugin
        ),
        startServer
    ));
};
