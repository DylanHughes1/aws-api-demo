const loginForm = document.getElementById('loginForm');
const loginResponse = document.getElementById('loginResponse');
const loginSection = document.getElementById('loginSection');
const uploadSection = document.getElementById('uploadSection');
const uploadForm = document.getElementById('uploadForm');
const showFilesBtn = document.getElementById('showFilesBtn');
const fileList = document.getElementById('fileList');
const logoutBtn = document.getElementById('logoutBtn');

let accessToken = null;

// === LOGIN ===
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (data.tokens?.accessToken) {
            accessToken = data.tokens.accessToken;
            loginResponse.textContent = 'Login exitoso!';
            loginSection.style.display = 'none';
            uploadSection.style.display = 'block';
        } else {
            loginResponse.textContent = 'Error: ' + (data.message || 'No se pudo autenticar');
        }
    } catch (error) {
        loginResponse.textContent = 'Error de red: ' + error.message;
    }
});

// === LOGOUT ===
logoutBtn.addEventListener('click', () => {
    accessToken = null;
    loginSection.style.display = 'block';
    uploadSection.style.display = 'none';
    loginForm.reset();
    document.getElementById('response').textContent = '';
    fileList.innerHTML = '';
    loginResponse.textContent = '';
});

// === SUBIR ARCHIVO ===
uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const file = document.getElementById('photo').files[0];
    const formData = new FormData();
    formData.append('photo', file);

    const response = await fetch('/upload', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        body: formData,
    });

    const result = await response.json();
    document.getElementById('response').textContent = result.s3Data?.url
        ? `Archivo subido: ${result.s3Data.url}`
        : 'Error al subir.';
});

// === VER ARCHIVOS ===
showFilesBtn.addEventListener('click', async () => {
    const response = await fetch('/files', {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    const files = await response.json();
    fileList.innerHTML = '';

    if (!files.length) {
        fileList.textContent = 'No hay archivos subidos.';
        return;
    }

    const list = document.createElement('div');
    list.style.display = 'flex';
    list.style.flexWrap = 'wrap';
    list.style.gap = '10px';

    files.forEach(file => {
        const container = document.createElement('div');
        container.style.border = '1px solid #ccc';
        container.style.padding = '10px';
        container.style.textAlign = 'center';
        container.style.width = '150px';

        const img = document.createElement('img');
        img.src = file.url;
        img.alt = file.filename;
        img.style.maxHeight = '100px';
        img.style.objectFit = 'cover';

        const link = document.createElement('a');
        link.href = file.url;
        link.textContent = file.filename;
        link.target = '_blank';

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.style.marginTop = '5px';
        deleteBtn.addEventListener('click', async () => {
            if (!confirm(`¿Eliminar "${file.filename}"?`)) return;

            const res = await fetch('/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify({ key: file.fileId }),
            });

            const result = await res.json();
            alert(result.message);
            showFilesBtn.click();
        });

        container.appendChild(img);
        container.appendChild(document.createElement('br'));
        container.appendChild(link);
        container.appendChild(document.createElement('br'));
        container.appendChild(deleteBtn);

        list.appendChild(container);
    });

    fileList.appendChild(list);
});
