var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var bootstrapEntryPoints = require('./webpack.bootstrap.config.js');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var autoprefixer = require('autoprefixer');
var ProvidePlugin = require('webpack/lib/ProvidePlugin');
var webpack = require('webpack');
var path = require("path");
var isProd = process.env.NODE_ENV === 'production';

console.log('isProd : ' + isProd);
var extractPlugin = new ExtractTextPlugin({
    filename: 'main.css'
});
var cssDevcss = ['style-loader', 'css-loader?sourceMap', 'postcss-loader'];
var cssDev = ['style-loader', 'css-loader?sourceMap', 'postcss-loader', 'sass-loader'];
var cssProd = ExtractTextPlugin.extract({
    fallback: 'style-loader',
    loader: ['css-loader', 'sass-loader'],
    publicPath: '/dist',
})
var cssConfig = isProd ? cssProd : cssDev;
var bootstrapConfig = isProd ? bootstrapEntryPoints.prod : bootstrapEntryPoints.dev;


var config = {
    devServer: {
        contentBase: __dirname + '/src/app', // `__dirname` is root of the project
    },
    entry: {
        app: './src/app/main.js',
        bootstrap: bootstrapConfig
    },
    output: {
        path: path.resolve(__dirname, "dist"), // `dist` is the destination
        filename: 'bundle.js',
        publicPath: '/dist'
    },
    module: {
        // preLoaders: [
        //     {
        //         test: /\.tag$/, exclude: /node_modules/,
        //         loader: 'riotjs-loader', query: { type: 'none' }
        //     }
        // ],
        // loaders: [
        //     {
        //         test: /\.js$|\.tag$/,
        //         exclude: /node_modules/,
        //         loader: 'babel-loader',
        //         query: { presets: ['es2015'] }
        //     }
        // ],
        rules: [
            {
                test: /\.tag$/,
                exclude: /node_modules/,
                loader: 'riotjs-loader',
                enforce: "pre",
                query: { type: 'none' }
            },
            {
                test: /\.js$|\.tag$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: { presets: ['es2015'] }
            },
            /* * Sass loader (required for Bootstrap 4) */
            {
                test: /\.css$/,
                use: cssDevcss,
            },

            {
                test: /\.scss$/,
                use: cssConfig,
            },

            /*
             * Bootstrap 4 loader
             */
            {
                test: /bootstrap\/dist\/js\/umd\//,
                use: 'imports-loader?jQuery=jquery'
            },
            // Bootstrap 3
            { test: /bootstrap-sass\/assets\/javascripts\//, use: 'imports-loader?jQuery=jquery' },

            /*
             * Font loaders, required for font-awesome-sass-loader and bootstrap-loader
             */
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=10000&mimetype=application/font-woff"
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file-loader"
            },
            {
                test: /\.js$/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: []
                    }
                }]
            }
        ]
    },
    plugins: [
        // new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.ProvidePlugin({ riot: 'riot' }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'bootstrap',
            // chunks: ['bootstrap'],
            filename: 'bootstrap.js',
            minChunks: Infinity
        }),
        new HtmlWebpackPlugin({
            title: 'My App',
            filename: 'src/app/index.html'
        }),
        // new CopyWebpackPlugin([
        //     { from: 'src/assets', to: 'assets' },
        // ]),
        new ExtractTextPlugin('main.css'),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery",
            Tether: "tether",
            "window.Tether": "tether",
            Tooltip: "exports-loader?Tooltip!bootstrap/js/dist/tooltip",
            Alert: "exports-loader?Alert!bootstrap/js/dist/alert",
            Button: "exports-loader?Button!bootstrap/js/dist/button",
            Carousel: "exports-loader?Carousel!bootstrap/js/dist/carousel",
            Collapse: "exports-loader?Collapse!bootstrap/js/dist/collapse",
            Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown",
            Modal: "exports-loader?Modal!bootstrap/js/dist/modal",
            Popover: "exports-loader?Popover!bootstrap/js/dist/popover",
            Scrollspy: "exports-loader?Scrollspy!bootstrap/js/dist/scrollspy",
            Tab: "exports-loader?Tab!bootstrap/js/dist/tab",
            Util: "exports-loader?Util!bootstrap/js/dist/util"
        }),
        new webpack.LoaderOptionsPlugin({
            postcss: [autoprefixer],
        })
    ]
};

module.exports = config;