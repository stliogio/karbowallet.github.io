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
    const copyBtn = document.getElementById("copyBtn");
    if (copyBtn) {
        document.getElementById("copyBtn").addEventListener("click", function() {
            document.getElementById("icon-fa-copy").classList.remove("fa-copy");
            document.getElementById("icon-fa-copy").classList.add("fa-circle-check");
            // Use the Clipboard API to write the text
            copyInput = document.getElementById("inputCopy").value;
            navigator.clipboard.writeText(copyInput);
            setTimeout(() => {
                document.getElementById("icon-fa-copy").classList.remove("fa-circle-check");
                document.getElementById("icon-fa-copy").classList.add("fa-copy");
            }, 1500);
        });
    }
    // Copy Button
  
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
        });
        // Reload balance
        
        // Show sharing information
        document.querySelector("#btn-share-payment").addEventListener("click", function() {
          if (document.querySelector("#amount").value > 0 && document.querySelector("#message").value.length) {
            // Get payment Id
            const xhr4 = new XMLHttpRequest();
            var paymentId = "";
            var rUrl = window.location.href;
            let inputAddress = document.querySelector("#wallet-adress").textContent;
            let inputAmount = document.querySelector("#amount").value;
            let InputLabel = document.querySelector("#message").value;
            if (inputAddress && inputAmount && InputLabel) {
                let receiveUrl = rUrl.replace('receive.html', 'send.html?address=' + inputAddress + '&amount=' + inputAmount + '&label=' + encodeURIComponent(InputLabel));
                const longUrl =
                  "https://stliogio.github.io/karbowallet.github.io/send.html" +
                  `?address=${encodeURIComponent(inputAddress)}` +
                  `&amount=${encodeURIComponent(inputAmount)}` +
                  `&label=${encodeURIComponent(InputLabel)}`;

                const xhr12 = new XMLHttpRequest();

                xhr12.open(
                  "GET",
                  "https://workerbalance.vovasch8.workers.dev/short/url?url=" +
                  encodeURIComponent(longUrl),
                  true
                );
                xhr12.onload = function () {
                  if (xhr12.status === 200) {
                    const response_xhr12 = JSON.parse(xhr12.responseText);
                    const shortURL = response_xhr12.short_url;
                    document.querySelector("#inputCopy").value = shortURL;
                    document.querySelector(".facebook").setAttribute("data-url", shortURL);
                    document.querySelector(".facebook").setAttribute("data-title", "Платіж Українською Криптовалютою Karbo: " + inputAmount + " KRB | Призначення: " + InputLabel);
                    document.querySelector(".telegram").setAttribute("data-url", shortURL);
                    document.querySelector(".telegram").setAttribute("data-title", "Платіж Українською Криптовалютою Karbo: " + inputAmount + " KRB | Призначення: " + InputLabel);
                    document.querySelector(".trello").setAttribute("data-url", shortURL);
                    document.querySelector(".trello").setAttribute("data-title", "Платіж Українською Криптовалютою Karbo: " + inputAmount + " KRB | Призначення: " + InputLabel);
                    document.querySelector(".soc-x").setAttribute("data-url", shortURL);
                    document.querySelector(".soc-x").setAttribute("data-title", "Платіж Українською Криптовалютою Karbo: " + inputAmount + " KRB | Призначення: " + InputLabel);
                    document.querySelector(".threads").setAttribute("data-url", shortURL);
                    document.querySelector(".threads").setAttribute("data-title", "Платіж Українською Криптовалютою Karbo: " + inputAmount + " KRB | Призначення: " + InputLabel);
                    document.querySelector(".whatsapp").setAttribute("data-url", shortURL);
                    document.querySelector(".whatsapp").setAttribute("data-title", "Платіж Українською Криптовалютою Karbo: " + inputAmount + " KRB | Призначення: " + InputLabel);
                    document.querySelector(".viber").setAttribute("data-url", shortURL);
                    document.querySelector(".viber").setAttribute("data-title", "Платіж Українською Криптовалютою Karbo: " + inputAmount + " KRB | Призначення: " + InputLabel);
                    document.querySelector(".linkedin").setAttribute("data-url", shortURL);
                    document.querySelector(".linkedin").setAttribute("data-title", "Платіж Українською Криптовалютою Karbo: " + inputAmount + " KRB | Призначення: " + InputLabel);
                  
                    // Лого має бути доступне по HTTPS URL
            const logo =
              "https://stliogio.github.io/karbowallet.github.io/img/logo%20StlioGio.png";

            const qrData = shortURL;

            const qrUrl =
              `https://quickchart.io/qr` +
              `?size=420` +
              `&margin=1` +
              `&ecLevel=H` +
              `&dark=1e293b` +
              `&light=ffffff` +
              `&caption=${encodeURIComponent("KARBO WALLET")}` +
              `&captionFontSize=38` +
              `&captionColor=1e293b` +
              `&centerImageUrl=${encodeURIComponent("https://stliogio.github.io/karbowallet.github.io/img/logo.jpg")}` +
              `&centerImageSizeRatio=0.25` +
              `&text=${encodeURIComponent(qrData)}`;

            document.querySelector("#qr-image").src = qrUrl;

            document.getElementById("download-qr").addEventListener("click", async function () {

                const imageUrl = document.getElementById("qr-image").src;

                const response = await fetch(imageUrl);

                const blob = await response.blob();

                const blobUrl = URL.createObjectURL(blob);

                const a = document.createElement("a");

                a.href = blobUrl;
              
                if (document.querySelector("#message").value.length) {
                  a.download = document.querySelector("#message").value + ".jpg";
                } else {
                  a.download = "pay-qr.jpg";
                }

                document.body.appendChild(a);

                a.click();

                a.remove();

                URL.revokeObjectURL(blobUrl);
            });
                  } 
                };
                xhr12.send();
            }
            
            document.querySelector(".social-sharing").classList.remove("d-none");
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
              document.querySelector(".receive-block").classList.remove("disabled-div");
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
        window.location.href = "index.html";
    }
  
});