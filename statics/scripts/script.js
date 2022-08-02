import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBxKKkdHnrJwmF2xLd0n4xvJLZiigf450Y",
    authDomain: "javascript-issue-tracker.firebaseapp.com",
    projectId: "javascript-issue-tracker",
    storageBucket: "javascript-issue-tracker.appspot.com",
    messagingSenderId: "737088544776",
    appId: "1:737088544776:web:824452d708139805bb71bd"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();
const collectionRef = collection(db, 'issues');


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

const displayIssueList = (issueList) => {
    console.log(issueList);
    var issueDisplayContainer = document.getElementById("container_issueDisplayCard_container");

    if ((issueList) && (issueList.length > 0)) {
        issueDisplayContainer.innerHTML = "";
        issueDisplayContainer.insertAdjacentHTML(
            "beforeend",
            `
                <h2 class="container_containerHeading accent text-center">Available Issues</h2>
                <div class="container_issueDisplayCard_cardsWrapper grid" id="container_issueDisplayCard_cardsWrapper"></div>
            `
        )

        for (var i = 0; i < issueList.length; i++) {
            var issue = issueList[i];
            var severityClass = "";

            switch (issue.severity) {
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
            cardWrapper.insertAdjacentHTML(
                "beforeend",
                `
                    <div class="container_issueDisplayCard col-span-2 flex flex-col justify-start align-start">
                        <span class="container_issueDisplayCard_issueID grid">
                            <p class="container_issueDisplayCard_issueID_idText">Issue ID:&nbsp;&nbsp;</p>
                            <a href=${(issue.url) ? issue.url : `#${issue.id}`} target="_blank" rel="noopener noreferrer" class="container_issueDisplayCard_issueID_idLink">${issue.id}</a>
                            <button class="btn ${(issue.status === "Open") ? "btn--openissue" : "btn--closedissue"} relative container_issueDisplayCard_issueStatusBtn">${issue.status}</button>
                        </span>
                        <h3 class="container_issueDisplayCard_issueTitle">${issue.title}</h3>
                        <p class="container_issueDisplayCard_issueDescription flex-1">${issue.description}</p>
                        <span class="container_issueDisplayCard_issueLevel ${severityClass} flex align-center">
                            <i class="container_issueDisplayCard_issueLevelMarker relative flex align-center justify-center"></i>
                            <p class="container_issueDisplayCard_issueLevelText">${issue.severity}</p>
                        </span>
                        <span class="container_issueDisplayCard_issueAssignee flex align-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                <path d="M224 256c70.7 0 128-57.31 128-128s-57.3-128-128-128C153.3 0 96 57.31 96 128S153.3 256 224 256zM274.7 304H173.3C77.61 304 0 381.6 0 477.3c0 19.14 15.52 34.67 34.66 34.67h378.7C432.5 512 448 496.5 448 477.3C448 381.6 370.4 304 274.7 304z"/>
                            </svg>
                            <p class="container_issueDisplayCard_issueAssigneeText">${issue.assignee}</p>
                        </span>
                        <span class="container_issueDisplayCard_issueControllBtnContainer flex">
                            <button class="btn btn--close container_issueDisplayCard_closeIssueBtn" id=${issue.docId}>Close</button>
                            <button class="btn btn--delete container_issueDisplayCard_deleteIssueBtn" id=${issue.docId}>Delete</button>
                        </span>
                    </div>
                `
            )

            var closeButtonList = document.querySelectorAll(".container_issueDisplayCard_closeIssueBtn");
            var deleteButtonList = document.querySelectorAll(".container_issueDisplayCard_deleteIssueBtn");
            for (var buttons of closeButtonList) { buttons.addEventListener("click", (e) => setStatusClosed(e.target.id)); }
            for (var buttons of deleteButtonList) { buttons.addEventListener("click", (e) => deleteIssue(e.target.id)); }
        }
    } else {
        issueDisplayContainer.innerHTML = "";
        issueDisplayContainer.insertAdjacentHTML(
            "beforeend", `<p class="container_containerHeading accent text-center">No Available Issues.</p>`
        )
    }
}

const fetchIssues = () => {
    getDocs(collectionRef).then((snapshot) => {
        var issueList = []
        snapshot.docs.forEach((doc) => {
            issueList.push({...doc.data(), docId: doc.id});
        });

        displayIssueList(issueList);
    }).catch((error) => {
        console.error(error.message);
    })
}

document.body.onload = fetchIssues();

const bodyElement = document.getElementById("main")
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

    addDoc(collectionRef, currentIssue).then(() => {
        formElement.reset();

        formSubmitModal.classList.add("modal--open");
        formSubmitModal.classList.remove("modal--closed");

        bodyElement.classList.remove("relative");
        bodyElement.classList.add("fixed");

        fetchIssues();
    }).catch((error) => {
        console.error(error.message);
    })
}

const formSubmitModal = document.getElementById("main_formSubmitModal");
const closeModalBtn = document.getElementById("closeModalBtn");

formSubmitModal.onclick = function () {
    formSubmitModal.classList.remove("modal--open");
    formSubmitModal.classList.add("modal--closed");

    bodyElement.classList.add("relative");
    bodyElement.classList.remove("fixed");
}

closeModalBtn.onclick = function () {
    formSubmitModal.classList.remove("modal--open");
    formSubmitModal.classList.add("modal--closed");

    bodyElement.classList.add("relative");
    bodyElement.classList.remove("fixed");
}