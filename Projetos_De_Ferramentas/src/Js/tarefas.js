// Estado central da aplicação: uma lista de tarefas
let tasks = [];

// Referências ao DOM
const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addTaskBtn");
const list = document.getElementById("taskList");


addBtn.addEventListener ("click" , addTask);
// 1. Adicionar tarefa

function addTask() {
    const text = input.value.trim();

   
    if (text === "") return; //Evitar a pessoa nao digitar nada e ficar uma tarefa vazia

   // Aqui agora sera o visor -- Kauan Souza
    const li = document.createElement ("li")
       li.textContent = text;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remover";
    removeBtn.classList.add("remove-btn");

    removeBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        list.removeChild(li);
    });

    li.addEventListener("click", () => {
        li.classList.toggle("completed");
    });

    li.appendChild(removeBtn);
    list.appendChild(li);
    input.value = "";
}

//Isso abaixo ficara nos bastidores
         // ⏳ Em desenvolvimento. O dev do futuro que lute pra terminar isso.
         // 🤯 Código em progresso — não pergunte quando vai ficar pronto.



