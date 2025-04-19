// js/ajax.js
const API_URL = "http://gamf.nhely.hu/ajax2/";
const userCode = "CQDOGVabc123"; 

document.addEventListener('DOMContentLoaded', function() {
    const ajaxForm = document.getElementById('ajax-form');
    const recordIdInput = document.getElementById('record-id');
    const nameInput = document.getElementById('ajax-name');
    const heightInput = document.getElementById('ajax-height');
    const weightInput = document.getElementById('ajax-weight');
    const btnSubmit = document.getElementById('btn-submit');
    const btnCancel = document.getElementById('btn-cancel');
    const updateIdInput = document.getElementById('update-id');
    const btnGetData = document.getElementById('btn-getData');
    const recordListDiv = document.getElementById('record-list');
    const heightSummaryDiv = document.getElementById('height-summary');
    const ajaxResultDiv = document.getElementById('ajax-result');

    // Segítő függvény: visszajelzés megjelenítése
    function showMessage(msg) {
        ajaxResultDiv.textContent = msg;
    }

    // Objektum átalakítása URL-encoded formátumba
    function toUrlEncoded(obj) {
        return Object.keys(obj)
                     .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
                     .join('&');
    }

    // Rekordok lekérése és listázása
    function readRecords() {
        const params = { op: "read", code: userCode };
        fetch(API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: toUrlEncoded(params)
        })
        .then(response => response.json())
        .then(data => {
            if(data.list) {
                displayRecords(data.list);
                displayHeightSummary(data.list);
            } else {
                recordListDiv.textContent = "Nincs adat.";
            }
        })
        .catch(err => {
            showMessage("Hiba az adatok lekérésekor: " + err);
        });
    }

    // Rekordok megjelenítése
    function displayRecords(records) {
        recordListDiv.innerHTML = "";
        records.forEach(record => {
            const div = document.createElement('div');
            div.style.borderBottom = "1px solid #ccc";
            div.style.padding = "5px";
            div.textContent = `ID: ${record.id}, Név: ${record.name}, Magasság: ${record.height}, Súly: ${record.weight}`;
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = "Töröl";
            deleteBtn.style.marginLeft = "10px";
            deleteBtn.addEventListener('click', function(){
                deleteRecord(record.id);
            });
            div.appendChild(deleteBtn);
            recordListDiv.appendChild(div);
        });
    }

    // Magasság értékek statisztikája: összeg, átlag, maximum
    function displayHeightSummary(records) {
        const heights = records.map(r => parseFloat(r.height));
        if(heights.length === 0) {
            heightSummaryDiv.textContent = "";
            return;
        }
        const sum = heights.reduce((a, b) => a + b, 0);
        const avg = sum / heights.length;
        const max = Math.max(...heights);
        heightSummaryDiv.innerHTML = `<strong>Magasság statisztika:</strong> Összeg: ${sum.toFixed(2)}, Átlag: ${avg.toFixed(2)}, Maximum: ${max}`;
    }

    // Rekord törlése
    function deleteRecord(id) {
        if(confirm("Biztos törlöd a(z) " + id + " azonosítójú rekordot?")) {
            const params = { op: "delete", id: id, code: userCode };
            fetch(API_URL, {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: toUrlEncoded(params)
            })
            .then(response => response.json())
            .then(data => {
                showMessage("Törlés: " + JSON.stringify(data));
                readRecords();
            })
            .catch(err => {
                showMessage("Hiba a törlés során: " + err);
            });
        }
    }

    // Űrlap visszaállítása (Create mód)
    function resetForm() {
        recordIdInput.value = "";
        ajaxForm.reset();
        btnSubmit.textContent = "Létrehoz";
        btnCancel.style.display = "none";
    }

    // Űrlap submit: Create vagy Update művelet
    ajaxForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = nameInput.value.trim();
        const height = heightInput.value.trim();
        const weight = weightInput.value.trim();
        
        // Validáció: Név kötelező, maximum 30 karakter
        if(name === "" || name.length > 30) {
            showMessage("Hibás adat: Név kötelező és maximum 30 karakter!");
            return;
        }
        if(height === "" || isNaN(parseFloat(height)) || weight === "" || isNaN(parseFloat(weight))) {
            showMessage("Hibás adat: Magasság és Súly érvényes számok kell legyenek!");
            return;
        }
        
        const isUpdate = recordIdInput.value !== "";
        let opType = isUpdate ? "update" : "create";
        const params = {
            op: opType,
            code: userCode,
            name: name,
            height: height,
            weight: weight
        };
        if(isUpdate) {
            params.id = recordIdInput.value;
        }
        
        fetch(API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: toUrlEncoded(params)
        })
        .then(response => response.json())
        .then(data => {
            showMessage((isUpdate ? "Frissítés" : "Létrehozás") + " sikeressége: " + JSON.stringify(data));
            resetForm();
            readRecords();
        })
        .catch(err => {
            showMessage("Hiba a művelet során: " + err);
        });
    });

    // Rekord adatainak kiolvasása egy adott ID alapján (Update előkészítés)
    btnGetData.addEventListener('click', function(){
        const idToGet = updateIdInput.value.trim();
        if(idToGet === ""){
            showMessage("Kérlek add meg a rekord ID-t!");
            return;
        }
        const params = { op: "read", code: userCode };
        fetch(API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: toUrlEncoded(params)
        })
        .then(response => response.json())
        .then(data => {
            if(data.list && data.list.length > 0) {
                const record = data.list.find(r => r.id == idToGet);
                if(record) {
                    // Űrlap mezők kitöltése a rekord adataival
                    recordIdInput.value = record.id;
                    nameInput.value = record.name;
                    heightInput.value = record.height;
                    weightInput.value = record.weight;
                    btnSubmit.textContent = "Frissít";
                    btnCancel.style.display = "inline";
                    showMessage("Rekord betöltve az ID alapján.");
                } else {
                    showMessage("Nem található rekord ezzel az ID-val.");
                }
            } else {
                showMessage("Nincs lekérhető adat.");
            }
        })
        .catch(err => {
            showMessage("Hiba a rekord lekérésekor: " + err);
        });
    });

    // Módosítás megszakítása
    btnCancel.addEventListener('click', function(){
        resetForm();
        showMessage("Módosítás megszakítva.");
    });

    // Induló rekordszolgáltatás
    readRecords();
});
