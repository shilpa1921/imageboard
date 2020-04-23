console.log("shilpa");

(function () {
    new Vue({
        el: "#main",
        data: {
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
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
            handleClick: function (e) {
                e.preventDefault();
                console.log("this", this);

                var formData = new FormData();

                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);
                var self = this;
                axios
                    .post("/upload", formData)
                    .then(function (res) {
                        console.log("resp from post /upload", res.data);
                        self.images.unshift(res.data);
                    })
                    .catch((err) => {
                        console.log("err from post /upload", err);
                    });
            },
            handleChange: function (e) {
                console.log("handle change running");
                console.log("file", e.target.files[0]);
                this.file = e.target.files[0];
            },
        },
    });
})();
