const cursosList = document.getElementById('cursos-list');
const alunosList = document.getElementById('alunos-list');
const alunoCursoSelect = document.getElementById('aluno-curso');
const cursoForm = document.getElementById('curso-form');
const alunoForm = document.getElementById('aluno-form');
const refreshButton = document.getElementById('refresh-all');
const toast = document.getElementById('toast');

let cursosCache = [];

function showToast(message, type = 'success') {
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  setTimeout(() => {
    toast.className = 'toast';
  }, 2200);
}

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.mensagem || 'Erro na requisição.';
    throw new Error(message);
  }

  return data;
}

function renderCursos(cursos) {
  cursosList.innerHTML = '';
  alunoCursoSelect.innerHTML = '<option value="">Selecione um curso</option>';

  cursos.forEach((curso) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${curso.id}</td>
      <td>${curso.nome}</td>
      <td class="actions">
        <button class="btn btn-small btn-secondary" data-action="edit-curso" data-id="${curso.id}">Editar</button>
        <button class="btn btn-small btn-danger" data-action="delete-curso" data-id="${curso.id}">Excluir</button>
      </td>
    `;
    cursosList.appendChild(tr);

    const option = document.createElement('option');
    option.value = String(curso.id);
    option.textContent = `${curso.nome} (ID ${curso.id})`;
    alunoCursoSelect.appendChild(option);
  });
}

function renderAlunos(alunos) {
  alunosList.innerHTML = '';

  alunos.forEach((aluno) => {
    const curso = cursosCache.find((item) => item.id === aluno.curso_id);
    const cursoNome = curso ? curso.nome : `ID ${aluno.curso_id}`;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${aluno.id}</td>
      <td>${aluno.nome}</td>
      <td>${aluno.email}</td>
      <td>${cursoNome}</td>
      <td class="actions">
        <button class="btn btn-small btn-secondary" data-action="edit-aluno" data-id="${aluno.id}">Editar</button>
        <button class="btn btn-small btn-danger" data-action="delete-aluno" data-id="${aluno.id}">Excluir</button>
      </td>
    `;
    alunosList.appendChild(tr);
  });
}

async function loadCursos() {
  const cursos = await apiRequest('/api/cursos');
  cursosCache = cursos;
  renderCursos(cursos);
}

async function loadAlunos() {
  const alunos = await apiRequest('/api/alunos');
  renderAlunos(alunos);
}

async function refreshAll() {
  try {
    await loadCursos();
    await loadAlunos();
    showToast('Dados atualizados com sucesso.');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

cursoForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(cursoForm);
  const nome = String(formData.get('nome') || '').trim();

  if (!nome) {
    showToast('Informe o nome do curso.', 'error');
    return;
  }

  try {
    await apiRequest('/api/cursos', {
      method: 'POST',
      body: JSON.stringify({ nome })
    });
    cursoForm.reset();
    await refreshAll();
    showToast('Curso cadastrado.');
  } catch (error) {
    showToast(error.message, 'error');
  }
});

alunoForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(alunoForm);
  const nome = String(formData.get('nome') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const curso_id = Number(formData.get('curso_id'));

  if (!nome || !email || !curso_id) {
    showToast('Preencha nome, e-mail e curso.', 'error');
    return;
  }

  try {
    await apiRequest('/api/alunos', {
      method: 'POST',
      body: JSON.stringify({ nome, email, curso_id })
    });
    alunoForm.reset();
    await refreshAll();
    showToast('Aluno cadastrado.');
  } catch (error) {
    showToast(error.message, 'error');
  }
});

cursosList.addEventListener('click', async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  const id = Number(target.dataset.id);
  const action = target.dataset.action;

  if (action === 'delete-curso') {
    if (!confirm('Deseja excluir este curso?')) {
      return;
    }

    try {
      await apiRequest(`/api/cursos/${id}`, { method: 'DELETE' });
      await refreshAll();
      showToast('Curso excluído.');
    } catch (error) {
      showToast(error.message, 'error');
    }
  }

  if (action === 'edit-curso') {
    const atual = cursosCache.find((item) => item.id === id);
    const novoNome = prompt('Novo nome do curso:', atual?.nome || '');

    if (!novoNome || !novoNome.trim()) {
      return;
    }

    try {
      await apiRequest(`/api/cursos/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ nome: novoNome.trim() })
      });
      await refreshAll();
      showToast('Curso atualizado.');
    } catch (error) {
      showToast(error.message, 'error');
    }
  }
});

alunosList.addEventListener('click', async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  const id = Number(target.dataset.id);
  const action = target.dataset.action;

  if (action === 'delete-aluno') {
    if (!confirm('Deseja excluir este aluno?')) {
      return;
    }

    try {
      await apiRequest(`/api/alunos/${id}`, { method: 'DELETE' });
      await refreshAll();
      showToast('Aluno excluído.');
    } catch (error) {
      showToast(error.message, 'error');
    }
  }

  if (action === 'edit-aluno') {
    const novoNome = prompt('Novo nome do aluno (deixe vazio para manter):', '');
    const novoEmail = prompt('Novo e-mail do aluno (deixe vazio para manter):', '');
    const novoCursoId = prompt('Novo curso_id do aluno (deixe vazio para manter):', '');

    const payload = {};
    if (novoNome && novoNome.trim()) {
      payload.nome = novoNome.trim();
    }
    if (novoEmail && novoEmail.trim()) {
      payload.email = novoEmail.trim();
    }
    if (novoCursoId && novoCursoId.trim()) {
      payload.curso_id = Number(novoCursoId.trim());
    }

    if (!Object.keys(payload).length) {
      return;
    }

    try {
      await apiRequest(`/api/alunos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
      await refreshAll();
      showToast('Aluno atualizado.');
    } catch (error) {
      showToast(error.message, 'error');
    }
  }
});

refreshButton.addEventListener('click', refreshAll);

refreshAll();
