// Seleção dos elementos do DOM Objeto

const container = document.querySelector(".container"); 

const qrCodeBtn = document.querySelector("#qr-form button"); 

const qrCodeInput = document.querySelector("#qr-input"); 

const qrCodeImage = document.querySelector("#qr-code img"); 

// Funções 

async function generatorQrCode() {
    
    const qrCodeInputValue = qrCodeInput.value;

    if(!qrCodeInputValue) {
        return Toastify({
            text: "Insira um texto ou link para gerar o QR Code!",
            duration: 3000,
            destination: "#",
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "left", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "linear-gradient(to right, #e53c3cff, #df8f26ff)",
            }
            }).showToast();
    }

    qrCodeBtn.innerHTML = "Gerando código...";

    const URLBase = "https://api.qrserver.com/v1/create-qr-code/?size=800x800&data=";
    const qrCodeApiUrl = `${URLBase}${encodeURIComponent(qrCodeInputValue)}`;

    try {
        const response = await fetch(qrCodeApiUrl);
        const blob = await response.blob();
        const dataUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
        const data = { qrcode: dataUrl.split(',')[1] };

        qrCodeImage.src = `data:image/png;base64,${data.qrcode}`;

        qrCodeBtn.innerHTML = "Gerar QR Code";

        qrCodeImage.onload = () => {
            container.classList.add("active");
        };

    } catch(error) {
        console.error(`ERRO ao requisitar recurso ao servidor da API QR Code. Segue a descrição do erro: ${error}`);
        Toastify({
            text: "ERRO ao requisitar recurso ao servidor da API QR Code.",
            duration: 3000,
            destination: "#",
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "left", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "linear-gradient(to right, #e53c3cff, #df8f26ff)",
            }
            }).showToast();
            qrCodeBtn.innerHTML = "Gerar QR Code";
    }
}

// Eventos 

qrCodeBtn.addEventListener("click", () => {
    generatorQrCode();
});

qrCodeInput.addEventListener("keydown", (e) => {
    if(e.code === "Enter" || e.key === "Enter") {
        generatorQrCode();
    }
});

// Limpar área do QR Code
document.addEventListener("keyup", () => {
    if(!qrCodeInput.value) {
        container.classList.remove("active");
        qrCodeInput.value = "";
        qrCodeBtn.innerHTML = "Gerar QR Code";
    }
});

// Limpar área do QR Code ao pressionar a tecla Escape
document.addEventListener("keydown", (e) => {
    if(e.code === "Escape" || e.key === "Escape") {
        container.classList.remove("active");
        qrCodeInput.value = "";
    }
});