var gulp = require('gulp');
// 引入gulp组件（插件）
// var uglify = require('gulp-uglify');
// var minifyCss = require('gulp-minify-css');
var GulpSSH = require('gulp-ssh');
// var transport = require("gulp-seajs-transport");

var config = {
    testConfig: {
        host: "104.225.145.3",
        username: "root",
        password: "dhr",
        port: 28235
    },
    prodConfig: {

    }
};
var gulpSSH;

gulp.task('default', function () {

});

/* 登陆测试服务器 */
gulp.task('login_test', function () {
    gulpSSH = new GulpSSH({
        ignoreErrors: false,
        sshConfig: config.testConfig
    })
});
// gulp.task('login_prod', function () {
//     gulpSSH = new GulpSSH({
//         ignoreErrors: false,
//         sshConfig: config.prodConfig
//     })
// });

/* 部署node文件 */
gulp.task('upload_serverFile', function () {
    return gulp.src(["**/*", "!node_modules/**/*", "!gulpfile.js", "!views/**/*", "!static/**/*", "!logs/**/*"])
        .pipe(gulpSSH.dest('/hyh'));
});

// /* web相关文件  不压缩 */
// gulp.task('upload_staticFile_noMinify', ['upload_staticFile_views'], function () {
//     return gulp.src(["static/**/*"])
//         .pipe(gulpSSH.dest('/var/www/JQK/static'));
// });

// /* web相关文件  需要压缩 */
gulp.task('upload_staticFile_needMinify', ['upload_minifyJs']);


// /* start    web相关文件 */
// gulp.task('upload_staticFile_views', function () {
//     return gulp.src(["views/**/*"])
//         .pipe(gulpSSH.dest('/var/www/JQK/views'));
// });

// gulp.task('upload_staticFile_minifyStatic', ['upload_staticFile_views'], function () {
//     return gulp.src(["static/**/*", "!static/javascripts/**/*", "!static/stylesheets/**/*", "!static/images/**/*", "!static/plugins/**/*", "!static/temp/**/*", "!static/uploads/**/*"])
//         .pipe(gulpSSH.dest('/var/www/JQK/static'));
// });

// gulp.task('upload_minifyCss', ['upload_staticFile_minifyStatic'], function () {
//     return gulp.src('static/stylesheets/**/*.css')
//         .pipe(minifyCss())
//         .pipe(gulpSSH.dest('/var/www/JQK/static/stylesheets'));
// });

// gulp.task('upload_minifyJs', ['upload_minifyCss'], function () {
//     return gulp.src('static/javascripts/**/*.js')
//         .pipe(transport())
//         .pipe(uglify())
//         .pipe(gulpSSH.dest('/var/www/JQK/static/javascripts'));
// });

// /* end    web相关文件 */
/*
 * 部署test环境node
 * */
gulp.task('test_server', ['login_test', 'upload_serverFile'], function () {
    return gulpSSH
        .shell(['cd /hyh', 'npm install', 'pm2 flush', 'pm2 reload all']);
});

/*
 * 部署test环境web
 * */
gulp.task('test_static', ['login_test', 'upload_staticFile_needMinify'], function () {
    return gulpSSH
        .shell(['rm -rf /hyh*', 'rm -rf /var/www/JQK/static/uploads/*']);
});


// /*
//  * 部署prod环境node
//  * */
// gulp.task('prod_server', ['login_prod', 'upload_serverFile'], function () {
//     return gulpSSH
//         .shell(['cd /var/www/JQK/', 'npm install', 'pm2 flush', 'pm2 reload all']);
// });

// /*
//  * 部署prod环境web
//  * */
// gulp.task('prod_static', ['login_prod', 'upload_staticFile_needMinify'], function () {
//     return gulpSSH
//         .shell(['rm -rf /var/www/JQK/static/temp/*', 'rm -rf /var/www/JQK/static/uploads/*']);
// });