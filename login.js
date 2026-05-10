window.addEventListener('load', function () {
    
    if (sessionStorage.getItem("x_auth_session")) {
        sessionStorage.removeItem('x_auth_session');
    }
    
    const queryString = window.location.href.split('?')[1] || '';
    const urlParams = new URLSearchParams(queryString);
    
    document.querySelector("#login-btn").addEventListener("click", function() {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "https://workerbalance.vovasch8.workers.dev/user/login", true);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onload = () => {
            const res = JSON.parse(xhr.responseText);
            // ⬇️ ОСЬ ВОНА
            if (res.x_auth_session) {
                sessionStorage.setItem("x_auth_session", res.x_auth_session);
                if (urlParams.has('purl')) {
                    window.location.href = urlParams.get('purl');  
                } else {
                    window.location.href = "wallet.html";
                }
            } else {
                document.querySelector(".message-box").textContent = "Не вірні дані!";
            }
            
        };

        xhr.onerror = () => console.error("network error");

        xhr.send(JSON.stringify({
            login: document.querySelector("#email-input").value,
            password: document.querySelector("#password-input").value
        }));
    }); 
});