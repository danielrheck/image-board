import * as Vue from "./vue.js";

//create vue app
const app = Vue.createApp({
    data() {
        return {
            title: "",
            description: "",
            username: "",
            file: null,
            images: [],
        };
    },
    updated() {},
    mounted: function () {
        fetch("/allImages")
            .then((resp) => resp.json())
            .then((data) => {
                this.images = data;
            })
            .catch((e) => {
                console.log("Error fetching images:  ", e);
            });
    },
    methods: {
        selectFile: function (e) {
            this.file = e.target.files[0];
            console.log("User selecteed file!  ", e.target.files[0]);
        },
        upload: function (e) {
            // cantjust send a json, because its a file
            // have to use formData to help
            const fd = new FormData();
            fd.append("file", this.file);
            fd.append("title", this.title);
            fd.append("username", this.username);
            fd.append("description", this.description);
            // for (let value of fd.values()) {
            //     console.log("Value:  ", value);
            // }
            // send it to the server
            fetch("/upload", {
                method: "POST",
                body: fd,
            })
                .then((resp) => resp.json())
                .then((resp) => {
                    this.images.unshift(resp);
                })
                .catch((e) => {
                    console.log("Error fetching/Upload:  ", e);
                });
        },
    },
});

// telling vview where to mount the app - Wherre to inject HTML into the DOM
app.mount("#main");
