const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const jqueryPath = path.resolve(__dirname, 'public/js/jquery/jquery.min.js');
const cssFiles = [
    path.resolve(__dirname, 'node_modules/bootstrap/dist/css/bootstrap.min.css'),
    path.resolve(__dirname, 'public/css/myStyle.css'),
    path.resolve(__dirname, 'public/css/modal.css')
];

class CssBundlePlugin {
    apply(compiler) {
        compiler.hooks.thisCompilation.tap('CssBundlePlugin', (compilation) => {
            cssFiles.forEach((filePath) => compilation.fileDependencies.add(filePath));
            compilation.hooks.processAssets.tap({
                name: 'CssBundlePlugin',
                stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL
            }, () => {
                const css = cssFiles
                    .map((filePath) => fs.readFileSync(filePath, 'utf8'))
                    .join('\n');
                compilation.emitAsset('styles.css', new compiler.webpack.sources.RawSource(css));
            });
        });
    }
}

 
module.exports = {
    plugins: [
        new CssBundlePlugin(),
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