console.log("shilpa");

(function () {
    new Vue({
        el: "#main",
        data: {
            name: "msg",
            seen: true,
            images: [],
        },
        mounted: function () {
            var self = this;
            axios.get("/images").then(function (response) {
                console.log("response from /images: ", response.data);
                // console.log('this INSIDE axios: ', self);

                self.images = response.data;
            });
        },
        methods: {
            myFunction: function () {
                console.log("myFunction is running!");
            },
        },
    });
})();
