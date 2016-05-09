var del = require('del');
var ejs = require('gulp-ejs');
var less = require('gulp-less');
var gulpif = require('gulp-if');
var util = require('./lib/util');
var ejshelper = require('tmt-ejs-helper');
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
        js: './src/js/**/*.js',
        media: './src/media/**/*',
        less: './src/css/style-*.less',
        lessAll: './src/css/**/*.less',
        html: ['./src/html/**/*.html', '!./src/html/_*/**.html', '!./src/html/_*/**/**.html'],
        htmlAll: './src/html/**/*.html'
    },
    dev: {
        dir: './dev',
        css: './dev/css',
        html: './dev/html'
    }
};


module.exports = function (gulp, config) {

    var lazyDir = config.lazyDir || ['../slice'];

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
                    postcssPxtorem({
                        root_value: '20', // 基准值 html{ font-size: 20px; }
                        prop_white_list: [], // 对所有 px 值生效
                        minPixelValue: 2 // 忽略 1px 值
                    })
                ])
            ))
            .pipe(lazyImageCSS({imagePath: lazyDir}))
            .pipe(gulp.dest(paths.dev.css))
            .on('data', function () {
            })
            .on('end', reloadHandler)
    }

    //编译 html
    function compileHtml() {
        return gulp.src(paths.src.html)
            .pipe(ejs(ejshelper()).on('error', function (error) {
                console.log(error.message);
            }))
            .pipe(gulpif(
                config.supportREM,
                posthtml(
                    posthtmlPx2rem({
                        rootValue: 20,
                        minPixelValue: 2
                    })
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
        var target = file.match(/^src[\/|\\](.*?)[\/|\\]/)[1];

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

    };

    //监听文件
    function watch(cb) {
        var watcher = gulp.watch([
                paths.src.img,
                paths.src.slice,
                paths.src.js,
                paths.src.media,
                paths.src.lessAll,
                paths.src.htmlAll
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
        gulp.parallel(
            copyImg,
            copySlice,
            copyJs,
            copyMedia,
            compileLess,
            compileHtml
        ),
        gulp.parallel(
            watch,
            loadPlugin
        ),
        startServer
    ));
};
