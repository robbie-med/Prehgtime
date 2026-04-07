/* =====================================================
   PREGNANCY CLINICAL TIMELINE  -  script.js
   ===================================================== */
(function () {
"use strict";

var PX = 88;
var W0 = 1;
var W1 = 42;

var ERAS = [
  { id: "era-t1",   label: "First Trimester",  start: 1,  end: 13,  cls: "t1"   },
  { id: "era-t2",   label: "Second Trimester", start: 14, end: 27,  cls: "t2"   },
  { id: "era-t3",   label: "Third Trimester",  start: 28, end: 36,  cls: "t3"   },
  { id: "era-term", label: "Term / Late Term", start: 37, end: 42,  cls: "term" }
];

var TYPE_LABELS = {
  labs:    "Laboratory",
  appt:    "Appointment",
  infect:  "Infection / TORCH",
  fetal:   "Fetal Development",
  tx:      "Treatment / Vaccine",
  screen:  "Screening / Imaging"
};

var TYPE_COLORS = {
  labs:    "#1a6fa8",
  appt:    "#2e7d46",
  infect:  "#c0392b",
  fetal:   "#7b3fa0",
  tx:      "#c97d10",
  screen:  "#1a7a7a"
};

function wY(week) { return Math.round((week - W0) * PX); }

/* --- EVENTS --- */
var EVENTS = [

{ week: 4, side: "left", type: "appt",
  title: "Pregnancy Confirmation Visit",
  preview: "Confirm IUP, establish GA, full OB/medical/social history. EDD = LMP + 280 days (Naegele\u2019s rule).",
  detail: '<p><strong>Goals:</strong> Confirm intrauterine pregnancy, establish GA from LMP + dating U/S.</p><ul><li>EDD: LMP + 280 days (Naegele\u2019s rule)</li><li>Review all medications for teratogenicity</li><li>Counsel: no alcohol/smoking, caffeine &lt;200 mg/day, avoid deli meat/soft cheeses (Listeria)</li><li>Exercise: 150 min/wk moderate intensity OK; dental care safe in pregnancy</li></ul>' },

{ week: 4.5, side: "right", type: "tx",
  title: "Folic Acid + Prenatal Vitamins",
  preview: "Folic acid 0.4\u20130.8 mg/day (4 mg if prior NTD). Iron 27 mg, iodine 150 \u03BCg, DHA 200 mg. Avoid teratogens.",
  detail: '<ul><li><strong>Folic acid:</strong> 0.4\u20130.8 mg/day standard; 4 mg/day if prior NTD, maternal DM, valproate/carbamazepine</li><li>Prenatal vitamin: iron 27 mg, iodine 150 \u03BCg, DHA 200 mg, Vit D, calcium</li><li><strong>Teratogens to avoid:</strong> isotretinoin, valproate, warfarin, methotrexate, ACEi/ARBs, tetracyclines, fluoroquinolones, thalidomide</li><li>Nausea: Vit B6 10\u201325 mg TID \u00B1 doxylamine 12.5 mg</li></ul>' },

{ week: 5, side: "right", type: "fetal",
  title: "Cardiac Tube / Heartbeat",
  preview: "Cardiac tube forms ~day 22. Heartbeat on TVU/S by wk 5\u20136. Neural tube closes day 28. CRL ~4 mm at wk 6.",
  detail: '<ul><li>Heart begins beating ~day 22 post-fertilization</li><li>TVU/S detects cardiac activity at 5\u20136 wks</li><li>Neural tube closes by day 28 \u2014 highest teratogen risk wks 3\u20138 (embryonic period)</li><li>CRL at 6 wks: ~4\u20135 mm</li></ul>' },

{ week: 6, side: "left", type: "labs",
  title: "Initial Prenatal Panel",
  preview: "Type & Screen, CBC, Rubella IgG, Varicella IgG, HepB sAg, HIV, RPR, GC/Chlamydia NAAT, urine Cx, TSH, HepC, Pap.",
  detail: '<ul><li><strong>Blood type &amp; Screen</strong> (ABO/Rh)</li><li><strong>CBC</strong> \u2014 baseline Hgb, MCV, platelets</li><li><strong>Rubella IgG</strong> \u2014 if negative: MMR postpartum (live vaccine contraindicated in pregnancy)</li><li><strong>Varicella IgG</strong> \u2014 if negative: VZIG if exposed; varicella vaccine postpartum</li><li><strong>HepB sAg</strong> \u2014 if+: HBIG + HepB vaccine to newborn \u226412h of delivery</li><li><strong>HIV 1/2 Ag/Ab (4th gen)</strong> \u2014 universal opt-out screening</li><li><strong>RPR/VDRL</strong> \u2014 syphilis; if+: FTA-ABS confirm \u2192 benzathine PCN G</li><li><strong>GC + Chlamydia NAAT</strong> \u2014 cervical/vaginal swab</li><li><strong>Urine culture</strong> \u2014 treat ASB \u226510\u2075 CFU/mL \u2192 prevents pyelonephritis + PTL</li><li><strong>TSH</strong> \u2014 hypothyroidism linked to miscarriage, impaired fetal neurodevelopment</li><li><strong>Hepatitis C Ab</strong> \u2014 universal per ACOG 2020</li><li><strong>Pap smear</strong> if due per screening interval</li></ul>' },

{ week: 7, side: "right", type: "labs",
  title: "Quantitative \u03B2-hCG Kinetics",
  preview: "Doubles q48h in viable IUP. Peaks 8\u201310 wks (~100k mIU/mL). Discriminatory zone ~1500\u20133000 mIU/mL.",
  detail: '<ul><li>Doubles every 48h in viable early IUP</li><li>Discriminatory zone: ~1500\u20133000 mIU/mL \u2192 IUP should be visible on TVU/S; if not \u2192 ectopic until proven otherwise</li><li>Peak: 8\u201310 wks (~100,000 mIU/mL), then declines to T2/T3 plateau</li><li>Very high \u03B2-hCG \u2192 molar pregnancy, multifetal gestation</li><li>Falling or plateauing \u2192 completed AB or ectopic</li></ul>' },

{ week: 8, side: "left", type: "fetal",
  title: "Organogenesis Peak",
  preview: "All major organs forming wks 3\u201310. Limbs, heart chambers, CNS, GI. Embryo \u2192 fetus at wk 10. CRL ~30 mm.",
  detail: '<ul><li>Embryonic period (wks 3\u201310): highest teratogenic risk for structural malformations</li><li>Wk 6: 4-chamber heart forming; limb buds visible</li><li>Wk 7: face, lens, ear developing; liver hematopoiesis begins</li><li>Wk 8: fingers distinct; external genitalia undifferentiated</li><li>Wk 10: embryo \u2192 fetus; intestines return from umbilical stalk; CRL ~30 mm</li></ul>' },

{ week: 8.5, side: "right", type: "screen",
  title: "Dating Ultrasound (TVU/S)",
  preview: "CRL most accurate for GA dating (\u00B15\u20137 d). Confirm IUP, viability, sac count. FHR normal 110\u2013160 bpm.",
  detail: '<ul><li>CRL most accurate dating method in T1 (\u00B15\u20137 days)</li><li>If CRL EDD differs from LMP EDD by &gt;7 days \u2192 use CRL to set EDD</li><li>Assess: yolk sac, cardiac activity, sac number, adnexal masses</li><li>FHR normal 110\u2013160 bpm; bradycardia &lt;90 at 6\u20138 wks = poor prognosis</li><li>Diagnose: blighted ovum (GS &gt;25 mm, no embryo), missed AB (CRL &gt;7 mm, no FHR), ectopic, molar</li></ul>' },

{ week: 9, side: "left", type: "infect",
  title: "TORCH: Critical T1 Window",
  preview: "Highest-risk period for congenital infections. CMV, Toxo, Rubella, Parvovirus B19, Syphilis. Hydrops: CMV + Parvo.",
  detail: '<ul><li><strong>CMV:</strong> Periventricular calcifications, hearing loss, chorioretinitis, hydrops. Dx: IgM/IgG avidity + PCR amniotic fluid. Rx: valacyclovir (investigational)</li><li><strong>Toxoplasma gondii:</strong> Cat feces/raw meat \u2192 chorioretinitis, intracranial calcifications, hydrocephalus. Rx: pyrimethamine + sulfadiazine + leucovorin</li><li><strong>Rubella (T1):</strong> Cataracts + cochlear defects + PDA/VSD (congenital rubella syndrome). No treatment; MMR postpartum</li><li><strong>Parvovirus B19:</strong> Aplastic crisis \u2192 nonimmune hydrops fetalis. MCA-PSV monitoring; intrauterine transfusion if severe</li><li><strong>Syphilis:</strong> Any trimester. Benzathine PCN G only proven Rx in pregnancy</li><li><strong>HSV:</strong> Vertical transmission at delivery; microcephaly, vesicles, hydrocephalus. NO hydrops</li><li><strong>VZV:</strong> Scar lesions, limb hypoplasia, chorioretinitis, cortical atrophy. NO hydrops</li><li><strong>Listeria:</strong> Deli meat/soft cheese. Rx: ampicillin + gentamicin</li></ul>' },

{ week: 10, side: "right", type: "screen",
  title: "cfDNA / NIPT",
  preview: "From wk 10. T21 sensitivity >99%. T18, T13, sex chr. aneuploidies. Positive \u2260 diagnostic \u2014 confirm with CVS/amnio.",
  detail: '<ul><li>Available from 10 wks; analyzes fetal cfDNA in maternal plasma</li><li>T21 sensitivity &gt;99%, specificity ~99.9%; T18, T13, 45X, 47XXY detected</li><li>Optional panels: microdeletions (22q11.2), fetal sex</li><li><strong>Positive NIPT is NOT diagnostic</strong> \u2014 confirm with CVS or amniocentesis</li><li>False positives: vanishing twin, confined placental mosaicism, maternal malignancy</li><li>Fetal fraction must be \u22654% for valid results</li></ul>' },

{ week: 11, side: "left", type: "screen",
  title: "CVS (Chorionic Villus Sampling)",
  preview: "Wks 10\u201313. Karyotype + microarray. Earlier than amnio. Loss risk ~0.5\u20131%. Cannot diagnose NTDs.",
  detail: '<ul><li>Transabdominal or transcervical biopsy of chorionic villi</li><li>Results: karyotype (10\u201314 days), FISH (24\u201348h), chromosomal microarray</li><li>Earlier than amniocentesis (10\u201313 vs 15\u201320 wks)</li><li>Loss risk: ~0.5\u20131% (vs amnio ~0.1\u20130.3%)</li><li>Cannot diagnose NTDs (no AFP) \u2014 requires follow-up MSAFP or anatomy U/S</li></ul>' },

{ week: 11.5, side: "right", type: "screen",
  title: "Nuchal Translucency (NT) U/S",
  preview: "Wks 11\u201313. NT \u22653 mm \u2192 \u2191 risk T21/18/13 + cardiac defects. Combined with PAPP-A + free \u03B2-hCG.",
  detail: '<ul><li>NT \u22653.0 mm = abnormal; \u22653.5 mm \u2192 significant structural/chromosomal risk</li><li><strong>PAPP-A</strong> \u22640.4 MoM \u2192 aneuploidy, FGR, preeclampsia, stillbirth risk</li><li><strong>Free \u03B2-hCG</strong> high \u2192 T21; low \u2192 T18/T13</li><li>Combined DR for T21: ~85\u201390% at 5% FPR</li><li>Additional markers: absent nasal bone, tricuspid regurgitation, ductus venosus reversal</li><li>Cystic hygroma \u2192 Turner syndrome, T21, T18; high mortality risk</li></ul>' },

{ week: 12, side: "left", type: "tx",
  title: "Aspirin Prophylaxis \u2014 Preeclampsia",
  preview: "High risk: aspirin 81 mg/day at bedtime, start \u226416 wks, continue to 36 wks. Reduces preeclampsia by 10\u201320%.",
  detail: '<p><strong>High-risk (1+ criterion):</strong></p><ul><li>Prior preeclampsia (especially early-onset or severe)</li><li>Multifetal gestation, chronic HTN, DM type 1 or 2, CKD, SLE, antiphospholipid syndrome</li></ul><p><strong>Moderate risk (\u22652 criteria):</strong> nulliparity, BMI &gt;30, family Hx, age \u226535, prior SGA.</p><ul><li>Dose: aspirin 81 mg PO QD at bedtime</li><li>Start: ideally before 16 wks; benefit up to 28 wks</li><li>Stop: 36\u201337 wks gestation</li></ul>' },

{ week: 12.5, side: "right", type: "fetal",
  title: "End of Embryonic Period",
  preview: "Fetus from wk 10. External genitalia differentiating. Intestines returned from cord. CRL ~6 cm at 13 wks.",
  detail: '<ul><li>Embryo \u2192 fetus at wk 10; fetal period = wks 10\u201340</li><li>External genitalia: sex differentiation begins ~wk 7; may be visible on U/S 12\u201314 wks</li><li>Intestines fully returned into abdominal cavity</li><li>CRL at 13 wks: ~6 cm; weight ~23 g</li><li>Bone marrow begins hematopoiesis (previously liver/spleen)</li><li>Placenta fully functional, replaces corpus luteum for progesterone by wk 10</li></ul>' },

{ week: 14, side: "left", type: "appt",
  title: "T2 Routine Prenatal Visit",
  preview: "BP, weight, fundal height (\u2248 GA \u00B1 2 cm after 20 wks), FHR Doppler. Every 4 wks in T2.",
  detail: '<ul><li><strong>BP:</strong> goal &lt;140/90; treat if \u2265160/110 (severe range)</li><li><strong>Weight gain targets:</strong> normal BMI 25\u201335 lbs total; overweight 15\u201325; obese 11\u201320; underweight 28\u201340</li><li><strong>Fundal height:</strong> cm \u2248 GA \u00B1 2 cm (after 20 wks); SFH &lt;2 cm below GA \u2192 FGR workup</li><li><strong>FHR:</strong> 110\u2013160 bpm normal</li><li><strong>Review symptoms:</strong> headache/visual changes/edema (preeclampsia); dysuria/flank pain (UTI/pyelo); vaginal bleeding; contractions; decreased FM after quickening</li></ul>' },

{ week: 15, side: "right", type: "labs",
  title: "Quad Screen (MSAFP)",
  preview: "AFP, hCG, uE3, Inhibin A at 15\u201320 wks. \u2191AFP \u2192 NTD. \u2193AFP + \u2191hCG + \u2193uE3 + \u2191InhA \u2192 T21.",
  detail: '<ul><li><strong>AFP \u2191\u2191 (&gt;2.5 MoM):</strong> open NTD (anencephaly, spina bifida), gastroschisis, omphalocele, multiple gestation, underestimated GA, fetal demise</li><li><strong>AFP \u2193:</strong> Trisomy 21, Trisomy 18</li><li><strong>hCG \u2191:</strong> T21; \u2193: T18</li><li><strong>Unconjugated estriol (uE3) \u2193:</strong> T21, T18, Smith-Lemli-Opitz</li><li><strong>Inhibin A \u2191:</strong> T21</li><li>Quad screen DR for T21: ~81% at 5% FPR</li><li>AFP &gt;2.5 MoM \u2192 targeted anatomy U/S + consider amnio</li></ul>' },

{ week: 16, side: "left", type: "infect",
  title: "Parvovirus B19 \u2014 Fifth Disease",
  preview: "Slapped-cheek rash + polyarthritis in mother. Fetal aplastic crisis \u2192 nonimmune hydrops. Monitor MCA-PSV >1.5 MoM.",
  detail: '<p><strong>Maternal:</strong> Slapped-cheek facial rash, lacy rash on trunk/limbs, flu-like prodrome, symmetrical polyarticular arthritis. Often mild/asymptomatic.</p><p><strong>Fetal:</strong> Infects fetal erythroid precursors \u2192 aplastic crisis \u2192 severe anemia \u2192 nonimmune hydrops fetalis. Risk of hydrops ~5\u201310% if infected T2.</p><ul><li><strong>Dx:</strong> Parvovirus B19 IgM/IgG serology; PCR</li><li><strong>Monitoring:</strong> MCA-PSV Doppler q1\u20132 wks \u00D7 8\u201312 wks; &gt;1.5 MoM = fetal anemia \u2192 consider intrauterine transfusion</li><li>No antiviral; no vaccine available</li></ul>' },

{ week: 16.5, side: "right", type: "screen",
  title: "Amniocentesis (if indicated)",
  preview: "Wks 15\u201320. Karyotype, microarray, FISH. Indications: abnormal NIPT/quad, AMA, prior aneuploidy. Loss ~0.1\u20130.3%.",
  detail: '<ul><li>Transabdominal U/S-guided aspiration of amniotic fluid at 15\u201320 wks</li><li>Results: FISH 24\u201348h (rapid T21/18/13), karyotype 10\u201314 days, microarray 7\u201314 days</li><li>Also diagnoses: NTDs (elevated amniotic AFP + AChE), fetal infection (CMV/toxo PCR)</li><li>Loss risk: ~0.1\u20130.3%</li><li>Give RhIg if Rh-negative mother before procedure</li></ul>' },

{ week: 18, side: "left", type: "screen",
  title: "Anatomy Survey Ultrasound",
  preview: "Landmark 18\u201322 wk U/S. Brain, face, heart (4-chamber + outflow tracts), spine, kidneys, placenta, AFI, cord.",
  detail: '<p><strong>Fetal biometry:</strong> BPD, HC, AC, FL \u2192 EFW (Hadlock)</p><p><strong>CNS:</strong> lateral ventricles (&lt;10 mm), cavum septum pellucidum, cerebellum, posterior fossa</p><p><strong>Face:</strong> lips (cleft), orbits, nasal bone, profile</p><p><strong>Cardiac:</strong> 4-chamber view, LVOT, RVOT, 3-vessel-trachea view, situs</p><p><strong>Spine:</strong> sagittal + transverse (NTD; banana/lemon signs in spina bifida)</p><p><strong>Abdomen:</strong> stomach, kidneys (pelvis &lt;4 mm), bladder, 3-vessel cord insertion</p><p><strong>Placenta:</strong> location (&lt;2 cm from os = previa \u2192 follow-up 32 wks), cord insertion</p><p><strong>AFI/DVP:</strong> oligohydramnios (AFI &lt;5 or DVP &lt;2), polyhydramnios (AFI &gt;24)</p>' },

{ week: 19, side: "right", type: "fetal",
  title: "Quickening + Organ Maturation",
  preview: "Mother feels movement 18\u201322 wks (primips later). Kidneys producing urine. Type II pneumocytes making surfactant.",
  detail: '<ul><li>Quickening: primips 18\u201322 wks; multips 16\u201318 wks</li><li>Fetal kidneys \u2192 primary amniotic fluid source by 16 wks; esophageal atresia \u2192 polyhydramnios</li><li>Type II pneumocytes begin surfactant production (lecithin, phosphatidylglycerol)</li><li>Lanugo covers entire body; brown fat (thermogenesis) deposits from ~20 wks</li><li>Weight at 20 wks: ~300 g; length ~25 cm</li></ul>' },

{ week: 20, side: "left", type: "infect",
  title: "VZV Congenital Window",
  preview: "Varicella wks 8\u201320 \u2192 scar lesions, limb hypoplasia, chorioretinitis, cortical atrophy. No hydrops. VZIG within 96h.",
  detail: '<ul><li><strong>Congenital varicella syndrome:</strong> highest risk wks 8\u201320</li><li>Fetal: cicatricial skin lesions, chorioretinitis, limb hypoplasia, cortical atrophy, microcephaly \u2014 all detectable on antenatal U/S</li><li><strong>Does NOT cause hydrops fetalis</strong></li><li>Management: VZV IgG\u2013 mother exposed \u2192 VZIG within 96h; acyclovir if active maternal disease; no live vaccine in pregnancy</li><li>Rubella &gt;20 wks: congenital rubella syndrome risk markedly reduced; hydrops rare</li></ul>' },

{ week: 24, side: "right", type: "fetal",
  title: "Viability Threshold",
  preview: "22\u201324 wks = limit of viability. At 24 wks ~50\u201370% survival with NICU. Eyes open. Hearing present.",
  detail: '<ul><li>22 wks: ~10\u201315% survival; severe morbidity; individualize resuscitation goals</li><li>23 wks: ~30\u201350% survival; goals-of-care discussion with family</li><li>24 wks: ~50\u201370% survival; most centers offer full resuscitation</li><li>25 wks: ~70\u201380% survival with decreasing morbidity</li><li>Weight: 24 wks ~600 g; 28 wks ~1000 g</li><li>Eyes open ~26 wks; hearing present; pain pathways developing</li></ul>' },

{ week: 24.5, side: "left", type: "labs",
  title: "GDM Screen \u2014 1-hr GCT \u2192 3-hr GTT",
  preview: "50g GCT (non-fasting). \u2265130 or \u2265140 mg/dL \u2192 3-hr 100g OGTT. \u22652 abnormal values = GDM (Carpenter-Coustan).",
  detail: '<p><strong>1-hr GCT (non-fasting):</strong> 50g glucose; threshold \u2265130 mg/dL (87% sensitivity) or \u2265140 mg/dL (83% sensitivity).</p><p><strong>3-hr 100g OGTT (Carpenter-Coustan):</strong></p><ul><li>Fasting \u226595 mg/dL</li><li>1-hour \u2265180 mg/dL</li><li>2-hour \u2265155 mg/dL</li><li>3-hour \u2265140 mg/dL</li><li><strong>2 or more values at or above threshold = GDM diagnosis</strong></li></ul><p><strong>Alternative IADPSG/WHO 75g 2-hr OGTT:</strong> fasting \u226592, 1h \u2265180, 2h \u2265153 \u2014 any single value = GDM.</p><p>Management: medical nutrition therapy first; insulin if diet fails; metformin/glyburide off-label alternatives.</p>' },

{ week: 26, side: "right", type: "labs",
  title: "Repeat CBC + Rh Antibody Screen",
  preview: "Repeat Hgb (treat if <10 g/dL). Rh antibody screen at 28 wks before RhoGAM. Repeat urine culture.",
  detail: '<ul><li><strong>CBC:</strong> iron deficiency anemia most common \u2014 ferrous sulfate 325 mg TID; IV iron if severe/intolerant</li><li><strong>Rh(D) antibody screen:</strong> if Rh\u2013 mother, check for alloimmunization before giving RhIg</li><li><strong>Urine culture:</strong> repeat if prior ASB or UTI</li><li><strong>Repeat GC/Chlamydia:</strong> if high-risk population</li></ul>' },

{ week: 27, side: "left", type: "tx",
  title: "Tdap + Flu + COVID + RhoGAM at 28 wks",
  preview: "Tdap 27\u201336 wks (ideally 27\u201332). Flu any trimester. RhoGAM 300 \u03BCg IM at 28 wks if Rh(D)\u2013.",
  detail: '<ul><li><strong>Tdap:</strong> 27\u201336 wks (ideally 27\u201332 wks) every pregnancy \u2014 maternal Abs cross placenta and protect newborn from pertussis before own vaccine series</li><li><strong>Influenza (inactivated):</strong> Any trimester during flu season</li><li><strong>COVID-19 (mRNA preferred):</strong> Any trimester; safe</li><li><strong>RSV vaccine (Abrysvo):</strong> 32\u201336 wks \u2014 ACOG 2023; passive Ab protection for newborn</li><li><strong>RhoGAM 300 \u03BCg IM at 28 wks</strong> if Rh(D)\u2013 and antibody screen negative</li><li>Also give after: vaginal bleeding, amniocentesis, ECV, abdominal trauma, threatened AB, ectopic, fetal demise</li><li>Repeat within 72h postpartum if infant is Rh+</li></ul>' },

{ week: 27.5, side: "right", type: "screen",
  title: "Cervical Length + PTL Prevention",
  preview: "TVU/S CX \u226425 mm at 24 wks \u2192 high PTL risk. Vaginal progesterone 200 mg QD or 17-OHPC IM. Cerclage if indicated.",
  detail: '<ul><li>Transvaginal CL &lt;25 mm at 24 wks \u2192 high risk spontaneous PTL</li><li><strong>Vaginal progesterone 200 mg QD:</strong> if CL \u226425 mm in singleton</li><li><strong>17-OHPC (17\u03B1-hydroxyprogesterone caproate):</strong> weekly IM 16\u201336 wks if prior spontaneous PTB &lt;37 wks</li><li><strong>Cerclage:</strong> prior PTL + CL \u226425 mm + singleton \u2192 McDonald or Shirodkar; history-indicated cerclage at 12\u201314 wks for cervical incompetence</li></ul>' },

{ week: 28, side: "left", type: "appt",
  title: "T3 Visits \u2014 Every 2 Weeks",
  preview: "Every 2 wks from 28\u201336 wks; weekly from 36 wks. BP, weight, FH, FHR, Leopold maneuvers. Preeclampsia red flags.",
  detail: '<p><strong>Leopold maneuvers:</strong></p><ul><li>1st: Fundal grip \u2014 head (hard/round) vs breech (soft/irregular)</li><li>2nd: Lateral grip \u2014 locate fetal back</li><li>3rd: Pawlick\u2019s \u2014 presenting part above pubic symphysis</li><li>4th: Pelvic grip \u2014 head engagement/flexion</li></ul><p><strong>Preeclampsia criteria:</strong> BP \u2265140/90 \u00D72 \u22654h apart + proteinuria \u2265300 mg/24h OR end-organ damage (thrombocytopenia, renal insufficiency, impaired liver, pulmonary edema, new HA/visual disturbance).</p><p>Severe range BP \u2265160/110 \u2192 IV labetalol/hydralazine or oral nifedipine + MgSO\u2084 seizure prophylaxis.</p>' },

{ week: 29, side: "right", type: "labs",
  title: "Third Trimester Labs",
  preview: "CBC (anemia/PLT), repeat HIV/syphilis if high-risk, urine protein:Cr if preeclampsia concern, LFTs/LDH/uric acid.",
  detail: '<ul><li><strong>CBC:</strong> anemia + platelets (PLT &lt;100k \u2192 HELLP screen if preeclampsia present)</li><li><strong>Repeat HIV + RPR:</strong> high-risk populations or unknown status</li><li><strong>Repeat GC/Chlamydia:</strong> high-risk</li><li><strong>Urine protein/Cr ratio:</strong> \u22650.3 = significant proteinuria (equivalent to 300 mg/24h)</li><li><strong>24-hr urine protein:</strong> gold standard; \u2265300 mg = proteinuria for preeclampsia Dx</li><li><strong>HELLP panel:</strong> AST/ALT, LDH, uric acid, peripheral smear if preeclampsia suspected</li></ul>' },

{ week: 30, side: "left", type: "tx",
  title: "Antenatal Corticosteroids",
  preview: "Delivery anticipated <34 wks: betamethasone 12 mg IM q24h \u00D7 2 doses. Reduces RDS, IVH, NEC by ~40%.",
  detail: '<ul><li><strong>Betamethasone 12 mg IM q24h \u00D7 2 doses</strong> (preferred); dexamethasone 6 mg IM q12h \u00D7 4 doses is alternative</li><li>Peak benefit: 24h\u20137 days after first dose</li><li><strong>Benefits:</strong> \u2193 RDS, \u2193 IVH, \u2193 NEC, \u2193 neonatal mortality ~40%</li><li><strong>Rescue course:</strong> if &gt;14 days since initial course AND &lt;34 wks AND delivery still anticipated</li><li><strong>Late preterm (34\u201336 wks):</strong> single course betamethasone (ALPS trial) \u2014 \u2193 respiratory morbidity in late preterm neonates</li><li>Monitor glucose in DM patients (transient hyperglycemia); transient leukocytosis</li></ul>' },

{ week: 31, side: "right", type: "fetal",
  title: "Rapid Fetal Weight Gain",
  preview: "~200\u2013250 g/wk. 28 wks: ~1100 g. 32 wks: ~1800 g. 36 wks: ~2600 g. Lung maturity increasing. Brain gyrification.",
  detail: '<ul><li>28 wks: ~1100 g; 32 wks: ~1800 g; 36 wks: ~2600 g; 40 wks: ~3200\u20133400 g</li><li>Fetal fat: 15% body weight at 34 wks; 30% at term</li><li>Lanugo diminishing from 36 wks; vernix caseosa accumulates on skin</li><li>Brain gyrification accelerates 28\u201340 wks; cortical neuron migration completing</li><li>Fetal breathing movements present \u226530 min/hr by 34 wks</li><li>Eyes open ~26 wks; grasp reflex present by 28 wks</li><li>Most malpresentations convert to vertex by 32\u201334 wks</li></ul>' },

{ week: 32, side: "left", type: "screen",
  title: "Growth Ultrasound + BPP",
  preview: "EFW, AFI, umbilical artery Doppler if FGR. BPP: NST + breathing + movement + tone + fluid (max 10 pts).",
  detail: '<ul><li>EFW &lt;10th percentile = SGA; &lt;3rd = severe FGR</li><li>AFI normal 5\u201324 cm; DVP normal 2\u20138 cm</li><li>Placenta previa follow-up: if low-lying at anatomy scan \u2192 recheck 32 wks; complete previa \u2192 scheduled C/S at 36\u201337 wks</li><li><strong>BPP (max 10 pts):</strong> NST (2) + breathing \u226530 sec in 30 min (2) + \u22653 movements (2) + tone (2) + AFI normal (2). Score \u22646 \u2192 delivery consideration; \u22644 \u2192 deliver</li><li><strong>Umbilical artery Doppler:</strong> AEDF \u2192 deliver by 34 wks; REDF \u2192 deliver immediately</li></ul>' },

{ week: 33, side: "right", type: "screen",
  title: "Non-Stress Test (NST) Surveillance",
  preview: "Reactive: 2 accels \u226515 bpm \u00D7 15 sec in 20 min. Weekly or BID for DM, HTN, FGR, IUFD Hx, post-dates.",
  detail: '<ul><li><strong>Reactive NST:</strong> \u22652 accelerations \u226515 bpm \u00D7 \u226515 sec in 20 min = reassuring</li><li>Non-reactive: fails criteria in 40 min \u2192 proceed to BPP or CST</li><li>Late decelerations: uteroplacental insufficiency (concerning)</li><li>Variable decelerations: cord compression (usually benign if brief)</li><li><strong>Indications:</strong> DM (start 28\u201332 wks), HTN/preeclampsia, FGR, post-dates \u226541 wks, prior IUFD, oligohydramnios, multifetal gestation, AMA</li><li>CST/OCT: late decels with \u226550% contractions = positive result (concerning)</li></ul>' },

{ week: 34, side: "left", type: "tx",
  title: "Magnesium Sulfate \u2014 Neuroprotection",
  preview: "Delivery <32 wks: MgSO\u2084 4\u20136g IV load then 1\u20132 g/hr \u00D7 12\u201324h. Reduces CP by ~32%. Antidote: Ca gluconate 1g IV.",
  detail: '<ul><li><strong>Dose:</strong> 4\u20136 g IV over 15\u201320 min (load); maintenance 1\u20132 g/hr; duration \u226424h or until delivery</li><li>ACOG: use for anticipated delivery &lt;32 wks (some protocols extend to &lt;34 wks)</li><li><strong>Evidence (BEAM trial):</strong> reduces cerebral palsy by ~32%; reduces severe neurological dysfunction</li></ul><p><strong>Toxicity monitoring:</strong></p><ul><li>Loss of DTRs = first sign (~7\u201310 mEq/L) \u2192 reduce infusion rate</li><li>Respiratory depression (&gt;12 mEq/L) \u2192 stop infusion immediately</li><li>Cardiac arrest (&gt;15 mEq/L)</li><li>Monitor DTRs hourly; urine output &gt;25 mL/hr (renally cleared)</li><li><strong>Antidote: Calcium gluconate 1g IV over 3 min</strong></li></ul>' },

{ week: 35, side: "right", type: "infect",
  title: "GBS Screen + HSV Suppression",
  preview: "GBS rectovaginal swab 35\u201337 wks. GBS+ \u2192 intrapartum PCN G. HSV: acyclovir 400 mg TID from 36 wks.",
  detail: '<p><strong>GBS Screening (35\u201337 wks):</strong></p><ul><li>Universal rectovaginal (NOT cervical) swab culture</li><li>GBS colonization: ~25% of pregnant women</li><li><strong>IAP indications:</strong> GBS culture+, unknown status + risk factors (PTL &lt;37 wks, ROM &gt;18h, intrapartum fever \u226538\u00B0C, prior GBS infant, GBS bacteriuria this pregnancy)</li><li><strong>Penicillin G 5M units IV load, then 2.5M units IV q4h</strong> (first-line)</li><li>Ampicillin 2g IV then 1g q4h; cefazolin (low-risk PCN allergy); clindamycin or vancomycin (high-risk PCN allergy)</li></ul><p><strong>HSV suppression from 36 wks:</strong></p><ul><li>Acyclovir 400 mg TID OR valacyclovir 500 mg BID until delivery</li><li>Active genital HSV lesions at labor onset \u2192 cesarean delivery regardless</li></ul>' },

{ week: 36, side: "left", type: "appt",
  title: "Weekly Term Visits + Delivery Planning",
  preview: "Weekly from 36 wks. Bishop score (\u22658 = favorable). Leopold maneuvers. ECV if breech. TOLAC counseling.",
  detail: '<ul><li><strong>Bishop score:</strong> dilation + effacement + station + consistency + position \u2192 \u22658 = favorable; &lt;6 = ripen before induction</li><li>Breech \u2192 offer ECV at 36\u201337 wks (success ~50\u201360%); if failed/declined \u2192 C/S at 39 wks</li><li><strong>TOLAC counseling:</strong> VBAC success ~60\u201380% if prior low transverse uterine incision; rupture risk ~0.5\u20131%</li><li>Discuss: labor analgesia options, breastfeeding plan, cord blood banking, newborn care preferences</li><li>Postdates counseling: induction recommended at 41 wks per ACOG</li></ul>' },

{ week: 37, side: "right", type: "labs",
  title: "Pre-Delivery Lab Panel",
  preview: "CBC, Type & Screen (repeat if >72h), BMP. Coags if preeclampsia/HELLP/previa. GBS result review.",
  detail: '<ul><li><strong>CBC:</strong> pre-delivery baseline; PLT &lt;100k \u2192 alert anesthesia; PLT &lt;50k \u2192 no neuraxial anesthesia</li><li><strong>Type &amp; Screen:</strong> re-draw if &gt;72h from expected delivery; crossmatch if high-risk (previa, accreta, prior PPH)</li><li><strong>BMP/CMP:</strong> if preeclampsia \u2014 Cr, LFTs, LDH, uric acid</li><li><strong>Coagulation (PT, aPTT, fibrinogen):</strong> if abruption, IUFD, DIC risk</li><li><strong>GBS result:</strong> confirm status and intrapartum antibiotic prophylaxis plan</li></ul>' },

{ week: 38, side: "left", type: "fetal",
  title: "Term Fetus",
  preview: "38 = early term; 39\u201340 = full term; 41 = late term; \u226542 = post-term. Avg wt 3200\u20133500 g at 39\u201340 wks.",
  detail: '<ul><li>Early term 37\u201338 wks: \u2191 neonatal respiratory morbidity vs full term; avoid elective delivery before 39 wks</li><li>Full term 39\u201340 wks: optimal neonatal outcomes</li><li><strong>ARRIVE trial (NEJM 2018):</strong> elective induction at 39 wks in nullips \u2192 no \u2191 C-section rate + \u2193 hypertensive disorders</li><li>Late term 41 wks; Post-term \u226542 wks \u2192 \u2191 meconium aspiration, oligohydramnios, macrosomia, placental insufficiency, fetal demise</li><li>Weight at 40 wks: 3200\u20133500 g average; vernix + lanugo largely absent</li></ul>' },

{ week: 39, side: "right", type: "tx",
  title: "Induction of Labor / Cervical Ripening",
  preview: "Medical IOL: GDM, HTN, FGR, PROM, post-term. Misoprostol, dinoprostone, Foley balloon, oxytocin.",
  detail: '<p><strong>Medical indications for IOL:</strong> GDM, chronic/gestational HTN, preeclampsia, FGR, PROM at term, IUFD, post-dates \u226541 wks, oligohydramnios, cholestasis of pregnancy.</p><p><strong>Cervical ripening (Bishop &lt;6):</strong></p><ul><li><strong>Misoprostol (PGE1):</strong> 25 \u03BCg vaginally q4h or 50 \u03BCg PO q4h; avoid if prior uterine surgery (\u2191 rupture risk)</li><li><strong>Dinoprostone (PGE2 / Cervidil):</strong> vaginal insert; removable</li><li><strong>Foley bulb:</strong> mechanical ripening; safe with prior uterine surgery</li><li><strong>Oxytocin (Pitocin):</strong> 0.5\u20132 mU/min IV, titrate q15\u201340 min; target \u2265200 MVUs/10 min</li></ul><p><strong>Arrest criteria (ACOG 2014):</strong> Active phase arrest \u22656 cm: &lt;0.5 cm/2h with adequate ctx OR 4h inadequate ctx. Second stage arrest per duration thresholds with/without epidural.</p>' },

{ week: 40, side: "left", type: "appt",
  title: "Stages of Labor",
  preview: "Stage 1: latent (0\u20136 cm) \u2192 active (6\u201310 cm). Stage 2: pushing. Stage 3: placenta (\u226430 min). Stage 4: 1\u20132h PP.",
  detail: '<p><strong>Stage 1 Latent:</strong> 0\u20136 cm; irregular \u2192 regular contractions. Nullips \u226420h; multips \u226414h.</p><p><strong>Stage 1 Active:</strong> 6\u201310 cm; expected \u22650.5 cm/hr (ACOG 2014). Arrest: &lt;0.5 cm/2h adequate ctx OR 4h inadequate ctx.</p><p><strong>Stage 2:</strong> Full dilation \u2192 delivery. Nullip without epidural &lt;2h; with epidural &lt;3h. Multip: &lt;1h / &lt;2h.</p><p><strong>Stage 3:</strong> Delivery \u2192 placental expulsion. Normal \u226430 min. Active management: oxytocin 10U IM immediately after delivery of infant \u2192 \u2193 PPH 50%.</p><p><strong>Stage 4:</strong> First 1\u20132h postpartum. VS q15 min \u00D71h \u2192 q30 min \u00D71h; monitor uterine tone, lochia, bladder, BP.</p><p><strong>Labor analgesia:</strong> Epidural 0.0625\u20130.125% bupivacaine \u00B1 fentanyl; CSE; IV fentanyl 50\u2013100 \u03BCg; nitrous oxide 50%; pudendal block.</p>' },

{ week: 40.5, side: "right", type: "infect",
  title: "Chorioamnionitis (IAI)",
  preview: "Fever \u226539\u00B0C + maternal/fetal tachycardia. Rx: ampicillin + gentamicin \u00B1 clindamycin if C-section.",
  detail: '<p><strong>Diagnosis (\u22651 fever criterion):</strong></p><ul><li>Maternal fever \u226539\u00B0C (single) OR 38\u201338.9\u00B0C \u00D72 (30 min apart)</li><li>PLUS \u22651: maternal tachycardia &gt;100 bpm, fetal tachycardia &gt;160 bpm, uterine tenderness, purulent amniotic fluid</li></ul><p><strong>Treatment:</strong></p><ul><li><strong>Ampicillin 2g IV q6h + Gentamicin 1.5 mg/kg q8h</strong> (or 5 mg/kg q24h)</li><li><strong>Add clindamycin 900 mg IV q8h</strong> if cesarean delivery (anaerobic coverage)</li><li>Continue until afebrile + asymptomatic \u00D724\u201348h postpartum</li><li>Fetal tachycardia &gt;160 = early sign; worsening variability + late decels \u2192 expedite delivery</li></ul>' },

{ week: 40.8, side: "left", type: "labs",
  title: "HELLP Syndrome",
  preview: "Hemolysis + \u2191 Liver enzymes + Low Platelets. MgSO\u2084 prophylaxis + antihypertensives. Delivery = definitive Rx.",
  detail: '<ul><li><strong>H:</strong> Schistocytes on smear, LDH &gt;600 U/L, elevated indirect bilirubin</li><li><strong>EL:</strong> AST &gt;70 U/L (or 2\u00D7 ULN)</li><li><strong>LP:</strong> Platelets &lt;100k/\u03BCL (Class I &lt;50k, II 50\u2013100k, III 100\u2013150k)</li></ul><p><strong>Management:</strong></p><ul><li>MgSO\u2084 4\u20136g load then 1\u20132 g/hr (seizure prophylaxis)</li><li>Antihypertensives for BP \u2265160/110: IV labetalol, IV hydralazine, or oral nifedipine</li><li>Platelet transfusion: &lt;50k before C/S or vaginal delivery</li><li>Delivery = definitive treatment: \u226534 wks \u2192 deliver; &lt;34 wks \u2192 individualize</li><li>DIC can complicate HELLP: fibrinogen \u2193, PT/PTT \u2191, D-dimer \u2191\u2191</li></ul>' },

{ week: 41, side: "right", type: "screen",
  title: "Post-Dates Surveillance",
  preview: "\u226541 wks: NST + AFI twice weekly. AFI <5 cm or DVP <2 \u2192 oligohydramnios \u2192 deliver. BPP if NST non-reactive.",
  detail: '<ul><li>ACOG recommends delivery at 41\u201342 wks; induction offered from 41 wks</li><li>Fetal surveillance: NST + AFI or BPP twice weekly starting 41 wks</li><li>Oligohydramnios (AFI &lt;5 cm or DVP &lt;2 cm) \u2192 deliver regardless of fetal testing</li><li>Risks of expectant management beyond 41 wks: \u2191 meconium aspiration, \u2191 fetal demise, \u2191 macrosomia (shoulder dystocia risk), \u2191 uteroplacental insufficiency</li><li>Meconium-stained fluid: neonatal team at delivery; intubate only if depressed infant</li></ul>' },

{ week: 41.3, side: "left", type: "tx",
  title: "PPH Prevention + Management",
  preview: "Oxytocin 10U IM at delivery (Stage 3). Uterotonic ladder. Tranexamic acid 1g IV within 3h. Bakri, B-Lynch, hysterectomy.",
  detail: '<p><strong>PPH:</strong> blood loss &gt;1000 mL or hemodynamic instability within 24h of delivery.</p><p><strong>Active management of Stage 3 (all deliveries):</strong> oxytocin 10U IM immediately after delivery \u2192 \u2193 PPH 50%; uterine massage; cord clamping 30\u201360 sec after birth.</p><p><strong>Uterotonic escalation:</strong></p><ul><li>Oxytocin 10\u201340 U in 1L NS IV drip</li><li>Methylergonovine 0.2 mg IM (contraindicated: HTN/preeclampsia)</li><li>Carboprost 0.25 mg IM q15\u201390 min, max 8 doses (contraindicated: asthma)</li><li>Misoprostol 800\u20131000 \u03BCg rectally</li><li><strong>Tranexamic acid 1g IV within 3h of delivery</strong> (WOMAN trial \u2014 \u2193 hemorrhage mortality)</li></ul><p><strong>Procedural:</strong> bimanual compression, Bakri balloon tamponade, B-Lynch compression suture, uterine artery ligation, hysterectomy.</p>' }

];

/* --- POSTPARTUM EVENTS --- */
var PP_EVENTS = [

{ type: "labs", title: "Neonatal APGAR Score",
  preview: "At 1 and 5 min. 7\u201310 = normal. 4\u20136 = moderate depression \u2192 stimulate. <4 \u2192 resuscitate.",
  detail: '<p><strong>APGAR (max 10):</strong></p><ul><li><strong>A</strong>ppearance: 0=blue/pale, 1=acrocyanosis, 2=pink all over</li><li><strong>P</strong>ulse: 0=absent, 1=&lt;100, 2=\u2265100</li><li><strong>G</strong>rimace: 0=none, 1=grimace, 2=cough/cry</li><li><strong>A</strong>ctivity (tone): 0=limp, 1=some flexion, 2=active</li><li><strong>R</strong>espiration: 0=absent, 1=weak/irregular, 2=good cry</li><li>Score &lt;7 at 5 min \u2192 continue q5 min until \u22657 or 20 min</li><li>1-min score predicts need for resuscitation; 5-min score predicts neurological prognosis</li></ul>' },

{ type: "tx", title: "Immediate Newborn Prophylaxis",
  preview: "Vitamin K1 1 mg IM. Erythromycin 0.5% eye ointment. HepB vaccine \u226424h. HBIG if mom HBsAg+.",
  detail: '<ul><li><strong>Vitamin K1 (phytonadione) 1 mg IM:</strong> Prevents VKDB (hemorrhagic disease of newborn); factors II, VII, IX, X are Vit K\u2013dependent; neonates born deficient</li><li><strong>Erythromycin 0.5% ophthalmic ointment:</strong> Prevents ophthalmia neonatorum (GC + Chlamydia); mandated in most states</li><li><strong>HepB vaccine (HepB1):</strong> \u226424h if mom HBsAg\u2013; \u226412h if mom HBsAg+ (plus HBIG 0.5 mL IM at different site)</li></ul>' },

{ type: "screen", title: "Newborn Metabolic + Hearing Screen",
  preview: "Heel stick 24\u201348h: PKU, hypothyroidism, galactosemia, CAH, MCAD, hemoglobinopathies, SMA, SCID, CF. Hearing OAE/AABR.",
  detail: '<p><strong>Universal NBS heel-stick at 24\u201348h (repeat at 1\u20132 wks if done &lt;24h):</strong></p><ul><li>PKU, MSUD, homocystinuria, other amino acidopathies</li><li>Congenital hypothyroidism (most common treatable NBS condition)</li><li>Congenital adrenal hyperplasia (21-hydroxylase deficiency)</li><li>MCAD deficiency (fatty acid oxidation disorder)</li><li>Galactosemia, Cystic fibrosis (IRT), Sickle cell + hemoglobinopathies</li><li>SCID, Spinal muscular atrophy (SMA \u2014 RUSP added 2018)</li></ul><p><strong>Hearing screen:</strong> OAE or AABR before discharge; repeat at 1 month if fail.</p><p><strong>CCHD screen:</strong> Pulse ox right hand + right foot at 24h; refer if fail algorithm.</p>' },

{ type: "fetal", title: "Neonatal Hyperbilirubinemia",
  preview: "Physiologic jaundice peaks day 3\u20135. <24h = pathologic (hemolysis). Bhutani nomogram \u2192 phototherapy threshold.",
  detail: '<ul><li>Physiologic: appears day 2\u20133, peaks day 3\u20135, resolves 2 wks (term) / 3 wks (preterm)</li><li>Pathologic if &lt;24h \u2192 hemolytic cause (ABO/Rh incompatibility); direct Coombs+</li><li><strong>Bhutani nomogram:</strong> plot total serum bilirubin vs postnatal age in hours \u2192 risk zone</li><li>Phototherapy threshold: varies by GA + risk factors (hemolytic disease, G6PD, sepsis, acidosis, hypoalbuminemia) \u2014 AAP 2022 updated thresholds; use BiliTool at bilitool.org</li><li>Exchange transfusion: if bili approaches neurotoxicity threshold despite phototherapy \u2192 prevents kernicterus</li></ul>' },

{ type: "infect", title: "Postpartum Infections",
  preview: "Endometritis: fever + uterine tenderness \u2192 clinda + gent. Mastitis: dicloxacillin \u00D7 14d, continue breastfeeding.",
  detail: '<p><strong>Endometritis</strong> (C/S risk 5\u201310\u00D7 higher than vaginal):</p><ul><li>Fever \u226538\u00B0C \u00D72 after 24h + uterine tenderness + foul lochia</li><li>Rx: <strong>Clindamycin 900 mg IV q8h + Gentamicin 1.5 mg/kg q8h</strong> until afebrile 24\u201348h</li></ul><p><strong>Mastitis:</strong></p><ul><li>Unilateral breast erythema, warmth, tenderness, fever, flu-like sx; S. aureus most common</li><li>Rx: <strong>Dicloxacillin 500 mg QID \u00D7 10\u201314 days</strong> (cephalexin alternative; TMP-SMX if MRSA)</li><li>Continue breastfeeding; frequent feeds reduce milk stasis; breast abscess \u2192 U/S-guided aspiration or I&D</li></ul>' },

{ type: "screen", title: "Postpartum Depression Screening",
  preview: "EPDS at 1-month and 6-month visits. Score \u226510 \u2192 evaluate. \u226513 \u2192 likely PPD. Sertraline safest with breastfeeding.",
  detail: '<p><strong>Edinburgh Postnatal Depression Scale (EPDS):</strong> 10-item self-report; score 0\u201330.</p><ul><li>\u226510 \u2192 further evaluation; \u226513 \u2192 likely PPD (sensitivity ~80%)</li><li>ACOG: contact within 3 wks postpartum; comprehensive visit at 12 wks</li></ul><p><strong>Spectrum:</strong></p><ul><li><strong>Baby blues:</strong> Days 3\u201310; tearfulness, lability; normal; self-resolving</li><li><strong>PPD:</strong> Onset within 4 wks\u20131 year; SSRI + psychotherapy. Sertraline preferred (lowest milk transfer). Also: escitalopram, paroxetine</li><li><strong>Postpartum psychosis:</strong> Psychiatric emergency; hallucinations, delusions; onset 2\u20134 wks; admit + mood stabilizers + antipsychotics</li><li>Brexanolone (Zulresso): IV; FDA-approved specifically for PPD</li></ul>' },

{ type: "tx", title: "Postpartum Contraception",
  preview: "POP immediately. No COCP <6 wks (VTE). Immediate postpartum IUD within 10 min of placenta. Implant any time.",
  detail: '<ul><li><strong>Progestin-only pill (POP):</strong> Immediately postpartum; safe while breastfeeding; 3-hr dosing window</li><li><strong>Combined OCP:</strong> Avoid &lt;6 wks (\u2191 VTE risk); avoid &lt;6 months if exclusively breastfeeding (estrogen suppresses lactation)</li><li><strong>Immediate postpartum IUD</strong> (within 10 min of placental delivery): LNG or copper; ~25% expulsion rate (vs interval insertion), but provides immediate LARC</li><li><strong>Implant (Nexplanon):</strong> Any time postpartum; 3 years; safe while breastfeeding</li><li><strong>Depo-Provera 150 mg IM:</strong> Any time postpartum; q12 wks; safe BF; delayed return to fertility</li></ul>' },

{ type: "labs", title: "6-Week Postpartum Labs",
  preview: "GDM \u2192 75g 2-hr OGTT at 4\u201312 wks (50% get T2DM in 10 yrs). TSH (postpartum thyroiditis ~5\u201310%). Pap if deferred.",
  detail: '<ul><li><strong>GDM follow-up (mandatory):</strong> 75g 2-hr OGTT at 4\u201312 wks postpartum; repeat annually if normal; 50% develop T2DM within 10 years</li><li><strong>TSH:</strong> Postpartum thyroiditis in ~5\u201310%; hyperthyroid phase wks 1\u20134 \u2192 hypothyroid phase wks 4\u20138 \u2192 often normalizes; may recur in future pregnancies</li><li><strong>CBC:</strong> if persistent fatigue, significant blood loss</li><li><strong>Hgb A1c + fasting glucose:</strong> long-term DM surveillance in prior GDM patients</li><li><strong>Pap smear:</strong> if deferred during pregnancy</li><li>BP: hypertensive disorders of pregnancy \u2192 \u2191 lifetime CVD risk; follow BP q1yr long-term</li></ul>' }

];

/* --- HELPERS --- */
function el(tag, cls, html) {
  var e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
}

/* --- BUILD WEEK RULER --- */
function buildRuler() {
  var ruler = document.getElementById("week-ruler");
  if (!ruler) return;
  var inner = el("div", "wr-inner");
  inner.id = "wr-inner";

  for (var wk = W0; wk <= W1; wk++) {
    var row = el("div", "wk-row");
    row.dataset.week = wk;
    var era = ERAS.find(function (e) { return e.start === wk; });
    if (era) {
      row.classList.add("era-start");
      var eraLabel = el("span", "wk-era", era.label);
      eraLabel.style.setProperty("--era-rows", era.end - era.start + 1);
      row.appendChild(el("span", "wk-num", String(wk)));
      row.appendChild(eraLabel);
    } else {
      row.appendChild(el("span", "wk-num", String(wk)));
    }
    inner.appendChild(row);
  }

  var ppRow = el("div", "wk-row era-start");
  var ppLabel = el("span", "wk-era", "Postpartum");
  ppLabel.style.setProperty("--era-rows", 8);
  ppRow.appendChild(el("span", "wk-num", "PP"));
  ppRow.appendChild(ppLabel);
  inner.appendChild(ppRow);

  ruler.appendChild(inner);
}

/* --- BUILD ERA BANDS --- */
function buildEraBands() {
  var overlay = document.getElementById("era-overlay");
  if (!overlay) return;
  ERAS.forEach(function (era) {
    var band = el("div", "era-band " + era.cls);
    band.style.top    = wY(era.start - W0) + "px";
    band.style.height = (era.end - era.start + 1) * PX + "px";
    overlay.appendChild(band);
  });
}

/* --- BUILD SPINE --- */
function buildSpine() {
  var spine = document.getElementById("spine");
  if (!spine) return;

  spine.style.height = (W1 - W0 + 1) * PX + "px";

  for (var wk = W0; wk <= W1; wk++) {
    var line = el("div", "week-line");
    line.style.top = wY(wk - W0) + "px";
    if (ERAS.some(function (e) { return e.start === wk; })) line.classList.add("era-start");
    spine.appendChild(line);
  }

  ERAS.forEach(function (era) {
    var lbl = el("div", "spine-era-label", era.label);
    lbl.id = era.id;
    lbl.style.top = wY(era.start - W0) + "px";
    spine.appendChild(lbl);
  });

  var occupied = { left: [], right: [] };
  var CARD_H = 125;
  var GAP = 6;

  var sorted = EVENTS.slice().sort(function (a, b) { return a.week - b.week; });
  sorted.forEach(function (ev) {
    var side = ev.side || "right";
    var top = wY(ev.week - W0);
    var occ = occupied[side];

    var tries = 0;
    while (tries < 80) {
      var bottom = top + CARD_H;
      var hit = occ.some(function (pair) { return top < pair[1] + GAP && bottom + GAP > pair[0]; });
      if (!hit) break;
      top += 10;
      tries++;
    }
    occ.push([top, top + CARD_H]);

    var wkLabel = Number.isInteger(ev.week)
      ? "Wk " + ev.week
      : "Wk " + Math.floor(ev.week) + "\u2013" + (Math.floor(ev.week) + 1);

    var eventEl = el("div", "event side-" + side);
    eventEl.dataset.type = ev.type;
    eventEl.style.top = top + "px";
    eventEl.innerHTML =
      '<div class="event-card">' +
        '<div class="event-wk-badge">' + wkLabel + '</div>' +
        '<div class="event-tag">' + (TYPE_LABELS[ev.type] || ev.type) + '</div>' +
        '<div class="event-title">' + ev.title + '</div>' +
        '<div class="event-preview">' + ev.preview + '</div>' +
        '<div class="event-more">\u2197 Details</div>' +
      '</div>';
    eventEl.addEventListener("click", (function (e) {
      return function () { openModal(e); };
    })(ev));
    spine.appendChild(eventEl);
  });
}

/* --- BUILD POSTPARTUM GRID --- */
function buildPP() {
  var grid = document.getElementById("pp-grid");
  if (!grid) return;
  PP_EVENTS.forEach(function (ev) {
    var card = el("div", "pp-card");
    card.dataset.type = ev.type;
    card.innerHTML =
      '<div class="event-tag">' + (TYPE_LABELS[ev.type] || ev.type) + '</div>' +
      '<div class="event-title">' + ev.title + '</div>' +
      '<div class="event-preview">' + ev.preview + '</div>';
    card.addEventListener("click", (function (e) {
      return function () { openModal(e); };
    })(ev));
    grid.appendChild(card);
  });
}

/* --- MODAL --- */
function openModal(ev) {
  document.getElementById("modal-tag").textContent   = TYPE_LABELS[ev.type] || ev.type;
  document.getElementById("modal-tag").style.color   = TYPE_COLORS[ev.type] || "#333";
  document.getElementById("modal-wk").textContent    = ev.week ? "Gestational Week " + ev.week : "";
  document.getElementById("modal-title").textContent = ev.title;
  document.getElementById("modal-body").innerHTML    = ev.detail;
  document.getElementById("modal").scrollTop         = 0;
  document.getElementById("overlay").classList.add("open");
}

function closeModal() {
  document.getElementById("overlay").classList.remove("open");
}

document.getElementById("modal-x").addEventListener("click", closeModal);
document.getElementById("overlay").addEventListener("click", function (e) {
  if (e.target === document.getElementById("overlay")) closeModal();
});
document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });

/* --- FILTER --- */
document.getElementById("filter-btns").addEventListener("click", function (e) {
  var btn = e.target.closest(".fbtn");
  if (!btn) return;
  document.querySelectorAll(".fbtn").forEach(function (b) { b.classList.remove("on"); });
  btn.classList.add("on");
  var type = btn.dataset.type;
  document.querySelectorAll(".event").forEach(function (ev) {
    ev.classList.toggle("filtered-out", type !== "all" && ev.dataset.type !== type);
  });
  document.querySelectorAll(".pp-card").forEach(function (card) {
    var hide = type !== "all" && card.dataset.type !== type;
    card.style.opacity       = hide ? "0.12" : "1";
    card.style.pointerEvents = hide ? "none" : "";
  });
});

/* --- RULER SYNC --- */
function syncRuler() {
  var inner     = document.getElementById("wr-inner");
  var spineWrap = document.getElementById("spine-wrap");
  var railHdr   = document.querySelector(".rail-header");
  if (!inner || !spineWrap || !railHdr) return;

  var railHdrH = railHdr.offsetHeight;

  function update() {
    var spineTop = spineWrap.getBoundingClientRect().top;
    var offset   = railHdrH - spineTop;
    inner.style.transform = "translateY(" + (-Math.max(0, offset)) + "px)";
  }

  window.addEventListener("scroll", update, { passive: true });
  update();
}

/* --- INIT --- */
window.addEventListener("load", function () {
  buildRuler();
  buildEraBands();
  buildSpine();
  buildPP();
  syncRuler();
});

})();
