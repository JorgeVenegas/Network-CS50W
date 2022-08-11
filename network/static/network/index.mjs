import Alert from "./alert.mjs";
import PostPH from "./posts-ph.mjs";
import Post from "./posts.mjs";

// Current user gloabl variables
let isLoggedIn = false, currentUser = "";

// Do when DOM loaded
document.addEventListener("DOMContentLoaded", function () {

    // Check if user is authenticated
    currentUser = document.querySelector("#current-user").innerHTML;
    isLoggedIn = typeof (currentUser) != 'undefined' && currentUser != null && currentUser != ""
    // If logged in add event listeners to nav elemts
    if (isLoggedIn) {
        document.querySelector("#nav-username").addEventListener('click', (event) => {
            load_page('profile')(event.target.innerHTML);
        })

        document.querySelector("#nav-following").addEventListener('click', () => {
            load_page('following');
        })
    }
    document.querySelector("#nav-feed").addEventListener('click', () => {
        load_page('feed');
    })

    // Set pagination button event listeners if enabled
    let prev_page = document.querySelector("#previous-page")
    prev_page.addEventListener('click', () => {
        if (prev_page.classList.contains('disabled')) {
            return
        }
        load_posts(prev_page.dataset.key, prev_page.dataset.page)
    })
    let next_page = document.querySelector("#next-page")
    next_page.addEventListener('click', () => {
        if (next_page.classList.contains('disabled')) {
            return
        }
        load_posts(next_page.dataset.key, next_page.dataset.page)
    })

    // Handle post edit form submission without page reloading
    let editPostForm = document.querySelector("#edit-post-form")
    editPostForm.addEventListener('submit', (e) => {
        e.preventDefault()
        fetch(`edit/${editPostForm.dataset.id}`, {
            credentials: "include",
            method: "POST",
            body: JSON.stringify({
                content: document.querySelector('#edit-post-textarea').value
            })
        }).then(response => console.log(response))
            .then(load_page('profile')(currentUser))
    })

    // Load feed page always first
    load_page("feed");
})

/***
 Handle page loading
 @param key clue for page to render (feed, following, username)
 @param page index of posts page to render
 */
function load_posts(key, page = 1) {
    // Set posts content to nothing to populate later
    document.querySelector("#posts-view").innerHTML = ``
    for (let i = 0; i < 10; i++) {
        document.querySelector("#posts-view").appendChild(PostPH())
    }

    // Request posts to server
    fetch(`/posts/${key}/${page}`) // Get the latest 10 posts and render them
        .then(response => response.json())
        .then(data => {
            console.log(data)
            document.querySelector("#posts-view").innerHTML = ""
            for (let postInfo of data.posts) {
                document.querySelector("#posts-view").appendChild(Post(postInfo));
            }

            // Render pagination helpers
            if (data.page.number) {
                document.querySelector("#current-page").innerHTML = data.page.number;
            }
            else {
                document.querySelector("#posts-pagnation").classXList.add("visually-hidden")
            }
            if (data.page.has_previous) {
                let prev_page = document.querySelector("#previous-page");
                prev_page.classList.remove("disabled")
                prev_page.setAttribute("data-key", key)
                prev_page.setAttribute("data-page", data.page.number - 1)
            }
            else {
                document.querySelector("#previous-page").classList.add("disabled")
            }
            if (data.page.has_next) {
                let next_page = document.querySelector("#next-page")
                next_page.classList.remove("disabled")
                next_page.setAttribute("data-key", key)
                next_page.setAttribute("data-page", data.page.number + 1)
            }
            else {
                document.querySelector("#next-page").classList.add("disabled")
            }
        })
}

/***
 Handle page loading
 @param page clue for page to render (feed, following, profile)
 */
export function load_page(page) {
    // Set elements to nothing to populate later.
    let title = document.querySelector("#h1-title");
    title.innerHTML = "";
    let header = document.querySelector("#header");
    header.innerHTML = "";
    let posts = document.querySelector("#posts-view");
    posts.innerHTML = "";

    switch (page) {
        case "profile":
            // Curried function to render profile given its username
            return function load_profile(username) {
                // Get specified profile information to render
                fetch(`/profile/${username}`)
                    .then(response => response.json())
                    .then(user => {
                        let ableToFollow = isLoggedIn && user.username != currentUser;
                        let colSpace = ableToFollow ? 4 : 6;
                        title.innerHTML = user.first_name;
                        let stats = `<span class='link-secondary'>@${user.username}</span>
                        <hr>
                        <div class="row mb-3">
                            <div class="col-${colSpace}">
                                <strong>Followers:</strong> <span id='following-count'>${user.followers_count}</span>
                            </div>
                            <div class="col-${colSpace}">
                                <strong>Following:</strong> ${user.following_count}
                            </div>`
                        if (isLoggedIn && user.username != currentUser) {
                            stats += `<div class="col-${colSpace}">
                            <form id='profile-follow-form'>
                            <button id='profile-follow-btn' type="submit" class="btn btn-outline-primary btn-sm">${user.is_followed ? "Unfollow" : "Follow"}</button>
                            </form>
                            </div>`;
                        }
                        stats += `</div>`;
                        header.innerHTML = stats;

                        // If user is authenticated allow to follow
                        if (isLoggedIn && user.username != currentUser) {
                            document.querySelector("#profile-follow-form").addEventListener('submit', (e) => {
                                e.preventDefault();
                                fetch(`/handle_follow`, {
                                    credentials: "include",
                                    method: "POST",
                                    body: JSON.stringify({
                                        profile_username: user.username
                                    })
                                }).then(response => response.json())
                                    .then((info) => {
                                        console.log(info)
                                        document.querySelector("#profile-follow-btn").innerHTML = info.followed ? "Unfollow" : "Follow";
                                        document.querySelector("#following-count").innerHTML = info.follow_count;
                                    })
                            })
                        }
                    })
                load_posts(username)
                window.scrollTo(0, 0)
            }
        case "feed":
            title.innerHTML = "All posts";
            header.innerHTML = `<div class="card text-bg-light border-light mb-5">
                <div id='new-post-card-body' class="card-body">
                    <h3 class="card-title">New Post</h3>
                    <textarea class="form-control mb-3" name="new-post" id="new-post-content" rows="5"></textarea>
                    <button class="btn btn-primary mb-3" id="add-new-post">Post</button>
                    <div id='new-post-alert'></div>
                </div>
            </div>`;
            load_posts('feed')
            window.scrollTo(0, 0)

            document.querySelector("#add-new-post").addEventListener("click", () => {
                document.querySelector("#new-post-alert").innerHTML = ""
                let content = document.querySelector("#new-post-content").value;
                console.log(content)
                if (content != "") {
                    fetch("new/post", {
                        credentials: "include",
                        method: "POST",
                        body: JSON.stringify({
                            "content": content
                        })
                    }).then(response => response.json())
                        .then(info => {
                            document.querySelector("#new-post-alert").appendChild(Alert(info.message))
                            document.querySelector("#new-post-content").value = "";
                            load_posts('feed')
                        })
                } else {
                    document.querySelector("#new-post-alert").appendChild(Alert("You must write something to post it!"))
                }
            })
            break;
        case "following":
            document.querySelector("#h1-title").innerHTML = "Following";
            load_posts("following")
            window.scrollTo(0, 0)
            break;
        default:
            break;
    }
}