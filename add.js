// add.js

document.addEventListener('DOMContentLoaded', () => {
    const title = document.title;
    let page = '';
    if (title.includes('Prisoner'))  page = 'prisoner';
    else if (title.includes('Officer')) page = 'officer';
    else if (title.includes('Arrest'))  page = 'arrest';
    else return;

    const fieldSets = {
        prisoner: [
            { name: 'id',          label: 'ID',            type: 'text',   placeholder: 'CR-XXXX'      },
            { name: 'fullName',    label: 'Full Name',     type: 'text',   placeholder: 'Full Name'    },
            { name: 'dob',         label: 'Date of Birth', type: 'date',   placeholder: ''             },
            { name: 'nationality', label: 'Nationality',   type: 'text',   placeholder: 'e.g. American'},
            { name: 'status',      label: 'Status',        type: 'select', options: ['Incarcerated', 'Released', 'Wanted'] },
        ],
        officer: [
            { name: 'id',         label: 'ID',         type: 'text',   placeholder: 'OFF-XXXXX'  },
            { name: 'fullName',   label: 'Full Name',  type: 'text',   placeholder: 'Full Name'  },
            { name: 'rank',       label: 'Rank',       type: 'select', options: ['Officer', 'Sergeant', 'Detective', 'Lieutenant', 'Chief'] },
            { name: 'department', label: 'Department', type: 'text',   placeholder: 'e.g. Patrol'},
            { name: 'clearance',  label: 'Clearance',  type: 'select', options: ['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5'] },
        ],
        arrest: [
            { name: 'caseId',     label: 'Case ID',           type: 'text', placeholder: 'AR-XXXX'   },
            { name: 'criminalId', label: 'Criminal ID',       type: 'text', placeholder: 'CR-XXXX'   },
            { name: 'officerId',  label: 'Arresting Officer', type: 'text', placeholder: 'OFF-XXXXX' },
            { name: 'date',       label: 'Date',              type: 'date', placeholder: ''           },
            { name: 'charge',     label: 'Charge',            type: 'text', placeholder: 'e.g. Fraud'},
        ],
    };

    const fields = fieldSets[page];

    // ---------- build modal ----------
    const overlay = document.createElement('div');
    overlay.id = 'add-overlay';
    overlay.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:100;align-items:center;justify-content:center;';

    const modal = document.createElement('div');
    modal.style.cssText = 'background:#000;border:1px solid #5789FF;box-shadow:0 0 30px rgba(87,137,255,0.3);border-radius:10px;padding:32px;width:340px;max-width:95vw;font-family:"Share Tech Mono",monospace;';

    const heading = document.createElement('h2');
    heading.textContent = 'Add Record';
    heading.style.cssText = 'font-size:15px;color:#5789FF;margin-bottom:24px;background:transparent;letter-spacing:0.15em;';
    modal.appendChild(heading);

    fields.forEach(f => {
        const wrap = document.createElement('div');
        wrap.style.cssText = 'margin-bottom:16px;background:transparent;';

        const lbl = document.createElement('label');
        lbl.textContent = f.label;
        lbl.style.cssText = 'display:block;font-size:11px;color:#5789FF;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:6px;background:transparent;';

        let el;
        if (f.type === 'select') {
            el = document.createElement('select');
            f.options.forEach(opt => {
                const o = document.createElement('option');
                o.value = opt; o.textContent = opt;
                el.appendChild(o);
            });
        } else {
            el = document.createElement('input');
            el.type = f.type;
            el.placeholder = f.placeholder || '';
        }
        el.name = f.name;
        el.style.cssText = 'display:block;width:100%;padding:8px 12px;background:#000;color:#fff;border:1px solid #5789FF;border-radius:6px;font-size:13px;font-family:"Share Tech Mono",monospace;outline:none;box-sizing:border-box;';

        const err = document.createElement('span');
        err.className = 'field-error';
        err.style.cssText = 'display:none;color:#ff4d4d;font-size:11px;margin-top:4px;background:transparent;';

        wrap.appendChild(lbl);
        wrap.appendChild(el);
        wrap.appendChild(err);
        modal.appendChild(wrap);
    });

    const btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;gap:12px;margin-top:8px;background:transparent;';

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.style.cssText = 'flex:1;padding:8px;background:#5789FF;color:#000;border:none;border-radius:6px;font-size:13px;cursor:pointer;font-family:"Share Tech Mono",monospace;letter-spacing:0.1em;';

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.cssText = 'flex:1;padding:8px;background:transparent;color:#5789FF;border:1px solid #5789FF;border-radius:6px;font-size:13px;cursor:pointer;font-family:"Share Tech Mono",monospace;letter-spacing:0.1em;';

    btnRow.appendChild(saveBtn);
    btnRow.appendChild(cancelBtn);
    modal.appendChild(btnRow);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // ---------- open / close ----------
    function openModal() {
        overlay.style.display = 'flex';
        modal.querySelectorAll('input, select').forEach(el => {
            el.tagName === 'SELECT' ? (el.selectedIndex = 0) : (el.value = '');
            el.style.borderColor = '#5789FF';
        });
        modal.querySelectorAll('.field-error').forEach(e => e.style.display = 'none');
    }

    function closeModal() { overlay.style.display = 'none'; }

    const addLink = document.querySelector('.add');
    if (addLink) {
        addLink.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
    }

    cancelBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });

    // ---------- save ----------
    saveBtn.addEventListener('click', () => {
        let valid = true;
        modal.querySelectorAll('input, select').forEach(el => {
            const err = el.nextElementSibling;
            if (!el.value.trim()) {
                el.style.borderColor = '#ff4d4d';
                if (err) { err.textContent = 'Required.'; err.style.display = 'block'; }
                valid = false;
            } else {
                el.style.borderColor = '#5789FF';
                if (err) err.style.display = 'none';
            }
        });
        if (!valid) return;

        const tbody = document.querySelector('.table tbody');
        const tr = document.createElement('tr');
        modal.querySelectorAll('input, select').forEach(el => {
            const td = document.createElement('td');
            td.textContent = el.value.trim();
            tr.appendChild(td);
        });
        const editTd = document.createElement('td');
        const editLink = document.createElement('a');
        editLink.href = '#'; editLink.className = 'edit'; editLink.textContent = 'Edit';
        editTd.appendChild(editLink);
        tr.appendChild(editTd);
        tbody.appendChild(tr);

        closeModal();
    });
});
