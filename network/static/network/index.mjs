import Post from "./posts.mjs";

document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("#posts-view").appendChild(
        Post({
            title: "Title",
            content: "content",
            timestamp: "time",
            liked: true,
            likes: 10,
            comments: 7,
            id: 1,
            author: "Author",
        })
    );
    for (let i = 0; i < 100; i++) {
        document.querySelector("#posts-view").appendChild(
            Post({
                title: "Title",
                content: "content",
                timestamp: "time",
                liked: false,
                likes: 10,
                comments: 5,
                id: 1,
                author: "Author",
            })
        );
    }
});
