import * as Vue from "./vue.js";
import modal from "./modal.js";

//create vue app
const app = Vue.createApp({
    data() {
        return {
            title: "",
            description: "",
            username: "",
            file: null,
            images: [],
            imageId: 0,
            lowestId: null,
            lowestIdShowing: null,
            moreResults: true,
        };
    },
    updated() {},
    components: {
        modal: modal,
    },
    mounted: function () {
        fetch("/allImages")
            .then((resp) => resp.json())
            .then((data) => {
                this.images = data;
                this.lowestIdShowing = this.images[this.images.length - 1].id;
                this.lowestId = data[0].lowestId;
                if (this.lowestId == this.lowestIdShowing) {
                    this.moreResults = false;
                }
            })
            .catch((e) => {
                console.log("Error fetching images:  ", e);
            });
    },
    methods: {
        selectFile: function (e) {
            this.file = e.target.files[0];
        },
        close: function () {
            this.imageId = 0;
        },
        changeId: function (e) {
            this.imageId = e.target.id;
        },
        getMoreImages: function () {
            this.lowestIdShowing = this.images[this.images.length - 1].id;
            let queryURL = `/more?lowestid=${this.lowestIdShowing}`;
            fetch(queryURL)
                .then((resp) => resp.json())
                .then((data) => {
                    this.lowestId = data[0].lowestId;
                    for (let i = 0; i < data.length; i++) {
                        this.images.push(data[i]);
                    }
                    this.lowestIdShowing =
                        this.images[this.images.length - 1].id;
                    if (this.lowestId == this.lowestIdShowing) {
                        this.moreResults = false;
                    }
                });
        },
        infiniteScroll: function () {},
        upload: function () {
            const fd = new FormData();
            fd.append("file", this.file);
            fd.append("title", this.title);
            fd.append("username", this.username);
            fd.append("description", this.description);
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
