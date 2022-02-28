import * as Vue from "./vue.js";

//create vue app
const app = Vue.createApp({
    data() {
        return {
            images: [],
        };
    },
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
    methods: {},
});

// telling vview where to mount the app - Wherre to inject HTML into the DOM
app.mount("#main");
