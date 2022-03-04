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
        fetch(queryURL)
            .then((resp) => resp.json())
            .then((data) => {
                if (data[0]) {
                    console.log("DATA.URL");
                    this.url = data[0].url;
                    this.title = data[0].title;
                    this.description = data[0].description;
                    this.author = data[0].username;
                    let date = new Date(data[0].created_at);
                    data[0].created_at = date.toLocaleDateString("en-GB");
                    this.created_at = data[0].created_at;
                } else {
                    history.replaceState(null, null, "/");
                    this.$emit("closeclicked");
                }
            })
            .catch((e) => {
                console.log("Fetch Failed:  ", e);
            });
    },
    methods: {
        closeModal: function () {
            this.$emit("closeclicked");
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
    template: `
    <div class="modalContainer" >
        <p class="closeModalButton" @click="closeModal">X</p>
        <img class="modalImage" :src="url" alt="macaco">
        <div class="deletePic" @click="deletepic">Delete Pic</div>
        <div class="modalImageName">{{title}}</div>
        <div class="modalImageDescription">{{description}}</div>
        <div class="modalImageAuthorAndDate">{{author}} at {{created_at}}</div>
        <comments v-if="pic_id" :pic_id="pic_id"></comments>
    </div>
    
    
    `,
};

export default modal;
