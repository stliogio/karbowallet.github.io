window.addEventListener('load', function () {
  
    // Preloader
    const loader = document.getElementById("preloader");
    const commision = 50;
    const platformCommision = 1;
    const commisionWalletAddress = "KiE8uyEJKq55gzrxwHX8LF8bYX3cAxU41e11UDUSotTcJme2oUX7uaA85SKe2k7ZFaLQbfaRJjfz5Fz7ZSu8vjkJ3L8XhFo";
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
    
    // isset get params
    // Обробка зборів та платежів
        const queryString = window.location.href.split('?')[1] || '';
        const urlParams = new URLSearchParams(queryString);

        if (urlParams.has('address') && urlParams.has('amount') && urlParams.has('label')) {
          document.querySelector("#adress-wallet").value = urlParams.get('address');
          document.querySelector("#amount").value = urlParams.get('amount');
          document.querySelector("#main-label").textContent = "Відправити платіж: " + urlParams.get('label');
        }
    
    // Load balance
    function reloadBalance(x_token) {
      const xhr11 = new XMLHttpRequest();
          xhr11.open("GET", "https://workerbalance.vovasch8.workers.dev/wallet/balance", true);
          xhr11.setRequestHeader("X-Auth-Session", x_token);
          xhr11.onload = () => {
            resBalance = JSON.parse(xhr11.responseText);
            document.querySelector("#balance").textContent = ((resBalance.available / 1000000000000) + (resBalance.locked / 1000000000000)).toFixed(4);
            if (resBalance.locked !== 0) {
              document.querySelector(".locked-balance").textContent = (resBalance.locked / 1000000000000).toFixed(4);
              document.querySelector(".blockchaine-message").style.display = "block";
            } else {
              document.querySelector(".blockchaine-message").style.display = "none";
            }
          };
          xhr11.send();
    }
    
    // Load page elements
    if (sessionStorage.getItem("x_auth_session")) {
        const x_auth_session = sessionStorage.getItem("x_auth_session");
        document.querySelector(".pre-logo").setAttribute("src", "img/pack " + (Math.floor(Math.random() * 2) + 1) + "/" + (Math.floor(Math.random() * 10) + 1) + ".png");
        
        // Get wallet address and balance
          const xhr3 = new XMLHttpRequest();
          xhr3.open("GET", "https://workerbalance.vovasch8.workers.dev/wallet/balance", true);
          xhr3.setRequestHeader("X-Auth-Session", x_auth_session);
          xhr3.onload = () => {
            resBalance = JSON.parse(xhr3.responseText);
            document.querySelector("#balance").textContent = ((resBalance.available / 1000000000000) + (resBalance.locked / 1000000000000)).toFixed(4);
            document.querySelector("#wallet-adress").textContent = resBalance.address;
            if (resBalance.locked === 0) {
              document.querySelector(".blockchaine-message").style.display = "none";
            } else {
              document.querySelector(".locked-balance").textContent = (resBalance.locked / 1000000000000).toFixed(4);
            }
          };
          xhr3.send();
        
        // Get payment Id
        const xhr4 = new XMLHttpRequest();
        var paymentId = "";
        xhr4.open("GET", "https://workerbalance.vovasch8.workers.dev/wallet/paymentId", true);
        xhr4.setRequestHeader("X-Auth-Session", x_auth_session);
        xhr4.onload = () => {
            const resPaymentId = JSON.parse(xhr4.responseText);
            paymentId = resPaymentId.paymentId;  
        };
        xhr4.send(); 

        document.querySelector("#send-btn").addEventListener("click", function() {
            if (paymentId) {
                // Send crypto coins
                const xhr5 = new XMLHttpRequest();
                var amount = 0;
                xhr5.open("POST", "https://workerbalance.vovasch8.workers.dev/wallet/send", true);
                xhr5.setRequestHeader("Content-Type", "application/json");
                xhr5.setRequestHeader("X-Auth-Session", x_auth_session);
                xhr5.onload = function () {
                  if (xhr5.status >= 200 && xhr5.status < 300) {
                    document.querySelector("#adress-wallet").value = "";
                    document.querySelector("#amount").value = 0;
                    document.querySelector("#info-transaction-message").classList.remove("d-none");
                    setTimeout(() => {
                        document.querySelector("#info-transaction-message").classList.add("d-none");
                    }, 30000);
                  } else {
                    console.log("Помилка:", xhr5.status);
                  }
                };
                walletAddress = document.querySelector("#adress-wallet").value;
                amount = document.querySelector("#amount").value;
                
                if (amount > 0 && walletAddress != "") {
                    var data = {
                      address: walletAddress,
                      allAvailableBalance: false,
                      amount: amount * 1000000000000,
                      paymentId: paymentId
                    };
                    xhr5.send(JSON.stringify(data));
                }
            }
        });
      
      // Get transactions
        const xhr15 = new XMLHttpRequest();
        var resTransactions = "";
        xhr15.open("GET", "https://workerbalance.vovasch8.workers.dev/wallet/transactions", true);
        xhr15.setRequestHeader("X-Auth-Session", x_auth_session);
        xhr15.onload = () => {
          resTransactions = JSON.parse(xhr15.responseText);
          
          // Month payments
          let thisMonth = new Date().getMonth();
          var access = false;
          resTransactions.forEach((tr, index) => {
          const dateTimeTr = tr.time;
          const dateTr = new Date(dateTimeTr);
          if ((tr.blockIndex === -1 && (-tr.amount / 1000000000000) >= commision) || (dateTr.getMonth() === thisMonth && tr.address === commisionWalletAddress && (-tr.amount / 1000000000000) >= commision )) {
              access = true;
              document.querySelector(".actions").classList.remove("disabled-div");
              document.querySelector(".send-block").classList.remove("disabled-div");
              document.querySelector(".monthPayBlock").classList.add("d-none");
          } 
          });
          
          if (!access && parseInt(document.querySelector("#balance").textContent) < commision + platformCommision) {
            document.querySelector(".btn-pay").classList.add("disabled-div");   
          } else if (!access) {
            document.querySelector(".btn-pay").addEventListener("click", function() {
              
              // Get payment Id
              const xhr6 = new XMLHttpRequest();
              var paymentId = "";
              xhr6.open("GET", "https://workerbalance.vovasch8.workers.dev/wallet/paymentId", true);
              xhr6.setRequestHeader("X-Auth-Session", x_auth_session);
              xhr6.onload = () => {
                  const resPaymentId = JSON.parse(xhr6.responseText);
                  paymentId = resPaymentId.paymentId;  
                
                const xhr5 = new XMLHttpRequest();
                var amount = 0;
                xhr5.open("POST", "https://workerbalance.vovasch8.workers.dev/wallet/send", true);
                xhr5.setRequestHeader("Content-Type", "application/json");
                xhr5.setRequestHeader("X-Auth-Session", x_auth_session);
                xhr5.onload = function () {
                  if (xhr5.status >= 200 && xhr5.status < 300) {
                    document.querySelector(".pay-message").style = "block";
                    document.querySelector(".pay-message").innerHTML = "<span class='text-success'>Підтвердіть платіж на email!</span>";
                    //window.location.reload();
                  } else {
                    console.log("Помилка:", xhr5.status);
                  }
                };
                var data = {
                address: commisionWalletAddress,
                allAvailableBalance: false,
                amount: commision * 1000000000000,
                paymentId: paymentId
                };
                xhr5.send(JSON.stringify(data));
              };
              xhr6.send(); 
            });
          }
    // Month payments
  
    // Reload balance
        document.querySelector(".r-balance").addEventListener("click", function() {
            const element = document.querySelector('.r-balance');

            reloadBalance(x_auth_session);
            element.animate([
              { transform: 'rotate(0deg)' },
              { transform: 'rotate(360deg)' }
            ], {
              duration: 1000,     // 2 seconds
              iterations: 2, // Loop 2
              easing: 'linear'    // Constant speed
            });
          
          let reloadThisMonth = new Date().getMonth();
          var reloadAccess = false;
          resTransactions.forEach((tr, index) => {
          const reloadDateTimeTr = tr.time;
          const reloadDateTr = new Date(reloadDateTimeTr);
          if ((tr.blockIndex === -1 && (-tr.amount / 1000000000000) >= commision) ||  (reloadDateTr.getMonth() === reloadThisMonth && tr.address === commisionWalletAddress && (-tr.amount / 1000000000000) >= commision )) {
              access = true;
              document.querySelector(".actions").classList.remove("disabled-div");
              document.querySelector(".send-block").classList.remove("disabled-div");
              document.querySelector(".monthPayBlock").classList.add("d-none");
          }
          });
        });
        // Reload balance
          
        };
        xhr15.send();
    } else {
        window.location.href = "index.html?purl=" + encodeURIComponent(window.location.href);
    }
  
});