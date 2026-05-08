window.addEventListener('load', function () {
    
    document.querySelector("#register-btn").addEventListener("click", function() {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "https://workerbalance.vovasch8.workers.dev/user/register", true);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                const res = JSON.parse(xhr.responseText);
                document.querySelector("#message-box").innerHTML = "<span class='text-success'>Підтвердіть реєстрацію на email!</span>";
            } else {
                document.querySelector("#message-box").innerHTML = "<span class='text-danger'>Не вірні дані!</span>";
                console.log("Помилка:", xhr.status);
            }
        };

        xhr.onerror = () => console.error("network error");
        
        if (document.querySelector("#password").value === document.querySelector("#repeatPassword").value) {
            if (document.querySelector("#password").value.length < 5 || document.querySelector("#repeatPassword").value.length < 5) {
                document.querySelector("#message-box").innerHTML = "<span class='text-danger'>Пароль повинен містити більше 4 символів!</span>";
            } else if (document.querySelector("#nick").value.length < 5) {
                document.querySelector("#message-box").innerHTML = "<span class='text-danger'>Нік повинен містити більше 4 символів!</span>";
            } else {
                xhr.send(JSON.stringify({
                email: document.querySelector("#email").value,
                username: document.querySelector("#nick").value,
                password: document.querySelector("#password").value
            }));
            }
        } else {
            document.querySelector("#message-box").innerHTML = "<span class='text-danger'>Паролі не співпадають!</span>";
        }
    }); 
});