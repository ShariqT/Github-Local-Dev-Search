module.exports = {
    entry:[
        __dirname + "/jsapp/App.jsx"
    ],
    resolve:{
        extensions: [".js", ".jsx"]
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            }
        ]
    },
    output: {
        filename: "mainapp.js",
        path: __dirname + "/src/main/resources/assets"
    }
}