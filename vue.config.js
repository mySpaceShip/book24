module.exports = {
    configureWebpack: {
        module: {
            rules: [
                {
                    test: /\.pug$/,
                    loader: 'pug-plain-loader'
                },
                {
                    test: /\.scss$/,
                    use: ['sass-loader', {
                        loader: 'style-resources-loader',
                        options: {
                            patterns: [
                                './src/assets/style/*.scss',
                            ]
                        }
                    }]
                }
            ]
        }
    }
}