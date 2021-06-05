var gulp        = require('gulp');
var sass        = require('gulp-sass');

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("scss/*scss")
        .pipe(sass())
        .pipe(gulp.dest("css"));
});

// watching scss/html files
gulp.task('serve', gulp.series('sass', function() {
    gulp.watch("scss/*.scss", gulp.series('sass'));
}));


gulp.task('default', gulp.series('serve'));