window.addEventListener('load', function () {
  
    // Preloader
    const loader = document.getElementById("preloader");
    setTimeout(() => {
    loader.classList.add("hidden");
    loader.remove();
    }, 1500); // невелика затримка для плавності
    // Preloader
  
    // Copy Button
    function copyToClipboard() {
      // Get the text field
      let copyText = document.getElementById("wallet-adress");

      // Use the Clipboard API to write the text
      navigator.clipboard.writeText(copyText.innerText).then(() => {
      // Optional: Alert the user that the text was copied
      document.getElementById("copy-icon").classList.add("text-primary");
          setTimeout(() => {
          document.getElementById("copy-icon").classList.remove("text-primary"); 
      }, 1000);
      }).catch(err => {
        console.error('Could not copy text: ', err);
      });
    }
    const copyIcon = document.getElementById("copy-icon");
    if (copyIcon) {
        document.getElementById("copy-icon").addEventListener("click", function() {
            copyToClipboard();
        });
    }
    // Copy Button
  
  // Load page elements
    if (sessionStorage.getItem("x_auth_session")) {
        const x_auth_session = sessionStorage.getItem("x_auth_session");
      
      // Get wallet address and email
        const xhr3 = new XMLHttpRequest();
        xhr3.open("GET", "https://workerbalance.vovasch8.workers.dev/user/current", true);
        xhr3.setRequestHeader("X-Auth-Session", x_auth_session);
        xhr3.onload = () => {
          const resCurrent = JSON.parse(xhr3.responseText);
          document.querySelector("#wallet-email").textContent = resCurrent.email;
          document.querySelector("#wallet-adress").textContent = resCurrent.wallet.address;
        };
        xhr3.send();
    
      document.querySelector(".btn-save").addEventListener("click", function() {
        // Change password
            const xhr4 = new XMLHttpRequest();
            let email = document.querySelector("#wallet-email").textContent;
            if (document.querySelector("#ChangePassword").value === document.querySelector("#RepeatPassword").value) {
              let newPassword = document.querySelector("#RepeatPassword").value;
                const data = {
                email: email,
                newPassword: newPassword
              };
              xhr4.open("PUT", "https://workerbalance.vovasch8.workers.dev/user/password", true);
              xhr4.setRequestHeader("X-Auth-Session", x_auth_session);
              xhr4.setRequestHeader("Content-Type", "application/json");
              xhr4.onload = () => {
                if (xhr4.status >= 200 && xhr4.status < 300) {
                  const resMessage = JSON.parse(xhr4.responseText);
                  document.querySelector("#message-box").classList.remove("d-none");
                  document.querySelector("#message-box").innerHTML = "<span class='text-success d-flex justify-content-center'>Підтвердіть зміну паролю на email!</span>";
                  document.querySelector("#ChangePassword").value = "";
                  document.querySelector("#RepeatPassword").value = "";
                } else {
                  console.log("Помилка:", xhr4.status);
                }
              };
              xhr4.send(JSON.stringify(data));
            } else {
              document.querySelector("#message-box").classList.remove("d-none");
              document.querySelector("#message-box").innerHTML = "<span class='text-danger d-flex justify-content-center'>Пароль не співпадає!</span>";
              document.querySelector("#ChangePassword").value = "";
              document.querySelector("#RepeatPassword").value = "";
            }
        setTimeout(() => {
          document.querySelector("#message-box").classList.add("d-none");
          document.querySelector("#message-box").innerHTML = "";
        }, 5000);
      });
      
      document.querySelector(".btn-paymentId").addEventListener("click", function() {
        // Get payment Id
        const xhr5 = new XMLHttpRequest();
        var paymentId = "";
        xhr5.open("GET", "https://workerbalance.vovasch8.workers.dev/wallet/paymentId", true);
        xhr5.setRequestHeader("X-Auth-Session", x_auth_session);
        xhr5.onload = () => {
            const resPaymentId = JSON.parse(xhr5.responseText);
            paymentId = resPaymentId.paymentId;
            document.querySelector(".input-payment-id").innerHTML = paymentId;
        };
        xhr5.send();
      });
    }
});