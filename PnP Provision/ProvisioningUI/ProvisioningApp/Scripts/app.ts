require.config({
    baseUrl: "",
    paths: {
        "jQuery": "lib/jquery-1.9.1.min.js",
        "knockout": "lib/knockout-3.4.0.js"
    }, shim: {
        "jQuery": {
            exports: "$"
        }
    }
})