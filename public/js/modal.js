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
        fetch(queryURL)
            .then((resp) => resp.json())
            .then((data) => {
                this.url = data.url;
                this.title = data.title;
                this.description = data.description;
                this.author = data.username;
                this.created_at = data.created_at;
            })
            .catch((e) => {
                console.log("Fetch Failed:  ", e);
            });
    },
    methods: {
        closeModal: function () {
            this.$emit("closeclicked");
        },
    },
    template: `
    <div class="modalContainer" >
        <p class="closeModalButton" @click="closeModal">X</p>
        <img class="modalImage" :src="url" alt="macaco">
        <div class="modalImageName">{{title}}</div>
        <div class="modalImageDescription">{{description}}</div>
        <div class="modalImageAuthorAndDate">{{author}} at {{created_at}}</div>
        <comments v-if="pic_id" :pic_id="pic_id"></comments>
    </div>
    
    
    `,
};

export default modal;
