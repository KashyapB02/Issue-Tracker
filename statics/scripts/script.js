const user = JSON.parse(localStorage.getItem("user"))
if (window.location.pathname === "/dashboard.html") {
    if (!user || !user.verified)
        window.location.replace(`${window.location.origin}/auth/login.html`);
}

import { db } from './firebase.js'
import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    updateDoc,
    query,
    where
} from "https://www.gstatic.com/firebasejs/9.9.1/firebase-firestore.js";
import { successAlert, errorAlert, normalAlert } from "./alert.js";

const issueCollectionRef = collection(db, 'issues');
const userCollectionRef = collection(db, 'users');

const formSubmitModal = document.getElementById("main_formSubmitModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const issueHandlerIcons = document.querySelectorAll(".issueHandlerIcons");
const modalActionTextPara = document.getElementById("formSubmitModal_actiontext");
const issueAssignee = document.getElementById("issue_assignee");

if (issueAssignee) {
    const users = query(userCollectionRef, where("uid", "!=", user.uid))
    getDocs(users).then((snapshots) => {
        snapshots.docs.forEach((doc) => {
            const data = doc.data()
            issueAssignee.insertAdjacentHTML(
                "beforeend",
                `<option value=${data.uid}>${data.displayName}</option>`
            )
        })
    }).catch((error) => {
        console.error(error.code);
    })
}

const setModalOpen = () => {
    formSubmitModal.classList.add("modal--open");
    formSubmitModal.classList.remove("modal--closed");

    bodyElement.classList.remove("relative");
    bodyElement.classList.add("fixed");
}

const setStatusClosed = (id) => {
    const docRef = doc(db, 'issues', id);
    updateDoc(docRef, {
        status: "Closed"
    }).then(() => {
        (document.getElementById("closedIssue")).classList.add("active");
        modalActionTextPara.innerText = "Issue Closed Successfully!";
        modalActionTextPara.style.color = "hsl(var(--clr-closedissue))";

        setModalOpen();
        fetchIssues();
    }).catch((error) => {
        console.error(error.message);
    })
}

const deleteIssue = (id) => {
    const docRef = doc(db, 'issues', id);
    deleteDoc(docRef).then(() => {
        (document.getElementById("deletedIssue")).classList.add("active");
        modalActionTextPara.innerText = "Issue Deleted Successfully!";
        modalActionTextPara.style.color = "hsl(var(--clr-deletebtn))";

        setModalOpen();
        fetchIssues();
    }).catch ((error) => {
        console.error(error.message);
    })
}

const displayIssueList = (issueList) => {
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
    getDocs(issueCollectionRef).then((snapshot) => {
        var issueList = []
        snapshot.docs.forEach((doc) => {
            issueList.push({...doc.data(), docId: doc.id});
        });

        displayIssueList(issueList);
    }).catch((error) => {
        console.error(error.message);
    })
}

window.addEventListener("load", () => {
    fetchIssues();
    for (let icons of issueHandlerIcons) {
        if (icons.classList.contains("active")) {
            icons.classList.remove("active");
        }
    }
});

const bodyElement = document.getElementById("main")
const formElement = document.getElementById("form-body");
formElement.onsubmit = (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        errorAlert("Cannot create issue.\n User is currently logged out");

        const observer = new MutationObserver(function(mutationsList) {
            mutationsList.forEach(function(mutation) {
                mutation.removedNodes.forEach(function(removedNode) {
                    if(removedNode.id == 'dialogContainer') {
                        window.location.replace(`${window.location.origin}/auth/login.html`);
                        observer.disconnect();
                    }
                });
            });
        });
        observer.observe(document.body, { subtree: true, childList: true });

        return;
    }

    var issueTitle = document.getElementById("title_input").value;
    var issueDescription = document.getElementById("description_input").value;
    var issueSeverity = document.getElementById("severity_input").value;
    var issueAssignee = document.getElementById("issue_assignee").value;
    var issueLink = document.getElementById("url_input").value;

    var currentIssue = {
        id: chance.guid(),
        url: issueLink,
        status: "Open",
        title: issueTitle,
        description: issueDescription,
        severity: issueSeverity,
        assignee: issueAssignee,
        creator: user.uid,
    }

    addDoc(issueCollectionRef, currentIssue).then(() => {
        formElement.reset();

        (document.getElementById("addedIssue")).classList.add("active");
        modalActionTextPara.innerText = "Issue Added Successfully!";
        modalActionTextPara.style.color = "hsl(var(--clr-openissue))";

        setModalOpen();
        fetchIssues();
    }).catch((error) => {
        console.error(error.message);
    })
}

[formSubmitModal, closeModalBtn].forEach((element) => {
    element.onclick = function () {
        formSubmitModal.classList.remove("modal--open");
        formSubmitModal.classList.add("modal--closed");

        bodyElement.classList.add("relative");
        bodyElement.classList.remove("fixed");

        for (let icons of issueHandlerIcons) {
            if (icons.classList.contains("active")) {
                icons.classList.remove("active");
            }
        }
    }
})
