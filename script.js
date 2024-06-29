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

    // Abrir o modal ao clicar no botão
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
        const volunteerData = {
            title: form.studyTitle.value,
            description: form.studyDescription.value,
            content: form.studyContent.value,
            priority: form.studyPriority.value,
        };

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
                    if(status == "uncompleted")
                        fetchStudyCardsData("uncompleted")
                    else
                    fetchStudyCardsData("completed")
                }
            });
        });
    }

    async function handleCompleteStudy(studyId) {
        openConfirmationModal('Tem certeza de que deseja concluir este estudo?', 'Confirmar', async function () {
            await fetch(`http://127.0.0.1:5000/study/completed?id=${studyId}`, {
                method: 'PUT',
            }).then(function (response) {
                if (response.ok) fetchStudyCardsData("uncompleted")
            });
        });
    }
    async function handleUncompleteStudy(studyId) {
        openConfirmationModal('Tem certeza de que deseja reverter este estudo?', 'Confirmar', async function () {
            await fetch(`http://127.0.0.1:5000/study/uncompleted?id=${studyId}`, {
                method: 'PUT',
            }).then(function (response) {
                if (response.ok) fetchStudyCardsData("completed")
            });
        });
    }



    async function fetchStudyCardsData(filter) {
        try {
            const response = await fetch(`http://127.0.0.1:5000/studies?status=${filter}`);
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const data = await response.json();

            const container = document.getElementById('studyCardsContainer');
            container.innerHTML = '';
            if(data.studies.length <=0) {
                container.innerHTML = `<h2>Nenhum study encontrado :( </h2>`;
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
                        </div>
                    </div>
                `;
                } else {
                    card.innerHTML = `
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
                    deleteBtn.addEventListener('click', () => handleDeleteStudy(study.id));
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

    fetchStudyCardsData("uncompleted")
});