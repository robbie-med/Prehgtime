/* =====================================================
PREGNANCY CLINICAL TIMELINE  ·  script.js
===================================================== */
(function () {
‘use strict’;

/* ─── CONSTANTS (hardcoded — no CSS var reading at parse time) ── */
const PX  = 88;          // pixels per week
const W0  = 1;           // first week rendered
const W1  = 42;          // last week rendered

/* ─── ERA DEFINITIONS ──────────────────────────────── */
const ERAS = [
{ id:‘era-t1’,   label:‘First Trimester’,  start:1,  end:13,  cls:‘t1’   },
{ id:‘era-t2’,   label:‘Second Trimester’, start:14, end:27,  cls:‘t2’   },
{ id:‘era-t3’,   label:‘Third Trimester’,  start:28, end:36,  cls:‘t3’   },
{ id:‘era-term’, label:‘Term / Late Term’, start:37, end:42,  cls:‘term’ },
];

/* ─── week → pixel offset from top of spine ──────── */
function wY(week) { return Math.round((week - W0) * PX); }

/* ─── EVENTS ────────────────────────────────────────
week  : gestational week (may be fractional)
side  : ‘right’ | ‘left’
type  : labs | appt | infect | fetal | tx | screen
──────────────────────────────────────────────────── */
const EVENTS = [

/* ── Wks 4–5 ── */
{ week:4,   side:‘left’,  type:‘appt’,
title:‘Pregnancy Confirmation Visit’,
preview:‘Confirm IUP, establish GA, obtain full OB/medical/social history. EDD by Naegele's rule (LMP + 280 d).’,
detail:`<p><strong>Goals:</strong> Confirm intrauterine pregnancy, establish gestational age from LMP + dating U/S.</p><ul><li>EDD: LMP + 280 days (Naegele's rule)</li><li>Review medications for teratogenicity</li><li>Counsel: no alcohol, no smoking, caffeine &lt;200 mg/day, avoid deli meat/soft cheeses (Listeria)</li><li>Exercise: 150 min/wk moderate OK</li><li>Dental care safe in pregnancy</li></ul>` },

{ week:4.5, side:‘right’, type:‘tx’,
title:‘Folic Acid + Prenatal Vitamins’,
preview:‘Folic acid 0.4–0.8 mg/day (4 mg if prior NTD). Prenatal vitamin: iron 27 mg, iodine, DHA. Avoid teratogens.’,
detail:`<ul><li><strong>Folic acid:</strong> 0.4–0.8 mg/day standard; 4 mg/day if prior NTD, maternal DM, valproate/carbamazepine use</li><li>Prenatal vitamin: iron 27 mg, iodine 150 μg, DHA 200 mg, Vit D, calcium</li><li><strong>Teratogens to avoid:</strong> isotretinoin, valproate, warfarin, methotrexate, ACEi/ARBs, tetracyclines, fluoroquinolones</li><li>Nausea: Vit B6 10–25 mg TID ± doxylamine 12.5 mg</li></ul>` },

{ week:5,   side:‘right’, type:‘fetal’,
title:‘Cardiac Tube Forms / Heartbeat’,
preview:‘Cardiac tube forms ~day 22. Heartbeat detectable on TVU/S by wk 5–6. CRL ~4 mm at wk 6.’,
detail:`<ul><li>Heart begins beating ~day 22 post-fertilization</li><li>TVU/S detects cardiac activity at 5–6 wks GA</li><li>Neural tube closes by day 28 — highest teratogen risk wks 3–8</li><li>CRL at 6 wks: ~4–5 mm; all major organ systems beginning to form</li></ul>` },

/* ── Wk 6: Initial prenatal panel ── */
{ week:6,   side:‘left’,  type:‘labs’,
title:‘Initial Prenatal Panel’,
preview:‘Type & Screen, CBC, Rubella IgG, Varicella IgG, HepB sAg, HIV, RPR, GC/Chlamydia NAAT, urine Cx, TSH, Pap.’,
detail:`<ul><li><strong>Blood type & Screen</strong> (ABO/Rh)</li><li><strong>CBC</strong> — baseline Hgb, MCV, platelets</li><li><strong>Rubella IgG</strong> — if negative: vaccinate postpartum (MMR = live, contraindicated in pregnancy)</li><li><strong>Varicella IgG</strong> — if negative: VZIG if exposed; varicella vaccine postpartum</li><li><strong>HepB surface antigen (HBsAg)</strong> — if+: HBIG + HepB vaccine to newborn ≤12h</li><li><strong>HIV 1/2 Ag/Ab combo (4th gen)</strong> — universal opt-out</li><li><strong>RPR/VDRL</strong> — syphilis screen; if+: FTA-ABS confirm → benzathine PCN G</li><li><strong>GC + Chlamydia NAAT</strong> — cervical/vaginal swab</li><li><strong>Urine culture</strong> — ASB: treat if ≥10⁵ CFU/mL → prevents pyelonephritis + PTL</li><li><strong>TSH</strong> — hypothyroidism → miscarriage, fetal neurodevelopment</li><li><strong>Hepatitis C Ab</strong> — universal per ACOG 2020</li><li><strong>Pap smear</strong> if due</li></ul>` },

{ week:7,   side:‘right’, type:‘labs’,
title:‘Quantitative β-hCG Kinetics’,
preview:‘Doubles q48h in viable IUP. Peaks 8–10 wks (~100k mIU/mL). Plateau/low → ectopic or failed IUP.’,
detail:`<ul><li>Normal: doubles every 48h in viable early IUP</li><li>Discriminatory zone: ~1500–3000 mIU/mL → IUP should be visible on TVU/S; if not → ectopic until proven otherwise</li><li>Peak: 8–10 wks (~100,000 mIU/mL), then falls to T2/T3 plateau</li><li>Very high β-hCG → molar pregnancy, multifetal</li><li>Falling/plateauing → completed AB or ectopic</li></ul>` },

{ week:8,   side:‘left’,  type:‘fetal’,
title:‘Organogenesis Peak’,
preview:‘All major organs forming. Limbs, heart chambers, CNS, GI. Embryo → fetus at wk 10. CRL ~30 mm.’,
detail:`<ul><li>Embryonic period (wks 3–10): highest teratogenic risk</li><li>Wk 6: 4-chamber heart forming; limb buds</li><li>Wk 7: face, lens, ear developing; liver hematopoiesis</li><li>Wk 8: fingers distinct; external genitalia undifferentiated</li><li>Wk 10: embryo → fetus; intestines return from umbilical stalk; CRL ~30 mm</li></ul>` },

/* ── Wk 8–10: Dating U/S ── */
{ week:8.5, side:‘right’, type:‘screen’,
title:‘Dating Ultrasound (TVU/S)’,
preview:‘CRL most accurate for GA dating (±5–7 d). Confirms IUP, viability, number of gestational sacs. FHR 110–160.’,
detail:`<ul><li>Crown-rump length (CRL) most accurate for dating in T1 (±5–7 days)</li><li>If CRL-based EDD differs from LMP EDD by &gt;7 days → use CRL</li><li>Assess: yolk sac, cardiac activity, number of sacs, adnexal masses</li><li>FHR: normal 110–160 bpm; bradycardia &lt;90 bpm at 6–8 wks = poor prognosis</li><li>Diagnose: blighted ovum (GS &gt;25 mm, no embryo), missed AB (CRL &gt;7 mm, no FHR), ectopic, molar</li></ul>` },

{ week:9,   side:‘left’,  type:‘infect’,
title:‘TORCH: Critical T1 Window’,
preview:‘Highest-risk period for congenital infections. CMV, Toxo, Rubella, Parvovirus B19, Syphilis. Hydrops: CMV, Parvo.’,
detail:`<ul><li><strong>CMV:</strong> Periventricular calcifications, hearing loss, chorioretinitis, hydrops. Diagnose: IgM/IgG avidity + PCR amniotic fluid</li><li><strong>Toxoplasma gondii:</strong> cat feces, raw meat → chorioretinitis, intracranial calcifications, hydrocephalus. Rx: pyrimethamine + sulfadiazine + leucovorin</li><li><strong>Rubella (T1):</strong> congenital rubella syndrome: cataracts, cochlear defects, PDA/VSD. No treatment; MMR postpartum</li><li><strong>Parvovirus B19:</strong> aplastic crisis → nonimmune hydrops fetalis. MCA-PSV monitoring; intrauterine transfusion if severe</li><li><strong>Syphilis:</strong> any trimester. Benzathine PCN G only proven Rx in pregnancy</li><li><strong>HSV:</strong> vertical at delivery; microcephaly, vesicles, hydrocephalus. NO hydrops</li><li><strong>VZV:</strong> scar lesions, limb hypoplasia, chorioretinitis, cortical atrophy. NO hydrops</li><li><strong>Listeria:</strong> ampicillin + gentamicin; avoid deli meats/soft cheeses</li></ul>` },

/* ── Wk 10–13 ── */
{ week:10,  side:‘right’, type:‘screen’,
title:‘cfDNA / NIPT’,
preview:‘From wk 10. T21 sensitivity >99%. Also T18, T13, sex chr. aneuploidies. Positive = not diagnostic → confirm.’,
detail:`<ul><li>Available from 10 wks; analyzes fetal cfDNA fragments in maternal blood</li><li>T21 sensitivity &gt;99%, specificity ~99.9%; T18, T13, 45X, 47XXY also detected</li><li>Optional: microdeletions (22q11.2 DiGeorge), fetal sex</li><li><strong>Positive NIPT ≠ diagnosis</strong> — confirm with amniocentesis or CVS</li><li>False positives: vanishing twin, confined placental mosaicism, maternal malignancy</li><li>Fetal fraction must be ≥4% for reliable results</li></ul>` },

{ week:11,  side:‘left’,  type:‘screen’,
title:‘CVS (Chorionic Villus Sampling)’,
preview:‘Wks 10–13. Karyotype + microarray. Earlier than amnio. Loss risk ~0.5–1%. Cannot rule out NTD.’,
detail:`<ul><li>Transabdominal or transcervical biopsy of chorionic villi (placental tissue)</li><li>Results: karyotype (10–14 days), FISH (24–48h), chromosomal microarray</li><li>Advantage: earlier than amniocentesis (10–13 vs 15–20 wks)</li><li>Pregnancy loss risk: ~0.5–1% (vs amnio ~0.1–0.3%)</li><li>Cannot diagnose NTDs (no AFP) — follow-up MSAFP or anatomy U/S required</li></ul>` },

{ week:11.5,side:‘right’, type:‘screen’,
title:‘Nuchal Translucency (NT) U/S’,
preview:‘Wks 11–13⁶⁄₇. NT ≥3 mm → ↑ risk T21/18/13 + cardiac. Combined with PAPP-A + free β-hCG.’,
detail:`<ul><li>NT ≥3.0 mm abnormal; ≥3.5 mm → significant structural/chromosomal risk</li><li><strong>PAPP-A</strong> low (≤0.4 MoM) → aneuploidy, FGR, preeclampsia, stillbirth</li><li><strong>Free β-hCG</strong> high → T21; low → T18/T13</li><li>Combined DR for T21: ~85–90% at 5% FPR</li><li>Additional markers: absent nasal bone, tricuspid regurgitation, ductus venosus reversal</li><li>Cystic hygroma → Turner syndrome, T21, T18; high mortality</li></ul>` },

{ week:12,  side:‘left’,  type:‘tx’,
title:‘Aspirin Prophylaxis — Preeclampsia’,
preview:‘High risk: low-dose aspirin 81 mg/day starting ≤16 wks, continue to 36 wks. Reduces preeclampsia 10–20%.’,
detail:`<p><strong>High-risk indications (1+ criterion):</strong></p><ul><li>Prior preeclampsia (especially early-onset/severe)</li><li>Multifetal gestation</li><li>Chronic hypertension, DM type 1 or 2, CKD, autoimmune (SLE, APS)</li></ul><p><strong>Moderate risk (≥2 criteria):</strong> nulliparity, obesity BMI &gt;30, family Hx, age ≥35, prior SGA/adverse outcome.</p><ul><li>Dose: aspirin 81 mg PO QD at bedtime</li><li>Start: ideally before 16 wks; benefit if started up to 28 wks</li><li>Stop: 36–37 wks</li></ul>` },

{ week:12.5,side:‘right’, type:‘fetal’,
title:‘End of Embryonic Period’,
preview:‘Fetus from wk 10. External genitalia differentiating. Intestines returned from cord. CRL ~6 cm at 13 wks.’,
detail:`<ul><li>Fetal period begins at wk 10; embryonic period ends</li><li>External genitalia: sex differentiation begins ~wk 7; visible on U/S 12–14 wks</li><li>Intestines fully returned into abdominal cavity</li><li>CRL at 13 wks: ~6 cm; weight ~23 g</li><li>Bone marrow begins hematopoiesis (previously liver/spleen)</li><li>Placenta fully functional, replaces corpus luteum for progesterone by wk 10</li></ul>` },

/* ── T2 ── */
{ week:14,  side:‘left’,  type:‘appt’,
title:‘T2 Routine Prenatal Visit’,
preview:‘BP, weight, fundal height (≈ GA ± 2 cm after 20 wks), FHR Doppler. Every 4 wks in T2.’,
detail:`<ul><li><strong>BP:</strong> goal &lt;140/90; treat if ≥160/110 (severe range)</li><li><strong>Weight gain:</strong> normal BMI 25–35 lbs total; overweight 15–25; obese 11–20; underweight 28–40</li><li><strong>Fundal height:</strong> cm ≈ GA ± 2 cm (after 20 wks); &lt;2 cm below GA → FGR work-up</li><li><strong>FHR Doppler:</strong> 110–160 bpm normal</li><li><strong>Symptom review:</strong> headache, visual changes, edema (preeclampsia); dysuria/flank pain (UTI/pyelo); vaginal bleeding; contractions; decreased fetal movement (after quickening)</li></ul>` },

{ week:15,  side:‘right’, type:‘labs’,
title:‘Quad Screen (MSAFP)’,
preview:‘AFP, hCG, uE3, Inhibin A at 15–20 wks. ↑AFP → NTD/abdominal defect. ↓AFP, ↑hCG, ↓uE3, ↑InhA → T21.’,
detail:`<ul><li><strong>AFP ↑↑ (&gt;2.5 MoM):</strong> open NTD (anencephaly, spina bifida), gastroschisis, omphalocele, multiple gestation, underestimated GA, fetal demise</li><li><strong>AFP ↓:</strong> Trisomy 21, Trisomy 18</li><li><strong>hCG ↑:</strong> T21; ↓: T18</li><li><strong>Unconjugated estriol (uE3) ↓:</strong> T21, T18, Smith-Lemli-Opitz</li><li><strong>Inhibin A ↑:</strong> T21</li><li>Quad screen DR for T21: ~81% at 5% FPR</li><li>Abnormal AFP &gt;2.5 MoM → targeted anatomy U/S + consider amnio</li></ul>` },

{ week:16,  side:‘left’,  type:‘infect’,
title:‘Parvovirus B19 — Fifth Disease’,
preview:‘Slapped-cheek rash, polyarthritis. Fetal aplastic crisis → nonimmune hydrops. Monitor MCA-PSV >1.5 MoM.’,
detail:`<p><strong>Maternal:</strong> Slapped-cheek rash, lacy trunk/limb rash, flu-like prodrome, symmetrical polyarticular arthritis. Often mild or asymptomatic.</p><p><strong>Fetal:</strong> Infects fetal erythroid precursors → aplastic crisis → severe fetal anemia → nonimmune hydrops fetalis. Risk of hydrops ~5–10% if infected T2.</p><ul><li><strong>Dx:</strong> IgM/IgG serology; PCR; MCA-PSV Doppler q1–2 wks × 8–12 wks after exposure</li><li><strong>MCA-PSV &gt;1.5 MoM</strong> = significant fetal anemia → consider intrauterine transfusion</li><li>No antiviral; no vaccine available</li></ul>` },

{ week:16.5,side:‘right’, type:‘screen’,
title:‘Amniocentesis (if indicated)’,
preview:‘Wks 15–20. Karyotype, microarray, FISH. Abnormal NIPT/quad, AMA, prior aneuploidy. Loss risk ~0.1–0.3%.’,
detail:`<ul><li>Transabdominal U/S-guided aspiration of amniotic fluid (15–20 wks)</li><li>Results: FISH 24–48h (rapid T21/18/13), karyotype 10–14 days, microarray 7–14 days</li><li>Also: NTDs (elevated amniotic AFP + AChE), fetal infection PCR (CMV, toxo)</li><li>Pregnancy loss risk: ~0.1–0.3%</li><li>Give RhIg if Rh-negative mother</li></ul>` },

{ week:18,  side:‘left’,  type:‘screen’,
title:‘Anatomy Survey Ultrasound’,
preview:‘The landmark 18–22 wk U/S. Brain, face, heart (4-chamber + outflow tracts), spine, kidneys, placenta, AFI.’,
detail:`<p><strong>Fetal biometry:</strong> BPD, HC, AC, FL → EFW (Hadlock formula)</p><p><strong>CNS:</strong> lateral ventricles (&lt;10 mm), cavum septum pellucidum, cerebellum, posterior fossa</p><p><strong>Face:</strong> lips, orbits, nasal bone, profile</p><p><strong>Cardiac:</strong> 4-chamber, LVOT, RVOT, 3-vessel-trachea view, situs</p><p><strong>Spine:</strong> sagittal + transverse (NTD detection; banana/lemon signs in spina bifida)</p><p><strong>Abdomen:</strong> stomach, kidneys (renal pelvis &lt;4 mm), bladder, 3-vessel umbilical cord</p><p><strong>Placenta:</strong> location (&lt;2 cm from os = previa → follow-up at 32 wks), cord insertion</p><p><strong>AFI/DVP:</strong> oligohydramnios (AFI &lt;5 or DVP &lt;2), polyhydramnios (AFI &gt;24)</p>` },

{ week:19,  side:‘right’, type:‘fetal’,
title:‘Quickening + Organ Maturation’,
preview:‘First fetal movement felt 18–22 wks (primips later). Kidneys producing urine. Surfactant synthesis begins.’,
detail:`<ul><li>Quickening: primips 18–22 wks; multips 16–18 wks</li><li>Fetal kidneys → primary amniotic fluid source by 16 wks; esophageal atresia → polyhydramnios</li><li>Type II pneumocytes begin surfactant production</li><li>Lanugo covers entire body; brown fat (thermogenesis) begins ~20 wks</li><li>Weight at 20 wks: ~300 g; length ~25 cm</li></ul>` },

{ week:20,  side:‘left’,  type:‘infect’,
title:‘VZV Congenital Window’,
preview:‘Varicella wks 8–20 → scar lesions, limb hypoplasia, chorioretinitis, cortical atrophy. No hydrops. VZIG within 96h.’,
detail:`<ul><li><strong>Congenital varicella syndrome:</strong> highest risk wks 8–20</li><li>Fetal: cicatricial skin lesions, chorioretinitis, limb hypoplasia, cortical atrophy, microcephaly — detectable on antenatal U/S</li><li><strong>Does NOT cause hydrops fetalis</strong></li><li>Management: VZV IgG– mother exposed → VZIG within 96h of exposure; acyclovir if active maternal disease; no live vaccine in pregnancy</li><li>Rubella &gt;20 wks: congenital rubella syndrome risk markedly reduced; hydrops rare</li></ul>` },

/* ── Wk 24–28 ── */
{ week:24,  side:‘right’, type:‘fetal’,
title:‘Viability Threshold’,
preview:‘22–24 wks = limit of viability. At 24 wks ~50–70% survival with NICU. Eyes open. Hearing present.’,
detail:`<ul><li>22 wks: ~10–15% survival; severe morbidity; individualize resuscitation</li><li>23 wks: ~30–50% survival; goals-of-care discussion</li><li>24 wks: ~50–70% survival; most centers offer full resuscitation</li><li>25 wks: ~70–80% survival</li><li>Weight: 24 wks ~600 g; 28 wks ~1000 g</li><li>Eyes open ~26 wks; pain pathways developing; hearing present</li></ul>` },

{ week:24.5,side:‘left’,  type:‘labs’,
title:‘GDM Screen — 1-hr GCT → 3-hr GTT’,
preview:‘50g GCT (no fasting). ≥130 or ≥140 mg/dL → 3-hr 100g OGTT. 2+ abnormal values = GDM (Carpenter-Coustan).’,
detail:`<p><strong>1-hr GCT (non-fasting):</strong> 50g glucose load; threshold ≥130 mg/dL (87% sensitivity) or ≥140 mg/dL (83% sensitivity).</p><p><strong>3-hr 100g OGTT (Carpenter-Coustan):</strong></p><ul><li>Fasting ≥95 mg/dL</li><li>1-hour ≥180 mg/dL</li><li>2-hour ≥155 mg/dL</li><li>3-hour ≥140 mg/dL</li><li><strong>2 or more values ≥ threshold = GDM diagnosis</strong></li></ul><p><strong>Alternative IADPSG/WHO 75g 2-hr OGTT:</strong> fasting ≥92, 1h ≥180, 2h ≥153 — any one value = GDM.</p><p>Management: medical nutrition therapy → insulin if diet fails; metformin/glyburide off-label.</p>` },

{ week:26,  side:‘right’, type:‘labs’,
title:‘Repeat CBC + Rh Antibody Screen at 28 wks’,
preview:‘Repeat Hgb for anemia (treat if <10). Rh antibody screen before RhoGAM. Repeat urine culture.’,
detail:`<ul><li><strong>CBC:</strong> iron deficiency anemia most common → ferrous sulfate 325 mg TID; IV iron if severe/intolerant</li><li><strong>Rh(D) antibody screen:</strong> if Rh– mother, check for alloimmunization before giving RhIg</li><li><strong>Urine culture:</strong> repeat if prior ASB or UTI</li><li><strong>Repeat GC/Chlamydia:</strong> if high risk</li></ul>` },

{ week:27,  side:‘left’,  type:‘tx’,
title:‘Tdap + Influenza + COVID + RhoGAM’,
preview:‘Tdap 27–36 wks (ideally 27–32). Flu any trimester. RhoGAM 300 μg IM at 28 wks if Rh(D)–.’,
detail:`<ul><li><strong>Tdap:</strong> 27–36 wks (ideally 27–32) every pregnancy — maternal Abs protect newborn before own vaccine series</li><li><strong>Influenza (inactivated):</strong> Any trimester during flu season</li><li><strong>COVID-19 (mRNA):</strong> Any trimester; safe</li><li><strong>RSV vaccine (Abrysvo):</strong> 32–36 wks — new ACOG 2023; protects newborn via passive Ab</li><li><strong>RhoGAM 300 μg IM at 28 wks</strong> if Rh(D)– and antibody screen negative</li><li>Also give after: vaginal bleeding, amniocentesis, ECV, abdominal trauma, threatened AB</li><li>Repeat within 72h of delivery if infant Rh+</li></ul>` },

{ week:27.5,side:‘right’, type:‘screen’,
title:‘Cervical Length + PTL Prevention’,
preview:‘TVU/S CX ≤25 mm at 24 wks → high PTL risk. Vaginal progesterone 200 mg QD. Cerclage if prior PTL.’,
detail:`<ul><li>Transvaginal CL &lt;25 mm at 24 wks → high risk spontaneous PTL</li><li><strong>Vaginal progesterone 200 mg QD:</strong> if CL ≤25 mm in singleton gestation</li><li><strong>17-OHPC (17α-hydroxyprogesterone caproate):</strong> weekly IM 16–36 wks if prior spontaneous PTB &lt;37 wks</li><li><strong>Cerclage:</strong> prior PTL + CL ≤25 mm + singleton → McDonald or Shirodkar; history-indicated cerclage at 12–14 wks</li></ul>` },

/* ── Wk 28–36 ── */
{ week:28,  side:‘left’,  type:‘appt’,
title:‘T3 Visits — Every 2 Weeks’,
preview:‘BP, weight, fundal height, FHR, Leopold maneuvers. Preeclampsia red flags: HA, visual Δ, RUQ pain, edema.’,
detail:`<p><strong>Visit schedule:</strong> q2 wks from 28–36 wks; weekly from 36 wks.</p><p><strong>Leopold maneuvers:</strong></p><ul><li>1st: Fundal grip — head (hard/round) vs breech (soft/irregular)</li><li>2nd: Lateral grip — locate fetal back</li><li>3rd: Pawlick's — presenting part</li><li>4th: Pelvic grip — head engagement/flexion</li></ul><p><strong>Preeclampsia:</strong> BP ≥140/90 ×2 ≥4h apart + proteinuria ≥300 mg/24h OR end-organ damage. Severe: BP ≥160/110 → IV labetalol/hydralazine or oral nifedipine; MgSO₄ seizure prophylaxis.</p>` },

{ week:29,  side:‘right’, type:‘labs’,
title:‘Third Trimester Labs’,
preview:‘CBC (anemia, PLT), repeat HIV/syphilis if high-risk, urine protein:Cr if preeclampsia concern, LFTs/LDH.’,
detail:`<ul><li><strong>CBC:</strong> anemia + platelets (HELLP screen if preeclampsia)</li><li><strong>Repeat HIV:</strong> high risk or unknown status</li><li><strong>Repeat syphilis RPR + GC/Chlamydia:</strong> high-risk populations</li><li><strong>Urine protein/Cr ratio:</strong> ≥0.3 = significant proteinuria (equivalent to 300 mg/24h)</li><li><strong>24-hr urine protein:</strong> gold standard; ≥300 mg = proteinuria for preeclampsia Dx</li><li><strong>HELLP panel:</strong> LFTs (AST/ALT), LDH, uric acid, peripheral smear — if preeclampsia suspected</li></ul>` },

{ week:30,  side:‘left’,  type:‘tx’,
title:‘Antenatal Corticosteroids’,
preview:‘If delivery anticipated <34 wks: betamethasone 12 mg IM × 2 doses q24h. Reduces RDS, IVH, NEC by ~40%.’,
detail:`<ul><li><strong>Betamethasone 12 mg IM q24h × 2 doses</strong> (preferred); dexamethasone 6 mg IM q12h × 4 doses alternative</li><li><strong>Indications:</strong> anticipated preterm delivery &lt;34 wks</li><li><strong>Benefits:</strong> ↓ RDS, ↓ IVH, ↓ NEC, ↓ neonatal mortality ~40%</li><li>Peak benefit: 24h–7 days after first dose</li><li><strong>Rescue course:</strong> if &gt;14 days since initial course AND still &lt;34 wks AND delivery still anticipated</li><li><strong>Late preterm (34–36⁶⁄₇ wks):</strong> single course betamethasone (ALPS trial) — reduces respiratory morbidity</li><li>Monitor glucose in DM patients (transient hyperglycemia)</li></ul>` },

{ week:31,  side:‘right’, type:‘fetal’,
title:‘Rapid Fetal Weight Gain’,
preview:‘~200–250 g/wk. 28 wks: ~1100 g. 32 wks: ~1800 g. Lung maturity increasing. Brain gyrification accelerates.’,
detail:`<ul><li>28 wks: ~1100 g; 32 wks: ~1800 g; 36 wks: ~2600 g; 40 wks: ~3200–3400 g</li><li>Fetal fat accumulation: 15% body weight at 34 wks; 30% at term</li><li>Lanugo diminishing from 36 wks; vernix caseosa accumulates</li><li>Brain gyrification accelerates 28–40 wks; cortical neurons migrating</li><li>Fetal "breathing" movements present; eyes open ~26 wks; grasp reflex present</li><li>Malpresentation common before 32 wks; most convert to vertex by 36 wks</li></ul>` },

{ week:32,  side:‘left’,  type:‘screen’,
title:‘Growth Ultrasound + BPP’,
preview:‘EFW, AFI, placental location follow-up. BPP: NST + breathing + movement + tone + fluid (max 10 pts).’,
detail:`<ul><li>EFW &lt;10th percentile = SGA; &lt;3rd = severe FGR</li><li>AFI normal 5–24 cm; DVP normal 2–8 cm</li><li>Placenta previa: if low-lying at anatomy scan → follow-up 32 wks; complete previa → scheduled C/S 36–37 wks</li><li><strong>BPP (max 10 pts):</strong> NST (2) + breathing ≥30 sec (2) + ≥3 movements (2) + tone (2) + AFI normal (2). Score ≤6 → delivery consideration</li><li><strong>Umbilical artery Doppler:</strong> AEDF → deliver by 34 wks; REDF → deliver immediately</li></ul>` },

{ week:33,  side:‘right’, type:‘screen’,
title:‘Non-Stress Test (NST) Surveillance’,
preview:‘Reactive: 2 accels ≥15 bpm × 15 sec in 20 min. Weekly/BID for DM, HTN, FGR, IUFD Hx, post-dates.’,
detail:`<ul><li><strong>Reactive NST:</strong> ≥2 accelerations ≥15 bpm × ≥15 sec in 20 min = reassuring</li><li>Non-reactive: fails criteria in 40 min → BPP or CST</li><li>Late decelerations: uteroplacental insufficiency (concerning)</li><li>Variable decelerations: cord compression (common; usually benign if brief)</li><li><strong>Indications:</strong> DM (start 28–32 wks), HTN/preeclampsia, FGR, post-dates, IUFD history, oligohydramnios, multifetal, AMA</li><li>CST/OCT: late decels with ≥50% contractions = positive (concerning)</li></ul>` },

{ week:34,  side:‘left’,  type:‘tx’,
title:‘Magnesium Sulfate — Neuroprotection’,
preview:‘If delivery <32 wks: MgSO₄ 4–6g IV load then 1–2 g/hr. Reduces cerebral palsy by ~32%. Antidote: Ca gluconate.’,
detail:`<ul><li><strong>Dose:</strong> 4–6 g IV over 15–20 min load; maintenance 1–2 g/hr; duration ≤24h or until delivery</li><li><strong>Evidence:</strong> reduces cerebral palsy risk ~32%; reduces severe neurological dysfunction</li><li>ACOG: &lt;32 wks (some protocols extend to &lt;34 wks)</li></ul><p><strong>Toxicity monitoring:</strong></p><ul><li>Loss of DTRs = first sign (~7–10 mEq/L) → reduce rate</li><li>Respiratory depression (&gt;12 mEq/L) → stop infusion</li><li>Cardiac arrest (&gt;15 mEq/L)</li><li>Check DTRs hourly; urine output &gt;25 mL/hr (renally cleared)</li><li><strong>Antidote: Calcium gluconate 1g IV over 3 min</strong></li></ul>` },

{ week:35,  side:‘right’, type:‘infect’,
title:‘GBS Screen + HSV Suppression’,
preview:‘GBS rectovaginal swab 35–37 wks. GBS+ → intrapartum PCN G. HSV: acyclovir 400 mg TID from 36 wks.’,
detail:`<p><strong>GBS Screening:</strong></p><ul><li>Universal rectovaginal (NOT cervical) swab culture at 35–37 wks</li><li>GBS colonization: ~25% of pregnant women</li><li><strong>IAP if:</strong> GBS culture+, unknown status + risk factors (PTL &lt;37 wks, ROM &gt;18h, intrapartum fever ≥38°C, prior GBS infant, GBS bacteriuria this pregnancy)</li><li><strong>Penicillin G 5M units IV load, then 2.5M units q4h</strong> (first-line)</li><li>Ampicillin 2g IV then 1g q4h; cefazolin if low-risk PCN allergy; clindamycin or vancomycin if high-risk allergy</li></ul><p><strong>HSV suppression from 36 wks:</strong></p><ul><li>Acyclovir 400 mg TID OR valacyclovir 500 mg BID</li><li>Active genital HSV lesions at labor onset → C-section regardless</li></ul>` },

/* ── Term ── */
{ week:36,  side:‘left’,  type:‘appt’,
title:‘Weekly Term Visits + Delivery Planning’,
preview:‘Weekly from 36 wks. Bishop score (≥8 = favorable). Leopold maneuvers. ECV if breech. TOLAC counseling.’,
detail:`<ul><li><strong>Bishop score:</strong> dilation + effacement + station + consistency + position → ≥8 = favorable cervix; &lt;6 = ripen first</li><li>Breech presentation → offer ECV at 36–37 wks (success ~50–60%); if declined or failed → schedule C/S at 39 wks</li><li><strong>TOLAC counseling:</strong> VBAC success ~60–80% if prior low transverse incision; uterine rupture risk ~0.5–1%</li><li>Discuss: labor analgesia, breastfeeding plan, cord blood banking, newborn care</li><li>Postdates counseling: induction recommended at 41 wks</li></ul>` },

{ week:37,  side:‘right’, type:‘labs’,
title:‘Pre-Delivery Lab Panel’,
preview:‘CBC, Type & Screen (repeat if >72h), BMP. Coagulation if preeclampsia/HELLP/previa. GBS result review.’,
detail:`<ul><li><strong>CBC:</strong> baseline pre-delivery; PLT &lt;100k → alert anesthesia; PLT &lt;50k → no epidural</li><li><strong>Type & Screen:</strong> re-draw if &gt;72h from expected delivery; crossmatch if high-risk (previa, accreta, prior PPH)</li><li><strong>BMP/CMP:</strong> if preeclampsia (Cr, LFTs, LDH, uric acid)</li><li><strong>Coagulation (PT, aPTT, fibrinogen):</strong> if abruption, IUFD, DIC risk</li><li><strong>GBS result:</strong> confirm status and IAP plan</li></ul>` },

{ week:38,  side:‘left’,  type:‘fetal’,
title:‘Term Fetus’,
preview:‘38 = early term; 39–40 = full term; 41 = late term; ≥42 = post-term. Avg wt 3200–3500 g at 39–40 wks.’,
detail:`<ul><li>Early term 37–38⁶⁄₇ wks: avoid elective delivery; ↑ neonatal respiratory morbidity vs full term</li><li>Full term 39–40⁶⁄₇ wks: optimal outcomes; <strong>ARRIVE trial (NEJM 2018):</strong> elective induction at 39 wks in nullips → ↓ C-section rate + ↓ hypertensive disorders</li><li>Late term 41–41⁶⁄₇ wks; Post-term ≥42 wks → ↑ meconium aspiration, oligohydramnios, macrosomia, placental insufficiency, fetal demise</li><li>Fetal weight at 40 wks: 3200–3500 g average; vernix + lanugo largely absent</li></ul>` },

{ week:39,  side:‘right’, type:‘tx’,
title:‘Induction of Labor / Cervical Ripening’,
preview:‘Medical IOL: GDM, HTN, FGR, PROM, post-term. Misoprostol, dinoprostone, Foley balloon, oxytocin.’,
detail:`<p><strong>Medical indications for IOL:</strong> GDM, chronic/gestational HTN, preeclampsia, FGR, PROM at term, IUFD, post-dates ≥41 wks, oligohydramnios, cholestasis of pregnancy.</p><p><strong>Cervical ripening (Bishop &lt;6):</strong></p><ul><li><strong>Misoprostol (Cytotec):</strong> 25 μg vaginally q4h or 50 μg PO q4h (PGE1); avoid if prior uterine surgery</li><li><strong>Dinoprostone (Cervidil):</strong> PGE2 insert; can be removed</li><li><strong>Foley bulb:</strong> mechanical; safe with prior uterine surgery</li><li><strong>Oxytocin (Pitocin):</strong> 0.5–2 mU/min IV, titrate up q15–40 min; goal ≥200 MVUs per 10 min</li></ul><p><strong>Arrest criteria (ACOG):</strong> Active phase arrest ≥6 cm: &lt;0.5 cm/2h adequate ctx or 4h inadequate ctx. Second stage: per duration guidelines with/without epidural.</p>` },

{ week:40,  side:‘left’,  type:‘appt’,
title:‘Stages of Labor’,
preview:‘Stage 1: latent (0–6 cm) → active (6–10 cm). Stage 2: pushing → delivery. Stage 3: placenta. Stage 4: 1–2h PP.’,
detail:`<p><strong>Stage 1 Latent:</strong> 0–6 cm; irregular → regular ctx; nullips ≤20h; multips ≤14h.</p><p><strong>Stage 1 Active:</strong> 6–10 cm; expected ≥0.5 cm/hr; arrest: &lt;0.5 cm/2h adequate ctx OR 4h inadequate ctx.</p><p><strong>Stage 2:</strong> Full dilation → delivery. Nullip without epidural &lt;2h; with epidural &lt;3h. Multip: &lt;1h/&lt;2h.</p><p><strong>Stage 3:</strong> ≤30 min. Active management: oxytocin 10U IM immediately after delivery → ↓ PPH 50%.</p><p><strong>Stage 4:</strong> First 1–2h; VS q15 min ×1h → q30 min ×1h; assess uterine tone, lochia, bladder.</p><p><strong>Labor analgesia:</strong> Epidural 0.0625–0.125% bupivacaine ± fentanyl; CSE; IV fentanyl 50–100 μg; nitrous oxide 50%.</p>` },

{ week:40.5,side:‘right’, type:‘infect’,
title:‘Chorioamnionitis (IAI)’,
preview:‘Fever ≥39°C + tachycardia (maternal/fetal). Rx: ampicillin + gentamicin ± clindamycin if C-section.’,
detail:`<p><strong>Diagnosis (≥1 maternal fever criterion):</strong></p><ul><li>Fever ≥39°C (single) OR 38–38.9°C ×2 (30 min apart)</li><li>PLUS ≥1: maternal tachycardia &gt;100, fetal tachycardia &gt;160, uterine tenderness, purulent AF</li></ul><p><strong>Treatment:</strong></p><ul><li><strong>Ampicillin 2g IV q6h + Gentamicin 1.5 mg/kg q8h</strong> (or 5 mg/kg q24h)</li><li><strong>Add clindamycin 900 mg IV q8h</strong> if cesarean delivery (anaerobic coverage)</li><li>Continue until afebrile and asymptomatic ×24–48h postpartum</li><li>Fetal tachycardia &gt;160 bpm = early sign; worsening variability + late decels → expedite delivery</li></ul>` },

{ week:40.8,side:‘left’,  type:‘labs’,
title:‘HELLP Syndrome’,
preview:‘Hemolysis + ↑ Liver enzymes + Low Platelets. MgSO₄ seizure prophylaxis. Antihypertensives. Deliver.’,
detail:`<p><strong>HELLP:</strong></p><ul><li><strong>H:</strong> Schistocytes, LDH &gt;600 U/L, elevated indirect bilirubin</li><li><strong>EL:</strong> AST &gt;70 U/L (or 2× ULN)</li><li><strong>LP:</strong> Platelets &lt;100k/μL (Class I &lt;50k, II 50–100k, III 100–150k)</li></ul><p><strong>Management:</strong></p><ul><li>MgSO₄ 4–6g load then 1–2 g/hr (seizure prophylaxis)</li><li>Antihypertensives: IV labetalol, IV hydralazine, or oral nifedipine for BP ≥160/110</li><li>Platelet transfusion: &lt;50k before vaginal delivery; typically &lt;50k before C/S</li><li>Delivery: definitive treatment; ≥34 wks → deliver; &lt;34 wks → individualize</li><li>DIC can complicate: fibrinogen ↓, PT/PTT ↑, D-dimer ↑↑</li></ul>` },

{ week:41,  side:‘right’, type:‘screen’,
title:‘Post-Dates Surveillance’,
preview:‘≥41 wks: NST + AFI twice weekly. AFI <5 cm or DVP <2 → oligohydramnios → deliver. BPP if non-reactive.’,
detail:`<ul><li>ACOG recommends delivery at 41–42 wks; induction offered from 41 wks</li><li>Surveillance: NST + AFI or BPP twice weekly starting 41 wks</li><li>Oligohydramnios (AFI &lt;5 cm or DVP &lt;2 cm) → deliver regardless of testing</li><li>Risks of expectant management: ↑ meconium aspiration, ↑ fetal demise, ↑ macrosomia, ↑ uteroplacental insufficiency</li><li>Meconium-stained fluid: neonatal team ready; intubate only if depressed infant</li></ul>` },

{ week:41.2,side:‘left’,  type:‘tx’,
title:‘PPH Prevention + Management’,
preview: ‘Oxytocin 10U IM at delivery. Uterotonic ladder. Tranexamic acid 1g IV within 3h. Balloon, suture, hysterectomy.’,
detail:`<p><strong>PPH:</strong> blood loss &gt;1000 mL or hemodynamic instability within 24h.</p><p><strong>Active management Stage 3:</strong> oxytocin 10U IM immediately after delivery → ↓ PPH 50%; uterine massage; delayed cord clamping 30–60 sec.</p><p><strong>Uterotonic escalation:</strong></p><ul><li>Oxytocin 10–40 U in 1L NS IV</li><li>Methylergonovine 0.2 mg IM (contraindicated: HTN/preeclampsia)</li><li>Carboprost 0.25 mg IM q15–90 min, max 8 doses (contraindicated: asthma)</li><li>Misoprostol 800–1000 μg rectally</li><li><strong>Tranexamic acid 1g IV within 3h of delivery</strong> (WOMAN trial: ↓ hemorrhage mortality)</li></ul><p><strong>Procedural:</strong> bimanual compression, Bakri balloon tamponade, B-Lynch suture, uterine artery ligation, hysterectomy.</p>` },

];

/* ─── POSTPARTUM EVENTS ─────────────────────────────── */
const PP_EVENTS = [
{ type:‘labs’, title:‘Neonatal APGAR Score’,
preview:‘1 and 5 min. 7–10 normal. <4 → resuscitate. 5-min score predicts neurological outcome.’,
detail:`<p><strong>APGAR (max 10):</strong></p><ul><li><strong>A</strong>ppearance: 0=blue/pale, 1=acrocyanosis, 2=pink all over</li><li><strong>P</strong>ulse: 0=absent, 1=&lt;100, 2=≥100</li><li><strong>G</strong>rimace: 0=none, 1=grimace, 2=cough/cry</li><li><strong>A</strong>ctivity (tone): 0=limp, 1=some flexion, 2=active</li><li><strong>R</strong>espiration: 0=absent, 1=weak, 2=good cry</li><li>Score &lt;7 at 5 min → continue q5 min ×20 min</li><li>1-min predicts need for resuscitation; 5-min predicts neurological prognosis</li></ul>` },

{ type:‘tx’, title:‘Immediate Newborn Prophylaxis’,
preview:‘Vitamin K1 1 mg IM. Erythromycin 0.5% eye ointment. HepB vaccine ≤24h. HBIG if mom HBsAg+.’,
detail:`<ul><li><strong>Vitamin K1 (phytonadione) 1 mg IM:</strong> Prevents VKDB/hemorrhagic disease of newborn; factors II, VII, IX, X are Vit K–dependent; neonates born deficient</li><li><strong>Erythromycin 0.5% ophthalmic ointment:</strong> GC + Chlamydia ophthalmia neonatorum prophylaxis; mandated in most states</li><li><strong>HepB vaccine (HepB1):</strong> ≤24h if mom HBsAg–; ≤12h if mom HBsAg+ (plus HBIG 0.5 mL IM different site)</li></ul>` },

{ type:‘screen’, title:‘Newborn Metabolic + Hearing Screen’,
preview:‘Heel stick 24–48h: PKU, hypothyroidism, galactosemia, CAH, MCAD, hemoglobinopathies, SMA, SCID, CF.’,
detail:`<p><strong>Universal NBS heel-stick (24–48h; repeat at 1–2 wks if done &lt;24h):</strong></p><ul><li>Phenylketonuria (PKU), MSUD, homocystinuria, other amino acidopathies</li><li>Congenital hypothyroidism (most common treatable NBS condition)</li><li>Congenital adrenal hyperplasia (21-hydroxylase deficiency)</li><li>MCAD deficiency (fatty acid oxidation)</li><li>Galactosemia, Cystic fibrosis (IRT), Sickle cell + hemoglobinopathies</li><li>SCID, Spinal muscular atrophy (SMA)</li></ul><p><strong>Hearing screen:</strong> OAE or AABR before discharge; repeat at 1 month if fail.</p><p><strong>CCHD screen:</strong> Pulse ox right hand + right foot; refer if fail algorithm at 24h.</p>` },

{ type:‘fetal’, title:‘Neonatal Hyperbilirubinemia’,
preview:‘Physiologic jaundice peaks day 3–5. <24h = pathologic (hemolysis). Bhutani nomogram → phototherapy threshold.’,
detail:`<ul><li>Physiologic: appears day 2–3, peaks day 3–5 (indirect bili), resolves by 2 wks (term) / 3 wks (preterm)</li><li>Pathologic if &lt;24h → hemolytic cause (ABO/Rh incompatibility; direct Coombs+)</li><li><strong>Bhutani nomogram:</strong> total serum bilirubin vs postnatal age in hours → low/intermediate/high risk zone</li><li>Phototherapy threshold: varies by GA + risk factors (hemolytic disease, G6PD, acidosis, hypoalbuminemia) — AAP 2022 updated thresholds (BiliTool: bilitool.org)</li><li>Exchange transfusion: if bili approaches neurotoxicity threshold despite phototherapy → prevents kernicterus</li></ul>` },

{ type:‘infect’, title:‘Postpartum Infections’,
preview:‘Endometritis: fever + uterine tenderness → clinda + gent. Mastitis: dicloxacillin × 14d, keep breastfeeding.’,
detail:`<p><strong>Endometritis</strong> (C/S risk 5–10× higher than vaginal):</p><ul><li>Fever ≥38°C ×2 after 24h + uterine tenderness + foul lochia</li><li>Rx: <strong>Clindamycin 900 mg IV q8h + Gentamicin 1.5 mg/kg q8h</strong> until afebrile 24–48h</li></ul><p><strong>Mastitis:</strong></p><ul><li>Unilateral breast erythema, warmth, tenderness, fever, flu-like sx; S. aureus most common</li><li>Rx: <strong>Dicloxacillin 500 mg QID × 10–14 days</strong> (cephalexin alternative; TMP-SMX if MRSA)</li><li>Continue breastfeeding; frequent feeds reduce milk stasis</li><li>Breast abscess: U/S-guided aspiration or I&D</li></ul>` },

{ type:‘screen’, title:‘Postpartum Depression Screening’,
preview:‘EPDS at 1-month and 6-month visits. Score ≥10 → evaluate. ≥13 → likely PPD. Sertraline safest while BF.’,
detail:`<p><strong>Edinburgh Postnatal Depression Scale (EPDS):</strong> 10-item self-report; score 0–30.</p><ul><li>≥10 → further evaluation; ≥13 → likely PPD (sensitivity ~80%)</li><li>ACOG: contact within 3 wks; comprehensive visit at 12 wks postpartum</li></ul><p><strong>Spectrum:</strong></p><ul><li><strong>Baby blues:</strong> Days 3–10; tearfulness, lability; normal; resolves spontaneously</li><li><strong>PPD:</strong> Onset within 4 wks–1 year; SSRI + therapy. Sertraline preferred while breastfeeding</li><li><strong>Postpartum psychosis:</strong> Psychiatric emergency; hallucinations, delusions; onset 2–4 wks; admit + mood stabilizers</li><li>Brexanolone (Zulresso): IV; FDA-approved specifically for PPD</li></ul>` },

{ type:‘tx’, title:‘Postpartum Contraception’,
preview:‘POP immediately. No COCP <6 wks (VTE). Immediate postpartum IUD (within 10 min of placenta). Implant any time.’,
detail:`<ul><li><strong>Progestin-only pill (POP):</strong> Immediately; safe while breastfeeding; 3-hr window compliance</li><li><strong>Combined OCP:</strong> Avoid &lt;6 wks (VTE risk); &lt;6 months if exclusively BF (↓ milk)</li><li><strong>Immediate postpartum IUD</strong> (within 10 min of placental delivery): LNG or copper; ~25% expulsion rate (vs interval), but LARC immediately</li><li><strong>Implant (Nexplanon):</strong> Any time postpartum; 3 years; safe while BF</li><li><strong>Depo-Provera 150 mg IM:</strong> Any time postpartum; q12 wks; delayed return to fertility</li></ul>` },

{ type:‘labs’, title:‘6-Week Postpartum Labs’,
preview:‘GDM → 75g 2-hr OGTT at 4–12 wks (50% develop T2DM in 10 yrs). TSH (postpartum thyroiditis). Pap if deferred.’,
detail:`<ul><li><strong>GDM follow-up (mandatory):</strong> 75g 2-hr OGTT at 4–12 wks postpartum; repeat annually if normal</li><li><strong>TSH:</strong> Postpartum thyroiditis in ~5–10%; hyperthyroid phase wks 1–4 → hypothyroid phase wks 4–8 → often normalizes</li><li><strong>CBC:</strong> if persistent fatigue, significant blood loss</li><li><strong>Hgb A1c + fasting glucose:</strong> long-term DM surveillance in prior GDM patients</li><li><strong>Pap smear:</strong> if deferred during pregnancy</li><li>BP follow-up: hypertensive disorders of pregnancy increase lifetime CVD risk → monitor q1yr</li></ul>` },
];

/* ─── HELPER: make element ──────────────────────────── */
function el(tag, cls, html) {
const e = document.createElement(tag);
if (cls) e.className = cls;
if (html !== undefined) e.innerHTML = html;
return e;
}

/* ─── BUILD WEEK RULER ──────────────────────────────── */
function buildRuler() {
const ruler = document.getElementById(‘week-ruler’);
if (!ruler) return;
const inner = el(‘div’, ‘wr-inner’);
inner.id = ‘wr-inner’;

for (let wk = W0; wk <= W1; wk++) {
const row = el(‘div’, ‘wk-row’);
row.dataset.week = wk;
const era = ERAS.find(e => e.start === wk);
if (era) {
row.classList.add(‘era-start’);
const eraLabel = el(‘span’, ‘wk-era’);
eraLabel.textContent = era.label;
eraLabel.style.setProperty(’–era-rows’, era.end - era.start + 1);
row.appendChild(el(‘span’, ‘wk-num’, String(wk)));
row.appendChild(eraLabel);
} else {
row.appendChild(el(‘span’, ‘wk-num’, String(wk)));
}
inner.appendChild(row);
}

// Postpartum
const ppRow = el(‘div’, ‘wk-row era-start’);
const ppLabel = el(‘span’, ‘wk-era’);
ppLabel.textContent = ‘Postpartum’;
ppLabel.style.setProperty(’–era-rows’, 8);
ppRow.appendChild(el(‘span’, ‘wk-num’, ‘PP’));
ppRow.appendChild(ppLabel);
inner.appendChild(ppRow);

ruler.appendChild(inner);
}

/* ─── BUILD SPINE ───────────────────────────────────── */
function buildSpine() {
const spine = document.getElementById(‘spine’);
if (!spine) return;

const totalH = (W1 - W0 + 1) * PX;
spine.style.height = totalH + ‘px’;

// Week tick lines
for (let wk = W0; wk <= W1; wk++) {
const line = el(‘div’, ‘week-line’);
line.style.top = wY(wk) + ‘px’;
if (ERAS.some(e => e.start === wk)) line.classList.add(‘era-start’);
spine.appendChild(line);
}

// Era labels (sitting left of spine line)
ERAS.forEach(era => {
const lbl = el(‘div’, ‘spine-era-label’, era.label);
lbl.id = era.id;
lbl.style.top = wY(era.start) + ‘px’;
spine.appendChild(lbl);
});

// Collision tracking: for each side keep array of [topPx, bottomPx]
const occupied = { left: [], right: [] };
const CARD_H = 120; // estimated card height for collision avoidance
const GAP = 8;

const sorted = […EVENTS].sort((a, b) => a.week - b.week);

sorted.forEach((ev) => {
const idealTop = wY(ev.week - W0 + 1); // +1 so wk4 event starts at wk4 row
const side = ev.side || ‘right’;

```
// Find free slot
let top = idealTop;
const occ = occupied[side];
let placed = false;
let tries = 0;
while (!placed && tries < 60) {
  const bottom = top + CARD_H;
  const collision = occ.some(([ot, ob]) => top < ob + GAP && bottom + GAP > ot);
  if (!collision) { placed = true; }
  else { top += 10; }
  tries++;
}
occ.push([top, top + CARD_H]);

const eventEl = el('div', `event side-${side}`);
eventEl.dataset.type = ev.type;

const wkLabel = ev.week % 1 === 0
  ? `Wk ${ev.week}`
  : `Wk ${Math.floor(ev.week)}–${Math.floor(ev.week) + 1}`;

eventEl.innerHTML = `
  <div class="event-card">
    <div class="event-wk-badge">${wkLabel}</div>
    <div class="event-tag">${TYPE_LABELS[ev.type] || ev.type}</div>
    <div class="event-title">${ev.title}</div>
    <div class="event-preview">${ev.preview}</div>
    <div class="event-more">↗ Details</div>
  </div>`;

eventEl.style.top = top + 'px';
eventEl.addEventListener('click', () => openModal(ev));
spine.appendChild(eventEl);
```

});
}

/* ─── BUILD ERA BANDS ───────────────────────────────── */
function buildEraBands() {
const overlay = document.getElementById(‘era-overlay’);
if (!overlay) return;

ERAS.forEach(era => {
const band = el(‘div’, `era-band ${era.cls}`);
const top = wY(era.start - W0);
const height = (era.end - era.start + 1) * PX;
band.style.top = top + ‘px’;
band.style.height = height + ‘px’;
overlay.appendChild(band);
});
}

/* ─── BUILD POSTPARTUM GRID ─────────────────────────── */
function buildPP() {
const grid = document.getElementById(‘pp-grid’);
if (!grid) return;
PP_EVENTS.forEach(ev => {
const card = el(‘div’, ‘pp-card’);
card.dataset.type = ev.type;
card.innerHTML = ` <div class="event-tag">${TYPE_LABELS[ev.type] || ev.type}</div> <div class="event-title">${ev.title}</div> <div class="event-preview">${ev.preview}</div>`;
card.addEventListener(‘click’, () => openModal(ev));
grid.appendChild(card);
});
}

/* ─── MODAL ─────────────────────────────────────────── */
const TYPE_LABELS = {
labs: ‘Laboratory’, appt: ‘Appointment’, infect: ‘Infection / TORCH’,
fetal: ‘Fetal Development’, tx: ‘Treatment / Vaccine’, screen: ‘Screening / Imaging’,
};
const TYPE_COLORS = {
labs:’#1a6fa8’, appt:’#2e7d46’, infect:’#c0392b’,
fetal:’#7b3fa0’, tx:’#c97d10’, screen:’#1a7a7a’,
};

function openModal(ev) {
document.getElementById(‘modal-tag’).textContent  = TYPE_LABELS[ev.type] || ev.type;
document.getElementById(‘modal-tag’).style.color  = TYPE_COLORS[ev.type] || ‘#333’;
document.getElementById(‘modal-wk’).textContent   = ev.week ? `Gestational Week ${ev.week}` : ‘’;
document.getElementById(‘modal-title’).textContent = ev.title;
document.getElementById(‘modal-body’).innerHTML   = ev.detail;
document.getElementById(‘modal’).scrollTop        = 0;
document.getElementById(‘overlay’).classList.add(‘open’);
}

function closeModal() {
document.getElementById(‘overlay’).classList.remove(‘open’);
}

document.getElementById(‘modal-x’).addEventListener(‘click’, closeModal);
document.getElementById(‘overlay’).addEventListener(‘click’, e => {
if (e.target === document.getElementById(‘overlay’)) closeModal();
});
document.addEventListener(‘keydown’, e => { if (e.key === ‘Escape’) closeModal(); });

/* ─── FILTER BUTTONS ─────────────────────────────────── */
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
card.style.opacity = (type !== ‘all’ && card.dataset.type !== type) ? ‘0.12’ : ‘1’;
card.style.pointerEvents = (type !== ‘all’ && card.dataset.type !== type) ? ‘none’ : ‘’;
});
});

/* ─── RULER SYNC ─────────────────────────────────────── */
function syncRuler() {
const inner = document.getElementById(‘wr-inner’);
const spineWrap = document.getElementById(‘spine-wrap’);
const railLeft = document.querySelector(’.rail-left’);
const railHeader = document.querySelector(’.rail-header’);
if (!inner || !spineWrap || !railLeft || !railHeader) return;

const railHeaderH = railHeader.offsetHeight;

function update() {
const spineTop = spineWrap.getBoundingClientRect().top;
// offset = how far the spine top has scrolled above the bottom of the rail header
const offset = railHeaderH - spineTop;
inner.style.transform = `translateY(${-Math.max(0, offset)}px)`;
}

window.addEventListener(‘scroll’, update, { passive: true });
update();
}

/* ─── INIT ───────────────────────────────────────────── */
function init() {
buildRuler();
buildEraBands();
buildSpine();
buildPP();
syncRuler();
}

// Use window.onload to ensure fonts + CSS are parsed before we read layout
window.addEventListener(‘load’, init);

})();
