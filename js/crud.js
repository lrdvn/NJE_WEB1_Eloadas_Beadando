// Globális változók: a rekordok és az inkrementáló ID
let records = [];
let nextId = 1;

// Elekmentek kiválasztása a DOM-ból
const form = document.getElementById('record-form');
const recordIdInput = document.getElementById('record-id');
const nameInput = document.getElementById('name');
const heightInput = document.getElementById('height');
const weightInput = document.getElementById('weight');
const formButton = document.getElementById('form-button');
const cancelUpdateBtn = document.getElementById('cancel-update');
const tableBody = document.querySelector('#crud-table tbody');
const filterInput = document.getElementById('filter');

/**
 * renderTable – újrarajzolja a táblázat tartalmát
 * @param {Array} data - A megjelenítendő rekordok tömbje
 */
function renderTable(data) {
  tableBody.innerHTML = '';
  data.forEach(record => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${record.id}</td>
      <td>${record.name}</td>
      <td>${record.height}</td>
      <td>${record.weight}</td>
      <td>
        <button onclick="startEdit(${record.id})">Szerkeszt</button>
        <button onclick="deleteRecord(${record.id})">Töröl</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

/**
 * Form submit esemény:
 * Ha a rejtett rekord ID üres, új rekordot hoz létre (Create),
 * különben frissíti a létező rekordot (Update).
 */
form.addEventListener('submit', function(event) {
  event.preventDefault();
  const name = nameInput.value.trim();
  const height = parseFloat(heightInput.value);
  const weight = parseFloat(weightInput.value);
  
  // Validáció: név kötelező, maximum 30 karakter
  if (name === '' || name.length > 30) {
    alert("A név kötelező és maximum 30 karakter lehet.");
    return;
  }
  // Magasság és súly számként történő ellenőrzése
  if (isNaN(height) || isNaN(weight)) {
    alert("Magasság és súly érvényes számok kell hogy legyenek!");
    return;
  }
  
  const recordId = recordIdInput.value;
  if (recordId) {
    // Létező rekord frissítése
    const record = records.find(r => r.id === parseInt(recordId));
    if (record) {
      record.name = name;
      record.height = height;
      record.weight = weight;
      alert("Rekord frissítve.");
    }
  } else {
    // Új rekord létrehozása
    const newRecord = { id: nextId++, name, height, weight };
    records.push(newRecord);
    alert("Új rekord létrehozva.");
  }
  resetForm();
  renderTable(records);
});

/**
 * startEdit – Rekord szerkesztésének elindítása.
 * A rekord adatait betölti az űrlapba, módosítva a gomb feliratát.
 */
function startEdit(id) {
  const record = records.find(r => r.id === id);
  if (record) {
    recordIdInput.value = record.id;
    nameInput.value = record.name;
    heightInput.value = record.height;
    weightInput.value = record.weight;
    formButton.textContent = "Frissít";
    cancelUpdateBtn.style.display = "inline";
  }
}

/**
 * cancelUpdate – Megszünteti a szerkesztést, visszaállítja az űrlapot.
 */
cancelUpdateBtn.addEventListener('click', function() {
  resetForm();
});

/**
 * resetForm – Visszaállítja az űrlapot alapértelmezettre.
 */
function resetForm() {
  recordIdInput.value = '';
  form.reset();
  formButton.textContent = "Létrehoz";
  cancelUpdateBtn.style.display = "none";
}

/**
 * deleteRecord – Törli a megadott ID-jű rekordot.
 */
function deleteRecord(id) {
  if (confirm("Biztos törlöd ezt a rekordot?")) {
    records = records.filter(r => r.id !== id);
    renderTable(records);
  }
}

/**
 * Sorting: A táblázat fejlécére kattintva a megfelelő oszlop szerint rendez.
 */
const headers = document.querySelectorAll('#crud-table th[data-column]');
headers.forEach(header => {
  header.addEventListener('click', function() {
    const column = this.getAttribute('data-column');
    let order = this.getAttribute('data-order');
    // Váltás: desc -> asc, asc -> desc
    order = order === 'desc' ? 'asc' : 'desc';
    this.setAttribute('data-order', order);
    sortTableByColumn(column, order);
  });
});

/**
 * sortTableByColumn – Sorba rendezi a rekordokat a megadott oszlop és sorrend alapján.
 */
function sortTableByColumn(column, order) {
  records.sort((a, b) => {
    if (typeof a[column] === "number") {
      return order === 'asc' ? a[column] - b[column] : b[column] - a[column];
    } else {
      let aVal = a[column].toLowerCase();
      let bVal = b[column].toLowerCase();
      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
      return 0;
    }
  });
  renderTable(records);
}

/**
 * Szűrés: A beviteli mezőbe írt keresőkifejezés alapján a rekordok között keres.
 */
filterInput.addEventListener('input', function() {
  const query = this.value.toLowerCase();
  const filtered = records.filter(record =>
    record.id.toString().includes(query) ||
    record.name.toLowerCase().includes(query) ||
    record.height.toString().includes(query) ||
    record.weight.toString().includes(query)
  );
  renderTable(filtered);
});

// Első render: üres állapottal
renderTable(records);

// Hogy a startEdit és deleteRecord függvények hozzáférhetők legyenek a HTML-ből is
window.startEdit = startEdit;
window.deleteRecord = deleteRecord;
