const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");

let current = "";

buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        const value = btn.getAttribute("data-key");

        // Limpa tudo
        if (btn.id === "clear") {
            current = "";
            display.textContent = "0";
            return;
        }

        // Apagar último caractere
        if (btn.id === "backspace") {
            current = current.slice(0, -1);
            display.textContent = current || "0";
            return;
        }

        // Calcular operação
        if (btn.id === "equal") {
            try {
                current = eval(current).toString();
                display.textContent = current;
            } catch {
                display.textContent = "Erro";
            }
            return;
        }

        // Adicionar número ou operador
        if (value) {
            current += value;
            display.textContent = current;
        }
    });
});
