window.addEventListener('load', function () {
  
    // Preloader
    const loader = document.getElementById("preloader");
    const commision = 0;
    const platformCommision = 1;
    const commisionWalletAddress = "KiE8uyEJKq55gzrxwHX8LF8bYX3cAxU41e11UDUSotTcJme2oUX7uaA85SKe2k7ZFaLQbfaRJjfz5Fz7ZSu8vjkJ3L8XhFo";
    setTimeout(() => {
    loader.classList.add("hidden");
    loader.remove();
    }, 1500); // невелика затримка для плавності
    // Preloader

    // Function Copy Button
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
    // Copy Button
    const copyIcon = document.getElementById("copy-icon");
    if (copyIcon) {
        document.getElementById("copy-icon").addEventListener("click", function() {
            copyToClipboard();
        });
    }
  
    // Function Load Transactions
    function putTransactions(rTransactions, countClick) {
      const step = 3;
            for(let i = (countClick * step); i < (countClick * step) + step; i++) {
              if (rTransactions[i]) {
                const dateTransaction = rTransactions[i].time;
                const date = new Date(dateTransaction + 'Z');
                date.setHours(date.getHours());
                const formatted = date.toLocaleString('uk-UA', {
                  timeZone: 'Europe/Kyiv', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false
                });
                document.querySelector("#transactions").insertAdjacentHTML('beforeend', 
                  '<div class="asset mt-2">' +
                    '<div class="asset-info">' +
                      '<div class="d-flex">' +
                        '<div class="asset-name">' +
                          '<i class="fa-solid fa-right-left me-2"></i>' +
                          '<span class="text-break" id="payment-' + (i + 1) + '">' + '<span class="text-success">Переказ: </span>' + rTransactions[i].paymentId + '</span>' +
                        '</div>' +
                        '<div class="d-flex asset-value align-items-center">' +
                          '<strong class="ms-2 me-2 text-nowrap" id="btcValue">' + (rTransactions[i].amount / 1000000000000) + ' KRB</strong>' +
                        '</div>' +
                      '</div>' +
                      '<div class="d-flex justify-content-end" id="btcValue">' +
                        '<span id="payment-amount-' + (i + 1) + '">' + (formatted) + '</span>' +
                      '</div>' +                        
                    '</div>' + 
                  '</div>'
                );
              }
            }
        }
    // Load Transactions
  
    // Load page elements
    if (sessionStorage.getItem("x_auth_session")) {
        const x_auth_session = sessionStorage.getItem("x_auth_session");
        
        // Get wallet address and balance
          const xhr3 = new XMLHttpRequest();
          xhr3.open("GET", "https://workerbalance.vovasch8.workers.dev/wallet/balance", true);
          xhr3.setRequestHeader("X-Auth-Session", x_auth_session);
          xhr3.onload = () => {
            resBalance = JSON.parse(xhr3.responseText);
            document.querySelector("#balance").textContent = ((resBalance.available / 1000000000000)).toFixed(4);
            document.querySelector("#wallet-adress").textContent = resBalance.address;
          };
          xhr3.send();
      
        // Get transactions
        const xhr4 = new XMLHttpRequest();
        var resTransactions = "";
        xhr4.open("GET", "https://workerbalance.vovasch8.workers.dev/wallet/transactions", true);
        var countClicks = 0;
        xhr4.setRequestHeader("X-Auth-Session", x_auth_session);
        xhr4.onload = () => {
          resTransactions = JSON.parse(xhr4.responseText);
          
          // Load transactions
          putTransactions(resTransactions, countClicks);
          countClicks++;
          
          // Month payments
          let thisMonth = new Date().getMonth();
          var access = false;
          resTransactions.forEach((tr, index) => {
          const dateTimeTr = tr.time;
          const dateTr = new Date(dateTimeTr);
          if (dateTr.getMonth() === thisMonth && tr.address === commisionWalletAddress && (-tr.amount / 1000000000000) >= (commision + platformCommision) ) {
              access = true;
              document.querySelector(".actions").classList.remove("disabled-div");
              document.querySelector(".history-transactions").classList.remove("disabled-div");
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
                    window.location.reload();
                  } else {
                    console.log("Помилка:", xhr5.status);
                  }
                };
                var data = {
                address: commisionWalletAddress,
                allAvailableBalance: false,
                amount: (commision - platformCommision) * 1000000000000,
                paymentId: paymentId
                };
                xhr5.send(JSON.stringify(data));
              };
              xhr6.send(); 
            });
          }
        };
        xhr4.send();
      
        document.querySelector("#arrow-load-transactions").addEventListener("click", function() {
          if (resTransactions) {
            putTransactions(resTransactions, countClicks);
            countClicks++;
          }
        });
    } else {
        window.location.href = "index.html";
    }
});