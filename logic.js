const app = {
    lang: 'en',
    trips: [],

    init() {
        this.setLang('ru');
        this.populateLevels();
        this.addTrip(); 
        this.loadLocal();
    },

    setLang(l) {
        this.lang = l;
        document.querySelectorAll('.lang-toggle').forEach(el => el.classList.remove('active'));
        document.getElementById(`lang-${l}`).classList.add('active');
        
        const txt = CONFIG.text[l];
        const bind = (id, val, isHTML=false) => { 
            const el = document.getElementById(id); 
            if(el) { if(isHTML) el.innerHTML = val; else el.innerText = val; } 
        };
        
        bind('txt-title', txt.title); bind('txt-desc', txt.description);
        bind('txt-disc1', txt.disclaimer1); bind('txt-disc2', txt.disclaimer2);
        bind('txt-app', txt.blocks.app); bind('txt-law', txt.blocks.law);
        bind('txt-lawDesc', txt.lawDesc, true); bind('txt-trips', txt.blocks.trips);
        bind('txt-statement', txt.blocks.statement);
        
        bind('lbl-langLevel', txt.labels.langLevel); bind('lbl-firstReceipt', txt.labels.firstReceipt);
        bind('lbl-appDate', txt.labels.appDate); bind('lbl-lawInterp', txt.labels.lawInterp);
        bind('lbl-latest', txt.labels.toggleLatest); bind('lbl-strict', txt.labels.toggleStrict);
        bind('lbl-arc', txt.labels.arc); bind('lbl-name', txt.labels.name);
        bind('lbl-mp', txt.labels.mp); bind('txt-stateInfo', txt.labels.statementInfo);

        bind('th-period', txt.appTable.period); bind('th-absence', txt.appTable.absence);
        bind('th-daysInCy', txt.appTable.daysInCy); bind('th-credited', txt.appTable.credited);
        bind('th-total', txt.appTable.total);

        bind('th-t-trip', txt.tripTable.trip); bind('th-t-depDate', txt.tripTable.depDate);
        bind('th-t-depPass', txt.tripTable.depPass); bind('th-t-depStamp', txt.tripTable.depStamp);
        bind('th-t-retDate', txt.tripTable.retDate); bind('th-t-retPass', txt.tripTable.retPass);
        bind('th-t-retStamp', txt.tripTable.retStamp); bind('th-t-daysAway', txt.tripTable.daysAway);

        bind('btn-generate', txt.buttons.generate); bind('btn-save', txt.buttons.save);
        bind('btn-load', txt.buttons.load); bind('btn-clear', txt.buttons.clear);

        bind('contact-desc', txt.contactDesc);
        bind('btn-contact-text', txt.contactBtn);
        bind('btn-support-text', txt.supportBtn);

        this.populateLevels();
        this.renderTrips();
        this.calculate();
    },

    populateLevels() {
        const sel = document.getElementById('inp-level');
        const curr = sel.value;
        sel.innerHTML = '';
        const lvls = CONFIG.text[this.lang].levels;
        for (const [key, val] of Object.entries(lvls)) { sel.appendChild(new Option(val, key)); }
        if (curr) sel.value = curr;
    },

    calculate() {
        this.saveLocal();
        const appDateStr = document.getElementById('inp-app').value;
        const receiptDateStr = document.getElementById('inp-receipt').value;
        const isStrict = document.getElementById('inp-strict').checked;
        const tbody = document.getElementById('app-body');
        tbody.innerHTML = '';

        if (!appDateStr || !receiptDateStr) {
            document.getElementById('tot-absence').innerText = '0';
            document.getElementById('tot-cy').innerText = '0';
            document.getElementById('tot-credit').innerText = '0';
            document.getElementById('tot-status').innerText = '';
            return;
        }

        let currEnd = new Date(appDateStr);
        const limitDate = new Date(receiptDateStr);
        let totalAbs = 0, totalCy = 0, totalCred = 0, periodCount = 0;

        while (currEnd > limitDate && periodCount < 10) {
            let currStart = new Date(currEnd);
            currStart.setFullYear(currStart.getFullYear() - 1);
            currStart.setDate(currStart.getDate() + 1);

            if (currStart < limitDate) currStart = new Date(limitDate);

            const pLength = this.diffDays(currStart, currEnd) + 1;
            const pAbsence = this.getAbsenceForPeriod(currStart, currEnd);
            const pCyprus = pLength - pAbsence;
            
            let pCredited = 0, statusKey = '', rowClass = '';
            let isFinalYear = (periodCount === 0);

            if (isFinalYear) {
                pCredited = pCyprus;
                if (pAbsence > 90) { rowClass = 'row-error'; statusKey = 'fail'; } 
                else { statusKey = 'good'; }
            } else {
                if (isStrict) {
                    pCredited = pCyprus;
                    if(pAbsence > 90) { rowClass = 'row-warning'; statusKey = 'deducted'; } 
                    else { statusKey = 'good'; }
                } else {
                    if (pAbsence <= 90) { pCredited = pLength; statusKey = 'good'; } 
                    else { pCredited = pLength - (pAbsence - 90); rowClass = 'row-warning'; statusKey = 'deducted'; }
                }
            }

            totalAbs += pAbsence; totalCy += pCyprus; totalCred += pCredited;

            const tr = document.createElement('tr');
            if (rowClass) tr.className = rowClass;
            tr.innerHTML = `
                <td>${this.formatD(currStart)} - ${this.formatD(currEnd)}</td>
                <td class="center-text">${pAbsence > 0 ? pAbsence : '-'}</td>
                <td class="center-text">${pCyprus}</td>
                <td class="center-text">${pCredited}</td>
                <td>${CONFIG.text[this.lang].status[statusKey]}</td>
            `;
            tbody.appendChild(tr);

            currEnd = new Date(currStart);
            currEnd.setDate(currEnd.getDate() - 1);
            periodCount++;
        }

        document.getElementById('tot-absence').innerText = totalAbs;
        document.getElementById('tot-cy').innerText = totalCy;
        document.getElementById('tot-credit').innerText = totalCred;
        
        const lvl = document.getElementById('inp-level').value;
        const target = lvl === 'b1' ? 1460 : (lvl === 'a2' ? 1825 : 2555);
        
        // Inject the exact target number into the "wait" string
        let waitText = CONFIG.text[this.lang].status.wait.replace('{target}', target);
        document.getElementById('tot-status').innerText = totalCred >= target ? CONFIG.text[this.lang].status.ready : waitText;
    },

    getAbsenceForPeriod(pStart, pEnd) {
        let abs = 0;
        this.trips.forEach(t => {
            if(!t.dep || !t.ret) return;
            const dStart = new Date(t.dep), dEnd = new Date(t.ret);
            if (dEnd < pStart || dStart > pEnd) return;
            const oStart = dStart < pStart ? pStart : dStart;
            const oEnd = dEnd > pEnd ? pEnd : dEnd;
            abs += this.diffDays(oStart, oEnd);
        });
        return abs;
    },

    diffDays(d1, d2) { return Math.round(Math.abs((d2 - d1) / (1000 * 60 * 60 * 24))); },
    formatD(d) { return d.toLocaleDateString('en-GB'); },

    addTrip() {
        this.trips.push({ id: Date.now(), name: '', dep: '', dPass: '', dStamp: '', ret: '', rPass: '', rStamp: '' });
        this.renderTrips();
    },
    removeTrip(id) {
        this.trips = this.trips.filter(t => t.id !== id);
        this.renderTrips();
        this.calculate();
    },
    updateTrip(id, field, val) {
        const trip = this.trips.find(t => t.id === id);
        if (trip) trip[field] = val;
        
        const idx = this.trips.findIndex(t => t.id === id);
        if (field === 'dPass' && !trip.rPass) trip.rPass = val;
        if (field === 'rPass' && idx < this.trips.length - 1 && !this.trips[idx+1].dPass) this.trips[idx+1].dPass = val;

        this.renderTrips();
        this.calculate();
    },

    renderTrips() {
        const tbody = document.getElementById('trips-body');
        tbody.innerHTML = '';
        const texts = CONFIG.text[this.lang];
        
        const validTrips = this.trips.filter(t => t.dep && t.ret);

        this.trips.forEach((t, i) => {
            const tr = document.createElement('tr');
            let days = 0, isOverlap = false, dateErr = false;

            if (t.dep && t.ret) {
                const depD = new Date(t.dep), retD = new Date(t.ret);
                if (retD < depD) dateErr = true;
                else {
                    days = this.diffDays(depD, retD);
                    validTrips.forEach(v => {
                        if (v.id !== t.id) {
                            const vDep = new Date(v.dep), vRet = new Date(v.ret);
                            if (depD <= vRet && retD >= vDep) isOverlap = true;
                        }
                    });
                }
            }
            
            const ph = texts.placeholders[i % texts.placeholders.length];
            const errClass = (dateErr || isOverlap) ? 'error-input' : '';

            tr.innerHTML = `
                <td><input type="text" class="trip-name" placeholder="${ph}" value="${t.name}" onchange="app.updateTrip(${t.id}, 'name', this.value)"></td>
                <td><input type="date" value="${t.dep}" class="${errClass}" onchange="app.updateTrip(${t.id}, 'dep', this.value)"></td>
                <td><input type="text" value="${t.dPass}" onchange="app.updateTrip(${t.id}, 'dPass', this.value)"></td>
                <td><input type="number" value="${t.dStamp}" onchange="app.updateTrip(${t.id}, 'dStamp', this.value)"></td>
                <td><input type="date" value="${t.ret}" class="${errClass}" onchange="app.updateTrip(${t.id}, 'ret', this.value)"></td>
                <td><input type="text" value="${t.rPass}" onchange="app.updateTrip(${t.id}, 'rPass', this.value)"></td>
                <td><input type="number" value="${t.rStamp}" onchange="app.updateTrip(${t.id}, 'rStamp', this.value)"></td>
                <td><input type="text" class="flat-calc center-text" value="${days || '-'}" readonly></td>
                <td class="center-text"><button class="btn-icon" onclick="app.removeTrip(${t.id})">✕</button></td>
            `;
            tbody.appendChild(tr);
        });
    },

    saveLocal() {
        const data = {
            level: document.getElementById('inp-level').value,
            receipt: document.getElementById('inp-receipt').value,
            app: document.getElementById('inp-app').value,
            strict: document.getElementById('inp-strict').checked,
            arc: document.getElementById('inp-arc').value,
            name: document.getElementById('inp-name').value,
            mp: document.getElementById('inp-mp').value,
            trips: this.trips
        };
        localStorage.setItem('cyprus_calc', JSON.stringify(data));
    },
    loadLocal() {
        const str = localStorage.getItem('cyprus_calc');
        if (str) {
            const data = JSON.parse(str);
            if(data.level) document.getElementById('inp-level').value = data.level;
            if(data.receipt) document.getElementById('inp-receipt').value = data.receipt;
            if(data.app) document.getElementById('inp-app').value = data.app;
            if(data.strict !== undefined) document.getElementById('inp-strict').checked = data.strict;
            if(data.arc) document.getElementById('inp-arc').value = data.arc;
            if(data.name) document.getElementById('inp-name').value = data.name;
            if(data.mp) document.getElementById('inp-mp').value = data.mp;
            if(data.trips) this.trips = data.trips;
            this.renderTrips();
            this.calculate();
        }
    },
    clearAll() {
        if(!confirm('Are you sure you want to clear all data?')) return;
        localStorage.removeItem('cyprus_calc');
        document.querySelectorAll('input:not([type="checkbox"])').forEach(i => i.value = '');
        this.trips = [];
        this.addTrip();
        this.calculate();
    },
    saveCSV() {
        let csv = "Key,Value\n";
        csv += `Level,${document.getElementById('inp-level').value}\n`;
        csv += `Receipt,${document.getElementById('inp-receipt').value}\n`;
        csv += `AppDate,${document.getElementById('inp-app').value}\n`;
        csv += `Strict,${document.getElementById('inp-strict').checked}\n`;
        csv += `ARC,${document.getElementById('inp-arc').value}\n`;
        csv += `Name,${document.getElementById('inp-name').value}\n`;
        csv += `MP,${document.getElementById('inp-mp').value}\n`;
        csv += "\nTrip,DepDate,DepPass,DepStamp,RetDate,RetPass,RetStamp\n";
        this.trips.forEach(t => { csv += `${t.name||''},${t.dep||''},${t.dPass||''},${t.dStamp||''},${t.ret||''},${t.rPass||''},${t.rStamp||''}\n`; });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
        a.download = 'M127_Calculator_Backup.csv';
        a.click();
    },
    loadCSV(input) {
        const file = input.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const lines = e.target.result.split('\n').map(l => l.trim());
            this.trips = []; let inTrips = false;
            lines.forEach(line => {
                if (!line) return; const cols = line.split(',');
                if (cols[0] === 'Trip') { inTrips = true; return; }
                if (!inTrips && cols.length >= 2) {
                    if(cols[0]==='Level') document.getElementById('inp-level').value = cols[1];
                    if(cols[0]==='Receipt') document.getElementById('inp-receipt').value = cols[1];
                    if(cols[0]==='AppDate') document.getElementById('inp-app').value = cols[1];
                    if(cols[0]==='Strict') document.getElementById('inp-strict').checked = (cols[1] === 'true');
                    if(cols[0]==='ARC') document.getElementById('inp-arc').value = cols[1];
                    if(cols[0]==='Name') document.getElementById('inp-name').value = cols[1];
                    if(cols[0]==='MP') document.getElementById('inp-mp').value = cols[1];
                } else if (inTrips) {
                    this.trips.push({ id: Date.now()+Math.random(), name: cols[0]||'', dep: cols[1]||'', dPass: cols[2]||'', dStamp: cols[3]||'', ret: cols[4]||'', rPass: cols[5]||'', rStamp: cols[6]||'' });
                }
            });
            this.renderTrips(); this.calculate(); alert('Data loaded successfully!'); input.value = '';
        };
        reader.readAsText(file);
    },

    // --- STATEMENT GENERATOR ---
    formatPassPage(pass, page) {
        if (page === "First receipt" || page === "Not applicable") return page;
        let res = [];
        if (pass) res.push(`Pass No. ${pass}`);
        if (page) res.push(`Page ${page}`);
        return res.join("<br>");
    },

    generateStatements() {
        const receiptStr = document.getElementById('inp-receipt').value;
        const appDateStr = document.getElementById('inp-app').value;
        if (!receiptStr || !appDateStr) { alert("Please fill First receipt date and Application date first."); return; }

        const name = document.getElementById('inp-name').value || "YOUR NAME AND SURNAME";
        const appDate = new Date(appDateStr);
        const mp = document.getElementById('inp-mp').value || ".......";
        const arc = document.getElementById('inp-arc').value || "XXX";

        const sortedTrips = this.trips.filter(t => t.dep && t.ret).sort((a,b) => new Date(a.dep) - new Date(b.dep));
        
        let stays = [];
        let currArrDate = new Date(receiptStr);
        let currArrPass = "";
        let currArrPage = "First receipt";

        sortedTrips.forEach(t => {
            const depDate = new Date(t.dep);
            if (depDate > currArrDate) {
                stays.push({
                    arrD: currArrDate, arrPass: currArrPass, arrPage: currArrPage,
                    depD: depDate, depPass: t.dPass, depPage: t.dStamp,
                    days: this.diffDays(currArrDate, depDate)
                });
            }
            currArrDate = new Date(t.ret);
            currArrPass = t.rPass;
            currArrPage = t.rStamp;
        });

        if (appDate > currArrDate) {
            stays.push({
                arrD: currArrDate, arrPass: currArrPass, arrPage: currArrPage,
                depD: appDate, depPass: "", depPage: "Not applicable", labelDep: "Till today",
                days: this.diffDays(currArrDate, appDate)
            });
        }

        // STATEMENT 1
        let html = `
        <div class="statement-page">
            <div class="st-details">
                NAME OF APPLICANT: <strong>${name}</strong><br>
                Date of application M127: <strong>${this.formatD(appDate)}</strong> / MP: <strong>${mp}</strong> / ARC nr.: <strong>${arc}</strong>
            </div>
            <div class="st-title">
                STATEMENT NO. 1<br><br>
                ΚΑΤΑΣΤΑΣΗ ΠΑΡΑΜΟΝΗΣ ΣΤΗΝ ΚΥΠΡΟ ΣΥΜΦΩΝΑ ΜΕ ΤΟ ΔΙΑΒΑΤΗΡΙΟ<br>
                STATEMENT OF STAY IN CYPRUS ACCORDING TO PASSPORT
            </div>
            <table class="st-table">
                <thead>
                    <tr>
                        <th colspan="2">ΑΦΙΞΕΙΣ στην Κύπρο<br>ARRIVALS to Cyprus</th>
                        <th colspan="2">ΑΝΑΧΩΡΗΣΕΙΣ από την Κύπρο<br>DEPARTURES from Cyprus</th>
                        <th colspan="3">ΔΙΑΡΚΕΙΑ ΠΑΡΑΜΟΝΗΣ ΣΤΗΝ ΚΥΠΡΟ<br>DURATION OF STAY IN CYPRUS</th>
                    </tr>
                    <tr>
                        <th>DATE</th><th>PAGE</th>
                        <th>DATE</th><th>PAGE</th>
                        <th>YEARS</th><th>MONTHS</th><th>DAYS</th>
                    </tr>
                </thead>
                <tbody>`;
        
        stays.forEach(s => {
            const aPageStr = this.formatPassPage(s.arrPass, s.arrPage);
            const dPageStr = this.formatPassPage(s.depPass, s.depPage);
            const dDateStr = s.labelDep ? `${s.labelDep}<br>${this.formatD(s.depD)}` : this.formatD(s.depD);
            html += `<tr>
                <td>${this.formatD(s.arrD)}</td><td>${aPageStr}</td>
                <td>${dDateStr}</td><td>${dPageStr}</td>
                <td></td><td></td><td>${s.days}</td>
            </tr>`;
        });

        // ADDED: Calculate total days for Statement 1
        let st1TotalDays = stays.reduce((sum, s) => sum + s.days, 0);

        html += `
                    <tr>
                        <td colspan="4" style="text-align: right; font-weight: bold;">ΣΥΝΟΛΟ ΠΑΡΑΜΟΝΗΣ / TOTAL STAY</td>
                        <td></td><td></td><td style="font-weight: bold;">${st1TotalDays}</td>
                    </tr>
                </tbody>
            </table>
            <div class="st-footer">
                DECLARATION: I the undersign <strong>${name}</strong><br><br>
                Do solemnly declare that the foregoing particulars stated above are true and I make this solemn declaration knowing the provisions of the Law for untrue declaration.<br><br>
                <div class="st-signatures">
                    <div>Date: <strong>${this.formatD(appDate)}</strong></div>
                    <div>Signature: ______________________</div>
                </div>
            </div>
        </div>`;

        // STATEMENT 2
        const boundaryDate = new Date(appDate);
        boundaryDate.setFullYear(boundaryDate.getFullYear() - 1);

        let st2Stays = [];
        let startIndex = -1;
        for (let i = stays.length - 1; i >= 0; i--) {
            if (stays[i].arrD <= boundaryDate) { startIndex = i; break; }
        }

        if (startIndex !== -1) {
            for (let i = startIndex; i < stays.length; i++) { st2Stays.push(stays[i]); }
        } else {
            st2Stays = [...stays];
        }

        let st2TotalDays = st2Stays.reduce((sum, s) => sum + s.days, 0);

        html += `
        <div class="statement-page">
            <div class="st-details">
                NAME OF APPLICANT: <strong>${name}</strong><br>
                Date of application M127: <strong>${this.formatD(appDate)}</strong> / MP: <strong>${mp}</strong> / ARC nr.: <strong>${arc}</strong>
            </div>
            <div class="st-title">
                STATEMENT NO. 2<br><br>
                ΚΑΤΑΣΤΑΣΗ ΠΑΡΑΜΟΝΗΣ ΑΛΛΟΔΑΠΟΥ ΤΟΥΣ ΤΕΛΕΥΤΑΙΟΥΣ 12 ΜΗΝΕΣ ΠΡΙΝ ΑΠΟ ΤΗΝ ΥΠΟΒΟΛΗ ΤΗΣ ΑΙΤΗΣΗΣ Μ127<br>
                STATEMENT OF STAY IN CYPRUS DURING THE LAST 12 MONTHS BEFORE THE DATE OF APPLICATION M127
            </div>
            <table class="st-table">
                <thead>
                    <tr>
                        <th colspan="2">ΑΦΙΞΕΙΣ στην Κύπρο<br>ARRIVALS to Cyprus</th>
                        <th colspan="2">ΑΝΑΧΩΡΗΣΕΙΣ από την Κύπρο<br>DEPARTURES from Cyprus</th>
                        <th colspan="2">ΔΙΑΡΚΕΙΑ ΠΑΡΑΜΟΝΗΣ ΣΤΗΝ ΚΥΠΡΟ<br>DURATION OF STAY IN CYPRUS</th>
                    </tr>
                    <tr>
                        <th>HMEP/DATE</th><th>ΣΕΛΙΔΑ/PAGE</th>
                        <th>HMEP/DATE</th><th>ΣΕΛΙΔΑ/PAGE</th>
                        <th>YEARS</th><th>DAYS</th>
                    </tr>
                </thead>
                <tbody>`;
        
        st2Stays.forEach((s, idx) => {
            const isFirst = (idx === 0);
            const aPageStr = this.formatPassPage(s.arrPass, s.arrPage);
            const dPageStr = this.formatPassPage(s.depPass, s.depPage);
            const aDateStr = isFirst ? `Last arrival in Cyprus:<br>${this.formatD(s.arrD)}` : this.formatD(s.arrD);
            const dDateStr = s.labelDep ? `Till today<br>${this.formatD(s.depD)}` : this.formatD(s.depD);
            
            html += `<tr>
                <td>${aDateStr}</td><td>${aPageStr}</td>
                <td>${dDateStr}</td><td>${dPageStr}</td>
                <td></td><td>${s.days}</td>
            </tr>`;
        });

        html += `
                    <tr>
                        <td colspan="4" style="text-align: right; font-weight: bold;">ΣΥΝΟΛΟ ΠΑΡΑΜΟΝΗΣ / TOTAL STAY</td>
                        <td></td><td style="font-weight: bold;">${st2TotalDays}</td>
                    </tr>
                </tbody>
            </table>
            <div class="st-footer">
                DECLARATION: I the undersign <strong>${name}</strong><br><br>
                Do solemnly declare that the foregoing particulars stated above are true and I make this solemn declaration knowing the provisions of the Law for untrue declaration.<br><br>
                <div class="st-signatures">
                    <div>Date: <strong>${this.formatD(appDate)}</strong></div>
                    <div>Signature: ______________________</div>
                </div>
            </div>
        </div>`;

        document.getElementById('print-area').innerHTML = html;
        window.print();
    }
};

window.onload = () => app.init();
