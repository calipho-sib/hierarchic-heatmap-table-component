var webpack = require('webpack');
var path = require('path');
var CleanWebpackPlugin = require('clean-webpack-plugin');

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
                src: ['src/heatmap-table.css',
                      'bower_components/bootstrap/dist/css/bootstrap.min.css',
                      'bower_components/jquery-typeahead/dist/jquery.typeahead.min.css'],
                dest: 'dist/heatmap-table.css'
            },
            vendor: {
                src: ['bower_components/handlebars/handlebars.js',
                      'bower_components/jquery/dist/jquery.min.js',
                      'bower_components/jquery-typeahead/dist/jquery.typeahead.min.js',
                      'bower_components/bootstrap/dist/js/bootstrap.min.js'],
                dest: 'dist/heatmap-table-vendor.js'
            },
            bundle: {
                 //the keyword vendor is used for external dependencies
                 src: ['dist/heatmap-table-vendor.js', 
                       'dist/heatmap-table.js'],
                //the keyword bundle is for the full package source + dependencies
                dest: 'dist/heatmap-table-bundle.js'
            },
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
                files: ['src/*.js', 'templates/*.tmpl', 'vendor/css/*.css', 'doc/*.pug', 'atlas/src/*.jsx'],
                tasks: ['handlebars:compile', 'concat', "pug:compile"]
            },
            handlebars: {
                files: 'templates/*.tmpl',
                tasks: ['handlebars:compile']
            },
            pug: {
                files: "doc/pug/*.pug",
                tasks: ['pug:compile']
            },
            webpack: {
                options: {
                    livereload: true
                },
                files: "atlas/src/*.jsx",
                tasks: ['webpack:all']
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
        },
        webpack: {
            all: {
                entry: {
                    anatomogram: './atlas/index.js',
                    anatomogramRenderer: './atlas/src/anatomogramRenderer.js',
                    dependencies: ['react', 'react-dom', 'jquery', 'jquery-hc-sticky', 'jquery-ui-bundle', 'imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js']
                },

                output: {
                    libraryTarget: 'var',
                    library: '[name]',
                    path: path.resolve(__dirname, 'dist'),
                    filename: '[name].bundle.js',
                    publicPath: '/atlas/dist/'
                },

                plugins: [
                    new CleanWebpackPlugin(['dist'], {verbose: true, dry: false}),
                    new webpack.optimize.DedupePlugin(),
                    new webpack.optimize.CommonsChunkPlugin({
                        name: 'dependencies',
                        filename: 'vendor.bundle.js',
                        minChunks: Infinity     // Explicit definition-based split. Don’t put shared modules between main and demo entries in vendor.bundle.js (e.g. Anatomogram.jsx)
                    })
                ],

                module: {
                    loaders: [
                        {test: /\.jsx$/, loader: 'babel'}
                    ]
                },

                devServer: {
                    port: 9000
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-pug');
    grunt.loadNpmTasks('grunt-webpack');

    grunt.registerTask('default', ['connect:server', 'pug', 'concat', 'watch:all']);
};
