const setStatusClosed = (id) => {
    console.log(id);
    var issues = JSON.parse(localStorage.getItem("issues"));
    for (var i = 0; i < issues.length; i++) { if (issues[i].id === id) { issues[i].status = "Closed"; } }
    localStorage.setItem("issues", JSON.stringify(issues));
    fetchIssues();
}

const deleteIssue = (id) => {
    var issues = JSON.parse(localStorage.getItem("issues"));
    var newIssueList = [];
    for (var i = 0; i < issues.length; i++) { if (issues[i].id !== id) { newIssueList.push(issues[i]); } }
    localStorage.setItem("issues", JSON.stringify(newIssueList));
    fetchIssues();
}

const fetchIssues = () => {
    var issueList = JSON.parse(localStorage.getItem("issues"));
    var issueDisplayContainer = document.getElementById("container_issueDisplayCard_container");

    if ((issueList) && (issueList.length > 0)) {
        issueDisplayContainer.innerHTML = "";
        issueDisplayContainer.insertAdjacentHTML (
            "beforeend",
            `
                <h2 class="container_containerHeading accent text-center">Available Issues</h2>
                <div class="container_issueDisplayCard_cardsWrapper grid" id="container_issueDisplayCard_cardsWrapper"></div>
            `
        )

        for (var i = 0; i < issueList.length; i++) {
            var {
                id,
                url,
                status,
                title,
                description,
                severity,
                assignee
            } = issueList[i];

            var currentIssueId = issueList[i].id;
            var severityClass = "";

            switch (severity) {
                case "low": {
                    severityClass = "low-issue";
                    break;
                }
                case "medium": {
                    severityClass = "med-issue";
                    break;
                }
                case "difficult": {
                    severityClass = "hard-issue";
                    break;
                }
                case "sever": {
                    severityClass = "sever-issue";
                    break;
                }
            }

            var cardWrapper = document.getElementById("container_issueDisplayCard_cardsWrapper");
            cardWrapper.insertAdjacentHTML (
                "beforeend",
                `
                    <div class="container_issueDisplayCard col-span-2 flex flex-col justify-start align-start">
                        <span class="container_issueDisplayCard_issueID grid">
                            <p class="container_issueDisplayCard_issueID_idText">Issue ID:&nbsp;&nbsp;</p>
                            <a href=${(url) ? url : `#${id}`} target="_blank" rel="noopener noreferrer" class="container_issueDisplayCard_issueID_idLink">${id}</a>
                            <button class="btn ${(status === "Open") ? "btn--openissue" : "btn--closedissue"} relative container_issueDisplayCard_issueStatusBtn">${status}</button>
                        </span>
                        <h3 class="container_issueDisplayCard_issueTitle">${title}</h3>
                        <p class="container_issueDisplayCard_issueDescription flex-1">${description}</p>
                        <span class="container_issueDisplayCard_issueLevel ${severityClass} flex align-center">
                            <i class="container_issueDisplayCard_issueLevelMarker relative flex align-center justify-center"></i>
                            <p class="container_issueDisplayCard_issueLevelText">${severity}</p>
                        </span>
                        <span class="container_issueDisplayCard_issueAssignee flex align-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                <path d="M224 256c70.7 0 128-57.31 128-128s-57.3-128-128-128C153.3 0 96 57.31 96 128S153.3 256 224 256zM274.7 304H173.3C77.61 304 0 381.6 0 477.3c0 19.14 15.52 34.67 34.66 34.67h378.7C432.5 512 448 496.5 448 477.3C448 381.6 370.4 304 274.7 304z"/>
                            </svg>
                            <p class="container_issueDisplayCard_issueAssigneeText">${assignee}</p>
                        </span>
                        <span class="container_issueDisplayCard_issueControllBtnContainer flex">
                            <button class="btn btn--close container_issueDisplayCard_closeIssueBtn" id=${currentIssueId}>Close</button>
                            <button class="btn btn--delete container_issueDisplayCard_deleteIssueBtn" id=${currentIssueId}>Delete</button>
                        </span>
                    </div>
                `
            )

            var closeButtonList = document.querySelectorAll(".container_issueDisplayCard_closeIssueBtn");
            var deleteButtonList = document.querySelectorAll(".container_issueDisplayCard_deleteIssueBtn");
            for (var buttons of closeButtonList) { buttons.addEventListener ("click", (e) => setStatusClosed(e.target.id)); }
            for (var buttons of deleteButtonList) { buttons.addEventListener ("click", (e) => deleteIssue(e.target.id)); }
        }
    } else {
        issueDisplayContainer.innerHTML = "";
        issueDisplayContainer.insertAdjacentHTML (
            "beforeend", `<p class="container_containerHeading accent text-center">No Available Issues.</p>`
        )
    }
}

document.body.onload = fetchIssues();

const formElement = document.getElementById("form-body");
formElement.onsubmit = (e) => {
    e.preventDefault();
    var issueTitle = document.getElementById("title_input").value;
    var issueDescription = document.getElementById("description_input").value;
    var issueSeverity = document.getElementById("severity_input").value;
    var issueAssignee = document.getElementById("assignee_input").value;
    var issueLink = document.getElementById("url_input").value;

    var currentIssue = {
        id: chance.guid(),
        url: issueLink,
        status: "Open",
        title: issueTitle,
        description: issueDescription,
        severity: issueSeverity,
        assignee: issueAssignee
    }

    if (localStorage.getItem("issues")) {
        var issues = JSON.parse(localStorage.getItem("issues"));
        issues.push(currentIssue);
        localStorage.setItem("issues", JSON.stringify(issues));
    } else {
        var issues = [];
        issues.push(currentIssue);
        localStorage.setItem("issues", JSON.stringify(issues));
    }

    formElement.reset();
    fetchIssues();
}
