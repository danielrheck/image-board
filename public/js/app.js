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
            imageId: location.pathname.slice(1),
            lowestId: null,
            lowestIdShowing: null,
            newImages: null,
            highestIdShowing: null,
            moreResults: false,
        };
    },
    updated() {},
    components: {
        modal: modal,
    },
    mounted: function () {
        window.addEventListener("popstate", (e) => {
            this.imageId = location.pathname.slice(1);
        });
        window.addEventListener("updateid", (e) => {
            this.updateid(e);
        });
        this.checkNewImages();
        this.fetchimages();
    },
    methods: {
        selectFile: function (e) {
            this.file = e.target.files[0];
        },
        close: function () {
            this.imageId = 0;
            history.pushState(null, null, "/");
        },
        updateid: function (e) {
            this.imageId = e;
            history.pushState(null, null, `/${this.imageId}`);
        },
        picdeleted: function () {
            this.imageId = 0;
            history.pushState(null, null, "/");
            this.images = [];
            this.fetchimages();
        },
        fetchimages: function () {
            fetch("/allImages")
                .then((resp) => resp.json())
                .then((data) => {
                    this.newImages = null;
                    this.images = data;
                    this.lowestIdShowing =
                        this.images[this.images.length - 1].id;
                    this.highestIdShowing = this.images[0].id;
                    this.lowestId = data[0].lowestId;
                    if (!(this.lowestId == this.lowestIdShowing)) {
                        this.moreResults = true;
                    } else {
                        this.moreResults = false;
                    }
                })
                .catch((e) => {
                    console.log("Error fetching images:  ", e);
                });
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
                    this.highestIdShowing = this.images[0].id;
                    this.lowestIdShowing =
                        this.images[this.images.length - 1].id;
                    if (!(this.lowestId == this.lowestIdShowing)) {
                        this.moreResults = true;
                    } else {
                        this.moreResults = false;
                    }
                });
        },
        infiniteScroll: function () {},
        checkNewImages: function () {
            setTimeout(() => {
                fetch(`/newImages?highestIdShowing=${this.highestIdShowing}`)
                    .then((resp) => resp.json())
                    .then((data) => {
                        if (data[0].count > 0) {
                            this.newImages = data[0].count;
                        }
                    });
                this.checkNewImages();
            }, 5000);
        },
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
                    this.highestIdShowing = resp.id;
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
