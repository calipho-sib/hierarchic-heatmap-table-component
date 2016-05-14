module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
                options: {
                separator: ';\n'
            },
            basic: {
                src: ['src/convert-nextprot-to-heatmap.js',
                    'src/nextprot-init-templates.js',
                    'src/heatmap-table.js',
                    'build/compiled-templates.js'],
                dest: 'dist/heatmap.js'
            },
            vendor: {
                src: ['bower_components/handlebars/handlebars.js'],
                dest: 'dist/heatmap-vendor.js'
            },
            bundle: {
                src: ['dist/heatmap-vendor.js',
                      'dist/heatmap.js'],
                dest: 'dist/nextprot-heatmap.js'
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
                files: ['src/*.js', 'templates/*.tmpl'],
                tasks: ['handlebars:compile', 'concat']
            },
            handlebars: {
                files: 'templates/*.tmpl',
                tasks: ['handlebars:compile']
            }
        },
        handlebars: {
            compile: {
                src: 'templates/*.tmpl',
                dest: 'build/compiled-templates.js',
                options: {
                    namespace: "HBtemplates"
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['connect:server', 'concat', 'watch:all']);
};