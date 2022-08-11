import { load_page } from "./index.mjs"

let Post = (props) => {
    // CURRENT USER
    let user = document.querySelector("#current-user").innerHTML;
    let isLoggedIn = typeof (user) != 'undefined' && user != null && user != "";

    // POST
    let post = document.createElement("div");
    post.classList.add("card", "text-bg-light", "border-light", "mb-3", 'post');

    // BODY
    let postBody = document.createElement("div");
    postBody.classList.add("card-body");

    // AUTHOR
    let postAuthor = document.createElement("span");
    postAuthor.classList.add('a-author', 'link-dark')
    postAuthor.addEventListener('click', () => {
        load_page('profile')(props.username)
    })

    let postAuthorSub = document.createElement("strong");
    postAuthorSub.innerHTML = props.author;

    postAuthor.appendChild(postAuthorSub)

    // DETAILS
    let postDetails = document.createTextNode(` @${props.username} • ${props.timestamp}`);

    // INFO
    let postInfo = document.createElement("div");
    postInfo.appendChild(postAuthor)
    postInfo.appendChild(postDetails)

    // HEADER
    let postHeader = document.createElement("div");
    postHeader.classList.add('d-flex', 'justify-content-between');
    postHeader.setAttribute("id", "post-header")
    postHeader.appendChild(postInfo);

    // EDIT
    if (props.username === user) {
        let postEdit = document.createElement('button');
        postEdit.setAttribute('id', 'post-edit')
        postEdit.setAttribute('type', 'button')
        postEdit.setAttribute('data-bs-toggle', 'modal');
        postEdit.setAttribute('data-bs-target', '#editPostModal');
        postEdit.classList.add('btn', 'btn-sm', 'btn-outline-primary');
        postEdit.innerHTML = 'Edit';
        postHeader.appendChild(postEdit);



        postEdit.addEventListener('click', () => {
            document.querySelector("#editPostModalLabel").innerHTML = `Editing your post`;

            let modalBodyPost = document.querySelector("#editPostModalBodyPost")
            modalBodyPost.innerHTML = '';

            let modalBodyEdit = document.querySelector("#editPostModalBodyInput")
            modalBodyEdit.innerHTML = '';

            let editPostForm = document.querySelector("#edit-post-form")
            editPostForm.setAttribute('data-id', props.id)

            let postClone = post.cloneNode(true);
            modalBodyPost.appendChild(postClone);
            let postBodyClone = postClone.querySelector('.card-body');
            let postStatsClone = postClone.querySelector('#post-stats');
            let postHeaderClone = postClone.querySelector('#post-header');
            let postEditClone = postHeaderClone.querySelector('#post-edit');
            postClone.classList.remove('post');
            postBodyClone.removeChild(postStatsClone); // Delete post stats
            postHeaderClone.removeChild(postEditClone); // Delete post stats

            let editInput = document.createElement("textarea");
            editInput.classList.add('form-control');
            editInput.setAttribute('id', 'edit-post-textarea');
            editInput.setAttribute('placeholder', 'Write your reply');

            fetch(`/edit/${props.id}`)
                .then(response => response.json())
                .then(post => {
                    editInput.value = post.content
                })


            modalBodyEdit.appendChild(editInput);
        })
    }

    // CONTENT
    let postContent = document.createElement("div");
    postContent.innerHTML = props.content;

    postBody.appendChild(postHeader);
    postBody.appendChild(postContent);

    if (isLoggedIn) {

        // LIKES
        let postLikes = document.createElement("div");
        postLikes.classList.add("me-2", "post-stats");

        // Render likes with default info
        if (props.likes.includes(user)) {
            postLikes.innerHTML =
                "<svg class='me-1 liked'xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-heart-fill' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z'/></svg>";
            postLikes.classList.remove("unliked")
            postLikes.classList.add("liked")
        } else {
            postLikes.innerHTML =
                "<svg class='me-1 unliked' xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-heart' viewBox='0 0 16 16'><path d='m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z' /></svg>";
            postLikes.classList.remove("liked")
            postLikes.classList.add("unliked")
        }
        postLikes.innerHTML += props.likes_count;

        let rerenderLikes = (liked, likes_count) => {
            console.log(liked)
            if (liked === true) {
                postLikes.innerHTML =
                    "<svg class='me-1 liked'xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-heart-fill' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z'/></svg>";
                postLikes.classList.remove("unliked")
                postLikes.classList.add("liked")
            } else {
                postLikes.innerHTML =
                    "<svg class='me-1 unliked' xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-heart' viewBox='0 0 16 16'><path d='m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z' /></svg>";
                postLikes.classList.remove("liked")
                postLikes.classList.add("unliked")
            }
            postLikes.innerHTML += likes_count;
        }

        // Handle like and dislike
        postLikes.addEventListener('click', () => {
            fetch(`/handle_like`, {
                credentials: "include",
                method: "POST",
                body: JSON.stringify({
                    post_id: props.id
                })
            })
                .then(response => response.json())
                .then(postInfo => {
                    console.log(postInfo)
                    rerenderLikes(postInfo.liked, postInfo.likes_count)
                })
        })
        /*
        // COMMENTS
        let postComments = document.createElement("div");
        postComments.classList.add("me-2", "post-stats", "reply");
        postComments.setAttribute('data-bs-toggle', 'modal');
        postComments.setAttribute('data-bs-target', '#replyPostModal');
        postComments.innerHTML =
            "<svg class='me-1' xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chat' viewBox='0 0 16 16'><path d='M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z'/></svg>";
        postComments.innerHTML += props.comments_count;

        // Handle post reply
        postComments.addEventListener('click', () => {
            // Reset card content
            document.querySelector("#commentPostModalLabel").innerHTML = `Replying to ${props.author}`;
            let modalBodyPost = document.querySelector("#commentPostModalBodyPost")
            modalBodyPost.innerHTML = '';

            let modalBodyReply = document.querySelector("#commentPostModalBodyReply")
            modalBodyReply.innerHTML = '';

            // Clone card elements
            let postClone = post.cloneNode(true);
            modalBodyPost.appendChild(postClone);
            let postBodyClone = postClone.querySelector('.card-body');
            let postStatsClone = postClone.querySelector('#post-stats');
            postClone.classList.remove('post');
            postBodyClone.removeChild(postStatsClone); // Delete post stats

            let replyInput = document.createElement("textarea");
            replyInput.classList.add('form-control');
            replyInput.setAttribute('placeholder', 'Write your reply');

            modalBodyReply.appendChild(replyInput);
        })
        */

        // STATS
        let postStats = document.createElement("div");
        postStats.classList.add("d-flex");
        postStats.setAttribute('id', 'post-stats')
        postStats.appendChild(postLikes);
        // postStats.appendChild(postComments);
        postBody.appendChild(postStats);
    }

    post.appendChild(postBody);

    return post;
};

export default Post;
