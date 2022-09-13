function alert (message, svg, alertType) {
    let ativeTimeout, start, remaining;

    const dialog = `<div class="dialog fixed flex flex-col" id="dialog"></div>`
    if (!document.getElementById("dialog"))
        document.body.insertAdjacentHTML("beforeend", dialog);

    const dialogDiv = document.getElementById("dialog")
    if (dialogDiv.childElementCount) {
        dialogDiv.removeChild(dialogDiv.lastChild)

        if (ativeTimeout)
            clearTimeout(ativeTimeout);
    }

    const dialogContainer = `
        <div class="dialogContainer dialogActive relative" id="dialogContainer">
            <div class="dialogContent flex flex-col align-start">
                <span class="dialogTypeIcon ${alertType}">${svg}</span>
                <p class="dialogMsg">${message}</p>
            </div>
            <span class="dialogeCloseBtn absolute" id="dialogeCloseBtn" title="Close"><p></p></span>
        </div>
    `

    dialogDiv.insertAdjacentHTML("beforeend", dialogContainer);
    const dialogContainerDivList = document.querySelectorAll("#dialogContainer");
    const dialogContainerDiv = [...dialogContainerDivList].pop();

    function handleAlert () {
        dialogContainerDiv.classList.remove("dialogActive");
        dialogContainerDiv.classList.add("dialogClose");

        setTimeout(function () {
            (dialogContainerDiv.parentNode).removeChild(dialogContainerDiv);
        }, 200);
    }

    const activateTimeout = (timer) => {
        ativeTimeout = setTimeout(handleAlert, timer);
        start = Date.now();
    }

    const dialogeCloseBtnList = document.querySelectorAll("#dialogeCloseBtn");
    const dialogeCloseBtn = [...dialogeCloseBtnList].pop();
    dialogeCloseBtn.onclick = function () { handleAlert(); }

    activateTimeout(5000);

    dialogContainerDiv.onclick = function () { clearTimeout(ativeTimeout); }
    if (window.matchMedia("(any-hover: hover)").matches || window.matchMedia("(hover: hover)").matches) {
        dialogContainerDiv.onmouseover = function () { clearTimeout(ativeTimeout); }
        dialogContainerDiv.onmouseleave = function () { 
            remaining = (5000 - (Date.now() - start));
            if (!(remaining > 0))
                handleAlert();
            else
                activateTimeout(remaining);
        }
    }
}

export const successAlert = (message) => {
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
        </svg>
    `

    alert(message, svg, "successAlert");
}

export const errorAlert = (message) => {
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/>
        </svg>
    `

    alert(message, svg, "errorAlert");
}

export const normalAlert = (message) => {
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zm32 224c0 17.7-14.3 32-32 32s-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32z"/>
        </svg>
    `

    alert(message, svg, "normalAlert");
}