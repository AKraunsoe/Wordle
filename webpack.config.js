const path = require('path');
const webpack = require('webpack');
const jqueryPath = path.resolve(__dirname, 'public/js/jquery/jquery.min.js');

 
module.exports = {
    plugins: [
        new webpack.ProvidePlugin({
            $: jqueryPath,
            jQuery: jqueryPath,
        }),
    ],
    entry: [  
        './public/js/jquery/jquery.min.js',   // jQuery first  
        //'./src/jquery/plugin-validate.js',  
        './public/js/index.js',  
        './public/js/backendCalls.js', 
        './public/js/htmlInjection.js', 
        './public/js/gameControl.js', 
        './public/js/messaging.js',
        './public/js/modalControls.js'
    ],  
    output: {  
        filename: 'app.js',  
        path: path.resolve(__dirname, 'public/dist')  
    },  
    mode: 'development' // Minifies by default in production mode  
};  