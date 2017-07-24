var webpack=require('webpack');
const path = require('path');
//var commonsPlugin=new webpack.optimize.CommonsChunkPlugin('common.js');
module.exports={
    entry:{index:'./src/index.tsx'},
    output:{
        path: path.resolve(__dirname, './build'),
        filename:'bundle.js',
        publicPath: '/static/'
    },
    module:{
        loaders:[
            {
                test:/\.css$/,
                loader:'style-loader!css-loader'
            },
            {
                test:/\.tsx?$/,
                loader:'awesome-typescript-loader',
                exclude: /node_modules/,
                query:{
                    presets:['es2015','react']
                }
            },
            {
                test:/\.jsx?$/,
                loader:'awesome-typescript-loader',
                exclude: /node_modules/,
                query:{
                    presets:['es2015','react']
                }
            },
            // {
            //     test:/\.(png|jpg)$/,
            //     loader:'url-loader?limit=8192'
            // },
            // {
            //     test:/\.less$/,
            //     loader:'style-loader!css-loader!less-loader'
            // },
            // {
            //     test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            //     loader: "url-loader?limit=10000&mimetype=application/font-woff"
            // },
            // {
            //     test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            //     loader: "file-loader"
            // }
        ],
        // plugins:[
        //     new webpack.HotModuleReplacementPlugin(),
        //     new webpack.NamedModulesPlugin(),
        //     new webpack.NoEmitOnErrorsPlugin(),
        // ]
    },
    resolve:{
        // root:'',
        extensions:['.tsx', '.js', '.jsx', '.json','.less'],
        alias:{
            AppStore:'js/stores/AppStores.js'
        }
    }
}
