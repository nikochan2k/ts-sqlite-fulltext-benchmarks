var gulp = require("gulp");
var runSequence = require("run-sequence");
var newer = require("gulp-newer");

var src2transpiled;
gulp.task("src2transpiled", function(cb) {
  if (src2transpiled == null) {
    src2transpiled = gulp.src([
        "src/**/*",
        "!src/**/*.ts",
        "!src/**/*.tsx"
      ], {
        base: "src"
      })
      .pipe(newer("transpiled"));
  }
  return src2transpiled
    .pipe(gulp.dest("transpiled"));
});

var shell = require("gulp-shell");
gulp.task("transpile", ["src2transpiled"], shell.task([
  "tsc"
]));

var src2dist;
gulp.task("src2dist", function(cb) {
  if (src2dist == null) {
    src2dist = gulp.src([
        "src/main/client/**/*",
        "!src/main/client/**/*.js",
        "!src/main/client/**/*.jsx"
      ], {
        base: "dist"
      })
      .pipe(newer("dist"));
  }
  return src2dist
    .pipe(gulp.dest("dist"));
});

var rollup;
gulp.task("dist", ["src2dist"], shell.task([
  "rollup -c"
]));

var espower, transpiled2espowered;
gulp.task("espower", ["transpile"], function() {
  if (espower == null) {
    espower = require("gulp-espower");
  }
  if (transpiled2espowered == null) {
    transpiled2espowered = gulp.src(["transpiled/test/**/*.js"], {
        base: "transpiled/test"
      })
      .pipe(newer("transpiled/espowered"));
  }
  return transpiled2espowered
    .pipe(espower())
    .pipe(gulp.dest("transpiled/espowered"));
});

var mocha;
gulp.task("test", ["espower"], function() {
  if (mocha == null) {
    mocha = require("gulp-mocha");
  }
  return gulp.src([
    "transpiled/main/**/*.js",
    "transpiled/espowered/**/*.js"
  ], {
    base: "transpiled"
  }).pipe(mocha());
});

gulp.task("typedoc", ["transpile"], function() {
  var typedoc = require("gulp-typedoc");
  return gulp.src([
      "src/**/*.ts",
      "src/**/*.tsx"
    ])
    .pipe(typedoc({
      module: "commonjs",
      target: "es5",
      out: "docs/",
      name: "Sample Project",
      readme: "README.md"
    }));
});

function watch(glob, tasks, action) {
  var watcher = gulp.watch(glob, tasks);
  if (!action) {
    return;
  }
  watcher.on("change", function(event) {
    console.log("File \"" + event.path + "\" was " + event.type +
      ", running tasks...");
    switch (event.type) {
      case "added":
        action.onAdded && action.onAdded(event);
        break;
      case "changed":
        action.onChanged && action.onChanged(event);
        break;
      case "deleted":
        action.onDeleted && action.onDelete(event);
        break;
    }
  });
}

var fs, path;

function doWatch(pretasks) {
  if (fs == null) {
    fs = require("fs");
    path = require("path");
  }

  watch(["src/**/*"], pretasks, {
    onAdded: function(event) {
      if (event.path.match(/\.tsx?$/)) {
        tsConfig = null;
        if (event.path.match(/[\/\\]src[\/\\]test[\/\\]/)) {
          testNewer = null;
        }
      } else {
        srcStaticNewer = null;
      }
    },
    onDeleted: function(event) {
      var deleted = event.path.substr(__dirname.length);
      if (deleted.match(/\.tsx?$/)) {
        var delTarget = deleted.replace(/.tsx?$/, ".js");
        var delJs = __dirname + path.sep + "transpiled" + delTarget;
        var delJsMap = delJs + ".map";
        fs.unlink(delJs);
        console.log("File \"" + delJs + "\" was also deleted.");
        fs.unlink(delJsMap);
        console.log("File \"" + delJsMap + "\" was also deleted.");
        tsConfig = null;
        if (event.path.match(/[\/\\]src[\/\\]test[\/\\]/)) {
          testNewer = null;
        }
      } else {
        var delFile = __dirname + path.sep + "transpiled" + deleted;
        fs.unlink(delFile);
        console.log("File \"" + delFile + "\" was also deleted.");
        srcStaticNewer = null;
      }
    }
  });
}

gulp.task("watch-transpile", ["transpile"], function() {
  doWatch(["transpile"]);
});
gulp.task("watch-test", ["test"], function() {
  doWatch(["test"]);
});
gulp.task("watch-build", ["build"], function() {
  doWatch(["build"]);
});

gulp.task("clean", function(cb) {
  var del = require("del");
  del(["transpiled", "dist", "docs"]).then(function(result) {
    cb();
  });
});

gulp.task("retranspile", function(cb) {
  runSequence("clean", "transpile", cb);
});
gulp.task("rebuild", function(cb) {
  runSequence("clean", "build", cb);
});
gulp.task("retest", function(cb) {
  runSequence("clean", "test", cb);
});
