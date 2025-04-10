const API_URL = 'http://localhost:3001/sessions';
const form = document.getElementById('session-form');
const tableBody = document.querySelector('#sessions-table tbody');

// Carregar sessões ao iniciar
window.addEventListener('DOMContentLoaded', fetchSessions);

// Adicionar nova sessão
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const subject = document.getElementById('subject').value;
  const duration = parseInt(document.getElementById('duration').value);
    console.log(subject)
    console.log(duration)
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, duration_in_hours: duration })
    });
    const novaSessao = await res.json();
    addRow(novaSessao); // adiciona na tabela
    form.reset();
  } catch (err) {
    console.error('Erro ao adicionar sessão', err);
  }
});

// Buscar todas as sessões
async function fetchSessions() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    data.forEach(session => addRow(session));
  } catch (error) {
    console.error('Erro ao buscar sessões:', error);
  }
}

// Adicionar uma linha na tabela
function addRow({ id, subject, duration_in_hours }) {
  const row = document.createElement('tr');
  row.setAttribute('data-id', id);

  row.innerHTML = `
    <td contenteditable="true">${subject}</td>
    <td contenteditable="true">${duration_in_hours}h</td>
    <td>
      <button class="edit">Salvar</button>
      <button class="delete">Remover</button>
    </td>
  `;

  // Remover sessão
  row.querySelector('.delete').addEventListener('click', async () => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      row.remove();
    } catch (err) {
      console.error('Erro ao remover sessão:', err);
    }
  });

  // Atualizar sessão
  row.querySelector('.edit').addEventListener('click', async () => {
    const cells = row.querySelectorAll('td');
    const updatedSubject = cells[0].innerText.trim();
    const updatedDuration = parseInt(cells[1].innerText.trim());

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: updatedSubject, duration_in_hours: updatedDuration })
      });

      if (!res.ok) throw new Error('Erro ao atualizar sessão');

      alert('Sessão atualizada com sucesso!');
    } catch (err) {
      console.error('Erro ao editar sessão:', err);
    }
  });

  tableBody.appendChild(row);
}
