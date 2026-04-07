/* =====================================================
PREGNANCY CLINICAL TIMELINE  ·  script.js
Generates a true vertical timeline:

- Each week = fixed px height
- Events positioned at their actual gestational week
- Left/right alternating, collision-offset stacking
  ===================================================== */

(function () {
‘use strict’;

/* ─── CONSTANTS ──────────────────────────────────────── */
const PX_PER_WEEK = parseInt(getComputedStyle(document.documentElement).getPropertyValue(’–px-per-week’)) || 88;
const FIRST_WEEK = 1;
const LAST_WEEK = 42;
const TOTAL_WEEKS = LAST_WEEK - FIRST_WEEK + 1;
const HEADER_OFFSET = 0; // spine starts at top of spine-wrap

/* ─── ERA DEFINITIONS ────────────────────────────────── */
const ERAS = [
{ id: ‘era-t1’,   label: ‘First Trimester’,   start: 1,  end: 13,  cls: ‘t1’ },
{ id: ‘era-t2’,   label: ‘Second Trimester’,  start: 14, end: 27,  cls: ‘t2’ },
{ id: ‘era-t3’,   label: ‘Third Trimester’,   start: 28, end: 36,  cls: ‘t3’ },
{ id: ‘era-term’, label: ‘Term / Late Term’,  start: 37, end: 42,  cls: ‘term’ },
];

/* ─── CLINICAL EVENTS ─────────────────────────────────
week: gestational week (number or fractional like 10.5)
side: ‘right’ | ‘left’ (which side of spine)
type: labs | appt | infect | fetal | tx | screen
title: short card title
preview: 2–3 line summary shown on card
detail: full content shown in modal (HTML string)
─────────────────────────────────────────────────────── */
const EVENTS = [

/* ══ WEEK 4–5 ══ */
{
week: 4, side: ‘left’, type: ‘appt’,
title: ‘Pregnancy Confirmation Visit’,
preview: ‘Confirm IUP. Obtain LMP, EDD, OB history. Counsel on nutrition, teratogens, exercise.’,
detail: `<p><strong>Goals:</strong> Confirm intrauterine pregnancy, establish gestational age from LMP + dating U/S, obtain complete obstetric/medical/family/social history.</p> <ul><li>Calculate EDD: LMP + 280 days (Naegele's rule)</li><li>Review medications for teratogenicity</li><li>Counsel: no alcohol, no smoking, limit caffeine &lt;200 mg/day, avoid raw meats/deli meat/soft cheeses (Listeria)</li><li>Exercise: 150 min/week moderate intensity OK</li><li>Sexual activity: generally safe if uncomplicated</li><li>Dental care: safe in pregnancy</li></ul>`
},
{
week: 4.5, side: ‘right’, type: ‘tx’,
title: ‘Folic Acid + Prenatal Vitamins’,
preview: ‘Folic acid 0.4–0.8 mg/day prevents neural tube defects. Start before conception ideally.’,
detail: `<p><strong>Folic acid:</strong> 0.4–0.8 mg/day standard; <strong>4 mg/day</strong> if prior NTD, maternal DM, antiepileptic drugs (valproate, carbamazepine).</p> <ul><li>Prenatal vitamin: iron 27 mg, iodine 150 μg, DHA 200 mg, Vit D, calcium</li><li>Iron: non-constipating formulations preferred; take with Vit C for absorption</li><li>Avoid: isotretinoin, valproate, warfarin, methotrexate, ACEi/ARBs, tetracyclines, fluoroquinolones, thalidomide</li><li>Nausea: vitamin B6 10–25 mg TID ± doxylamine 12.5 mg</li></ul>`
},
{
week: 5, side: ‘right’, type: ‘fetal’,
title: ‘Cardiac Tube / Heartbeat’,
preview: ‘Cardiac tube forms ~day 22. Fetal heartbeat detectable on TVU/S by 5–6 wks. Embryo ~4 mm CRL.’,
detail: `<p>Heart begins beating at approximately day 22. Transvaginal U/S can detect cardiac activity at 5–6 weeks gestational age.</p> <ul><li>CRL at 6 wks: ~4–5 mm</li><li>All major organ systems begin forming — organogenesis underway</li><li>Neural tube closes by day 28 (28–30 days post-fertilization)</li><li>Embryo stage: conception through week 10</li><li>Highest teratogen risk period: weeks 3–8 (embryonic period)</li></ul>`
},

/* ══ WEEK 6–8: Initial Prenatal Labs ══ */
{
week: 6, side: ‘left’, type: ‘labs’,
title: ‘Initial Prenatal Panel’,
preview: ‘Type & Screen, CBC, Rubella, Varicella, HepB, HIV, RPR, GC/Chlamydia, urine cx, TSH, Pap.’,
detail: `<strong>Complete initial prenatal lab panel:</strong> <ul><li><strong>Blood type & Screen</strong> (ABO/Rh) — Rh(D) negative → anti-D Ig management</li><li><strong>CBC</strong> — Hgb, Hct, MCV, platelets; baseline</li><li><strong>Rubella IgG</strong> — immunity status; if negative → vaccinate postpartum (MMR = live, contraindicated in pregnancy)</li><li><strong>Varicella IgG</strong> — if negative → VZIG if exposed; vaccinate postpartum</li><li><strong>Hepatitis B surface antigen (HBsAg)</strong> — if+: HBIG + HepB vaccine to newborn within 12h</li><li><strong>HIV 1/2 Ag/Ab combo (4th gen)</strong> — universal opt-out screening</li><li><strong>RPR / VDRL</strong> — syphilis screen; if+ → FTA-ABS confirm → benzathine PCN G</li><li><strong>GC + Chlamydia NAAT</strong> (cervical/vaginal swab) — treat if+</li><li><strong>Urine culture</strong> — asymptomatic bacteriuria: treat if ≥10⁵ CFU/mL → prevents pyelonephritis + PTL</li><li><strong>TSH</strong> — hypothyroidism associated with miscarriage, fetal neurodevelopment</li><li><strong>Hgb A1c</strong> — if high risk DM (obesity, prior GDM, family Hx)</li><li><strong>Pap smear</strong> — if due (current ACOG: age 21–65 q3yr; q5yr if cotesting)</li><li><strong>Hepatitis C Ab</strong> — universal per ACOG 2020</li></ul>`
},
{
week: 7, side: ‘right’, type: ‘labs’,
title: ‘Quantitative β-hCG Kinetics’,
preview: ‘Doubles q48h in viable early pregnancy. Peaks 8–10 wks (~100k mIU/mL). Low/plateau → ectopic or failed IUP.’,
detail: `<p><strong>β-hCG interpretation:</strong></p> <ul><li>Normal: doubles every 48h in viable early IUP</li><li>Discriminatory zone: ~1500–3000 mIU/mL → IUP should be visible on TVU/S</li><li>β-hCG &gt;3000 + no IUP on TVU/S → <strong>ectopic pregnancy until proven otherwise</strong></li><li>Peak: 8–10 wks (~100,000 mIU/mL), then declines to plateau in T2/T3</li><li>Very high β-hCG → molar pregnancy / multifetal gestation</li><li>Falling β-hCG (not halving/declining appropriately) → completed abortion</li></ul>`
},
{
week: 8, side: ‘left’, type: ‘fetal’,
title: ‘Organogenesis Peak’,
preview: ‘All major organs forming. Limbs, heart chambers, GI tract, CNS. Fetus becomes “fetal” at wk 10.’,
detail: `<p>The embryonic period (weeks 3–10) is when all major organ systems form — this is the period of highest teratogenic risk.</p> <ul><li><strong>Week 6:</strong> Heart 4 chambers forming; limb buds present</li><li><strong>Week 7:</strong> Face forming; lens, ear developing; liver hematopoiesis begins</li><li><strong>Week 8:</strong> Fingers distinct; external genitalia undifferentiated</li><li><strong>Week 10:</strong> Embryo → fetus. Intestines return from umbilical stalk. CRL ~30 mm</li><li>Teratogens causing malformations: alcohol (FAS), thalidomide (limb), isotretinoin (craniofacial/cardiac), valproate (NTD, craniofacial)</li></ul>`
},

/* ══ WEEK 8–10: Dating U/S ══ */
{
week: 8.5, side: ‘right’, type: ‘screen’,
title: ‘Dating Ultrasound (TVU/S)’,
preview: ‘Confirms IUP, viability, CRL for EDD. Rules out ectopic, molar, multiple gestation. FHR documented.’,
detail: `<p><strong>Transvaginal ultrasound:</strong></p> <ul><li>Crown-rump length (CRL) most accurate for dating in T1 (± 5–7 days)</li><li>If CRL-based EDD differs from LMP-based EDD by &gt;7 days → use CRL</li><li>Assess: yolk sac, embryo/fetal pole, cardiac activity, number of gestational sacs</li><li>FHR: normal 110–160 bpm; bradycardia &lt;90 bpm at 6–8 wks = poor prognosis</li><li>Diagnose: blighted ovum (gestational sac &gt;25 mm, no embryo), missed AB (no FHR, CRL &gt;7 mm)</li><li>Identify: ectopic (adnexal mass + no IUP), molar pregnancy (snowstorm pattern)</li></ul>`
},
{
week: 9, side: ‘left’, type: ‘infect’,
title: ‘TORCH: Critical T1 Window’,
preview: ‘Highest risk period for congenital infections. CMV, Toxo, Rubella, Parvovirus B19, Syphilis.’,
detail: `<p><strong>T1 is highest-risk for teratogenic fetal infection:</strong></p> <ul><li><strong>CMV:</strong> Periventricular calcifications, hearing loss, chorioretinitis, hydrops. Dx: maternal CMV IgM/IgG avidity + PCR amniotic fluid. Rx: valacyclovir (investigational), CMV HIG</li><li><strong>Toxoplasma gondii:</strong> From cat feces, raw meat. Fetal: chorioretinitis, intracranial calcifications, hydrocephalus, "blueberry muffin." Rx: pyrimethamine + sulfadiazine + leucovorin</li><li><strong>Rubella:</strong> T1 → congenital rubella syndrome: cataracts, cochlear defects, PDA/VSD. No treatment; MMR postpartum</li><li><strong>Parvovirus B19:</strong> Aplastic crisis → hydrops fetalis (nonimmune). MCA-PSV Doppler monitoring. Intrauterine transfusion if severe</li><li><strong>Syphilis (T. pallidum):</strong> Any trimester. Benzathine PCN G only proven Rx</li><li><strong>HSV:</strong> Vertical at delivery; intrauterine rare; microcephaly, vesicles, hydrocephalus. NO hydrops</li><li><strong>VZV:</strong> T1 → scar lesions, chorioretinitis, limb hypoplasia, cortical atrophy. NO hydrops</li><li><strong>Listeria:</strong> Deli meat, soft cheese. Ampicillin + gentamicin</li></ul>`
},

/* ══ WEEK 10–13: First Trimester Screen ══ */
{
week: 10, side: ‘right’, type: ‘screen’,
title: ‘Cell-Free Fetal DNA (cfDNA / NIPT)’,
preview: ‘From wk 10. Detects T21, T18, T13, sex chromosome aneuploidies. Sensitivity >99% for T21.’,
detail: `<p><strong>Non-invasive prenatal testing:</strong> analyzes fetal cfDNA fragments in maternal blood.</p> <ul><li>Available from 10 weeks gestation</li><li>Detects: Trisomy 21 (sensitivity &gt;99%, specificity ~99.9%), Trisomy 18, Trisomy 13, sex chromosome aneuploidies (45X, 47XXY, etc.)</li><li>Optional panels: microdeletions (22q11.2 DiGeorge, 1p36, 5p-); fetal sex</li><li><strong>Positive NIPT ≠ diagnosis</strong> — confirm with amniocentesis or CVS</li><li>False positives: vanishing twin, confined placental mosaicism, maternal malignancy</li><li>Fetal fraction must be ≥4% for reliable results</li></ul>`
},
{
week: 11.5, side: ‘left’, type: ‘screen’,
title: ‘Nuchal Translucency (NT) U/S’,
preview: ‘Wks 11–13⁶⁄₇. NT ≥3 mm → ↑ risk T21/18/13, cardiac defects. Combined with PAPP-A + free β-hCG.’,
detail: `<p><strong>First trimester combined screen (wks 11–13⁶⁄₇):</strong></p> <ul><li><strong>NT measurement:</strong> ≥3.0 mm abnormal; ≥3.5 mm → significant risk major structural/chromosomal anomaly</li><li><strong>PAPP-A:</strong> Low (≤0.4 MoM) → ↑ aneuploidy, FGR, preeclampsia, stillbirth risk</li><li><strong>Free β-hCG:</strong> High → T21; Low → T18/T13</li><li>Combined DR for T21: ~85–90% with 5% FPR</li><li>Additional markers: nasal bone absence (T21), tricuspid regurgitation, ductus venosus reversal</li><li>Cystic hygroma: large nuchal mass → Turner syndrome, T21, T18; high mortality</li></ul>`
},
{
week: 11, side: ‘right’, type: ‘screen’,
title: ‘Chorionic Villus Sampling (CVS)’,
preview: ‘Wks 10–13. Diagnostic karyotype, microarray. If abnormal NIPT or NT. Risk of loss ~0.5–1%.’,
detail: `<p><strong>CVS: invasive diagnostic procedure for karyotyping.</strong></p> <ul><li>Transabdominal or transcervical biopsy of chorionic villi (placental tissue)</li><li>Advantage over amnio: earlier result (10–13 wks vs 15–20 wks)</li><li>Results: karyotype (10–14 days), FISH (24–48h for rapid aneuploidy), chromosomal microarray</li><li>Risk of pregnancy loss: ~0.5–1% (vs amnio ~0.1–0.3%)</li><li>Cannot diagnose NTDs (no AFP) — follow-up MSAFP or anatomy U/S required</li><li>Contraindicated if: active vaginal bleeding, inaccessible placenta, active genital infection</li></ul>`
},
{
week: 12, side: ‘left’, type: ‘tx’,
title: ‘Aspirin Prophylaxis for Preeclampsia’,
preview: ‘If high risk: start low-dose aspirin 81 mg/day at 12–28 wks (ideally ≤16 wks). Continue to 36 wks.’,
detail: `<p><strong>USPSTF / ACOG recommendation:</strong> Low-dose aspirin (LDA) reduces preeclampsia risk by 10–20% in high-risk patients.</p> <p><strong>High-risk indications (1+ criterion):</strong></p> <ul><li>Prior preeclampsia (especially early-onset or severe)</li><li>Multifetal gestation</li><li>Chronic hypertension</li><li>Diabetes (type 1 or 2)</li><li>Chronic kidney disease</li><li>Autoimmune disease (SLE, antiphospholipid syndrome)</li></ul> <p><strong>Moderate risk (≥2 criteria):</strong> nulliparity, obesity (BMI &gt;30), family Hx preeclampsia, age ≥35, low SES, prior LBW/SGA infant, prior adverse pregnancy outcome.</p> <ul><li>Dose: aspirin 81 mg PO QD at bedtime</li><li>Start: ideally before 16 weeks; up to 28 wks still beneficial</li><li>Stop: 36–37 weeks</li></ul>`
},
{
week: 12.5, side: ‘right’, type: ‘fetal’,
title: ‘End of Embryonic Period / External Genitalia’,
preview: ‘Fetal period begins. Genitalia differentiating. Intestines return from cord. CRL ~6 cm at 13 wks.’,
detail: `<ul><li>Embryo → fetus at week 10; fetal period = weeks 10–40</li><li>External genitalia: sex differentiation begins ~7 wks; may be visible on U/S 12–14 wks</li><li>Intestinal loops return from umbilical cord into abdominal cavity</li><li>CRL at 13 wks: ~6 cm; weight ~23 g</li><li>Bone marrow begins hematopoiesis (previously liver/spleen)</li><li>Placenta fully functional, replaces corpus luteum for progesterone by wk 10</li><li>T1 spontaneous abortion rate: ~10–15% of recognized pregnancies (peaks wks 6–8)</li></ul>`
},

/* ══ WEEK 14–16 ══ */
{
week: 14, side: ‘left’, type: ‘appt’,
title: ‘T2 Routine Prenatal Visit’,
preview: ‘BP, weight, FH (wks ± 2 cm), FHR Doppler. Reassess symptoms: round ligament pain, heartburn, leukorrhea.’,
detail: `<p><strong>Routine prenatal visit checklist (every 4 wks T2, every 2 wks T3, weekly from 36 wks):</strong></p> <ul><li><strong>Blood pressure:</strong> goal &lt;140/90 (if chronic HTN, treat if ≥160/110)</li><li><strong>Weight gain:</strong> normal BMI → 25–35 lbs total; overweight → 15–25 lbs; obese → 11–20 lbs; underweight → 28–40 lbs</li><li><strong>Fundal height:</strong> symphysis to uterine fundus in cm ≈ gestational age in wks ± 2 cm (after 20 wks); SFH &lt;2 cm below GA → FGR</li><li><strong>FHR:</strong> Doppler at 10–12 wks; normal 110–160 bpm</li><li><strong>Symptoms to ask about:</strong> headache, visual changes, edema (preeclampsia); dysuria, flank pain (UTI/pyelo); vaginal bleeding or discharge; contractions; decreased fetal movement (after quickening)</li></ul>`
},
{
week: 15, side: ‘right’, type: ‘labs’,
title: ‘Quad Screen (MSAFP)’,
preview: ‘AFP, hCG, estriol, inhibin A at 15–20 wks. Screens for NTDs, T21, T18, abdominal wall defects.’,
detail: `<p><strong>Maternal Serum Analytes (15–20 weeks):</strong></p> <ul><li><strong>AFP (alpha-fetoprotein):</strong><br/>↑↑ (&gt;2.5 MoM) → open NTD (anencephaly, spina bifida), gastroschisis/omphalocele, multiple gestation, underestimated GA, fetal demise<br/>↓ → Trisomy 21, Trisomy 18</li><li><strong>hCG:</strong> ↑ → Trisomy 21; ↓ → Trisomy 18</li><li><strong>Unconjugated Estriol (uE3):</strong> ↓ → Trisomy 21, Trisomy 18, Smith-Lemli-Opitz</li><li><strong>Inhibin A:</strong> ↑ → Trisomy 21</li><li>Triple screen (no Inhibin A): DR ~69% for T21; Quad screen: ~81% DR</li><li>Abnormal AFP &gt;2.5 MoM → targeted anatomy U/S + consider amniocentesis</li></ul>`
},
{
week: 16, side: ‘left’, type: ‘infect’,
title: ‘Parvovirus B19 (Fifth Disease)’,
preview: ‘Slapped-cheek rash, polyarthritis. Fetal: aplastic crisis → nonimmune hydrops. Monitor MCA-PSV.’,
detail: `<p><strong>Parvovirus B19 (Erythrovirus B19) — "Fifth Disease" / Erythema Infectiosum:</strong></p> <p><strong>Maternal presentation:</strong> Slapped-cheek facial rash, lacy reticular rash on trunk/limbs, flu-like prodrome, symmetrical polyarticular arthritis (especially adults). Often mild or asymptomatic.</p> <p><strong>Fetal effects:</strong> Infects fetal erythroid precursors → aplastic crisis → severe fetal anemia → nonimmune hydrops fetalis. Risk of hydrops: ~5–10% if infected T2. Risk of fetal loss: ~2–6%.</p> <ul><li><strong>Diagnosis:</strong> IgM/IgG serology (IgM+ = acute); PCR (especially immunocompromised)</li><li><strong>Fetal monitoring:</strong> MCA-PSV Doppler q1–2 wks × 8–12 wks after acute infection; MCA-PSV &gt;1.5 MoM = significant fetal anemia</li><li><strong>Treatment:</strong> No antiviral; intrauterine transfusion if severe hydrops; many cases resolve spontaneously</li><li>No vaccine available</li></ul>`
},
{
week: 16.5, side: ‘right’, type: ‘screen’,
title: ‘Amniocentesis (if indicated)’,
preview: ‘Wks 15–20. Karyotype, microarray, FISH. Indicated: abnormal NIPT/quad, AMA, abnormal anatomy, prior aneuploidy.’,
detail: `<p><strong>Amniocentesis: gold standard diagnostic procedure for chromosomal analysis.</strong></p> <ul><li>Transabdominal U/S-guided aspiration of amniotic fluid</li><li>Optimal: 15–20 weeks</li><li>Results: FISH 24–48h (rapid T21/18/13/X/Y), karyotype 10–14 days, microarray 7–14 days</li><li>Also diagnoses: NTDs (elevated amniotic AFP + acetylcholinesterase), fetal infections (CMV, toxo PCR), metabolic disorders</li><li>Risk of pregnancy loss: ~0.1–0.3% (lower than CVS)</li><li>Contraindications: blood-filled fluid ("bloody tap"), active chorioamnionitis</li><li>Pre-procedure: confirm blood type; give RhIg if Rh-negative</li></ul>`
},

/* ══ WEEK 18–22: ANATOMY SCAN ══ */
{
week: 18, side: ‘left’, type: ‘screen’,
title: ‘Anatomy Survey Ultrasound’,
preview: ‘The landmark 18–22 wk U/S. Complete structural survey: brain, face, heart, spine, kidneys, abdomen, placenta.’,
detail: `<p><strong>Standard anatomy survey (18–22 weeks) — AIUM/ACOG guidelines:</strong></p> <p><strong>Fetal biometry:</strong> BPD, HC, AC, FL → EFW (Hadlock formula)</p> <p><strong>CNS:</strong> lateral ventricles (&lt;10 mm), cavum septum pellucidum, cerebellum, posterior fossa (banana/lemon signs in SB)</p> <p><strong>Face:</strong> lips (cleft lip detection), orbits, nasal bone, profile</p> <p><strong>Cardiac:</strong> 4-chamber view, LVOT, RVOT, 3-vessel trachea view, situs</p> <p><strong>Spine:</strong> complete sagittal + transverse (NTD detection)</p> <p><strong>Abdomen:</strong> stomach (filled = fetus swallowing), kidneys (bilateral; pelvis &lt;4 mm normal), bladder, cord insertion (2-vessel cord → renal/cardiac anomalies)</p> <p><strong>Placenta:</strong> location (previa if within 2 cm of os → follow-up at 32 wks), cord insertion</p> <p><strong>AFI / DVP:</strong> oligohydramnios (AFI &lt;5 or DVP &lt;2), polyhydramnios (AFI &gt;24 or DVP &gt;8)</p> <p><strong>Cervical length:</strong> if history of preterm birth, short CX, uterine anomaly</p>`
},
{
week: 19, side: ‘right’, type: ‘fetal’,
title: ‘Quickening / Fetal Organ Maturation’,
preview: ‘Mother feels movement 18–22 wks (primips later). Kidneys produce urine. Surfactant production begins.’,
detail: `<ul><li><strong>Quickening:</strong> First perception of fetal movement. Primips: 18–22 wks; multips: 16–18 wks.</li><li>Fetal kidneys produce urine → primary source of amniotic fluid by 16 wks</li><li>Type II pneumocytes begin surfactant production (lecithin, phosphatidylglycerol)</li><li>Lanugo (fine hair) covers entire body</li><li>Fetal swallowing: regulates amniotic fluid; esophageal atresia → polyhydramnios</li><li>Brown fat (thermogenesis) begins depositing ~20 wks</li><li>Weight at 20 wks: ~300 g; length ~25 cm</li></ul>`
},
{
week: 20, side: ‘left’, type: ‘infect’,
title: ‘VZV / Rubella: T2 Window’,
preview: ‘VZV: scar lesions, limb hypoplasia, chorioretinitis (no hydrops). Rubella >20 wks: hydrops rare.’,
detail: `<p><strong>Varicella Zoster Virus (VZV) — Congenital Varicella Syndrome:</strong></p> <ul><li>Highest risk if maternal infection weeks 8–20</li><li>Fetal: skin scarring (cicatricial lesions), chorioretinitis, limb hypoplasia, cortical atrophy, microcephaly</li><li>Detectable on antenatal ultrasound</li><li><strong>Does NOT cause hydrops fetalis</strong></li><li>Management: VZV IgG– mother exposed → VZIG (varicella-zoster immune globulin) within 96h; Acyclovir if active maternal disease (reduces severity); no live vaccine in pregnancy</li></ul> <p><strong>Rubella after 20 weeks:</strong> risk of congenital rubella syndrome markedly reduced; hydrops rare. Congenital rubella syndrome triad (T1): cataracts + cochlear defects + cardiac defects (PDA, VSD, pulmonary stenosis).</p>`
},

/* ══ WEEK 24–28: GDM + Viability ══ */
{
week: 24, side: ‘right’, type: ‘fetal’,
title: ‘Viability Threshold’,
preview: ‘22–24 wks = limit of viability. At 24 wks: ~50% survival with NICU. Eyes open. Hearing present.’,
detail: `<ul><li><strong>22 weeks:</strong> some centers offer resuscitation; survival rate ~10–15% with severe morbidity</li><li><strong>23 weeks:</strong> ~30–50% survival depending on center/weight/sex; discuss goals of care</li><li><strong>24 weeks:</strong> ~50–70% survival; most centers offer full resuscitation</li><li><strong>25 weeks:</strong> ~70–80% survival; morbidity decreasing</li><li>Weight at 24 wks: ~600 g; 28 wks: ~1000 g</li><li>Eyes open at ~26 wks; respond to sound; pain pathways developing</li><li>Antenatal corticosteroids, MgSO₄ (neuroprotection), GBS prophylaxis — all relevant if delivery anticipated</li></ul>`
},
{
week: 24.5, side: ‘left’, type: ‘labs’,
title: ‘GDM Screening — 1-hr GCT’,
preview: ‘50g glucose challenge (no fasting). Threshold ≥130 or ≥140 mg/dL → proceed to 3-hr GTT.’,
detail: `<p><strong>Gestational Diabetes Mellitus Screening (24–28 weeks):</strong></p> <p><strong>Step 1 — 1-hr Glucose Challenge Test (GCT):</strong></p> <ul><li>50g oral glucose load, non-fasting, 1-hr venous glucose</li><li>Threshold: ≥130 mg/dL (87% sensitivity) or ≥140 mg/dL (83% sensitivity, fewer false positives)</li><li>If abnormal → proceed to 3-hr GTT</li></ul> <p><strong>Step 2 — 3-hr 100g OGTT (Carpenter-Coustan criteria):</strong></p> <ul><li>Fasting ≥95 mg/dL</li><li>1-hour ≥180 mg/dL</li><li>2-hour ≥155 mg/dL</li><li>3-hour ≥140 mg/dL</li><li><strong>2 or more values ≥ threshold = GDM</strong></li></ul> <p><strong>Alternative (IADPSG/WHO):</strong> 2-hr 75g OGTT; fasting ≥92, 1h ≥180, 2h ≥153 — any one value = GDM.</p> <p>GDM management: medical nutrition therapy first; insulin if diet fails (metformin/glyburide: off-label, less preferred); fetal surveillance.</p>`
},
{
week: 26, side: ‘right’, type: ‘labs’,
title: ‘Repeat CBC + Rh Antibody Screen’,
preview: ‘Repeat Hgb for anemia (treat if <10). Rh antibody screen at 28 wks. Repeat urine culture.’,
detail: `<ul><li><strong>CBC at 28 wks:</strong> iron deficiency anemia most common (↓ MCV, ↓ ferritin, ↑ TIBC) → ferrous sulfate 325 mg TID; IV iron if severe/intolerant</li><li><strong>Rh(D) antibody screen:</strong> If Rh– mother, check for alloimmunization before giving RhIg</li><li><strong>Urine culture:</strong> repeat if prior asymptomatic bacteriuria</li><li><strong>Repeat GC/Chlamydia:</strong> if high risk (prior STI, new partner, adolescent)</li><li>Maternal Hgb &lt;10 g/dL → work up and treat; &lt;7 g/dL → consider transfusion</li></ul>`
},
{
week: 27, side: ‘left’, type: ‘tx’,
title: ‘Tdap + Influenza + RhoGAM at 28 wks’,
preview: ‘Tdap 27–36 wks (ideally 27–32). Flu vaccine any trimester. RhoGAM 300 μg IM if Rh(D)–.’,
detail: `<p><strong>Vaccinations in pregnancy:</strong></p> <ul><li><strong>Tdap (Tetanus, diphtheria, acellular pertussis):</strong> 27–36 wks (ideally 27–32 wks) every pregnancy regardless of prior vaccination → maternal antibodies transferred to newborn protect against pertussis before infant's own vaccine series</li><li><strong>Influenza (inactivated):</strong> Any trimester during flu season; reduces maternal ICU admissions, neonatal flu</li><li><strong>COVID-19 (mRNA preferred):</strong> Any trimester; safe</li><li><strong>RSV vaccine (Abrysvo):</strong> 32–36 wks; protects newborn via passive Ab transfer (new, ACOG 2023)</li></ul> <p><strong>RhoGAM (Rh Immunoglobulin 300 μg IM) at 28 wks:</strong></p> <ul><li>Give if Rh(D)– and antibody screen negative</li><li>Also give after: any vaginal bleeding, amniocentesis, external cephalic version (ECV), abdominal trauma, threatened AB, fetal demise, ectopic pregnancy</li><li>Repeat within 72h of delivery if infant is Rh+</li></ul>`
},
{
week: 27.5, side: ‘right’, type: ‘screen’,
title: ‘Cervical Length + PTL Risk’,
preview: ‘Short CX ≤25 mm at 24 wks → high risk PTL. Vaginal progesterone or 17-OHPC if indicated.’,
detail: `<p><strong>Cervical length (CL) screening and preterm labor prevention:</strong></p> <ul><li>Transvaginal CL &lt;25 mm at 24 wks → high risk for spontaneous PTL</li><li><strong>Vaginal progesterone 200 mg QD:</strong> if CL ≤25 mm regardless of prior PTL history (OPPTIMUM, PROLONG trials — some controversy but ACOG still recommends)</li><li><strong>17α-hydroxyprogesterone caproate (17-OHPC / Makena):</strong> if prior spontaneous preterm birth &lt;37 wks; weekly IM injections 16–36 wks (effectiveness contested in some trials)</li><li><strong>Cerclage:</strong> if prior PTL + CL ≤25 mm + singleton → McDonald or Shirodkar cerclage 13–16 wks; history-indicated cerclage for cervical incompetence at 12–14 wks</li><li>Progesterone: safe in pregnancy; does not masculinize female fetus</li></ul>`
},

/* ══ WEEK 28–32 ══ */
{
week: 28, side: ‘left’, type: ‘appt’,
title: ‘T3 Visits — Every 2 Weeks’,
preview: ‘BP, weight, fundal height, FHR. Leopold maneuvers for lie/presentation. Watch for preeclampsia sx.’,
detail: `<p><strong>T3 visit schedule: every 2 weeks from 28–36 wks; weekly from 36 wks.</strong></p> <p><strong>Leopold maneuvers (28+ wks):</strong></p> <ul><li>1st: Fundal grip — what's in fundus? (head = hard, round; breech = soft, irregular)</li><li>2nd: Lateral grip — locate fetal back/small parts</li><li>3rd: Pawlick's grip — presenting part</li><li>4th: Pelvic grip — head flexion/engagement</li></ul> <p><strong>Preeclampsia red flags:</strong> BP ≥140/90 on 2 occasions ≥4h apart; proteinuria ≥300 mg/24h; headache, visual changes, RUQ pain, thrombocytopenia, renal insufficiency (Cr &gt;1.1), pulmonary edema.</p> <p>Severe range: BP ≥160/110; manage with labetalol IV, hydralazine IV, or oral nifedipine; MgSO₄ seizure prophylaxis.</p>`
},
{
week: 29, side: ‘right’, type: ‘labs’,
title: ‘Third Trimester Labs’,
preview: ‘CBC (anemia), repeat HIV/syphilis if high-risk, HepB if needed, urine protein:Cr if preeclampsia concern.’,
detail: `<ul><li><strong>CBC:</strong> anemia work-up; platelets if preeclampsia/HELLP concern</li><li><strong>Repeat HIV:</strong> if high risk or unknown status</li><li><strong>Repeat syphilis RPR:</strong> high-risk populations; third trimester</li><li><strong>Repeat GC/Chlamydia:</strong> if high risk</li><li><strong>HepB surface Ag:</strong> if not done or negative previously + new exposure</li><li><strong>Urine protein/creatinine ratio:</strong> if BP elevated; ratio ≥0.3 = significant proteinuria (equivalent to 300 mg/24h)</li><li><strong>24-hour urine protein:</strong> gold standard; ≥300 mg = proteinuria for preeclampsia diagnosis</li><li><strong>LFTs, Cr, LDH, uric acid:</strong> if preeclampsia suspected (HELLP panel)</li></ul>`
},
{
week: 30, side: ‘left’, type: ‘tx’,
title: ‘Antenatal Corticosteroids (Betamethasone)’,
preview: ‘If delivery anticipated <34 wks: betamethasone 12 mg IM ×2 doses 24h apart. Reduces RDS, IVH, NEC.’,
detail: `<p><strong>Antenatal corticosteroids for fetal lung maturity:</strong></p> <ul><li><strong>Betamethasone 12 mg IM q24h × 2 doses</strong> (preferred; dexamethasone 6 mg IM q12h × 4 doses is alternative)</li><li><strong>Indications:</strong> anticipated preterm delivery &lt;34 weeks</li><li><strong>Benefits:</strong> ↓ respiratory distress syndrome (RDS), ↓ intraventricular hemorrhage (IVH), ↓ necrotizing enterocolitis (NEC), ↓ overall neonatal mortality by ~40%</li><li>Peak benefit: 24h–7 days after first dose</li><li>ACOG 2016: Consider rescue course if initial course &gt;14 days ago and &lt;34 wks and delivery still anticipated</li><li><strong>Late preterm (34–36⁶⁄₇ wks):</strong> single course betamethasone (ALPS trial) — reduces respiratory morbidity in late preterm infants</li><li>Maternal monitoring: transient hyperglycemia — monitor glucose in DM patients; transient leukocytosis</li></ul>`
},
{
week: 31, side: ‘right’, type: ‘fetal’,
title: ‘Fetal Weight Gain + Positioning’,
preview: ‘~200–250 g/wk gain. Lungs maturing. Lanugo diminishing. Head vertex by 32 wks. 28 wks: ~1100 g.’,
detail: `<ul><li><strong>28 weeks:</strong> ~1100 g; 32 weeks: ~1800 g; 36 weeks: ~2600 g; 40 weeks: ~3200–3400 g</li><li>Fetal fat accumulation: 15% body weight at 34 wks; 30% by term</li><li>Lanugo diminishing from 36 wks; vernix caseosa protecting skin</li><li>Brain gyrification accelerates 28–40 wks; cortical neurons migrating</li><li>Fetal "breathing" movements: 30+ minutes/hour by 34 wks (amniotic fluid in/out of lungs)</li><li>Eyes open at ~26 wks; pupillary light reflex present by 28–30 wks</li><li>Malpresentation (breech, transverse) common before 32 wks; most convert to vertex by 36 wks</li></ul>`
},

/* ══ WEEK 32–36 ══ */
{
week: 32, side: ‘left’, type: ‘screen’,
title: ‘Growth Ultrasound + BPP’,
preview: ‘EFW, AFI, placenta, Doppler if FGR. BPP = NST + breathing + movement + tone + fluid (max 10 pts).’,
detail: `<p><strong>Growth ultrasound (32–36 wks, or as indicated):</strong></p> <ul><li>EFW: &lt;10th percentile = SGA; &lt;3rd percentile = severe FGR</li><li>AFI normal: 5–24 cm; DVP normal: 2–8 cm</li><li>Placenta previa: if low-lying at anatomy scan → follow-up at 32 wks; complete previa at 36 wks → scheduled C-section at 36–37 wks</li><li><strong>Biophysical Profile (BPP):</strong> NST (2 pts) + breathing movements ≥30 sec in 30 min (2 pts) + ≥3 discrete body movements (2 pts) + tone (flexion/extension) (2 pts) + AFI normal (2 pts) = max 10<br/>Score ≤6 → delivery consideration; ≤4 → delivery strongly recommended</li><li><strong>Umbilical artery Doppler:</strong> absent end-diastolic flow (AEDF) → severe FGR, deliver by 34 wks; reversed EDF (REDF) → deliver immediately</li></ul>`
},
{
week: 33, side: ‘right’, type: ‘screen’,
title: ‘Non-Stress Test (NST) Surveillance’,
preview: ‘2 accels ≥15 bpm × 15 sec in 20 min = reactive. Weekly or BID in high-risk (DM, HTN, FGR, post-dates).’,
detail: `<p><strong>Antepartum fetal surveillance — Non-Stress Test:</strong></p> <ul><li><strong>Reactive NST:</strong> ≥2 accelerations of ≥15 bpm above baseline, lasting ≥15 seconds, within 20 minutes (reassuring)</li><li><strong>Non-reactive:</strong> fails above criteria in 40 min → proceed to BPP or CST</li><li><strong>Variable decelerations:</strong> cord compression (common, usually benign)</li><li><strong>Late decelerations:</strong> uteroplacental insufficiency</li><li><strong>Indications for surveillance:</strong> DM (start 28–32 wks), HTN/preeclampsia, FGR, post-dates (≥41 wks), IUFD history, oligohydramnios, twin pregnancy, AMA</li><li><strong>Contraction Stress Test (CST/OCT):</strong> oxytocin stimulation; late decels with ≥50% contractions = positive (concerning)</li></ul>`
},
{
week: 34, side: ‘left’, type: ‘tx’,
title: ‘Magnesium Sulfate (Neuroprotection)’,
preview: ‘If delivery <32 wks (some protocols <34): MgSO₄ 4–6g IV load then 1–2 g/hr × 12–24h → reduces CP.’,
detail: `<p><strong>MgSO₄ for fetal neuroprotection (anticipated delivery &lt;32 wks per ACOG; some extend to &lt;34 wks):</strong></p> <ul><li>Loading dose: <strong>4–6 g IV over 15–20 min</strong></li><li>Maintenance: <strong>1–2 g/hr continuous infusion</strong></li><li>Duration: up to 12–24 hours or until delivery</li><li>Mechanism: unclear; may involve NMDA antagonism, anti-inflammatory, neuroprotection of periventricular white matter</li><li>Evidence: reduces risk of cerebral palsy by ~32% and severe neurological dysfunction</li></ul> <p><strong>Toxicity monitoring:</strong></p> <ul><li>Loss of deep tendon reflexes (DTRs) → first sign of toxicity (~7–10 mEq/L)</li><li>Respiratory depression (&gt;12 mEq/L) → life-threatening</li><li>Cardiac arrest (&gt;15 mEq/L)</li><li>Check DTRs hourly; UO &gt;25 mL/hr (renally cleared)</li><li><strong>Antidote: Calcium gluconate 1g IV over 3 min</strong></li></ul>`
},
{
week: 35, side: ‘right’, type: ‘infect’,
title: ‘GBS Rectovaginal Screen + HSV Suppression’,
preview: ‘GBS swab 35–37 wks. Universal culture. GBS+ → intrapartum PCN G. HSV: acyclovir suppression from 36 wks.’,
detail: `<p><strong>Group B Streptococcus (GBS) Screening — 35–37 wks:</strong></p> <ul><li>Universal rectovaginal swab culture (NOT cervical)</li><li>GBS colonization rate: ~25% of pregnant women</li><li><strong>Intrapartum antibiotic prophylaxis (IAP) if:</strong> GBS culture+, unknown status + risk factors (PTL &lt;37 wks, ROM &gt;18h, intrapartum fever, prior GBS infant, GBS bacteriuria this pregnancy)</li><li><strong>Penicillin G 5M units IV load, then 2.5M units IV q4h</strong> (first-line)</li><li>Ampicillin 2g IV, then 1g q4h (alternative)</li><li>PCN allergy: cefazolin (low-risk allergy), clindamycin (if susceptible), vancomycin (high-risk allergy)</li></ul> <p><strong>HSV Suppression:</strong></p> <ul><li>Acyclovir 400 mg TID OR valacyclovir 500 mg BID from 36 wks → reduces viral shedding and recurrence at delivery</li><li>Active genital HSV lesions at labor onset → C-section</li></ul>`
},

/* ══ WEEK 36–40: Term ══ */
{
week: 36, side: ‘left’, type: ‘appt’,
title: ‘Weekly Term Visits + Delivery Planning’,
preview: ‘Weekly from 36 wks. Bishop score. Discuss birth plan, TOLAC, pain management, breastfeeding.’,
detail: `<p><strong>Term prenatal visits (weekly 36–40 wks):</strong></p> <ul><li><strong>Bishop score</strong> (cervical ripening assessment): dilation, effacement, station, consistency, position → ≥8 = favorable; &lt;6 = unfavorable (ripen first)</li><li>Leopold maneuvers: confirm vertex presentation; if breech → offer ECV at 36–37 wks (success ~50–60%); if declines → schedule C-section at 39 wks</li><li>TOLAC (trial of labor after cesarean) counseling: VBAC success rate ~60–80% if prior low transverse uterine incision; rupture risk ~0.5–1%</li><li>Discuss: labor pain management (epidural, CSE, IV opioids, nitrous oxide), breastfeeding plan, cord blood banking, circumcision, newborn care</li><li>Postdates counseling: induction recommended at 41–42 wks</li></ul>`
},
{
week: 37, side: ‘right’, type: ‘labs’,
title: ‘Pre-Delivery Lab Panel’,
preview: ‘CBC, Type & Screen, BMP. GBS result review. Coagulation studies if preeclampsia/HELLP/placenta previa.’,
detail: `<ul><li><strong>CBC:</strong> baseline Hgb/Hct/platelets pre-delivery; PLT &lt;100k → anesthesia aware (epidural risk); PLT &lt;50k → no epidural</li><li><strong>Type and Screen:</strong> re-draw if &gt;72h from expected delivery; crossmatch if high-risk (previa, accreta, prior PPH)</li><li><strong>BMP/CMP:</strong> if preeclampsia (Cr, LFTs, LDH, uric acid)</li><li><strong>Coagulation (PT, aPTT, fibrinogen):</strong> if abruption, IUFD, DIC risk</li><li><strong>GBS result:</strong> confirm status; if+ → IAP in place</li><li><strong>Cervical length history:</strong> if short CX, previa → birth plan</li></ul>`
},
{
week: 38, side: ‘left’, type: ‘fetal’,
title: ‘Term Fetus Characteristics’,
preview: ‘38 wks = early term; 39–40 = full term; 41 = late term; ≥42 = post-term. Avg wt 3200–3500 g at 39–40 wks.’,
detail: `<ul><li><strong>Early term:</strong> 37–38⁶⁄₇ wks — increased risk neonatal respiratory morbidity vs full term</li><li><strong>Full term:</strong> 39–40⁶⁄₇ wks — optimal outcomes; avoid elective delivery before 39 wks without medical indication</li><li><strong>Late term:</strong> 41–41⁶⁄₇ wks</li><li><strong>Post-term:</strong> ≥42 wks — increased risk: meconium aspiration, oligohydramnios, macrosomia, placental insufficiency, fetal demise</li><li>At 40 wks: vernix largely absent, lanugo gone, skull ossified but molding possible, fingernails grown past fingertips</li><li><strong>ARRIVE trial (NEJM 2018):</strong> elective induction at 39 wks in nullips → no increased C-section rate + fewer hypertensive disorders</li></ul>`
},
{
week: 39, side: ‘right’, type: ‘tx’,
title: ‘Induction of Labor / Cervical Ripening’,
preview: ‘Medical IOL: GDM, HTN, FGR, PROM, post-term. Cervical ripening: misoprostol, dinoprostone, Foley balloon.’,
detail: `<p><strong>Induction of labor (IOL):</strong></p> <p><strong>Medical indications:</strong> GDM, chronic/gestational HTN, preeclampsia, FGR, PROM (PROM at term → oxytocin), IUFD, post-dates (≥41 wks per ACOG), oligohydramnios, cholestasis of pregnancy.</p> <p><strong>Cervical ripening (Bishop &lt;6):</strong></p> <ul><li><strong>Misoprostol (Cytotec):</strong> 25 μg vaginally q4h OR 50 μg PO q4h; prostaglandin E1; avoid if prior uterine surgery (uterine rupture risk)</li><li><strong>Dinoprostone (Cervidil):</strong> PGE2 gel or insert; cervical ripening; can be removed</li><li><strong>Foley bulb:</strong> mechanical ripening; insert transcervically; safe if prior uterine surgery</li><li><strong>Oxytocin (Pitocin):</strong> IV infusion starting 0.5–2 mU/min, increase q15–40 min; targets adequate ctx (≥200 MVUs/10 min)</li></ul> <p><strong>Arrest of labor definitions (ACOG):</strong></p> <ul><li>Active phase arrest: ≥6 cm, membranes ruptured, ≥4h adequate ctx with no change OR ≥6h inadequate ctx with no change</li><li>Second stage arrest: nullip without epidural &gt;2h; with epidural &gt;3h; multip without epidural &gt;1h; with epidural &gt;2h</li></ul>`
},
{
week: 41, side: ‘left’, type: ‘screen’,
title: ‘Post-Dates Surveillance’,
preview: ‘≥41 wks: NST + AFI twice weekly. AFI <5 or DVP <2 → oligohydramnios → deliver. BPP if non-reactive.’,
detail: `<ul><li>True post-dates = ≥42 wks; late-term = 41 wks</li><li>ACOG recommends delivery at 41–42 wks; individualize</li><li>Fetal surveillance: NST + AFI or BPP twice weekly starting 41 wks</li><li>Oligohydramnios (AFI &lt;5 cm or DVP &lt;2 cm) → deliver regardless of fetal testing</li><li>Risks if expectant: ↑ meconium aspiration syndrome, ↑ fetal demise, ↑ macrosomia (shoulder dystocia risk), ↑ uteroplacental insufficiency</li><li>Placenta grades III (Grannum) — calcifications increase with aging placenta</li><li>Meconium-stained amniotic fluid: suction at perineum ONLY if vigorous infant; neonatal team ready; intubate if depressed</li></ul>`
},

/* ══ LABOR & DELIVERY (special week = 40 on spine, labeled separately) ══ */
{
week: 40, side: ‘right’, type: ‘appt’,
title: ‘Stages of Labor’,
preview: ‘Stage 1: latent (0–6 cm) → active (6–10 cm). Stage 2: pushing. Stage 3: placenta. Stage 4: 1–2h postpartum.’,
detail: `<p><strong>Stage 1 — Latent phase:</strong> 0–6 cm, irregular → regular contractions. Nullips ≤20h; multips ≤14h.</p> <p><strong>Stage 1 — Active phase:</strong> 6–10 cm. Expected ≥1 cm/hr (older Friedman curve) or ≥0.5 cm/hr (ACOG 2014 updated). Arrest: &lt;0.5 cm/2h with adequate ctx OR 4h with inadequate ctx.</p> <p><strong>Stage 2:</strong> Full dilation → delivery. Nullip without epidural &lt;2h; with epidural &lt;3h. Multip &lt;1h/2h.</p> <p><strong>Stage 3:</strong> Delivery → placental expulsion. Normal ≤30 min. Active management: oxytocin 10U IM immediately → reduces PPH.</p> <p><strong>Stage 4:</strong> First 1–2h postpartum. Monitor: tone, lochia, BP, HR q15 min × 1h → q30 min × 1h.</p> <p><strong>Labor analgesia:</strong> Epidural (0.0625–0.125% bupivacaine ± fentanyl); CSE; IV fentanyl 50–100 μg; nitrous oxide 50%; pudendal block.</p>`
},
{
week: 40.5, side: ‘left’, type: ‘infect’,
title: ‘Chorioamnionitis (IAI)’,
preview: ‘Fever ≥39°C + maternal/fetal tachycardia. Rx: ampicillin + gentamicin ± clindamycin (if C/S).’,
detail: `<p><strong>Intrauterine Amnionitis / Chorioamnionitis:</strong></p> <p><strong>Diagnosis (≥1 criterion):</strong></p> <ul><li>Maternal fever ≥39°C (single) OR 38–38.9°C ×2 (30 min apart)</li><li>PLUS ≥1: maternal tachycardia &gt;100, fetal tachycardia &gt;160, uterine tenderness, purulent amniotic fluid</li></ul> <p><strong>Treatment:</strong></p> <ul><li><strong>Ampicillin 2g IV q6h + Gentamicin 1.5 mg/kg q8h</strong> (or 5 mg/kg q24h)</li><li><strong>Add clindamycin 900 mg IV q8h</strong> (or metronidazole) if cesarean delivery (anaerobic coverage)</li><li>Continue until afebrile and asymptomatic ×24–48h postpartum</li></ul> <ul><li>Fetal tachycardia &gt;160 bpm: early sign; worsening variability + late decels → expedite delivery</li><li>Risk factors: prolonged ROM, multiple vaginal exams, prolonged labor, GBS+ untreated</li><li>Neonatal: sepsis work-up, empiric antibiotics</li></ul>`
},
{
week: 40.8, side: ‘right’, type: ‘labs’,
title: ‘HELLP Syndrome’,
preview: ‘Hemolysis + Elevated Liver enzymes + Low Platelets. MgSO₄ seizure prophylaxis. Deliver.’,
detail: `<p><strong>HELLP Syndrome (severe preeclampsia spectrum):</strong></p> <ul><li><strong>H — Hemolysis:</strong> schistocytes on smear, LDH &gt;600 U/L, elevated indirect bilirubin</li><li><strong>EL — Elevated Liver enzymes:</strong> AST &gt;70 U/L (or 2× ULN), ALT elevated</li><li><strong>LP — Low Platelets:</strong> &lt;100,000/μL (Class I &lt;50k, Class II 50–100k, Class III 100–150k)</li></ul> <p><strong>Management:</strong></p> <ul><li>MgSO₄ 4–6g load then 1–2 g/hr for seizure prophylaxis (eclampsia prevention)</li><li>Antihypertensives: IV labetalol, IV hydralazine, oral nifedipine (SBP ≥160 or DBP ≥110)</li><li>Platelet transfusion: &lt;50k if vaginal delivery; &lt;50k if C/S (most recommend &lt;50k regardless)</li><li>Betamethasone may temporarily increase platelets (controversial)</li><li>Delivery: definitive treatment; ≥34 wks → deliver; &lt;34 wks → individualize</li><li>DIC can complicate severe HELLP: fibrinogen ↓, PT/PTT ↑, D-dimer ↑↑</li></ul>`
},
{
week: 41.2, side: ‘left’, type: ‘tx’,
title: ‘PPH Prevention + Management’,
preview: ‘Active management of Stage 3. Oxytocin first-line. Uterotonic ladder. Tranexamic acid within 3h.’,
detail: `<p><strong>Postpartum hemorrhage:</strong> blood loss &gt;1000 mL (or hemodynamic instability) within 24h of delivery.</p> <p><strong>Active management of Stage 3 (for all deliveries):</strong></p> <ul><li>Oxytocin 10 units IM immediately after delivery of infant (reduces PPH by 50%)</li><li>Uterine massage</li><li>Early cord clamping (after 30–60 sec in stable neonate)</li></ul> <p><strong>Uterotonic escalation:</strong></p> <ul><li>Oxytocin 10–40 U in 1L NS IV drip (first-line)</li><li>Methylergonovine 0.2 mg IM (contraindicated: HTN, preeclampsia)</li><li>Carboprost (15-methyl PGF2α) 0.25 mg IM q15–90 min, max 8 doses (contraindicated: asthma)</li><li>Misoprostol 800–1000 μg rectally</li><li><strong>Tranexamic acid 1g IV</strong> (within 3h of delivery; WOMAN trial — reduces mortality from hemorrhage)</li></ul> <p><strong>Procedural:</strong> bimanual compression, Bakri balloon tamponade, uterine packing, B-Lynch suture, uterine artery ligation, hysterectomy.</p>`
},

];

/* ─── POSTPARTUM DATA ─────────────────────────────────── */
const PP_EVENTS = [
{
type: ‘labs’, title: ‘Neonatal Assessment — APGAR’,
preview: ‘APGAR at 1 and 5 min. 7–10 normal. 4–6 moderate depression → stimulate. <4 → resuscitate.’,
detail: `<p><strong>APGAR Score (max 10):</strong></p> <ul><li><strong>A</strong>ppearance (color): 0=blue/pale, 1=acrocyanotic, 2=pink all over</li><li><strong>P</strong>ulse: 0=absent, 1=&lt;100, 2=≥100</li><li><strong>G</strong>rimace (reflex irritability): 0=none, 1=grimace, 2=cough/sneeze/cry</li><li><strong>A</strong>ctivity (tone): 0=limp, 1=some flexion, 2=active</li><li><strong>R</strong>espiration: 0=absent, 1=irregular/weak, 2=good/crying</li><li>1-min APGAR predicts initial response to resuscitation; 5-min predicts neurological outcome</li><li>Score &lt;7 at 5 min → continue q5 min scores until ≥7 or 20 min</li></ul>`
},
{
type: ‘tx’, title: ‘Immediate Newborn Prophylaxis’,
preview: ‘Vitamin K1 1 mg IM. Erythromycin eye ointment. HepB vaccine within 12–24h. HBIG if mom HBsAg+.’,
detail: `<ul><li><strong>Vitamin K1 (phytonadione) 1 mg IM:</strong> Prevention of vitamin K deficiency bleeding (VKDB / hemorrhagic disease of newborn); factors II, VII, IX, X vitamin K–dependent; neonates born deficient</li><li><strong>Erythromycin 0.5% ophthalmic ointment:</strong> Prophylaxis against ophthalmia neonatorum from GC and Chlamydia; mandated in most states</li><li><strong>Hepatitis B vaccine (HepB1):</strong> Within 12–24h if mom HBsAg–; within 12h if mom HBsAg+ (plus HBIG 0.5 mL IM different site)</li><li>Hepatitis B immune globulin (HBIG): 0.5 mL IM within 12h if mom HBsAg+ → prevents vertical transmission</li></ul>`
},
{
type: ‘screen’, title: ‘Newborn Metabolic Screen + Hearing’,
preview: ‘Heel stick at 24–48h: PKU, hypothyroidism, galactosemia, CAH, MCAD, hemoglobinopathies, 30+ more.’,
detail: `<p><strong>Universal Newborn Screening (NBS):</strong> Heel-stick dried blood spot at 24–48h (repeat at 1–2 wks if done &lt;24h).</p> <p>State panels vary (~30–60 conditions). Recommended RUSP conditions include:</p> <ul><li>PKU (phenylketonuria), MSUD, homocystinuria, other amino acidopathies</li><li>Congenital hypothyroidism (most common treatable NBS condition)</li><li>Congenital adrenal hyperplasia (CAH — 21-hydroxylase deficiency)</li><li>MCAD deficiency (fatty acid oxidation)</li><li>Galactosemia</li><li>Cystic fibrosis (IRT)</li><li>Sickle cell disease + other hemoglobinopathies</li><li>Severe combined immunodeficiency (SCID)</li><li>Spinal muscular atrophy (SMA) — RUSP added 2018</li></ul> <p><strong>Hearing screen:</strong> OAE (otoacoustic emissions) or AABR (automated ABR) — universal, before discharge; repeat at 1 month if fail.</p> <p><strong>CCHD screen:</strong> Pulse oximetry right hand + right foot; refer if fail algorithm at 24h.</p>`
},
{
type: ‘fetal’, title: ‘Neonatal Hyperbilirubinemia’,
preview: ‘Physiologic jaundice peaks day 3–5. Bhutani nomogram: plot total bili vs age in hours. Phototherapy threshold varies.’,
detail: `<p><strong>Neonatal jaundice evaluation:</strong></p> <ul><li>Physiologic: appears day 2–3, peaks day 3–5, resolves by 2 wks (term) or 3 wks (preterm)</li><li>Pathologic: &lt;24h of life → hemolytic cause until proven otherwise (ABO, Rh incompatibility); direct Coombs+</li><li><strong>Bhutani nomogram:</strong> plot total serum bilirubin vs postnatal age in hours → low/intermediate/high risk zone</li><li>Phototherapy: threshold varies by GA, risk factors (isoimm. hemolytic disease, G6PD, sepsis, acidosis, hypoalbuminemia) — AAP 2022 updated thresholds</li><li>Exchange transfusion: if bili approaches neurotoxicity threshold despite phototherapy; prevents kernicterus</li><li>Bili goal: phototherapy when bili ≥ threshold for age + GA (AAP BiliTool: bilitool.org)</li><li>G6PD deficiency: can cause severe hemolysis + jaundice, especially in African/Mediterranean/Asian descent</li></ul>`
},
{
type: ‘infect’, title: ‘Postpartum Infections’,
preview: ‘Endometritis: fever + uterine tenderness → clindamycin + gentamicin. Mastitis: dicloxacillin × 14 days, keep BF.’,
detail: `<p><strong>Endometritis:</strong> Most common postpartum infection. C-section risk 5–10× higher than vaginal delivery.</p> <ul><li>Sx: fever (≥38°C ×2 after 24h), uterine tenderness, foul lochia, leukocytosis</li><li>Rx: <strong>Clindamycin 900 mg IV q8h + Gentamicin 1.5 mg/kg q8h</strong> until afebrile 24–48h (no oral step-down needed)</li></ul> <p><strong>Wound infection:</strong> Cellulitis vs abscess; open/drain + antibiotics; Staph aureus most common.</p> <p><strong>Mastitis:</strong></p> <ul><li>Unilateral breast erythema, warmth, tenderness, fever, flu-like sx; S. aureus most common</li><li>Rx: <strong>Dicloxacillin 500 mg QID × 10–14 days</strong> (or cephalexin); MRSA: TMP-SMX</li><li>Continue breastfeeding; frequent feeding reduces milk stasis</li><li>Breast abscess: fluctuant → ultrasound-guided aspiration or I&D</li></ul>`
},
{
type: ‘screen’, title: ‘Postpartum Depression Screening’,
preview: ‘EPDS at 1-month and 6-month visits. Score ≥10 → screen. ≥13 → likely PPD. Sertraline safest with BF.’,
detail: `<p><strong>Edinburgh Postnatal Depression Scale (EPDS):</strong> 10-item self-report; validated screening tool.</p> <ul><li>Score 0–30; ≥10 → further evaluation; ≥13 → likely PPD (sensitivity ~80%)</li><li>ACOG: contact within 3 wks postpartum; comprehensive visit at 12 wks (extends traditional 6-wk visit)</li></ul> <p><strong>Spectrum:</strong></p> <ul><li><strong>Baby blues:</strong> Tearfulness, mood lability, anxiety days 3–10; normal (50–80% of women); resolves spontaneously</li><li><strong>PPD:</strong> Onset within 4 wks–1 year; persistent sadness, anhedonia, anxiety, bonding difficulties. Treatment: SSRI + psychotherapy. <strong>Sertraline</strong> preferred (lowest milk transfer); also escitalopram, paroxetine</li><li><strong>Postpartum psychosis:</strong> Rare (0.1–0.2%); psychiatric emergency. Hallucinations, delusions, confusion; onset within 2–4 wks. Admit; mood stabilizers + antipsychotics</li><li><strong>Brexanolone (Zulresso):</strong> IV infusion; FDA-approved specifically for PPD; rapid onset</li></ul>`
},
{
type: ‘tx’, title: ‘Postpartum Contraception’,
preview: ‘POP immediately; no COCP <6 wks (thrombosis). LARC: immediate postpartum IUD or implant. Depo any time.’,
detail: `<p><strong>Postpartum contraception — timing and safety:</strong></p> <ul><li><strong>Progestin-only pill (POP):</strong> Immediately postpartum; safe while breastfeeding; no estrogen → no thrombosis risk; take same time daily (3-hr window)</li><li><strong>Combined OCP (estrogen + progestin):</strong> Avoid &lt;6 wks (VTE risk); avoid &lt;6 months if exclusively breastfeeding (estrogen suppresses milk production)</li><li><strong>Immediate postpartum IUD:</strong> Levonorgestrel (Mirena) or copper (Paragard) inserted within 10 min of placental delivery; higher expulsion rate (~25%) vs interval insertion but LARC immediately</li><li><strong>Implant (Nexplanon):</strong> Any time postpartum; 3-year progestin rod; highly effective; safe while BF</li><li><strong>Depot medroxyprogesterone (Depo-Provera):</strong> 150 mg IM q12 wks; any time postpartum; safe BF; delayed return to fertility</li><li><strong>Barrier methods:</strong> Condom immediately; diaphragm/cervical cap: wait 6 wks + refitting needed</li></ul>`
},
{
type: ‘labs’, title: ‘Postpartum Labs at 6 Weeks’,
preview: ‘GDM → 75g OGTT at 4–12 wks. TSH (postpartum thyroiditis). CBC if fatigue. Pap if deferred.’,
detail: `<ul><li><strong>GDM follow-up (mandatory):</strong> 75g 2-hr OGTT at 4–12 wks postpartum; repeat annually if normal; 50% develop T2DM within 10 years</li><li><strong>TSH:</strong> Postpartum thyroiditis in ~5–10% (autoimmune; hyperthyroid phase wks 1–4 → hypothyroid phase wks 4–8 → often normalizes); may recur with future pregnancies</li><li><strong>CBC:</strong> If significant blood loss, fatigue, persistent symptoms; treat iron deficiency</li><li><strong>Hgb A1c + fasting glucose:</strong> Long-term DM surveillance in prior GDM patients</li><li><strong>Pap smear:</strong> If deferred during pregnancy</li><li><strong>Blood pressure:</strong> Hypertensive disorders of pregnancy resolve within weeks but ↑ lifetime CVD risk; follow-up q1yr</li></ul>`
},
];

/* ─── HELPERS ─────────────────────────────────────────── */
function weekToY(week) {
return Math.round((week - FIRST_WEEK) * PX_PER_WEEK);
}

function makeEl(tag, cls, html) {
const el = document.createElement(tag);
if (cls) el.className = cls;
if (html) el.innerHTML = html;
return el;
}

/* ─── BUILD WEEK RULER ────────────────────────────────── */
function buildRuler() {
const ruler = document.getElementById(‘week-ruler’);
const inner = makeEl(‘div’, ‘wr-inner’);
inner.id = ‘wr-inner’;

let currentEra = null;
let eraStartRow = null;

for (let wk = FIRST_WEEK; wk <= LAST_WEEK; wk++) {
const row = makeEl(‘div’, ‘wk-row’);
row.dataset.week = wk;

```
const era = ERAS.find(e => e.start === wk);
if (era) {
  row.classList.add('era-start');
  currentEra = era;
  eraStartRow = row;
}

const num = makeEl('span', 'wk-num', `${wk}`);
row.appendChild(num);

if (era) {
  const eraLabel = makeEl('span', 'wk-era');
  eraLabel.textContent = era.label;
  eraLabel.style.setProperty('--era-rows', era.end - era.start + 1);
  row.appendChild(eraLabel);
}

inner.appendChild(row);
```

}

// Postpartum row
const ppRow = makeEl(‘div’, ‘wk-row era-start’);
ppRow.innerHTML = `<span class="wk-num">PP</span><span class="wk-era" style="--era-rows:6">Postpartum</span>`;
inner.appendChild(ppRow);

ruler.appendChild(inner);
return inner;
}

/* ─── BUILD ERA BANDS ─────────────────────────────────── */
function buildEraBands(spineEl, headerH) {
const overlay = document.getElementById(‘era-overlay’);

ERAS.forEach(era => {
const band = makeEl(‘div’, `era-band ${era.cls}`);
const top = headerH + weekToY(era.start);
const height = (era.end - era.start + 1) * PX_PER_WEEK;
band.style.top = top + ‘px’;
band.style.height = height + ‘px’;
overlay.appendChild(band);

```
// Anchor for jump links
const anchor = makeEl('div', 'era-anchor');
anchor.id = era.id;
anchor.style.top = (top - 60) + 'px';
overlay.appendChild(anchor);

// Era label on spine
const label = makeEl('div', 'spine-era-label');
label.textContent = era.label;
label.style.top = weekToY(era.start) + 'px';
spineEl.appendChild(label);
```

});
}

/* ─── BUILD SPINE + EVENTS ────────────────────────────── */
function buildSpine() {
const spine = document.getElementById(‘spine’);
const totalH = TOTAL_WEEKS * PX_PER_WEEK;
spine.style.height = totalH + ‘px’;

// Week tick lines
for (let wk = FIRST_WEEK; wk <= LAST_WEEK; wk++) {
const line = makeEl(‘div’, ‘week-line’);
line.style.top = weekToY(wk) + ‘px’;
if (ERAS.some(e => e.start === wk)) line.classList.add(‘era-start’);
spine.appendChild(line);
}

// Track vertical positions used on each side for collision avoidance
const usedSlots = { left: [], right: [] };

// Sort events by week
const sorted = […EVENTS].sort((a, b) => a.week - b.week);

sorted.forEach((ev, idx) => {
const baseTop = weekToY(ev.week - FIRST_WEEK + 1);
const side = ev.side || ‘right’;

```
// Find a non-colliding top offset
let top = baseTop;
const CARD_HEIGHT = 115; // approximate card height
const slots = usedSlots[side];

// Nudge downward until no overlap
let attempts = 0;
while (slots.some(s => Math.abs(s - top) < CARD_HEIGHT - 10) && attempts < 20) {
  top += 12;
  attempts++;
}
slots.push(top);

const eventEl = makeEl('div', `event side-${side}`);
eventEl.dataset.type = ev.type;
eventEl.dataset.idx = idx;
eventEl.style.top = top + 'px';

const card = makeEl('div', 'event-card');
card.innerHTML = `
  <div class="event-wk-badge">Wk ${ev.week % 1 === 0 ? ev.week : Math.floor(ev.week) + '–' + (Math.floor(ev.week) + 1)}</div>
  <div class="event-tag">${ev.type}</div>
  <div class="event-title">${ev.title}</div>
  <div class="event-preview">${ev.preview}</div>
  <div class="event-more">Click for details →</div>
`;

eventEl.appendChild(card);
eventEl.addEventListener('click', () => openModal(ev));
spine.appendChild(eventEl);
```

});
}

/* ─── BUILD POSTPARTUM SECTION ────────────────────────── */
function buildPostpartum() {
const grid = document.getElementById(‘pp-grid’);
PP_EVENTS.forEach((ev, i) => {
const card = makeEl(‘div’, ‘pp-card’);
card.dataset.type = ev.type;
card.innerHTML = `<div class="event-tag">${ev.type}</div> <div class="event-title">${ev.title}</div> <div class="event-preview">${ev.preview}</div>`;
card.addEventListener(‘click’, () => openModal(ev));
grid.appendChild(card);
});
}

/* ─── MODAL ───────────────────────────────────────────── */
const overlay = document.getElementById(‘overlay’);
const modal = document.getElementById(‘modal’);
const modalX = document.getElementById(‘modal-x’);
const modalTag = document.getElementById(‘modal-tag’);
const modalWk = document.getElementById(‘modal-wk’);
const modalTitle = document.getElementById(‘modal-title’);
const modalBody = document.getElementById(‘modal-body’);

const TYPE_LABELS = {
labs: ‘Laboratory’,
appt: ‘Appointment / Clinical’,
infect: ‘Infection / TORCH’,
fetal: ‘Fetal Development’,
tx: ‘Treatment / Vaccine’,
screen: ‘Screening / Imaging’,
};

const TYPE_COLORS = {
labs: ‘#1a6fa8’,
appt: ‘#2e7d46’,
infect: ‘#c0392b’,
fetal: ‘#7b3fa0’,
tx: ‘#c97d10’,
screen: ‘#1a7a7a’,
};

function openModal(ev) {
modalTag.textContent = TYPE_LABELS[ev.type] || ev.type;
modalTag.style.color = TYPE_COLORS[ev.type] || ‘#333’;
modalWk.textContent = ev.week ? `Gestational Week ${ev.week}` : ‘’;
modalTitle.textContent = ev.title;
modalBody.innerHTML = ev.detail;
overlay.classList.add(‘open’);
modal.scrollTop = 0;
}

function closeModal() {
overlay.classList.remove(‘open’);
}

modalX.addEventListener(‘click’, closeModal);
overlay.addEventListener(‘click’, e => { if (e.target === overlay) closeModal(); });
document.addEventListener(‘keydown’, e => { if (e.key === ‘Escape’) closeModal(); });

/* ─── FILTER BUTTONS ──────────────────────────────────── */
document.getElementById(‘filter-btns’).addEventListener(‘click’, e => {
const btn = e.target.closest(’.fbtn’);
if (!btn) return;

document.querySelectorAll(’.fbtn’).forEach(b => b.classList.remove(‘on’));
btn.classList.add(‘on’);

const type = btn.dataset.type;
document.querySelectorAll(’.event’).forEach(ev => {
ev.classList.toggle(‘filtered-out’, type !== ‘all’ && ev.dataset.type !== type);
});
document.querySelectorAll(’.pp-card’).forEach(card => {
card.style.opacity = (type !== ‘all’ && card.dataset.type !== type) ? ‘0.15’ : ‘1’;
});
});

/* ─── SYNC RULER SCROLL WITH CENTER ─────────────────────
The ruler is sticky but its inner content needs to scroll
in sync with the center pane so week numbers align.
─────────────────────────────────────────────────────── */
function syncRuler() {
const center = document.getElementById(‘center’);
const rulerInner = document.getElementById(‘wr-inner’);
const spineWrap = document.getElementById(‘spine-wrap’);
const siteHeader = document.querySelector(’.site-header’);

if (!rulerInner || !spineWrap || !siteHeader) return;

const headerH = siteHeader.offsetHeight;

function onScroll() {
const scrollY = window.scrollY;
const spineTop = spineWrap.getBoundingClientRect().top + scrollY - document.querySelector(’.rail-left’).getBoundingClientRect().top - scrollY;
// Calculate offset: how far spine top is from top of viewport minus rail header
const railHeader = document.querySelector(’.rail-header’);
const railHeaderH = railHeader ? railHeader.offsetHeight : 60;
const spineTopFromViewport = spineWrap.getBoundingClientRect().top;
const targetOffset = railHeaderH - spineTopFromViewport;
rulerInner.style.transform = `translateY(${-Math.max(0, window.scrollY - (spineWrap.offsetTop - railHeaderH))}px)`;
}

window.addEventListener(‘scroll’, onScroll, { passive: true });
onScroll();
}

/* ─── INIT ─────────────────────────────────────────────── */
function init() {
buildRuler();

const spineEl = document.getElementById(‘spine’);
const headerEl = document.querySelector(’.site-header’);
const headerH = headerEl ? headerEl.offsetHeight : 0;

buildEraBands(spineEl, headerH);
buildSpine();
buildPostpartum();
syncRuler();
}

document.addEventListener(‘DOMContentLoaded’, init);

})();
