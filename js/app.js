// Main App Logic

const app = {
    currentRoute: 'home',

    init() {
        this.navigate('home');
        
        // Initial nav bot greeting timeout to simulate helpfulness
        setTimeout(() => {
            if (document.getElementById('nav-bot-widget').classList.contains('nav-bot-closed')) {
                // Flash tooltip
                const toggle = document.getElementById('nav-bot-toggle');
                toggle.style.transform = 'scale(1.1)';
                setTimeout(() => toggle.style.transform = '', 300);
            }
        }, 3000);
    },

    navigate(route) {
        this.currentRoute = route;
        const main = document.getElementById('main-content');
        
        // Update nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            if (!btn.classList.contains('primary')) {
                btn.style.color = 'var(--text-secondary)';
                btn.style.background = 'transparent';
            }
        });

        // Render view
        if (route === 'home') {
            main.innerHTML = Components.Home();
            navBot.setContext('home');
        } else if (route === 'symptom-checker') {
            main.innerHTML = Components.SymptomChecker();
            healthBot.init();
            navBot.setContext('symptom-checker');
        } else if (route === 'find-doctors') {
            main.innerHTML = Components.FindDoctors();
            doctorFinder.init();
            navBot.setContext('find-doctors');
            
            // Special Navigation Bot behavior on Find Doctors page
            setTimeout(() => {
                navBot.open();
                navBot.addBotMessage("I see you're looking for doctors. You can use the Google Map to find real clinics near your zip code. Let me know if you need help!");
            }, 1000);
        }
    }
};

const navBot = {
    isOpen: false,
    context: 'home',

    toggle() {
        const widget = document.getElementById('nav-bot-widget');
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            widget.classList.remove('nav-bot-closed');
            document.getElementById('nav-bot-input').focus();
        } else {
            widget.classList.add('nav-bot-closed');
        }
    },
    
    open() {
        if (!this.isOpen) this.toggle();
    },

    setContext(route) {
        this.context = route;
    },

    handleQuickAction(action) {
        if (action === 'symptoms') {
            app.navigate('symptom-checker');
            this.addBotMessage("I've taken you to the AI Health Checker.");
        } else if (action === 'doctors') {
            app.navigate('find-doctors');
            this.addBotMessage("Here is the Find Doctors page. Let me know if you want me to analyze any doctor's pros and cons!");
        }
    },

    handleInput(e) {
        if (e.key === 'Enter') {
            this.sendMsg();
        }
    },

    sendMsg() {
        const input = document.getElementById('nav-bot-input');
        const text = input.value.trim();
        if (!text) return;

        this.addUserMessage(text);
        input.value = '';

        this.showTyping();
        
        setTimeout(() => {
            this.hideTyping();
            this.processMessage(text.toLowerCase());
        }, 1000);
    },

    processMessage(text) {
        if (this.context === 'find-doctors') {
            // Check if they are asking about a doctor
            const doc = DOCTORS.find(d => text.includes(d.name.toLowerCase().split(' ')[1]) || text.includes(d.id));
            if (doc) {
                this.analyzeDoctor(doc);
                return;
            } else if (text.includes('pro') || text.includes('con') || text.includes('research')) {
                this.addBotMessage("Sure! Please tell me which doctor's name you'd like me to research (e.g., 'Dr. Jenkins' or 'Dr. Chen').");
                return;
            }
        }
        
        if (text.includes('symptom') || text.includes('sick')) {
            this.addBotMessage("It sounds like you need the Symptom Checker. Shall I take you there?");
            this.handleQuickAction('symptoms');
        } else if (text.includes('doctor') || text.includes('find')) {
            this.addBotMessage("I can take you to the Find Doctors page.");
            this.handleQuickAction('doctors');
        } else {
            this.addBotMessage("I'm here to help you navigate DigiDoc. You can ask me to go to the Symptom Checker or Find Doctors.");
        }
    },

    analyzeDoctor(doc) {
        let msg = `<strong>${doc.name}</strong><br><br>Based on a quick Google research analysis, here are the pros and cons:<br><br>`;
        msg += `<strong style="color:var(--secondary)">Pros:</strong><ul>`;
        doc.pros.forEach(p => msg += `<li>${p}</li>`);
        msg += `</ul><br>`;
        msg += `<strong style="color:var(--danger)">Cons:</strong><ul>`;
        doc.cons.forEach(c => msg += `<li>${c}</li>`);
        msg += `</ul>`;
        this.addBotMessage(msg);
    },

    analyzeClinic(clinic) {
        let msg = `<strong>🏥 ${clinic.name}</strong><br><br>`;
        msg += `<strong>Specialty:</strong> ${clinic.specialty}<br>`;
        msg += `<strong>Phone:</strong> ${clinic.phone}<br>`;
        msg += `<strong>Location:</strong> ${clinic.location}<br>`;
        msg += `<strong>About:</strong> ${clinic.about}<br><br>`;
        
        if (clinic.doctors && clinic.doctors.length > 0) {
            msg += `<strong style="color:var(--primary)">Notable Doctors:</strong><ul style="padding-left:1.2rem; margin-top:0.2rem;">`;
            clinic.doctors.forEach(d => msg += `<li>${d}</li>`);
            msg += `</ul>`;
        } else {
            msg += `<em style="color:var(--text-secondary); font-size:0.85rem">No specific doctors listed in public records for this facility. We recommend calling to inquire.</em>`;
        }
        this.addBotMessage(msg);
    },

    addUserMessage(text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message user';
        msgDiv.textContent = text;
        this.appendMessage(msgDiv);
    },

    addBotMessage(html) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message bot';
        msgDiv.innerHTML = html;
        this.appendMessage(msgDiv);
    },

    showTyping() {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'typing-indicator';
        msgDiv.id = 'nav-typing';
        msgDiv.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
        this.appendMessage(msgDiv);
    },

    hideTyping() {
        const el = document.getElementById('nav-typing');
        if (el) el.remove();
    },

    appendMessage(el) {
        const container = document.getElementById('nav-bot-messages');
        container.appendChild(el);
        container.scrollTop = container.scrollHeight;
    }
};

const healthBot = {
    step: 0,
    clarificationAttempts: 0, // how many times we've looped back for more detail
    // Collected patient context
    profile: {
        age: null,
        gender: null,
        pastDiseases: '',
        vaccinationStatus: '',
        doctorDiagnosis: '',
        symptoms: ''
    },

    init() {
        this.step = 0;
        this.clarificationAttempts = 0;
        this.profile = { age: null, gender: null, pastDiseases: '', vaccinationStatus: '', doctorDiagnosis: '', symptoms: '' };
    },

    handleInput(e) {
        if (e.key === 'Enter') this.sendMsg();
    },

    sendMsg() {
        const input = document.getElementById('health-chat-input');
        const rawText = input.value.trim();
        const displayValue = rawText === '' ? '<em>(Skipped / Not shared)</em>' : rawText;

        this.addUserMessage(displayValue);
        input.value = '';

        // Store the raw answer against the current step BEFORE advancing
        this.storeAnswer(this.step, rawText);

        this.showTyping();
        setTimeout(() => {
            this.hideTyping();
            this.progressStep();
        }, 1200);
    },

    storeAnswer(step, raw) {
        const lower = raw.toLowerCase();
        if (step === 0) {
            // Step 0 = Age + Gender question
            const ageMatch = raw.match(/\b(\d{1,3})\b/);
            if (ageMatch) this.profile.age = parseInt(ageMatch[1], 10);
            if (lower.includes('male') || lower.includes('man') || lower.includes('boy')) this.profile.gender = 'male';
            if (lower.includes('female') || lower.includes('woman') || lower.includes('girl')) this.profile.gender = 'female';
        } else if (step === 1) {
            // Step 1 = Past diseases + vaccinations
            this.profile.pastDiseases = raw;
            if (lower.includes('vacc') || lower.includes('immuni')) {
                this.profile.vaccinationStatus = raw;
            }
        } else if (step === 2) {
            // Step 2 = Vaccination status (separate follow-up)
            if (!this.profile.vaccinationStatus) this.profile.vaccinationStatus = raw;
            this.profile.doctorDiagnosis = raw;
        } else if (step === 3) {
            // Step 3 = Doctor diagnosis detail
            this.profile.doctorDiagnosis = raw;
        } else if (step === 4) {
            // Step 4 = Symptoms — APPEND to any previously collected symptoms
            // so that clarification rounds build on earlier descriptions
            if (this.profile.symptoms && raw) {
                this.profile.symptoms += ' ' + raw;
            } else if (raw) {
                this.profile.symptoms = raw;
            }
        }
    },

    progressStep() {
        this.step++;

        if (this.step === 1) {
            this.addBotMessage('Thank you. Do you have any <strong>past diseases</strong> or chronic conditions? (e.g. diabetes, asthma, heart disease — leave blank if none or unknown)');
        } else if (this.step === 2) {
            this.addBotMessage('Got it. What is your <strong>vaccination status</strong>? (e.g. fully vaccinated, partially vaccinated — leave blank if unsure)');
        } else if (this.step === 3) {
            this.addBotMessage('Have any <strong>doctors previously diagnosed</strong> you for this issue? If yes, what did they say? (Leave blank if no prior diagnosis)');
        } else if (this.step === 4) {
            this.addBotMessage('Thank you for sharing all of that. Now, please <strong>describe your current symptoms</strong> in as much detail as possible. The more you share, the better I can help.');
        } else if (this.step === 5) {
            // --- DIAGNOSIS STEP ---
            this.runDiagnosis();
        } else {
            this.addBotMessage('If your symptoms worsen or you experience a medical emergency, please call emergency services immediately.');
        }
    },

    // ── Keyword scorer ────────────────────────────────────────────────────────
    // Returns: 2 = full match, 1 = partial match, 0 = no match
    //
    // Single words: use \bword s?\b so "headache" also matches "headaches"
    // Multi-word phrases:
    //   - +2 if the full phrase (or its plural) appears in the text
    //   - +1 if ≥50% of the significant words in the phrase appear individually
    //     (handles "sore knee" matching "knee pain", "can't breathe" matching "difficulty breathing")
    scoreKeyword(text, kw) {
        if (!kw.includes(' ')) {
            // Single word — match with optional trailing s for plurals
            try {
                return new RegExp(`\\b${kw}s?\\b`, 'i').test(text) ? 2 : 0;
            } catch (e) {
                return text.includes(kw) ? 2 : 0;
            }
        }

        // Multi-word phrase — try exact first (also try with plural last word)
        if (text.includes(kw) || text.includes(kw + 's')) return 2;

        // Partial: check how many SIGNIFICANT words from the phrase appear in text
        // Filter out tiny connector words (≤3 chars) like "in", "my", "a", "to", "of"
        const sigWords = kw.split(' ').filter(w => w.length > 3);
        if (sigWords.length === 0) return 0;

        const matched = sigWords.filter(w => {
            try {
                return new RegExp(`\\b${w}s?\\b`, 'i').test(text);
            } catch (e) {
                return text.includes(w);
            }
        });

        // ≥50% of significant words found → partial match
        return matched.length >= Math.ceil(sigWords.length / 2) ? 1 : 0;
    },

    // ── Casual speech normalizer ──────────────────────────────────────────────
    // Maps everyday casual phrases → medical equivalents so the scorer can
    // match them. Applied to the symptoms text before scoring.
    casualToMedical(text) {
        const map = [
            // Stomach / gut
            [/tummy|belly|stomach is killing me|gut is killing me/gi, 'stomach pain'],
            [/throwing up|been sick|keep being sick|feel sick to my stomach/gi, 'vomiting'],
            [/runs|squits|runny (poo|stool)|loose (poo|stool)/gi, 'diarrhea'],
            [/can'?t keep food down|nothing stays down/gi, 'vomiting stomach pain'],
            [/gassy|lots of wind|too much gas/gi, 'excessive wind flatulence'],

            // Head
            [/head is (killing|pounding|throbbing|splitting)|splitting headache/gi, 'throbbing headache'],
            [/my head hurts|head hurts bad/gi, 'headache'],
            [/dizzy spell|room is spinning|feel like i'?m spinning/gi, 'dizziness'],

            // Breathing / chest
            [/can'?t (catch my breath|breathe properly|get air)|gasping/gi, 'difficulty breathing'],
            [/chest (is|feels) (tight|heavy|crushed|squeezed)/gi, 'chest feels tight'],
            [/out of (puff|breath|air)|winded easily/gi, 'breathless'],
            [/wheezy|sounds wheezy/gi, 'wheezing'],

            // Joints / muscles
            [/joints (are|feel) (killing|awful|bad)|joints playing up/gi, 'joint pain'],
            [/knees (are|feel) (awful|terrible|sore|stiff)|sore knee/gi, 'knee pain'],
            [/back is (killing|awful|terrible)|bad back|sore back/gi, 'back pain'],
            [/stiff (in the morning|when i wake)/gi, 'morning stiffness'],
            [/achy|all achey|body aches all over|muscle aches/gi, 'joint ache'],

            // Skin
            [/skin (is|feels) (horrible|awful|terrible|itchy as|so itchy)|itching like crazy/gi, 'itchy skin'],
            [/red (patches|spots|blotches) on skin|skin looks red/gi, 'red patches on skin'],
            [/dry (flaky|cracked|rough) skin|skin (flaking|peeling|cracking)/gi, 'dry skin patches'],

            // Urinary
            [/burning (when i pee|when urinating|pee burns|down there)/gi, 'burning when peeing'],
            [/going (to the loo|to toilet|to pee) all the time|can'?t stop peeing/gi, 'peeing very often'],
            [/pee smells|wee smells/gi, 'smelly urine'],

            // General unwellness
            [/feel (rubbish|terrible|awful|dreadful|rotten|horrible)/gi, 'feel very unwell'],
            [/no energy|zero energy|can'?t get out of bed|exhausted all day/gi, 'exhausted all the time'],
            [/always tired|so tired|knackered|shattered/gi, 'exhausted all the time'],

            // Mood
            [/feeling (really |very )?(down|rubbish|low|horrible|hopeless)/gi, 'feeling very sad low mood'],
            [/lost interest|not enjoying anything|nothing makes me happy/gi, 'lost interest in things'],
            [/can'?t sleep|sleeping badly|up all night/gi, 'cannot sleep'],

            // Heart / BP
            [/heart (racing|pounding|going fast)|palpitations/gi, 'racing heartbeat'],
            [/feel faint|nearly fainted|almost blacked out/gi, 'feel faint lightheaded'],

            // Thyroid / weight
            [/putting on weight|gaining weight (easily|quickly|for no reason)/gi, 'unexplained weight gain'],
            [/always (freezing|cold)|feel cold all the time/gi, 'always feel cold'],
            [/hair (falling|coming) out|losing hair/gi, 'hair falling out'],

            // Diabetes-like
            [/thirsty all the time|drinking loads|can'?t stop drinking water/gi, 'always thirsty'],
            [/(wee|pee) loads|going toilet loads/gi, 'peeing a lot'],

            // Cold / respiratory
            [/sniffly|runny nose|nose is running|snotty/gi, 'runny nose'],
            [/blocked up|can'?t breathe through nose|nose is blocked/gi, 'blocked nose'],
            [/sore (throat|throat is killing me)/gi, 'sore throat'],
            [/bit (under the weather|off|rough|poorly)/gi, 'feeling under the weather'],
        ];

        let normalized = text;
        map.forEach(([pattern, replacement]) => {
            normalized = normalized.replace(pattern, replacement);
        });
        return normalized;
    },

    runDiagnosis() {
        // Normalize casual speech BEFORE scoring
        const rawSymptoms = this.profile.symptoms.toLowerCase();
        const symptomsText = this.casualToMedical(rawSymptoms);
        const pastDiseasesText = this.casualToMedical(this.profile.pastDiseases.toLowerCase());
        const doctorText = this.profile.doctorDiagnosis.toLowerCase();
        const age = this.profile.age;
        const gender = this.profile.gender;

        // Score each disease
        const scored = DISEASE_KB.map(disease => {
            let score = 0;

            // ── Primary: keyword match in current symptoms ─────────────────
            disease.keywords.forEach(kw => {
                score += this.scoreKeyword(symptomsText, kw);
            });

            // ── Past disease history ────────────────────────────────────────
            if (pastDiseasesText) {
                // Exact disease name in history gives strong boost
                const diseaseFirstWord = disease.name.split(' ')[0].toLowerCase();
                if (this.scoreKeyword(pastDiseasesText, diseaseFirstWord) > 0) score += 4;
                // Any keyword also appearing in their history
                disease.keywords.forEach(kw => {
                    if (this.scoreKeyword(pastDiseasesText, kw) > 0) score += 1;
                });
            }

            // ── Prior doctor diagnosis boost ───────────────────────────────
            if (doctorText) {
                const diseaseFirstWord = disease.name.split(' ')[0].toLowerCase();
                if (this.scoreKeyword(doctorText, diseaseFirstWord) > 0) score += 5;
                disease.keywords.forEach(kw => {
                    if (this.scoreKeyword(doctorText, kw) > 0) score += 1;
                });
            }

            // ── Age risk factor ────────────────────────────────────────────
            if (disease.riskFactors.ageRisk && age && age >= disease.riskFactors.ageRisk) score += 1;

            // ── Gender risk factor ─────────────────────────────────────────
            if (disease.riskFactors.femaleHigher && gender === 'female') score += 1;

            return { disease, score };
        });

        // ── Dynamic minimum score ──────────────────────────────────────────────
        // Count how many words the user used to describe their symptoms.
        // More detail = higher bar required; short input = lower bar.
        scored.sort((a, b) => b.score - a.score);
        const wordCount = symptomsText.trim().split(/\s+/).filter(Boolean).length;
        const bestScore = scored[0] ? scored[0].score : 0;

        // If best score < 2, the input is too vague — ask user to elaborate
        // (allow this loop up to 2 times, then fall back gracefully)
        if (bestScore < 2 && this.clarificationAttempts < 2) {
            this.clarificationAttempts++;
            this.step = 4; // loop back to symptom step

            const hints = [
                'how long you have had these symptoms',
                'whether symptoms are constant or come and go',
                'any other symptoms you may have noticed'
            ];
            this.addBotMessage(
                `I need a bit more detail to give you an accurate assessment. ` +
                `Could you please tell me more? For example:<br><ul>` +
                hints.map(h => `<li>${h}</li>`).join('') +
                `</ul>Your previous answer has been saved — just add whatever extra detail you can.`
            );
            return;
        }

        // Minimum score = 2
        const minScore = 2;
        const top = scored.filter(s => s.score >= minScore).slice(0, 3);

        if (top.length === 0) {
            // Still no confident match after clarification
            this.addBotMessage(`
                <strong>Assessment Complete</strong><br><br>
                Based on everything you described, I could not confidently match your symptoms to a specific condition in my knowledge base.<br><br>
                This does <strong>not</strong> mean your symptoms are not real or serious. Please visit a <strong>General Practitioner</strong> who can carry out a proper examination.<br><br>
                <em style="color:var(--warning)">⚠️ I am an AI assistant — not a substitute for professional medical advice.</em>
            `);
            this.showDoctorRecommendations(['doc1', 'doc3']);
            return;
        }

        const primary = top[0].disease;
        const alternatives = top.slice(1).map(s => s.disease.name);

        // Build a personalised diagnosis message
        let urgencyColor = primary.urgency === 'urgent' ? 'var(--danger)' : primary.urgency === 'high' ? '#f59e0b' : 'var(--secondary)';
        let urgencyLabel = primary.urgency === 'urgent' ? '🚨 URGENT' : primary.urgency === 'high' ? '⚠️ High Priority' : '🟢 Non-Emergency';

        let diagMsg = `<strong>DigiDoc AI Assessment</strong><br><br>`;

        // Personalised intro using collected profile
        if (age || gender) {
            diagMsg += `<em>For a ${age ? age + '-year-old ' : ''}${gender ? gender : 'patient'}${this.profile.pastDiseases && this.profile.pastDiseases !== '' ? ' with a history of ' + this.profile.pastDiseases : ''}:</em><br><br>`;
        }

        diagMsg += `Based on your symptoms, the most likely condition is:<br><br>`;
        diagMsg += `<strong style="font-size:1.1rem">${primary.name}</strong> <span style="color:${urgencyColor}; font-size:0.85rem; margin-left:0.5rem">${urgencyLabel}</span><br><br>`;
        diagMsg += `${primary.description}<br><br>`;

        if (alternatives.length > 0) {
            diagMsg += `<strong>Other possibilities to consider:</strong> ${alternatives.join(', ')}<br><br>`;
        }

        // Red flags warning
        if (primary.redFlags && primary.redFlags.length > 0) {
            diagMsg += `<strong style="color:var(--danger)">⚠️ Seek immediate help if you experience:</strong><ul>`;
            primary.redFlags.forEach(f => diagMsg += `<li>${f}</li>`);
            diagMsg += `</ul><br>`;
        }

        // Self-care
        diagMsg += `<strong>Self-care advice:</strong><br>${primary.selfCare}<br><br>`;

        // Medicines
        if (primary.medicines && primary.medicines.length > 0) {
            diagMsg += `<strong style="color:var(--primary)">Common Medicines:</strong><br>`;
            diagMsg += `<em style="font-size:0.85rem; color:var(--warning)">⚠️ Always consult a real doctor before buying these medicines to confirm your disease.</em><ul style="list-style:none; padding-left:0; margin-top:0.5rem;">`;
            primary.medicines.forEach(med => {
                const encodedName = encodeURIComponent(med.name.split(' (')[0]);
                const pharmEasyLink = `https://pharmeasy.in/search/all?name=${encodedName}`;
                const oneMgLink = `https://www.1mg.com/search/all?name=${encodedName}`;

                diagMsg += `<li style="margin-bottom: 0.8rem; background: rgba(255,255,255,0.03); padding: 0.8rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
                    <strong style="font-size: 1.05rem;">${med.name}</strong><br>
                    <span style="font-size:0.85rem; color:var(--text-secondary); display:block; margin:0.3rem 0;">Side effects: ${med.sideEffects}</span>
                    <div style="margin-top: 0.5rem; display: flex; gap: 8px; flex-wrap: wrap;">
                        <a href="${pharmEasyLink}" target="_blank" class="btn btn-primary" style="font-size:0.8rem; padding: 0.3rem 0.8rem; text-decoration:none; display:inline-flex; align-items:center; gap:4px; border-radius: 6px;">
                            <i class="ph-bold ph-shopping-cart"></i> Buy on PharmEasy
                        </a>
                        <a href="${oneMgLink}" target="_blank" class="btn btn-secondary" style="font-size:0.8rem; padding: 0.3rem 0.8rem; text-decoration:none; display:inline-flex; align-items:center; gap:4px; border-radius: 6px;">
                            <i class="ph-bold ph-shopping-bag"></i> Buy on Tata 1mg
                        </a>
                    </div>
                </li>`;
            });
            diagMsg += `</ul><br>`;
        }

        // Doctor recommendation
        diagMsg += `<strong>Recommended specialist:</strong> ${primary.specialty}<br><br>`;

        diagMsg += `<em style="color:var(--text-secondary); font-size:0.85rem">Source: ${primary.source} — ⚠️ This is an AI assistant. Please consult a real doctor for a definitive diagnosis.</em>`;

        this.addBotMessage(diagMsg);

        // Show personalised doctor cards after a short delay
        setTimeout(() => {
            this.showDoctorRecommendations(primary.doctorIds);
        }, 600);
    },

    showDoctorRecommendations(doctorIds) {
        const recommendedDocs = DOCTORS.filter(d => doctorIds.includes(d.id));

        let html = `<strong>Recommended local doctors for your condition:</strong><br><br>`;
        recommendedDocs.forEach(doc => {
            html += `
                <div style="background:rgba(14,165,233,0.08); border:1px solid rgba(14,165,233,0.25); border-radius:12px; padding:0.8rem; margin-bottom:0.8rem;">
                    <strong>${doc.name}</strong> — <em style="color:var(--primary)">${doc.specialty}</em><br>
                    <span style="font-size:0.85rem; color:var(--text-secondary)">📍 ${doc.location} &nbsp;⭐ ${doc.rating} (${doc.reviews} reviews)</span>
                </div>
            `;
        });

        html += `
            <div style="margin-top:1rem;">
                <button class="btn btn-primary" style="padding:0.5rem 1.2rem; font-size:0.9rem;" onclick="app.navigate('find-doctors')">
                    View All Doctors
                </button>
            </div>
        `;

        this.addBotMessage(html);
    },

    addUserMessage(html) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message user';
        msgDiv.innerHTML = html;
        this.appendMessage(msgDiv);
    },

    addBotMessage(html) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message bot';
        msgDiv.innerHTML = html;
        this.appendMessage(msgDiv);
    },

    showTyping() {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'typing-indicator';
        msgDiv.id = 'health-typing';
        msgDiv.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
        this.appendMessage(msgDiv);
    },

    hideTyping() {
        const el = document.getElementById('health-typing');
        if (el) el.remove();
    },

    appendMessage(el) {
        const container = document.getElementById('health-chat-messages');
        container.appendChild(el);
        container.scrollTop = container.scrollHeight;
    }
};

const doctorFinder = {
    currentClinics: [],

    init() {
        this.search(true);
    },

    async fetchRealClinicsByLocation(location) {
        try {
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`);
            const geoData = await geoRes.json();
            if (!geoData || geoData.length === 0) return [];
            
            const lat = geoData[0].lat;
            const lon = geoData[0].lon;

            const overpassQuery = `
                [out:json][timeout:10];
                (
                  node["amenity"="clinic"](around:15000,${lat},${lon});
                  node["amenity"="hospital"](around:15000,${lat},${lon});
                  node["amenity"="doctors"](around:15000,${lat},${lon});
                );
                out tags limit 12;
            `;
            
            const overpassRes = await fetch('https://overpass-api.de/api/interpreter', {
                method: 'POST',
                body: overpassQuery
            });
            const overpassData = await overpassRes.json();
            
            if (overpassData && overpassData.elements) {
                return overpassData.elements
                    .filter(el => el.tags && el.tags.name)
                    .map((el, index) => {
                        const t = el.tags;
                        let specialty = t.healthcare || t.amenity || 'General Healthcare';
                        specialty = specialty.charAt(0).toUpperCase() + specialty.slice(1);
                        
                        let addr = [];
                        if (t["addr:housenumber"]) addr.push(t["addr:housenumber"]);
                        if (t["addr:street"]) addr.push(t["addr:street"]);
                        if (t["addr:city"]) addr.push(t["addr:city"]);
                        let locationStr = addr.length > 0 ? addr.join(', ') : location;

                        return {
                            id: 'real_clinic_' + index,
                            name: t.name,
                            specialty: specialty.replace('_', ' '),
                            location: locationStr,
                            phone: t.phone || t["contact:phone"] || 'Phone not available',
                            about: t.description || `A local ${specialty.replace('_', ' ')} facility located in ${location}.`,
                            doctors: []
                        };
                    });
            }
            return [];
        } catch (e) {
            console.error("Error fetching clinics:", e);
            return [];
        }
    },

    async search(isInit = false) {
        const inputEl = document.getElementById('location-input');
        const input = inputEl ? inputEl.value.trim() : '';
        const container = document.getElementById('doctor-results');
        
        container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem;"><div class="typing-indicator" style="margin:0 auto;"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div><p style="margin-top:1rem; color: var(--text-secondary);">Searching for real local clinics...</p></div>';
        
        const query = input ? `doctors+clinics+in+${encodeURIComponent(input)}` : 'doctors+clinics+near+me';
        
        let clinics = [];
        if (input) {
            clinics = await this.fetchRealClinicsByLocation(input);
        } else {
            // For empty input, wait to search
            clinics = [];
        }

        this.currentClinics = clinics;

        let html = `
            <div style="grid-column: 1/-1; animation: fadeIn 0.5s ease-out; width: 100%; height: 500px; margin-bottom: 2rem;">
                <iframe 
                    width="100%" 
                    height="100%" 
                    frameborder="0" 
                    scrolling="no" 
                    marginheight="0" 
                    marginwidth="0" 
                    src="https://maps.google.com/maps?q=${query}&t=&z=13&ie=UTF8&iwloc=&output=embed"
                    style="border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 4px 30px rgba(0,0,0,0.1);"
                ></iframe>
            </div>
        `;

        if (clinics.length > 0) {
            html += `
            <div style="grid-column: 1/-1; margin-bottom: 1rem;">
                <h3 style="font-size: 1.5rem; color: var(--text-primary);">Real Local Clinics</h3>
                <p style="color: var(--text-secondary); font-size: 0.9rem;">Click on a clinic to have the AI research it for you.</p>
            </div>
            `;
            clinics.forEach(c => {
                html += Components.ClinicCard(c);
            });
        } else if (input) {
            html += `
            <div style="grid-column: 1/-1; text-align: center;">
                <p style="color: var(--text-secondary);">Could not fetch specific clinic details for this area. Please use the map above.</p>
            </div>
            `;
        }

        container.innerHTML = html;
    },

    viewClinic(id) {
        navBot.open();
        const clinic = this.currentClinics.find(c => c.id === id);
        if (!clinic) return;
        navBot.addBotMessage(`You clicked on <strong>${clinic.name}</strong>. Give me a moment to research their details for you...`);
        navBot.showTyping();
        
        setTimeout(() => {
            navBot.hideTyping();
            navBot.analyzeClinic(clinic);
        }, 1500);
    },

    viewDoctor(id) {
        navBot.open();
        const doc = DOCTORS.find(d => d.id === id);
        navBot.addBotMessage(`You clicked on <strong>${doc.name}</strong>. Let me analyze their pros and cons for you...`);
        navBot.showTyping();
        
        setTimeout(() => {
            navBot.hideTyping();
            navBot.analyzeDoctor(doc);
        }, 1500);
    }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
