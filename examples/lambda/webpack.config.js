const path = require("path");

module.exports = {
    mode: "production",
    entry: "./src/index.ts",
    resolve: {
        extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
    },
    output: {
        libraryTarget: "commonjs",
        path: path.join(__dirname, "dist"),
        filename: "index.js",
    },
    target: "node",
    module: {
        rules: [
            {
                // Include ts, tsx, js, and jsx files.
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                use: 'ts-loader'
            },
        ],
    }
};
