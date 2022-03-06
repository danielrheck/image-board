import comments from "./comments.js";

const modal = {
    data() {
        return {
            url: "",
            title: "",
            description: "",
            author: "",
            created_at: "",
            pic_id: 0,
            previous: null,
            next: null,
            deleteConfirmation: false,
        };
    },
    props: ["imageid"],
    components: {
        comments: comments,
    },
    mounted() {
        let queryURL = `/getImage?imageid=${this.imageid}`;
        this.pic_id = this.imageid;
        history.pushState(null, null, `/${this.pic_id}`);
        this.fetchimage(queryURL);
    },
    methods: {
        closeModal: function () {
            this.$emit("closeclicked");
        },
        fetchimage: function (queryURL) {
            fetch(queryURL)
                .then((resp) => resp.json())
                .then((data) => {
                    if (data[0]) {
                        console.log("DATA.URL");
                        this.url = data[0].url;
                        this.title = data[0].title;
                        this.description = data[0].description;
                        this.author = data[0].username;
                        this.author = data[0].username;
                        let date = new Date(data[0].created_at);
                        data[0].created_at = date.toLocaleDateString("en-GB");
                        this.created_at = data[0].created_at;
                        this.previous = data[0].previous;
                        this.next = data[0].next;
                    } else {
                        history.replaceState(null, null, "/");
                        this.$emit("closeclicked");
                    }
                })
                .catch((e) => {
                    console.log("Fetch Failed:  ", e);
                });
        },
        nextpic: function () {
            this.$emit("updateid", this.next);
        },
        previouspic: function () {
            this.$emit("updateid", this.previous);
        },
        openConfirmation: function () {
            this.deleteConfirmation = true;
        },
        closeConfirmation: function () {
            this.deleteConfirmation = false;
        },
        deletepic: function () {
            let url = this.url;
            let id = this.pic_id;
            let filename = url.substring(url.lastIndexOf("/") + 1);
            let fetchURL = `/delete?imageid=${id}&filename=${filename}`;
            fetch(fetchURL, { method: "DELETE" }).then(() => {
                this.$emit("picdeleted");
            });
        },
    },
    watch: {
        imageid: function () {
            this.pic_id = this.imageid;
            let queryURL = `/getImage?imageid=${this.pic_id}`;
            this.fetchimage(queryURL);
        },
    },
    template: `
    <div class="modalContainer"  >
            <div class="modalSemiContainer" >
        <p class="closeModalButton" @click="closeModal">X</p>
        <img class="modalImage" :src="url" alt="macaco">
        
        <div class="next" v-if="next" @click="nextpic"> ◁ </div>
        <div class="previous" v-if="previous" @click="previouspic"> ▷ </div>
        <div class="modalImageName">{{title}}</div>
        <div class="modalImageDescription">{{description}}</div>
        <div class="modalImageAuthorAndDate">{{author}} at {{created_at}}</div>
        <comments v-if="pic_id" :pic_id="pic_id"></comments>
        <div class="deletePic" @click="openConfirmation">Delete Pic</div>

        <div v-if="deleteConfirmation" class="deleteConfirmationContainer">
            <h3 class="deleteConfirmationText">Are you sure you want to delete this pic?</h3>
            <h4 class="deleteAnswer" @click="deletepic">Yes</h4>
            <h4 class="deleteAnswer" @click="closeConfirmation">No</h4>
        </div>

        </div>
    </div>
    
    
    `,
};

export default modal;
