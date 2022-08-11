// Module for customized alerts
let Alert = (message) => {
    let alert = document.createElement("div");
    alert.className = "alert";
    alert.classList.add("alert-primary", "alert-dismissible");
    alert.setAttribute("role", "alert");

    let closeButton = document.createElement("span");
    closeButton.type = "button";
    closeButton.className = "btn-close";
    closeButton.setAttribute("data-bs-dismiss", "alert");
    closeButton.setAttribute("aria-label", "Close");

    let messageDiv = document.createElement("div");
    messageDiv.innerHTML = message;

    alert.appendChild(messageDiv);
    alert.appendChild(closeButton);

    return alert;
}

export default Alert;