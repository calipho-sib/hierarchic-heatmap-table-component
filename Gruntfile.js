module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
                options: {
                separator: ';\n'
            },
            basic: {
                 //use core because it is the "base", but needs compiled templates to work 
                 src: ['src/heatmap-table-core.js',
                      'build/heatmap-compiled-templates.js'],
                dest: 'dist/heatmap-table.js'
            },
            css: {
                src: ['vendor/css/heatmap-table.css'],
                dest: 'dist/heatmap-table.css'
            },
            vendor: {
                src: ['bower_components/handlebars/handlebars.js',
                      'bower_components/jquery/dist/jquery.min.js'],
                dest: 'dist/heatmap-table-vendor.js'
            },
            bundle: {
                 //the keyword vendor is used for external dependencies
                 src: ['dist/heatmap-table-vendor.js', 
                       'dist/heatmap-table.js'],
                //the keyword bundle is for the full package source + dependencies
                dest: 'dist/heatmap-table-bundle.js'
            }
        },
        connect: {
            server: {
                options: {
                    port: 5000,
                    livereload: true,
                    base: '.'
                }
            }
        },
        watch: {
            all: {
                options: {
                    livereload: true
                },
                files: ['src/*.js', 'templates/*.tmpl', 'vendor/css/*.css', 'doc/*.pug'],
                tasks: ['handlebars:compile', 'concat', "pug:compile"]
            },
            handlebars: {
                files: 'templates/*.tmpl',
                tasks: ['handlebars:compile']
            },
            pug: {
                files: "doc/pug/*.pug",
                tasks: ['pug:compile']
            }
        },
        handlebars: {
            compile: {
                src: 'templates/*.tmpl',
                dest: 'build/heatmap-compiled-templates.js',
                options: {
                    namespace: "HBtemplates"
                }
            }
        },
        pug: {
            compile: {
                options: {
                    data: {}
                },
                files: [{
                    src: "**/*.pug",
                    dest: "doc",
                    ext: ".html",
                    cwd: "doc",
                    expand: true
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-pug');

    grunt.registerTask('default', ['connect:server', 'pug', 'concat', 'watch:all']);
};
