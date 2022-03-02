const modal = {
    data() {
        return {
            name: "Data to the component",
            num: 0,
            url: "",
            title: "",
            description: "",
            author: "",
            created_at: "",
        };
    },
    props: ["imageid"],
    mounted() {
        let queryURL = `/getImage?imageid=${this.imageid}`;
        fetch(queryURL)
            .then((resp) => resp.json())
            .then((data) => {
                console.log(data);
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
    </div>
    
    `,
};

export default modal;
