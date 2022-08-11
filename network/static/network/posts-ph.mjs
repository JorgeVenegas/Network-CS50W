// Module for post placeholder
let PostPH = () => {

    // POST
    let post = document.createElement("div");
    post.classList.add("card", "text-bg-light", "border-light", "mb-3", 'post', "placeholder-glow");

    // BODY
    let postBody = document.createElement("div");
    postBody.classList.add("card-body");

    // INFO
    let postInfo = document.createElement("span");
    postInfo.classList.add('placeholder', 'placeholder-xs', "col-6")

    // HEADER
    let postHeader = document.createElement("div");
    postHeader.classList.add('d-flex', 'justify-content-between');
    postHeader.appendChild(postInfo);

    // EDIT
    let postEdit = document.createElement('button');
    postEdit.setAttribute('type', 'button')
    postEdit.classList.add('btn', 'btn-sm', 'btn-primary', "placeholder", "col-1", "disabled");
    postHeader.appendChild(postEdit);

    // CONTENT
    let postContent = document.createElement("div");
    postContent.innerHTML = `<span class="placeholder bg-secondary col-7 placeholder"></span>
    <span class="placeholder bg-secondary col-4 placeholder"></span>
    <span class="placeholder bg-secondary col-5 placeholder"></span>
    <span class="placeholder bg-secondary col-3 placeholder"></span>`

    postBody.appendChild(postHeader);
    postBody.appendChild(postContent);

    post.appendChild(postBody);

    return post;
};

export default PostPH;
