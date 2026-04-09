// edit.js

document.addEventListener('DOMContentLoaded', () => {
    const title = document.title;
    let page = '';
    if (title.includes('Prisoner'))     page = 'prisoner';
    else if (title.includes('Officer')) page = 'officer';
    else if (title.includes('Arrest'))  page = 'arrest';
    else return;

    // Which data columns (0-indexed, excluding the Edit column) are editable
    const editableCols = {
        prisoner: [
            null,                                                                    // ID — read-only
            { type: 'text' },                                                        // Full Name
            { type: 'date' },                                                        // Date of Birth
            { type: 'text' },                                                        // Nationality
            { type: 'select', options: ['Incarcerated', 'Released', 'Wanted'] },    // Status
        ],
        officer: [
            null,                                                                    // ID — read-only
            { type: 'text' },                                                        // Full Name
            { type: 'select', options: ['Officer', 'Sergeant', 'Detective', 'Lieutenant', 'Chief'] },
            { type: 'text' },                                                        // Department
            { type: 'select', options: ['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5'] },
        ],
        arrest: [
            null,                // Case ID — read-only
            null,                // Criminal ID — read-only
            null,                // Officer — read-only
            { type: 'date' },    // Date
            { type: 'text' },    // Charge
        ],
    };

    const cols = editableCols[page];

    function makeInput(cfg, currentValue) {
        let el;
        if (cfg.type === 'select') {
            el = document.createElement('select');
            cfg.options.forEach(opt => {
                const o = document.createElement('option');
                o.value = opt; o.textContent = opt;
                if (opt === currentValue) o.selected = true;
                el.appendChild(o);
            });
        } else {
            el = document.createElement('input');
            el.type = cfg.type;
            el.value = currentValue;
        }
        el.style.cssText = 'background:#000;color:#fff;border:1px solid #5789FF;border-radius:4px;padding:4px 8px;font-size:13px;font-family:"Share Tech Mono",monospace;width:100%;outline:none;box-sizing:border-box;';
        return el;
    }

    function activateRow(tr) {
        // Prevent double-activation
        if (tr.dataset.editing === 'true') return;
        tr.dataset.editing = 'true';

        const cells = Array.from(tr.querySelectorAll('td'));
        const dataCells = cells.slice(0, -1);   // all except last (Edit) cell
        const editCell  = cells[cells.length - 1];

        const originals = dataCells.map(td => td.textContent.trim());

        dataCells.forEach((td, i) => {
            const cfg = cols[i];
            if (!cfg) return;  // read-only
            const input = makeInput(cfg, originals[i]);
            td.textContent = '';
            td.appendChild(input);
        });

        // Replace Edit link with Save / Cancel
        editCell.innerHTML = '';
        editCell.style.background = 'transparent';

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
        saveBtn.style.cssText = 'font-size:11px;color:#000;background:#5789FF;border:none;padding:3px 10px;border-radius:4px;cursor:pointer;font-family:"Share Tech Mono",monospace;margin-right:6px;';

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.style.cssText = 'font-size:11px;color:#5789FF;background:transparent;border:1px solid #5789FF;padding:3px 10px;border-radius:4px;cursor:pointer;font-family:"Share Tech Mono",monospace;';

        editCell.appendChild(saveBtn);
        editCell.appendChild(cancelBtn);

        saveBtn.addEventListener('click', () => {
            let valid = true;
            dataCells.forEach((td, i) => {
                if (!cols[i]) return;
                const el = td.querySelector('input, select');
                if (el && !el.value.trim()) { el.style.borderColor = '#ff4d4d'; valid = false; }
                else if (el) el.style.borderColor = '#5789FF';
            });
            if (!valid) return;

            dataCells.forEach((td, i) => {
                if (!cols[i]) return;
                const el = td.querySelector('input, select');
                if (el) td.textContent = el.value.trim();
            });
            restoreEditCell(tr, editCell);
        });

        cancelBtn.addEventListener('click', () => {
            dataCells.forEach((td, i) => {
                if (!cols[i]) return;
                td.textContent = originals[i];
            });
            restoreEditCell(tr, editCell);
        });
    }

    function restoreEditCell(tr, editCell) {
        tr.dataset.editing = 'false';
        editCell.innerHTML = '';
        const link = document.createElement('a');
        link.href = '#'; link.className = 'edit'; link.textContent = 'Edit';
        link.style.background = 'transparent';
        editCell.appendChild(link);
        link.addEventListener('click', (e) => { e.preventDefault(); activateRow(tr); });
    }

    // Attach to existing Edit links
    document.querySelectorAll('.table tbody .edit').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            activateRow(link.closest('tr'));
        });
    });

    // Delegate for rows added dynamically by add.js
    document.querySelector('.table tbody')?.addEventListener('click', (e) => {
        const link = e.target.closest('.edit');
        if (!link || link.dataset.bound) return;
        link.dataset.bound = 'true';
        e.preventDefault();
        activateRow(link.closest('tr'));
    });
});
