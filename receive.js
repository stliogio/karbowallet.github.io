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
    
    // Load page elements
    if (sessionStorage.getItem("x_auth_session")) {
        const x_auth_session = sessionStorage.getItem("x_auth_session");
        document.querySelector(".pre-logo").setAttribute("src", "img/pack " + (Math.floor(Math.random() * 2) + 1) + "/" + (Math.floor(Math.random() * 10) + 1) + ".png");
        
        // Get wallet address and balance
        const xhr3 = new XMLHttpRequest();
        var walletAddress = "";
        xhr3.open("GET", "https://workerbalance.vovasch8.workers.dev/wallet/balance", true);
        xhr3.setRequestHeader("X-Auth-Session", x_auth_session);
        xhr3.onload = () => {
          const resBalance = JSON.parse(xhr3.responseText);
          document.querySelector("#balance").textContent = ((resBalance.available / 1000000000000)).toFixed(4);
          document.querySelector("#wallet-adress").textContent = resBalance.address;
          walletAddress = resBalance.address;
        };
        xhr3.send();
        
        // Show sharing information
        document.querySelector("#btn-share-payment").addEventListener("click", function() {
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

                document.querySelector("#inputCopy").value = longUrl;
                
                document.querySelector(".facebook").setAttribute("data-url", receiveUrl);
                document.querySelector(".telegram").setAttribute("data-url", receiveUrl);
                document.querySelector(".trello").setAttribute("data-url", receiveUrl);
                document.querySelector(".soc-x").setAttribute("data-url", receiveUrl);
                document.querySelector(".threads").setAttribute("data-url", receiveUrl);
                document.querySelector(".whatsapp").setAttribute("data-url", receiveUrl);
                document.querySelector(".viber").setAttribute("data-url", receiveUrl);
                document.querySelector(".linkedin").setAttribute("data-url", receiveUrl);
                
            }

            // Лого має бути доступне по HTTPS URL
            const logo =
              "https://stliogio.github.io/karbowallet.github.io/img/logo%20StlioGio.png";

            const params = new URLSearchParams({
              address: inputAddress,
              amount: inputAmount,
              label: InputLabel
            });

            const qrData =
              `https://stliogio.github.io/karbowallet.github.io/receive.html?${params}`;

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
              `&centerImageSizeRatio=0.28` +
              `&text=${encodeURIComponent(qrData)}`;

            document.querySelector(".qr-box").innerHTML =
              `<img class="pre-logo"
                    src="${qrUrl}"
                    alt="qr">`;
            
            document.querySelector(".social-sharing").classList.remove("d-none");
        });
    } else {
        window.location.href = "index.html";
    }
  
});