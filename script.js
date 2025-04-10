document.addEventListener("DOMContentLoaded", function () {
    // START MODAL CADASTRAR STUDY
    // JavaScript para manipular o modal
    var modalCreateStudy = document.getElementById('studyModal');
    var btnCreateStudy = document.getElementById('createStudyBtn');
    var btnModalStudyCreateCancel = document.getElementById('btnModalStudyCreateCancel');
    var btnSearchCompleted = document.getElementById('btnSearchCompleted');
    var btnSearchNotStarted = document.getElementById('btnSearchNotStarted');


    btnSearchNotStarted.onclick = function () {
        fetchStudyCardsData("uncompleted");
    }

    btnSearchCompleted.onclick = function () {
        fetchStudyCardsData("completed");
    }

    // Abrir o modal para criar study ao clicar no botão
    btnCreateStudy.onclick = function () {
        modalCreateStudy.style.display = 'block';
    }

    btnModalStudyCreateCancel.onclick = closeModalStudyCreateCancel;

    // Função para fechar o modal
    function closeModalStudyCreateCancel() {
        modalCreateStudy.style.display = 'none';
    }

    // Fechar o modal ao clicar fora dele (na área escura)
    window.onclick = function (event) {
        if (event.target == modalCreateStudy) {
            modalCreateStudy.style.display = 'none';
        }
    }

    // Ação ao enviar o formulário 
    var form = document.getElementById('studyForm');
    form.onsubmit = function (event) {
        event.preventDefault();
        console.log('Título:', form.studyTitle.value);
        console.log('Descrição:', form.studyDescription.value);
        console.log('Prioridade:', form.studyPriority.value);
        console.log('Conteúdo:', form.studyContent.value);

        handleCreateStudy(form)
        // Fechar o modal após processar os dados
        modalCreateStudy.style.display = 'none';
        this.reset();
    }

    // END MODAL STUDY



    // START Funcao que pega dados do modal e chama o POST  da API para criar o Study
    const handleCreateStudy = async (form) => {
        let volunteerData = {
            title: form.studyTitle.value,
            description: form.studyDescription.value,
            content: form.studyContent.value,
            priority: form.studyPriority.value,
        };

        if (form.studyCategory.value) {
            volunteerData = { ...volunteerData, category_id: form.studyCategory.value }
        }

        try {
            const response = await fetch('http://127.0.0.1:5000/study', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...volunteerData
                })
            });

            if (response.ok) {
                console.log('Study criado com sucesso!');
                showToast('Study criado com sucesso', '#4CAF50')
                // Atualiza os cards de estudo após a criação do novo estudo
                fetchStudyCardsData("uncompleted");
            } else {
                console.error('Erro ao criar study:', response.statusText);
                showToast('Study criado com sucesso', '#ff4d4f')
            }
        } catch (error) {
            console.error('Erro ao criar evento:', error);
        }
    };

    // END Funcao que pega dados do modal e chama o POST  da API para criar o Study

    //   START CARDS 

    async function handleDeleteStudy(studyId, status) {
        openConfirmationModal('Tem certeza de que deseja excluir este estudo?', 'Confirmar', async function () {
            await fetch(`http://127.0.0.1:5000/study?id=${studyId}`, {
                method: 'DELETE',
            }).then(function (response) {
                if (response.ok) {
                    console.log(status)
                    if (status == "uncompleted")
                        fetchStudyCardsData("uncompleted")
                    else
                        fetchStudyCardsData("completed")
                }
            });
        });
    }

    async function scheduleGenerete(studyId) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const pageHeight = doc.internal.pageSize.height;
        const pageWidth = doc.internal.pageSize.width;

        const response = await fetch(`http://127.0.0.1:5000/study/schedule?id=${studyId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const dataResponse = await response.json();
        const jsonString = dataResponse.schedule

        const data = JSON.parse(jsonString);

    let y = 20;
    let pagina = 1;

    function adicionarCabecalho() {
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text(data.title, 20, 15);
      y = 30;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Página ${pagina}`, pageWidth - 40, 15);
      doc.setDrawColor(180);
      doc.line(20, 18, pageWidth - 20, 18);
    }

    adicionarCabecalho();
    data.semanas.forEach(semana => {
      if (y > pageHeight - 30) {
        doc.addPage();
        pagina++;
        adicionarCabecalho();
        y = 30;
      }

      // Nome da semana
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(`${semana.nome}`, 20, y);
      y += 10;

      semana.dias.forEach(dia => {
        if (y > pageHeight - 20) {
          doc.addPage();
          pagina++;
          y = 30;
          adicionarCabecalho();
          y = 30;
        }

        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.text(`• ${dia.dia}: ${dia.atividade}`, 25, y);
        y += 8;
      });

      y += 5; // espaço extra entre semanas
    });

    doc.save(`${data.title}.pdf`);
    }


    async function generateBooksPDF(title) {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${title}`);
        const { jsPDF } = window.jspdf;
        const data = await response.json();
      
        const doc = new jsPDF();
        const pageHeight = doc.internal.pageSize.height;
        const books = data.items?.slice(0, 20) || [];
      
        let y = 30;
        let pagina = 1;
      
        adicionarCabecalho(doc, pagina);
      
        for (let i = 0; i < books.length; i++) {
          const book = books[i];
          const titulo = book.volumeInfo?.title || 'Título não disponível';
      
          if (y > pageHeight - 20) {
            doc.addPage();
            pagina++;
            y = 30;
            adicionarCabecalho(doc, pagina);
          }
      
          doc.setFontSize(12);
          doc.text(`Título ${i + 1}: ${titulo}`, 10, y);
          y += 10;
        }
      
        doc.save("books.pdf");
      }
      
      // Cabeçalho simples
      function adicionarCabecalho(doc, pagina) {
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Página ${pagina}`, 180, 10);
        doc.setDrawColor(200);
        doc.line(10, 12, 200, 12);
      }
      

    async function handleCompleteStudy(studyId) {
        openConfirmationModal('Tem certeza de que deseja concluir este estudo?', 'Confirmar', async function () {
            await fetch(`http://127.0.0.1:5000/study/completed?id=${studyId}`, {
                method: 'PATCH',
            }).then(function (response) {
                if (response.ok) fetchStudyCardsData("uncompleted")
            });
        });
    }
    async function handleUncompleteStudy(studyId) {
        openConfirmationModal('Tem certeza de que deseja reverter este estudo?', 'Confirmar', async function () {
            await fetch(`http://127.0.0.1:5000/study/uncompleted?id=${studyId}`, {
                method: 'PATCH',
            }).then(function (response) {
                if (response.ok) fetchStudyCardsData("completed")
            });
        });
    }

    // Ordenação
    const sortSelect = document.getElementById('sort-select');
    sortSelect.addEventListener('change', function () {
        fetchStudyCardsData("uncompleted");
    });

    async function fetchStudyCardsData(filter) {
        try {
            let response;
            const sortBy = sortSelect.value; // Obtém o valor selecionado do select
            const filterByCategory = studyCategorySelectFilter.value; // Obtém o valor selecionado do select

            let url = ''
            if (filter) url += `status=${filter}&`;
            if (sortBy) url += `sort=${sortBy}&`;
            if (filterByCategory) url += `category=${filterByCategory}&`;

            // Remove o último caractere "&" da URL se existir
            url = url.slice(-1) === "&" ? url.slice(0, -1) : url;
            response = await fetch(`http://127.0.0.1:5000/studies?${url}`);
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const data = await response.json();

            const container = document.getElementById('studyCardsContainer');
            container.innerHTML = '';
            if (data.studies.length <= 0) {
                container.innerHTML = `
                <div class="content-caixa-vazia">
                    <h2>Nenhum card encontrado </h2>
                    <img class="img-caixa-vazia" src="./assets/caixa-vazia.png">
                </div>
                `;
                return;
            }

            data.studies.forEach(study => {
                const card = document.createElement('div');
                const colorHigh = { id: "high", color: '#ff4d4f' };
                const colorMedium = { id: "medium", color: '#F2C94C' };
                const colorLow = { id: "low", color: '#0288EA' };

                const priorities = [colorHigh, colorMedium, colorLow]
                const priorityObj = priorities.find(color => color.id === study.priority);
                card.className = 'study-card';
                card.style.borderLeft = `1rem solid ${priorityObj ? priorityObj.color : '#0288EA'}`;
                if (study.status === 'uncompleted') {
                    card.innerHTML = `
                    ${study.category_name ? `<span class="category-aviso">${study.category_name}</span>` : ''}
                    <div class="study-card-content-title">
                        <h3>${study.title}</h3>
                    </div>
                    <div class="study-card-content">
                        <div class="study-card-content-values">
                            <div class="study-description">${study.description}</div>
                            <div class="study-content"><a href="${study.content}" target="_blank">${study.content}</a></div>
                        </div>
                        <div class="card-study-btns">
                            <button class="btn-study-completed" id="complete-${study.id}">Concluir</button>
                            <button class="btn-study-delete" id="delete-${study.id}">Excluir</button>
                            <button class="btn-study-schedule" id="schedule-${study.id}">Cronograma</button>
                            <button class="btn-study-books" id="books-${study.id}">Livros</button>
                        </div>
                    </div>
                `;
                } else {
                    card.innerHTML = `
                    ${study.category_name ? `<span class="category-aviso">${study.category_name}</span>` : ''}
                    <span class="aviso">Concluído</span>
                    <div class="study-card-content-title">
                        <h3>${study.title}</h3>
                    </div>
                    <div class="study-card-content">
                        <div class="study-card-content-values">
                            <div class="study-description">${study.description}</div>
                            <div class="study-content"><a href="${study.content}" target="_blank">${study.content}</a></div>
                        </div>
                        <div class="card-study-btns">
                            <button class="btn-study-completed" id="uncomplete-${study.id}">Reverter</button>
                            <button class="btn-study-delete" id="delete-${study.id}">Excluir</button>
                        </div>
                    </div>
                `;
                }

                container.appendChild(card);
                if (study.status === 'uncompleted') {
                    const completeBtn = document.getElementById(`complete-${study.id}`);
                    if (completeBtn) {
                        completeBtn.addEventListener('click', () => handleCompleteStudy(study.id));
                    }
                } else {
                    const uncompleteBtn = document.getElementById(`uncomplete-${study.id}`);
                    if (uncompleteBtn) {
                        uncompleteBtn.addEventListener('click', () => handleUncompleteStudy(study.id));
                    }
                }

                const deleteBtn = document.getElementById(`delete-${study.id}`);
                if (deleteBtn) {
                    deleteBtn.addEventListener('click', () => handleDeleteStudy(study.id, study.status));
                }
                const scheduleBtn = document.getElementById(`schedule-${study.id}`);
                if (scheduleBtn) {
                    scheduleBtn.addEventListener('click', () => scheduleGenerete(study.id));
                }

                const booksBtn = document.getElementById(`books-${study.id}`);
                if (booksBtn) {
                    booksBtn.addEventListener('click', () => generateBooksPDF(study.title));
                }
            });
        } catch (error) {
            console.error('Failed to fetch study cards data:', error);
        }
    }

    //END CARDS


    //START TOAST
    // Função para mostrar o toast com mensagem dinâmica
    function showToast(message, color) {
        var toast = document.getElementById('toast');
        toast.textContent = message;
        toast.style.background = color || '#4CAF50';

        // Adiciona a classe para animar o toast
        toast.classList.add('show');

        // Remove a classe após alguns segundos
        setTimeout(function () {
            toast.classList.remove('show');
        }, 3000);
    }
    // END TOAST


    // MODAL DE CONFIRMACAO

    // Função para abrir o modal de confirmação
    function openConfirmationModal(message, confirmActionText, confirmCallback) {
        console.log('Modal de confirmação', confirmCallback)
        let modal = document.getElementById('confirmationModal');
        let modalMessage = modal.querySelector('#modalMessage');
        let confirmActionBtn = modal.querySelector('#confirmActionBtn');
        modalMessage.textContent = message; // Define a mensagem do modal

        // Exibe o modal
        modal.style.display = 'block';

        // Configura o botão de ação
        confirmActionBtn.textContent = confirmActionText || 'Confirm'; // Texto padrão do botão de confirmação
        confirmActionBtn.onclick = function () {
            if (typeof confirmCallback === 'function') {
                confirmCallback();
            }
            closeConfirmationModal();
        };

        // Adiciona evento ao botão de cancelar
        var cancelBtn = modal.querySelector('.close-modal');
        cancelBtn.onclick = closeConfirmationModal;

        // Função para fechar o modal
        function closeConfirmationModal() {
            modal.style.display = 'none';
        }

        // Fecha o modal se clicar fora da área do modal
        window.onclick = function (event) {
            if (event.target == modal) {
                closeConfirmationModal();
            }
        };
    }






    // START MODAL CATEGORY


    var modalCategory = document.getElementById("addCategoryModal");
    var btnAddCategory = document.getElementById("btnAddCategory");
    var saveBtn = document.getElementById("saveCategory");
    var cancelBtn = document.getElementById("cancelCategory");

    btnAddCategory.onclick = function () {
        fetchCategories()
        modalCategory.style.display = "block";
    }


    cancelBtn.onclick = function () {
        modalCategory.style.display = "none";
    }

    saveBtn.onclick = function () {
        var categoryName = document.getElementById("categoryName").value;
        console.log("Category Name:", categoryName);
        handleCreateCategory(categoryName)
        modalCategory.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target == modalCategory) {
            modalCategory.style.display = "none";
        }
    }
    var studyCategorySelect = document.getElementById("studyCategory");
    function addCategoryToSelect(id, name) {
        for (var i = 0; i < studyCategorySelect.options.length; i++) {
            if (studyCategorySelect.options[i].value == id || studyCategorySelect.options[i].textContent == name) {
                return;
            }
        }
        var option = document.createElement("option");
        option.value = id;
        option.textContent = name;
        studyCategorySelect.appendChild(option);
    }

    function fetchCategories() {
        fetch("http://127.0.0.1:5000/categories")
            .then(response => response.json())
            .then(data => {
                categoryList.innerHTML = ""; // Clear existing list
                data.categories.forEach(category => {
                    addCategoryToList(category.id, category.name);
                    addCategoryToSelect(category.id, category.name);
                    addCategoryToSelectFilter(category.id, category.name);
                });
            })
            .catch(error => console.error('Error fetching categories:', error));
    }

    function addCategoryToList(id, name) {
        var li = document.createElement("li");
        li.textContent = name;
        var deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Apagar";
        deleteBtn.className = "delete-btn";
        deleteBtn.onclick = function () {
            // Delete the category via the API
            fetch(`http://127.0.0.1:5000/category?id=${id}`, {
                method: 'DELETE'
            })
                .then(() => {
                    categoryList.removeChild(li);
                })
                .catch(error => console.error('Error deleting category:', error));
        };
        li.appendChild(deleteBtn);
        categoryList.appendChild(li);
    }

    const handleCreateCategory = async (name) => {
        const newCategory = {
            name,
        };

        try {
            const response = await fetch('http://127.0.0.1:5000/category', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...newCategory
                })
            });

            if (response.ok) {
                console.log('Categoria criada com sucesso!');
                showToast('Categoria criado com sucesso', '#4CAF50')
                addCategoryToSelect(response.data.id, response.data.name)
            } else {
                console.error('Erro ao criar category:', response.statusText);
                showToast('Categoria criado com sucesso', '#ff4d4f')
            }
        } catch (error) {
            console.error('Erro ao criar evento:', error);
        }
    };

    // END MODAL CATEGORY


    // START FILTER CATEGORIA

    var studyCategorySelectFilter = document.getElementById("studyCategoryFilter");
    function addCategoryToSelectFilter(id, name) {
        for (var i = 0; i < studyCategorySelectFilter.options.length; i++) {
            if (studyCategorySelectFilter.options[i].value == id || studyCategorySelectFilter.options[i].textContent == name) {
                return;
            }
        }
        var optionFilter = document.createElement("option");
        optionFilter.value = id;
        optionFilter.textContent = name;
        studyCategorySelectFilter.appendChild(optionFilter);
    }

    studyCategorySelectFilter.addEventListener('change', function () {
        fetchStudyCardsData("uncompleted");
    });

    // END FILTER CATEGORIA

    fetchStudyCardsData("uncompleted")
    fetchCategories()
});