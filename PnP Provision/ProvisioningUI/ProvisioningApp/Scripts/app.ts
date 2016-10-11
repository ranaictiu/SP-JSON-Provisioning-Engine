require.config({
    baseUrl: "../scripts",
    paths: {
        "jQuery": "lib/jquery-1.9.1.min",
        "knockout": "lib/knockout-3.4.0"
    }, shim: {
        "jQuery": {
            exports: "$"
        }
    }
})