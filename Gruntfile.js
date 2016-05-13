module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
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
                files: ['src/*.js'],
                tasks: 'concat'
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

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['connect:server', 'watch']);
};