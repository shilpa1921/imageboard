console.log("shilpa");

(function () {
    Vue.component("first-component", {
        template: "#template",
        props: ["postTitle", "id"],
        mounted: function () {
            console.log("postTile: ", this.postTitle);
            console.log("id in mounted of my component: ", this.id);
            // we can now make a request to the server sending the id,
            // and asking for all the information about that id.
            var self = this;
            axios
                .post("/info", { id: this.id })
                .then(function (response) {
                    console.log("This is the response data: ", response.data);

                    self.arr = response.data.shift();
                    self.comments = response.data[0];

                    console.log(
                        "This is the response data: ",
                        response.data[0]
                    );
                })
                .catch(function (err) {
                    console.log("Error in POST /image-post: ", err);
                });
        },

        data: function () {
            return {
                arr: [],
                count: 0,
                username: "",
                comment: "",
                comments: [],
            };
        },
        methods: {
            closeModal: function () {
                console.log("i am emitting from the component... (child)");
                this.$emit("close");
            },

            ClickInComponent: function (e) {
                e.preventDefault();
                console.log("this", this);
                var self = this;
                axios
                    .post("/upload-comment", {
                        id: this.id,
                        username: this.username,
                        comment: this.comment,
                    })
                    .then(function (res) {
                        console.log("resp from post /upload-comment", res.data);
                        self.comments.unshift(res.data);
                    })
                    .catch((err) => {
                        console.log("err from post /upload-comment", err);
                    });
            },
        },
    });

    new Vue({
        el: "#main",
        data: {
            selectedImage: false,
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

            closeMe: function () {
                console.log("close me");
                this.selectedImage = false;
            },

            handleChange: function (e) {
                console.log("handle change running");
                console.log("file", e.target.files[0]);
                this.file = e.target.files[0];
            },
        },
    });
})();
