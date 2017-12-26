var webpack=require('webpack');
const path = require('path');
//var commonsPlugin=new webpack.optimize.CommonsChunkPlugin('common.js');
module.exports={
    entry:{index:'./src/index.tsx'},
    output:{
        path: path.resolve(__dirname, './build'),
        filename:'bundle.js',
        publicPath: '/statics/'
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
        ],
    },
    resolve:{
        // root:'',
        extensions:['.tsx', '.js', '.jsx', '.json','.less'],
        alias:{
            AppStore:'js/stores/AppStores.js'
        }
    },
    devServer: {
        host: '0.0.0.0',
        port: 8080,
        historyApiFallback: true,

        hot: true,

        proxy: {
            "/api_auth/*": `http://localhost:8090`,
            "/account/*": `http://localhost:8090`,
            "/api/*": `http://localhost:8090`,
        }
    }
}
