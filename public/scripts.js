//Subir archivo
const form = document.getElementById('uploadForm');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const file = document.getElementById('photo').files[0];
    formData.append('photo', file);

    const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
    });

    const result = await response.json();
    document.getElementById('response').textContent = result.s3Data?.url
        ? `Archivo subido: ${result.s3Data.url}`
        : 'Error al subir.';
});

// Ver archivos
document.getElementById('showFilesBtn').addEventListener('click', async () => {
    const response = await fetch('/files');
    const files = await response.json();

    const fileListDiv = document.getElementById('fileList');
    fileListDiv.innerHTML = ''; // Limpiar antes

    if (files.length === 0) {
        fileListDiv.textContent = 'No hay archivos subidos.';
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
            const confirmDelete = confirm(`¿Eliminar "${file.filename}"?`);
            if (!confirmDelete) return;

            const res = await fetch('/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ key: file.fileId }),
            });

            const result = await res.json();
            alert(result.message);

            // Recargar lista luego de borrar
            document.getElementById('showFilesBtn').click();
        });

        container.appendChild(img);
        container.appendChild(document.createElement('br'));
        container.appendChild(link);
        container.appendChild(document.createElement('br'));
        container.appendChild(deleteBtn);

        list.appendChild(container);
    });

    fileListDiv.appendChild(list);
});

