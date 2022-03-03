const comments = {
    data() {
        return {
            comments: [],
            comment: "",
            username: "",
            validityerror: false,
        };
    },
    props: ["pic_id"],
    mounted() {
        let queryURL = `/comments?imageid=${this.pic_id}`;
        fetch(queryURL)
            .then((resp) => resp.json())
            .then((resp) => {
                for (let i = 0; i < resp.length; i++) {
                    this.comments.unshift(resp[i]);
                }
            })
            .catch((e) => {
                console.log("Error fetching (client side) comments:  ", e);
            });
    },
    methods: {
        postcomment: function () {
            if (this.username && this.comment) {
                this.validityerror = false;
                fetch("/comments", {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                    body: JSON.stringify({
                        id: this.pic_id,
                        comment: this.comment,
                        username: this.username,
                    }),
                })
                    .then((resp) => resp.json())
                    .then((resp) => {
                        this.comments.unshift(resp);
                    });
            } else {
                this.validityerror = true;
            }
        },
    },
    template: `
    <div class="commentsContainer">
        <div class="inputsContainer">
            <form class="commentPostForm">
                <label for="comment" class="inputLabel">Comment: </label><input class="commentInput" type="text" name="comment" v-model="comment" id="comment">
                <label for="username" class="inputLabel">Username: </label><input class="commentInput" type="text" name="username" v-model="username" id="username">
                <button class="commentButton" @click.prevent.default="postcomment">Post</button>
            </form>    
        </div>

        <div v-if="comments"  class="commentsBox">
            <div v-for="item in comments">
                <div class="actualComment" >
                    <h1 class="comment" >{{item.comment}}</h1>
                    <div class="commentAuthorAndDate">
                        <h3 class="commentAuthor">{{item.username}}</h3>
                        <h3 class="commentDate">{{item.created_at}}</h3>
                    </div>
                </div>
            </div>
        </div>

    </div>
    `,
};

export default comments;
