(() => {
    function collectPageData() {
        const pageData = {
            title: document.title,
            url: window.location.href,
            html: document.body.outerHTML // Only collect content inside <body>
        };

        chrome.storage.local.set({ pageData }, () => {
            console.log("Page data stored, injecting notification.");
            injectNotification();
        });
    }

    function injectNotification() {
        if (document.getElementById("extension-notification")) return; // Avoid duplicates

        const notification = document.createElement("div");
        notification.id = "extension-notification";
        notification.innerHTML = `
            <p>Page Data is Ready!</p>
            <div style="display: flex; justify-content: space-between; gap: 5px;">
                <button id="open-extension">View Data</button>
                <button id="close-notification">Close</button>
            </div>
        `;

        Object.assign(notification.style, {
            position: "fixed",
            top: "10px",
            right: "10px",
            backgroundColor: "white",
            border: "1px solid #ccc",
            padding: "10px",
            zIndex: "9999",
            boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
            fontSize: "14px",
            borderRadius: "5px"
        });

        document.body.appendChild(notification);

        document.getElementById("open-extension").addEventListener("click", () => {
            notification.remove();
            showDataPanel();
        });

        document.getElementById("close-notification").addEventListener("click", () => {
            notification.remove();
        });
    }

    function showDataPanel() {
        if (document.getElementById("extension-data-panel")) return;

        const panel = document.createElement("div");
        panel.id = "extension-data-panel";
        panel.innerHTML = `
            <div id="panel-header">
                <strong>Page Data</strong>
                <button id="close-panel">✖</button>
            </div>
            <p id="page-title">Loading...</p>
            <p id="page-url">Loading...</p>
            <textarea id="page-html" readonly></textarea>
        `;

        Object.assign(panel.style, {
            position: "fixed",
            top: "50px",
            right: "10px",
            width: "400px",
            height: "300px",
            backgroundColor: "white",
            border: "1px solid #ccc",
            padding: "10px",
            zIndex: "9999",
            boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
            fontSize: "14px",
            borderRadius: "5px",
            display: "flex",
            flexDirection: "column"
        });

        const closeButton = panel.querySelector("#close-panel");
        Object.assign(closeButton.style, {
            float: "right",
            cursor: "pointer",
            border: "none",
            background: "none",
            fontSize: "16px"
        });

        document.body.appendChild(panel);

        closeButton.addEventListener("click", () => {
            panel.remove();
        });

        chrome.storage.local.get("pageData", (data) => {
            if (data.pageData) {
                document.getElementById("page-title").textContent = `Title: ${data.pageData.title}`;
                document.getElementById("page-url").textContent = `URL: ${data.pageData.url}`;
                document.getElementById("page-html").value = data.pageData.html;
            }
        });
    }

    collectPageData();
})();
