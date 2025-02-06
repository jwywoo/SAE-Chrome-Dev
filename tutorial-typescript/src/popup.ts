document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("click-me") as HTMLButtonElement;
    const message = document.getElementById("message") as HTMLParagraphElement;

    button.addEventListener("click", () => {
        message.textContent = "Hello, Chrome Extension!";
    });
});
