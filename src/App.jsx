import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════
// DONNÉES — COURS GOGUENHEIM ISEN 3 2026
// ═══════════════════════════════════════════════════════════════

const EXAM_DATE = new Date("2026-04-27T10:00:00");

const CONSTANTS = [
  "ℏ = 1,055×10⁻³⁴ J·s",
  "h = 6,626×10⁻³⁴ J·s",
  "mₑ = 9,109×10⁻³¹ kg",
  "e = 1,602×10⁻¹⁹ C",
  "1 eV = 1,602×10⁻¹⁹ J",
  "ℏc = 197 eV·nm",
  "hc = 1240 eV·nm",
  "c = 3×10⁸ m/s",
];

const MODULES = [
  {
    id: 1, emoji: "⚡", color: "#f59e0b",
    title: "Photoélectrique & De Broglie",
    tag: "★★★ Toujours à l'exam",
    simple: `Imagine que la lumière c'est des petites balles (photons). Si tu en lances une sur un métal, elle peut arracher un électron — mais seulement si la balle est assez rapide (fréquence assez haute). En dessous d'un seuil : rien. Au-dessus : l'électron s'échappe.

De Broglie a ajouté le truc fou : les électrons se comportent aussi comme des ondes ! Chaque particule a une longueur d'onde λ = h/p associée.`,
    formulas: [
      { label: "Énergie du photon", f: "E = hν = hc/λ" },
      { label: "Photoélectrique (Einstein)", f: "Ec,max = hν − W" },
      { label: "Tension d'arrêt", f: "e|Vstop| = hν − W" },
      { label: "De Broglie ← h pas ℏ !", f: "λ = h/p = h/√(2mEc)" },
      { label: "Diffraction de Bragg", f: "2d·sinθ = nλ" },
      { label: "Compton", f: "Δλ = (h/mec)(1−cosθ)" },
    ],
    recipe: [
      "Écrire : Ec = hν − W (ou hc/λ − W)",
      "Convertir λ en m si en nm (×10⁻⁹)",
      "Convertir W en J si en eV (×1,6×10⁻¹⁹)",
      "Pour De Broglie : p = √(2mEc), puis λ = h/p",
      "Pour Bragg : 2d·sinθ = nλ → isoler",
      "Seuil : λs = hc/W (en dessous → rien)",
    ],
    trap: "⚠️ De Broglie : c'est h (6,626×10⁻³⁴), PAS ℏ (1,055×10⁻³⁴). Et θ dans Bragg est l'angle par rapport AU PLAN, pas à la normale.",
    exo: {
      q: "Lumière λ=200nm éclaire un métal de travail de sortie W=4,5eV. Calculer Ec,max. (h=6,626×10⁻³⁴ J·s, c=3×10⁸ m/s)",
      a: "E_photon = hc/λ = (6,626×10⁻³⁴ × 3×10⁸)/(200×10⁻⁹)\n= 9,939×10⁻¹⁹ J = 6,21 eV\n\nEc,max = 6,21 − 4,5 = 1,71 eV ✅\n\nAstuce : hc = 1240 eV·nm → E = 1240/200 = 6,2 eV directement !",
    },
  },
  {
    id: 2, emoji: "🌊", color: "#06b6d4",
    title: "Paquet d'ondes & Heisenberg",
    tag: "★★ Souvent en Q2/Q3",
    simple: `Une particule quantique c'est un "paquet" d'ondes : plein de vagues superposées qui forment une bosse localisée. 

Plus la bosse est serrée (Δx petit) → plus les fréquences sont étalées (Δk grand). C'est Heisenberg : tu ne peux pas connaître à la fois la position ET l'impulsion avec précision parfaite. Ce n'est pas une limite de l'instrument — c'est la nature elle-même.`,
    formulas: [
      { label: "Paquet d'ondes", f: "ψ(x,t) = ∫f(k)e^{i(kx−ωt)}dk" },
      { label: "Normalisation", f: "∫|ψ|²dx = 1" },
      { label: "Heisenberg position-impulsion", f: "Δx·Δp ≥ ℏ/2" },
      { label: "Heisenberg énergie-temps", f: "ΔE·Δt ≥ ℏ/2" },
      { label: "Vitesse de groupe", f: "vG = dω/dk|_{k₀} = p₀/m" },
      { label: "Transformée de Fourier", f: "f(k) = (1/2π)∫ψ(x)e^{−ikx}dx" },
    ],
    recipe: [
      "Normaliser ψ : ∫|ψ|²dx = 1 → trouver A",
      "Probabilité : P = ∫ₐᵇ|ψ|²dx",
      "TF : f(k) = (1/2π)∫ψ(x)e^{−ikx}dx",
      "Lire Δx sur le graphe (largeur du paquet)",
      "Δx·Δp ≥ ℏ/2 pour vérifier Heisenberg",
      "vG = dω/dk = vitesse classique de la particule",
    ],
    trap: "⚠️ Δx·Δk ≥ 1/2 (avec k) MAIS Δx·Δp ≥ ℏ/2 (avec p=ℏk). Les deux formes existent — ne pas les mélanger !",
    exo: {
      q: "ψ(x,0) = A pour −b ≤ x ≤ 3b, 0 ailleurs. (a) Trouver A. (b) Calculer la probabilité P que la particule soit dans [0,b].",
      a: "(a) ∫|ψ|²dx = A²×4b = 1\n    → A = 1/(2√b) ✅\n\n(b) P = ∫₀ᵇ A²dx = A²×b = b/(4b) = 1/4\n    → P = 25% ✅\n\nNote : le paquet est asymétrique (centré en x=b, pas en 0)",
    },
  },
  {
    id: 3, emoji: "🏠", color: "#10b981",
    title: "Puits infini 1D",
    tag: "★★★ Incontournable",
    simple: `Imagine une balle de ping-pong dans une boîte avec des murs en acier impossible à traverser. La balle rebondit, mais elle ne peut PAS être à l'extérieur (V=∞ hors de la boîte).

En quantique : l'électron dans cette boîte ne peut avoir que certaines énergies précises (comme les marches d'un escalier), pas n'importe quelle valeur. Plus la boîte est petite → plus les énergies sont grandes. Voilà la quantification !`,
    formulas: [
      { label: "TISE (équation à résoudre)", f: "−(ℏ²/2m)ψ'' + V(x)ψ = Eψ" },
      { label: "Vecteur d'onde", f: "k² = 2mE/ℏ²" },
      { label: "Niveaux d'énergie (n≥1 !)", f: "Eₙ = n²π²ℏ²/(2mL²)" },
      { label: "Fonctions d'onde normées", f: "ψₙ(x) = √(2/L)·sin(nπx/L)" },
      { label: "Évolution temporelle", f: "ψ(x,t) = Σcₙψₙe^{−iEₙt/ℏ}" },
      { label: "Valeur moyenne position", f: "⟨x⟩ = L/2,  ⟨p⟩ = 0" },
    ],
    recipe: [
      "TISE dans le puits (V=0) : ψ'' + k²ψ = 0",
      "Solution générale : ψ = A·sin(kx) + B·cos(kx)",
      "CL ψ(0)=0 → B = 0",
      "CL ψ(L)=0 → kL = nπ, n ≥ 1 (JAMAIS n=0 !)",
      "Eₙ = n²π²ℏ²/(2mL²)",
      "Normalisation → A = √(2/L)",
      "État superposé : P(Eₙ) = |cₙ|²,  ⟨E⟩ = Σ|cₙ|²Eₙ",
    ],
    trap: "⚠️ n=0 est INTERDIT (ψ ≡ 0, non physique). Le fondamental est n=1. Et n négatif = même chose que n positif (pas de nouvel état).",
    exo: {
      q: "Électron dans puits [0, L=1nm]. (a) Calculer E₁ et E₂ en eV. (b) État initial ψ = (ψ₁+ψ₂)/√2. Quelle est P(E₂) ? (ℏ=1,055×10⁻³⁴, mₑ=9,11×10⁻³¹)",
      a: "(a) E₁ = π²ℏ²/(2mL²) = π²×(1,055e-34)²/(2×9,11e-31×(1e-9)²)\n    = 6,02×10⁻²⁰ J = 0,376 eV\n    E₂ = 4×E₁ = 1,504 eV ✅\n\n(b) ψ = (1/√2)ψ₁ + (1/√2)ψ₂\n    c₂ = 1/√2\n    P(E₂) = |c₂|² = 1/2 = 50% ✅",
    },
  },
  {
    id: 4, emoji: "👻", color: "#8b5cf6",
    title: "Effet Tunnel & Puits fini",
    tag: "★★★ Très fréquent",
    simple: `Un ballon qui passe à travers un mur : impossible en physique classique. En quantique : il y a une probabilité non nulle ! C'est l'effet tunnel.

La fonction d'onde ne s'arrête pas brutalement au mur — elle décroît exponentiellement à l'intérieur. S'il reste assez de ψ de l'autre côté, la particule "passe". C'est la base des transistors modernes, des disques SSD et des microscopes STM.`,
    formulas: [
      { label: "Dans barrière (E<V₀) — RÉELLES !", f: "κ = √(2m(V₀−E))/ℏ" },
      { label: "T exact", f: "T = 1/[1+V₀²sinh²(κa)/(4E(V₀−E))]" },
      { label: "T approx (κa≫1)", f: "T ≈ 16(E/V₀)(1−E/V₀)·e^{−2κa}" },
      { label: "Conservation flux", f: "R + T = 1" },
      { label: "Puits fini (états pairs)", f: "k·tan(kL/2) = κ" },
      { label: "Puits fini (états impairs)", f: "k·cotan(kL/2) = −κ" },
    ],
    recipe: [
      "3 régions : I (x<0), II (0<x<a), III (x>a)",
      "Région I : ψ_I = Ae^{ik₁x} + Be^{−ik₁x}",
      "Région II : ψ_II = Ce^{κx} + De^{−κx} (RÉELLES !)",
      "Région III : ψ_III = Fe^{ik₁x} (transmise seulement)",
      "4 raccordements ψ et ψ' en x=0 et x=a",
      "T = |F/A|², R = |B/A|², vérifier R+T=1",
      "Si κa≫1 : T ≈ 16(E/V₀)(1−E/V₀)e^{−2κa}",
    ],
    trap: "⚠️ Dans la barrière (E<V₀) : e^{±κx} RÉELLES, JAMAIS e^{±ikx}. Erreur fatale qui annule tout le calcul !",
    exo: {
      q: "Barrière V₀=5eV, largeur a=0,5nm. Électron d'énergie E=1eV. Calculer κ puis estimer T.",
      a: "κ = √(2×9,11e-31×4×1,6e-19)/(1,055e-34)\n  = √(11,66e-49)/1,055e-34 ≈ 1,024×10¹⁰ m⁻¹\n\nκa = 1,024e10 × 0,5e-9 = 5,12 ≫ 1 → approx ok\n\nT ≈ 16×(1/5)×(4/5)×e^{−2×5,12}\n  = 2,56 × e^{−10,24} ≈ 2,56 × 3,56e-5\n  ≈ 9,1×10⁻⁵ ✅",
    },
  },
  {
    id: 5, emoji: "🎯", color: "#ef4444",
    title: "Formalisme Dirac & Mesure",
    tag: "★★★ Cœur du cours",
    simple: `L'état d'un système quantique est une "flèche" |ψ⟩ dans un espace abstrait (espace de Hilbert). Comme une direction dans un espace à N dimensions.

Une mesure = projeter cette flèche sur un axe. Tu obtiens TOUJOURS une valeur propre de l'observable (jamais la valeur moyenne), avec une probabilité |⟨φₙ|ψ⟩|². Après la mesure, la flèche s'effondre sur cet axe. C'est le "collapse du paquet d'ondes".`,
    formulas: [
      { label: "P1 : état", f: "|ψ⟩ ∈ ℋ (espace de Hilbert)" },
      { label: "P2 : observable", f: "Â hermitique : Â = Â⁺" },
      { label: "P3 : mesure → valeur propre", f: "Â|φₙ⟩ = aₙ|φₙ⟩" },
      { label: "P4 : Born (probabilité)", f: "P(aₙ) = |⟨φₙ|ψ⟩|²" },
      { label: "P5 : après mesure aₙ", f: "|ψ'⟩ = P̂ₙ|ψ⟩/‖P̂ₙ|ψ⟩‖" },
      { label: "P6 : évolution", f: "iℏ d|ψ⟩/dt = Ĥ|ψ⟩" },
      { label: "Valeur moyenne", f: "⟨Â⟩ = ⟨ψ|Â|ψ⟩ = Σaₙ|cₙ|²" },
      { label: "Commutateur", f: "[Â,B̂] = ÂB̂ − B̂Â" },
    ],
    recipe: [
      "Décomposer : |ψ⟩ = Σcₙ|φₙ⟩ avec cₙ = ⟨φₙ|ψ⟩",
      "Vérifier normalisation : Σ|cₙ|² = 1",
      "P(aₙ) = |cₙ|² (ATTENTION : |c|² = c*×c, pas c²)",
      "⟨Â⟩ = Σaₙ|cₙ|² (constant si Ĥ commute avec Â)",
      "Après mesure aₙ → état = |φₙ⟩ (réduction)",
      "Évolution : cₙ(t) = cₙ(0)×e^{−iEₙt/ℏ}",
      "[Â,B̂]=0 → mesures simultanées possibles, base commune",
    ],
    trap: "⚠️ On mesure TOUJOURS une valeur propre aₙ, JAMAIS ⟨A⟩. Et |cₙ|² ≠ cₙ² si cₙ est complexe ! |cₙ|² = cₙ*×cₙ. Les probabilités sont indépendantes du temps même si |ψ(t)⟩ évolue.",
    exo: {
      q: "|ψ⟩ = (1/√2)|1⟩ + (i/√2)|2⟩ avec E₁=1eV, E₂=3eV. (a) Vérifier la normalisation. (b) P(E₁), P(E₂) ? (c) ⟨E⟩ ?",
      a: "(a) |1/√2|² + |i/√2|² = 1/2 + 1/2 = 1 ✅\n    (Note : |i/√2|² = |i|²/2 = 1/2)\n\n(b) P(E₁) = |c₁|² = 1/2\n    P(E₂) = |c₂|² = |i/√2|² = 1/2 ✅\n\n(c) ⟨E⟩ = 1×(1/2) + 3×(1/2) = 2 eV ✅",
    },
  },
  {
    id: 6, emoji: "🧲", color: "#f97316",
    title: "Spin ½ & Stern-Gerlach",
    tag: "★★ Fin du cours",
    simple: `Le spin c'est une propriété intrinsèque de l'électron — comme une "rotation sur lui-même" mais sans analogue classique. Il ne peut prendre que deux valeurs : +ℏ/2 (↑) ou −ℏ/2 (↓).

Dans Stern-Gerlach : atomes dans un champ magnétique inhomogène. Classiquement → tache étalée. En quantique → exactement 2 taches. Preuve que le spin est quantifié. Et si tu mesures Sz puis Sx : la mesure de Sx détruit l'info sur Sz car [Sz,Sx] ≠ 0.`,
    formulas: [
      { label: "État général spin ½", f: "|ψ⟩ = a|+z⟩ + b|−z⟩,  |a|²+|b|²=1" },
      { label: "Ŝz (diagonale)", f: "Ŝz = (ℏ/2)[[1,0],[0,−1]]" },
      { label: "Ŝx", f: "Ŝx = (ℏ/2)[[0,1],[1,0]]" },
      { label: "Ŝy", f: "Ŝy = (ℏ/2)[[0,−i],[i,0]]" },
      { label: "États propres Ŝx", f: "|+x⟩=(|+⟩+|−⟩)/√2,  |−x⟩=(|+⟩−|−⟩)/√2" },
      { label: "Direction n(θ,φ) — θ/2 !!!", f: "|+n⟩=cos(θ/2)|+⟩+e^{iφ}sin(θ/2)|−⟩" },
    ],
    recipe: [
      "|ψ⟩ = a|+z⟩ + b|−z⟩, vérifier |a|²+|b|²=1",
      "Mesure Sz : P(+ℏ/2)=|a|², P(−ℏ/2)=|b|²",
      "Après mesure Sz=+ℏ/2 → état = |+z⟩",
      "Décomposer dans base Sx : |+z⟩=(|+x⟩+|−x⟩)/√2",
      "Mesure Sx sur |+z⟩ : P(±ℏ/2) = 1/2 toujours",
      "Écran P après R₁+R₂ : 4 taches, colonnes x : I₀/2 chacune",
      "[Sz,Sx]≠0 → mesurer Sx détruit l'info sur Sz",
    ],
    trap: "⚠️ |+n⟩=cos(θ/2)|+⟩+sin(θ/2)|−⟩ : c'est θ/2, PAS θ ! Erreur qui coûte tous les points. Et les intensités colonnes x valent TOUJOURS I₀/2 quel que soit l'état initial.",
    exo: {
      q: "|ψ⟩ = (√3/2)|+z⟩ + (1/2)|−z⟩. (a) Normalisation ? (b) P(Sz=+ℏ/2) ? (c) Après mesure Sz=+ℏ/2, on mesure Sx. P(Sx=+ℏ/2) ?",
      a: "(a) |√3/2|²+|1/2|² = 3/4+1/4 = 1 ✅\n\n(b) P(Sz=+ℏ/2) = |√3/2|² = 3/4 ✅\n\n(c) Après mesure Sz=+ℏ/2 → état = |+z⟩\n    |+z⟩ = (|+x⟩+|−x⟩)/√2\n    P(Sx=+ℏ/2) = |⟨+x|+z⟩|² = |1/√2|² = 1/2 ✅\n    (toujours 1/2, indépendant de l'état initial !)",
    },
  },
];

const SCHEDULE = [
  // Samedi
  { day: 0, time: "08h00", label: "Petit-déj, café, téléphone dans une autre pièce", icon: "☕", xp: 0 },
  { day: 0, time: "08h30", label: "Survol rapide Lectures 1-2 (histoire + De Broglie)", icon: "📖", xp: 10 },
  { day: 0, time: "09h00", label: "Survol Lectures 3-4 (Dirac + Heisenberg)", icon: "📖", xp: 10 },
  { day: 0, time: "09h30", label: "Survol Lectures 5-6 (spin + moment cinétique)", icon: "📖", xp: 10 },
  { day: 0, time: "10h00", label: "☕ Pause active — marche 20min sans écran", icon: "🚶", xp: 0 },
  { day: 0, time: "10h30", label: "RECETTE 3 — Puits infini : lire + corriger Ex.IV", icon: "🏠", xp: 20 },
  { day: 0, time: "11h00", label: "RECETTE 3 — Refaire sans regarder", icon: "✏️", xp: 30 },
  { day: 0, time: "11h30", label: "RECETTE 1 — Photoélectrique : lire + corriger Ex.I", icon: "⚡", xp: 20 },
  { day: 0, time: "12h00", label: "RECETTE 1 — Refaire sans regarder", icon: "✏️", xp: 30 },
  { day: 0, time: "12h30", label: "🍽️ Déjeuner + sieste 20min (alarme !)", icon: "😴", xp: 0 },
  { day: 0, time: "13h30", label: "RECETTE 5 — Dirac/Mesure : lire + corriger Ex.VII", icon: "🎯", xp: 20 },
  { day: 0, time: "14h00", label: "RECETTE 5 — Refaire sans regarder", icon: "✏️", xp: 30 },
  { day: 0, time: "14h30", label: "☕ Pause eau + snack (dernier café de la journée)", icon: "💧", xp: 0 },
  { day: 0, time: "15h00", label: "Feuille A4 RECTO — Zones 1 à 4 au crayon", icon: "📝", xp: 40 },
  { day: 0, time: "16h00", label: "Feuille A4 RECTO — Recopier au stylo, définitive", icon: "✒️", xp: 20 },
  { day: 0, time: "17h00", label: "🍽️ Dîner — AUCUN écran stimulant", icon: "🌙", xp: 0 },
  { day: 0, time: "18h30", label: "Recall à blanc — 10 formules top de mémoire", icon: "🧠", xp: 30 },
  { day: 0, time: "19h00", label: "Recall à blanc — Recettes 1, 3, 5 de mémoire", icon: "🧠", xp: 30 },
  { day: 0, time: "19h30", label: "Revoir les points qui ont bloqué", icon: "🔍", xp: 15 },
  { day: 0, time: "22h00", label: "🛌 SOMMEIL 9H — NON NÉGOCIABLE", icon: "💤", xp: 0, mandatory: true },
  // Dimanche
  { day: 1, time: "07h00", label: "Réveil, petit-déj, relecture feuille A4 (10min)", icon: "☀️", xp: 0 },
  { day: 1, time: "08h00", label: "RECETTE 4 — Effet tunnel : lire + exercice", icon: "👻", xp: 20 },
  { day: 1, time: "08h30", label: "RECETTE 4 — Refaire sans regarder", icon: "✏️", xp: 30 },
  { day: 1, time: "09h00", label: "RECETTE 2 — Paquet d'ondes : lire + exercice", icon: "🌊", xp: 20 },
  { day: 1, time: "09h30", label: "RECETTE 2 — Refaire sans regarder", icon: "✏️", xp: 30 },
  { day: 1, time: "10h00", label: "☕ Pause eau + snack", icon: "💧", xp: 0 },
  { day: 1, time: "10h30", label: "RECETTE 6 — Stern-Gerlach : lire + corriger Ex.XI", icon: "🧲", xp: 20 },
  { day: 1, time: "11h00", label: "RECETTE 6 — Refaire sans regarder", icon: "✏️", xp: 30 },
  { day: 1, time: "11h30", label: "Revoir commutateurs (point de blocage fréquent)", icon: "🔄", xp: 20 },
  { day: 1, time: "12h00", label: "🍽️ Déjeuner + sieste 20min", icon: "😴", xp: 0 },
  { day: 1, time: "13h00", label: "Feuille A4 VERSO — Zones 5 à 9 au stylo", icon: "📝", xp: 50 },
  { day: 1, time: "14h30", label: "☕ Pause 30min", icon: "🚶", xp: 0 },
  { day: 1, time: "15h00", label: "⏱️ SIMULATION 2H — Polycopié TD, calculatrice, feuille A4", icon: "🏆", xp: 100 },
  { day: 1, time: "17h00", label: "Correction simulation + identifier 3 erreurs costaud", icon: "🔍", xp: 30 },
  { day: 1, time: "18h00", label: "Fiche pièges personnels sur la feuille A4", icon: "⚠️", xp: 20 },
  { day: 1, time: "19h30", label: "Recall final — lire A4 à voix haute + restituer", icon: "🗣️", xp: 20 },
  { day: 1, time: "20h00", label: "Préparer sac : stylos×3, calculatrice, ID, convocation", icon: "🎒", xp: 0 },
  { day: 1, time: "22h00", label: "🛌 SOMMEIL 9H — AUCUNE RÉVISION APRÈS", icon: "💤", xp: 0, mandatory: true },
  // Lundi
  { day: 2, time: "07h00", label: "Réveil, douche, petit-déj complet (banane+avoine)", icon: "🍌", xp: 0 },
  { day: 2, time: "07h30", label: "2 cafés avec nourriture (dernier café avant exam)", icon: "☕", xp: 0 },
  { day: 2, time: "08h00", label: "Relecture calme A4 — AUCUN nouvel exercice", icon: "👁️", xp: 0 },
  { day: 2, time: "09h00", label: "Trajet — arriver 20min avant", icon: "🚶", xp: 0 },
  { day: 2, time: "10h00", label: "✍️ EXAMEN 2H — Bonne chance !", icon: "🏆", xp: 0, isExam: true },
];

const FORMULA_ZONES = [
  {
    title: "Zone 1 — Constantes",
    color: "#64748b",
    items: ["ℏ = 1,055×10⁻³⁴ J·s", "h = 6,626×10⁻³⁴ J·s", "mₑ = 9,109×10⁻³¹ kg", "e = 1,602×10⁻¹⁹ C", "1 eV = 1,602×10⁻¹⁹ J", "ℏc = 197 eV·nm  |  hc = 1240 eV·nm"],
  },
  {
    title: "Zone 2 — Dualité",
    color: "#f59e0b",
    items: ["E = hν = hc/λ", "Ec = hν − W (photoélectrique)", "e|Vstop| = hν − W", "λ = h/p = h/√(2mEc)  ← h pas ℏ !", "2d·sinθ = nλ (Bragg, θ/plan)", "Δλ = (h/mec)(1−cosθ) (Compton)"],
  },
  {
    title: "Zone 3 — Paquet d'ondes",
    color: "#06b6d4",
    items: ["ψ(x,t) = ∫f(k)e^{i(kx−ωt)}dk", "∫|ψ|²dx = 1  (normalisation)", "Δx·Δk ≥ 1/2  ↔  Δx·Δp ≥ ℏ/2", "vG = dω/dk|_{k₀} = p₀/m", "f(k) = (1/2π)∫ψ(x)e^{−ikx}dx"],
  },
  {
    title: "Zone 4 — Schrödinger",
    color: "#10b981",
    items: ["TDSE : iℏ∂ψ/∂t = Ĥψ", "TISE : −(ℏ²/2m)ψ'' + Vψ = Eψ", "Ĥ = −(ℏ²/2m)Δ + V̂(r)", "p̂ = −iℏ∂/∂x   [x̂,p̂] = iℏ", "ψ(x,t) = Σcₙψₙe^{−iEₙt/ℏ}", "ψ continue, ψ' continue si V fini"],
  },
  {
    title: "Zone 5 — Puits infini [0,L]",
    color: "#10b981",
    items: ["Eₙ = n²π²ℏ²/(2mL²)  n=1,2,3... (0 interdit!)", "ψₙ = √(2/L)·sin(nπx/L)", "⟨x⟩ = L/2   ⟨p⟩ = 0", "⟨p²⟩ = n²π²ℏ²/L²", "P(Eₙ) = |cₙ|²,  ⟨E⟩ = Σ|cₙ|²Eₙ"],
  },
  {
    title: "Zone 6 — Tunnel & Puits fini",
    color: "#8b5cf6",
    items: ["κ = √(2m(V₀−E))/ℏ  (RÉEL dans barrière)", "T = 1/[1+V₀²sinh²(κa)/(4E(V₀−E))]", "T ≈ 16(E/V₀)(1−E/V₀)e^{−2κa}  si κa≫1", "R + T = 1", "Puits fini pair : k·tan(kL/2) = κ", "Puits fini impair : k·cotan(kL/2) = −κ"],
  },
  {
    title: "Zone 7 — 6 Postulats Dirac",
    color: "#ef4444",
    items: ["P1: état = |ψ⟩ ∈ ℋ", "P2: grandeur physique → Â hermitique", "P3: mesure → valeur propre aₙ de Â", "P4: P(aₙ) = |⟨φₙ|ψ⟩|²", "P5: après mesure → |ψ'⟩ = projection normée", "P6: iℏd|ψ⟩/dt = Ĥ|ψ⟩", "Fermeture : Σ|φₙ⟩⟨φₙ| = 𝟙"],
  },
  {
    title: "Zone 8 — Mesures & Heisenberg",
    color: "#f59e0b",
    items: ["⟨Â⟩ = ⟨ψ|Â|ψ⟩ = Σaₙ|cₙ|²", "(ΔA)² = ⟨Â²⟩ − ⟨Â⟩²", "ΔA·ΔB ≥ ½|⟨[Â,B̂]⟩|", "[x̂,p̂] = iℏ → Δx·Δp ≥ ℏ/2", "ECOC : [Â,B̂]=0 ↔ base propre commune"],
  },
  {
    title: "Zone 9 — Spin ½ & PIÈGES",
    color: "#f97316",
    items: ["Ŝz=ℏ/2·[[1,0],[0,−1]]  Ŝx=ℏ/2·[[0,1],[1,0]]", "Ŝy=ℏ/2·[[0,−i],[i,0]]", "|+x⟩=(|+⟩+|−⟩)/√2   |−x⟩=(|+⟩−|−⟩)/√2", "|+n⟩=cos(θ/2)|+⟩+e^{iφ}sin(θ/2)|−⟩  [θ/2!]", "⚠️ h≠ℏ  ⚠️ n≥1  ⚠️ θ/2  ⚠️ |c|²=c*c  ⚠️ κ réel"],
  },
];

const TRAPS = [
  { n: 1, trap: "h vs ℏ", detail: "De Broglie : h (6,626e-34). Schrödinger : ℏ (1,055e-34)." },
  { n: 2, trap: "eV → J oublié", detail: "Toujours ×1,6×10⁻¹⁹ avant p=√(2mE)." },
  { n: 3, trap: "n=0 interdit puits infini", detail: "ψ₀ ≡ 0, non physique. Fondamental = n=1." },
  { n: 4, trap: "θ/2 dans spin", detail: "|+n⟩=cos(θ/2)|+⟩+... C'est θ/2, pas θ !" },
  { n: 5, trap: "|c|² ≠ c²", detail: "Si c=a+ib : |c|²=a²+b². Jamais c² tout seul." },
  { n: 6, trap: "Exponentielles dans barrière", detail: "E<V₀ → e^{±κx} RÉELLES, jamais e^{±ikx}." },
  { n: 7, trap: "θ Bragg = angle/plan", detail: "θ par rapport AU PLAN réticulaire, pas à la normale." },
  { n: 8, trap: "Mesure ≠ valeur moyenne", detail: "On mesure une valeur propre aₙ, jamais ⟨A⟩." },
  { n: 9, trap: "R+T = 1 oublié", detail: "Vérification systématique pour l'effet tunnel." },
  { n: 10, trap: "ψ' discontinue seulement si V=∞", detail: "Si V=V₀ fini → ψ et ψ' toutes deux continues." },
];

// ═══════════════════════════════════════════════════════════════
// APP PRINCIPALE
// ═══════════════════════════════════════════════════════════════

export default function QuantumCoach() {
  const [tab, setTab] = useState("dashboard");
  const [countdown, setCountdown] = useState({ h: 0, m: 0, s: 0, total: 1 });
  const [moduleIdx, setModuleIdx] = useState(0);
  const [moduleTab, setModuleTab] = useState("simple");
  const [showAnswer, setShowAnswer] = useState(false);
  const [checkedSlots, setCheckedSlots] = useState({});
  const [xp, setXp] = useState(0);
  const [focusMin, setFocusMin] = useState(25);
  const [focusSec, setFocusSec] = useState(0);
  const [focusRunning, setFocusRunning] = useState(false);
  const [focusTotal] = useState(25 * 60);
  const [parkingOpen, setParkingOpen] = useState(false);
  const [parkingText, setParkingText] = useState("");
  const [parkingList, setParkingList] = useState([]);
  const [scheduleDay, setScheduleDay] = useState(0);
  const [formulaZone, setFormulaZone] = useState(0);
  const [chat, setChat] = useState([{
    role: "assistant",
    content: "👋 Salut ! Je suis ton coach MQ. Pose-moi n'importe quelle question sur le cours de Goguenheim — formule, recette, exercice qui bloque. Je réponds simple + formule + exemple. Go ! 🚀"
  }]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [simRunning, setSimRunning] = useState(false);
  const [simSec, setSimSec] = useState(120 * 60);
  const [simAnswer, setSimAnswer] = useState("");
  const [simDone, setSimDone] = useState(false);
  const [simExoIdx, setSimExoIdx] = useState(0);
  const chatEndRef = useRef(null);
  const focusRef = useRef(null);
  const simRef = useRef(null);

  // Countdown
  useEffect(() => {
    const tick = () => {
      const diff = EXAM_DATE - new Date();
      if (diff <= 0) { setCountdown({ h: 0, m: 0, s: 0, total: 0 }); return; }
      setCountdown({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
        total: diff,
      });
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  // Focus timer
  useEffect(() => {
    if (focusRunning) {
      focusRef.current = setInterval(() => {
        setFocusMin(m => {
          setFocusSec(s => {
            if (s === 0 && m === 0) {
              clearInterval(focusRef.current);
              setFocusRunning(false);
              setParkingOpen(true);
              return 0;
            }
            if (s === 0) return 59;
            return s - 1;
          });
          setFocusSec(prev => {
            if (prev === 0 && m > 0) return 59;
            return prev;
          });
          return s => s === 0 && m > 0 ? m - 1 : m;
        });
        setFocusSec(s => s === 0 ? 59 : s - 1);
        setFocusMin(m => {
          if (focusSec === 0 && m > 0) return m - 1;
          return m;
        });
      }, 1000);
    } else clearInterval(focusRef.current);
    return () => clearInterval(focusRef.current);
  }, [focusRunning]);

  // Simplify focus timer
  const [focusRemain, setFocusRemain] = useState(25 * 60);
  useEffect(() => {
    if (focusRunning) {
      const t = setInterval(() => {
        setFocusRemain(r => {
          if (r <= 1) {
            clearInterval(t);
            setFocusRunning(false);
            setParkingOpen(true);
            return 25 * 60;
          }
          return r - 1;
        });
      }, 1000);
      return () => clearInterval(t);
    }
  }, [focusRunning]);

  // Sim timer
  useEffect(() => {
    if (simRunning) {
      simRef.current = setInterval(() => {
        setSimSec(s => {
          if (s <= 1) {
            clearInterval(simRef.current);
            setSimRunning(false);
            setSimDone(true);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else clearInterval(simRef.current);
    return () => clearInterval(simRef.current);
  }, [simRunning]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chat]);

  const sendChat = async () => {
  if (!chatInput.trim() || chatLoading) return;
  const msg = chatInput.trim();
  setChatInput("");
  setChat(c => [...c, { role: "user", content: msg }]);
  setChatLoading(true);
  
  const GEMINI_KEY = "AIzaSyDni3sKtIyG1sdIXMm9n-VASKyut1452po"; // ← ici
  
  try {
    const history = chat.map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: `Tu es le coach MQ de cet étudiant ISEN 3 pour l'exam Goguenheim du lundi 27/04/2026. Il part de ZÉRO et a moins de 48h. Profil : procrastinateur, distrait.

Réponds TOUJOURS dans cet ordre :
1. Analogie concrète ultra-simple (style enfant 10 ans, 2 phrases max)
2. La formule exacte à appliquer
3. Mini-exemple numérique si possible

Sois CONCIS (200 mots max), encourageant, utilise des émojis.
Programme : E=hν−W, De Broglie λ=h/p, paquet d'ondes Δx·Δp≥ℏ/2, TISE, puits infini Eₙ=n²π²ℏ²/(2mL²), effet tunnel, postulats Dirac, spin ½ matrices Pauli, Stern-Gerlach.` }]
          },
          contents: [...history, { role: "user", parts: [{ text: msg }] }],
          generationConfig: { maxOutputTokens: 600 }
        })
      }
    );
    const data = await res.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "❌ Erreur Gemini.";
    setChat(c => [...c, { role: "assistant", content: reply }]);
  } catch {
    setChat(c => [...c, { role: "assistant", content: "❌ Vérifie ta clé API." }]);
  }
  setChatLoading(false);
};

  const checkSlot = (id, slotXp) => {
    if (!checkedSlots[id]) setXp(x => x + slotXp);
    else setXp(x => x - slotXp);
    setCheckedSlots(s => ({ ...s, [id]: !s[id] }));
  };

  const fmtTime = (sec) => `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;
  const focusPct = ((focusRemain) / (25 * 60)) * 100;
  const r = 45;
  const circ = 2 * Math.PI * r;
  const stroke = circ - (focusPct / 100) * circ;

  const SIM_EXOS = [
    {
      title: "Exercice I — Photoélectrique & De Broglie",
      q: "Une source UV de longueur d'onde λ=150nm éclaire une plaque de Césium (W=2,1eV). \n1. Calculer l'énergie cinétique maximale Ec des électrons émis.\n2. Calculer leur vitesse maximale.\n3. Calculer leur longueur d'onde de De Broglie.\n(h=6,626×10⁻³⁴ J·s, c=3×10⁸ m/s, mₑ=9,11×10⁻³¹ kg, 1eV=1,6×10⁻¹⁹J)",
      a: "1) E = hc/λ = 1240/150 = 8,27 eV\n   Ec = 8,27 − 2,1 = 6,17 eV = 9,87×10⁻¹⁹ J ✅\n\n2) v = √(2Ec/mₑ) = √(2×9,87e-19/9,11e-31)\n   = √(2,167e12) = 1,47×10⁶ m/s ✅\n\n3) p = mₑ×v = 9,11e-31 × 1,47e6 = 1,339×10⁻²⁴ kg·m/s\n   λ_dB = h/p = 6,626e-34/1,339e-24 = 4,95×10⁻¹⁰ m = 0,495 nm ✅",
    },
    {
      title: "Exercice IV — Puits infini",
      q: "Électron dans un puits infini [0, L=0,5nm].\n1. Donner les 3 premiers niveaux d'énergie E₁, E₂, E₃ en eV.\n2. L'état initial est |ψ⟩ = (√3/2)|ψ₁⟩ + (1/2)|ψ₂⟩.\n   a) Vérifier la normalisation.\n   b) Calculer P(E₁) et P(E₂).\n   c) Calculer ⟨E⟩.\n(ℏ=1,055×10⁻³⁴, mₑ=9,11×10⁻³¹)",
      a: "1) E₁ = π²ℏ²/(2mL²) = π²×(1,055e-34)²/(2×9,11e-31×(0,5e-9)²)\n   = 2,41×10⁻¹⁹ J = 1,506 eV\n   E₂ = 4E₁ = 6,02 eV\n   E₃ = 9E₁ = 13,6 eV ✅\n\n2a) |√3/2|²+|1/2|² = 3/4+1/4 = 1 ✅\n\n2b) P(E₁) = |√3/2|² = 3/4 = 75%\n    P(E₂) = |1/2|² = 1/4 = 25% ✅\n\n2c) ⟨E⟩ = (3/4)×1,506 + (1/4)×6,02\n    = 1,130 + 1,505 = 2,63 eV ✅",
    },
    {
      title: "Exercice VII — Opérateurs & Mesure",
      q: "Espace à 2 états {|1⟩,|2⟩}. Observable Â avec valeurs propres a₁=1eV, a₂=3eV.\nÉtat initial : |ψ⟩ = (|1⟩+i|2⟩)/√2\n1. Vérifier la normalisation.\n2. Calculer P(a₁) et P(a₂).\n3. Calculer ⟨Â⟩ et ΔA.\n4. On mesure Â et on obtient a₁. Quel est l'état après la mesure ?",
      a: "1) |1/√2|²+|i/√2|² = 1/2+1/2 = 1 ✅\n\n2) P(a₁) = |⟨1|ψ⟩|² = |1/√2|² = 1/2\n   P(a₂) = |⟨2|ψ⟩|² = |i/√2|² = 1/2 ✅\n\n3) ⟨Â⟩ = (1/2)×1 + (1/2)×3 = 2 eV\n   ⟨Â²⟩ = (1/2)×1 + (1/2)×9 = 5 eV²\n   (ΔA)² = 5−4 = 1 → ΔA = 1 eV ✅\n\n4) Résultat a₁ → état = |1⟩ (réduction, projection sur |1⟩) ✅",
    },
    {
      title: "Exercice XI — Stern-Gerlach Spin ½",
      q: "Particules spin ½ dans l'état |Ψ⟩ = (1/2)|+z⟩ + (√3/2)|−z⟩.\nRégion R₁ : mesure de Sz. Région R₂ : mesure de Sx.\n1. Vérifier la normalisation.\n2. Écran après R₁ : combien de taches ? Intensités ?\n3. Calculer les vecteurs propres |±x⟩ en fonction de |±z⟩.\n4. Écran P après R₁+R₂ : combien de taches ? Intensités totales des colonnes x ?",
      a: "1) |1/2|²+|√3/2|² = 1/4+3/4 = 1 ✅\n\n2) 2 taches selon z :\n   I₊z = |1/2|²×I₀ = I₀/4\n   I₋z = |√3/2|²×I₀ = 3I₀/4 ✅\n\n3) |+x⟩ = (|+z⟩+|−z⟩)/√2\n   |−x⟩ = (|+z⟩−|−z⟩)/√2 ✅\n\n4) 4 taches sur écran P (2z × 2x)\n   Colonne x>0 : I = (1/4+3/4)×I₀/2 = I₀/2\n   Colonne x<0 : I = I₀/2\n   TOUJOURS I₀/2 indépendant de l'état initial ! ✅",
    },
  ];

  const cdColor = countdown.total < 1800000 ? "#ef4444" : countdown.total < 3600000 ? "#f59e0b" : "#f59e0b";
  const lvl = Math.floor(xp / 100) + 1;
  const xpInLvl = xp % 100;

  // ═══ RENDER ═══════════════════════════════════════════════════
  return (
    <div style={{
      minHeight: "100vh",
      background: "#07070f",
      color: "#e2d9c8",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* HEADER */}
      <div style={{
        background: "linear-gradient(180deg, #0d0d1f 0%, #070710 100%)",
        borderBottom: "1px solid #1a1a30",
        padding: "14px 20px 0",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
          <div>
            <div style={{ fontSize: 10, color: "#4a5568", letterSpacing: 3, textTransform: "uppercase" }}>ISEN 3 · Goguenheim · 2026</div>
            <div style={{ fontSize: 20, fontWeight: "bold", color: "#f0e8d8", letterSpacing: 0.5 }}>⚛ Quantum Coach</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 9, color: "#4a5568", letterSpacing: 2, textTransform: "uppercase" }}>EXAM LUN 27/04 · 10H00</div>
            <div style={{ fontFamily: "monospace", fontSize: 22, fontWeight: "bold", color: cdColor, letterSpacing: 2, lineHeight: 1 }}>
              {countdown.total <= 0 ? "EXAMEN !" : `${countdown.h}h ${String(countdown.m).padStart(2,"0")}m ${String(countdown.s).padStart(2,"0")}s`}
            </div>
          </div>
        </div>

        {/* XP Bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: "#f59e0b", fontFamily: "monospace", minWidth: 60 }}>Niv.{lvl} · {xp}XP</div>
          <div style={{ flex: 1, height: 4, background: "#1a1a2e", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ width: `${xpInLvl}%`, height: "100%", background: "linear-gradient(90deg, #f59e0b, #fbbf24)", borderRadius: 2, transition: "width 0.5s" }} />
          </div>
        </div>

        {/* TABS */}
        <div style={{ display: "flex", gap: 2, overflowX: "auto" }}>
          {[["dashboard","📊","Dashboard"],["schedule","🗓️","Planning"],["modules","📚","Modules"],["a4","📄","Fiche A4"],["simulator","⏱️","Exam"],["chat","💬","Coach IA"]].map(([id,ic,lb]) => (
            <button key={id} onClick={() => setTab(id)} style={{
              padding: "8px 12px", border: "none", cursor: "pointer", fontSize: 12,
              fontFamily: "inherit", whiteSpace: "nowrap", borderRadius: "6px 6px 0 0",
              background: tab === id ? "#12121f" : "transparent",
              color: tab === id ? "#f59e0b" : "#4a5568",
              borderBottom: tab === id ? "2px solid #f59e0b" : "2px solid transparent",
              fontWeight: tab === id ? "bold" : "normal",
            }}>{ic} {lb}</button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, padding: 16, maxWidth: 860, width: "100%", margin: "0 auto" }}>

        {/* ── DASHBOARD ──────────────────────────────── */}
        {tab === "dashboard" && (
          <div>
            {/* NOW WIDGET */}
            <div style={{ background: "linear-gradient(135deg, #1a1a2e, #0d0d1f)", border: "1px solid #f59e0b44", borderRadius: 14, padding: 18, marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: "#f59e0b", letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>🎯 MAINTENANT TU FAIS ÇA</div>
              {(() => {
                const now = new Date();
                const h = now.getHours(), mi = now.getMinutes();
                const nowMin = h * 60 + mi;
                const dayMap = { 0: 26, 1: 27 };
                const todayDate = now.getDate();
                const todayDay = Object.entries(dayMap).find(([, d]) => d === todayDate);
                const dayIdx = todayDay ? Number(todayDay[0]) : (now.getDay() === 1 ? 2 : null);
                const todaySlots = SCHEDULE.filter(s => s.day === (dayIdx ?? 0));
                const parseTime = t => { const [hh, mm] = t.split("h").map(Number); return hh * 60 + (mm || 0); };
                const current = todaySlots.find((s, i) => {
                  const st = parseTime(s.time);
                  const en = i < todaySlots.length - 1 ? parseTime(todaySlots[i + 1].time) : 24 * 60;
                  return nowMin >= st && nowMin < en;
                });
                return current ? (
                  <div>
                    <div style={{ fontSize: 22, marginBottom: 4 }}>{current.icon}</div>
                    <div style={{ fontSize: 16, fontWeight: "bold", color: "#f0e8d8" }}>{current.label}</div>
                    <div style={{ fontSize: 12, color: "#4a5568", marginTop: 4, fontFamily: "monospace" }}>{current.time}</div>
                  </div>
                ) : (
                  <div style={{ color: "#4a5568", fontSize: 14 }}>Ouvre le planning pour voir ta prochaine tâche →</div>
                );
              })()}
            </div>

            {/* CARDS */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10, marginBottom: 14 }}>
              {[
                { t: "Planning 48h", s: "Heure par heure", i: "🗓️", c: "#06b6d4", a: () => setTab("schedule") },
                { t: "6 Modules", s: "Recettes à maîtriser", i: "📚", c: "#10b981", a: () => setTab("modules") },
                { t: "Fiche A4", s: "9 zones à recopier", i: "📄", c: "#8b5cf6", a: () => setTab("a4") },
                { t: "Simulateur 2h", s: "Exam en conditions réelles", i: "⏱️", c: "#ef4444", a: () => setTab("simulator") },
              ].map(card => (
                <button key={card.t} onClick={card.a} style={{
                  background: "#0d0d1f", border: `1px solid ${card.c}33`, borderRadius: 12,
                  padding: "14px 12px", cursor: "pointer", textAlign: "left",
                  color: "inherit", fontFamily: "inherit",
                }} onMouseOver={e => e.currentTarget.style.borderColor = card.c}
                  onMouseOut={e => e.currentTarget.style.borderColor = `${card.c}33`}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{card.i}</div>
                  <div style={{ fontWeight: "bold", color: card.c, fontSize: 13 }}>{card.t}</div>
                  <div style={{ fontSize: 11, color: "#4a5568", marginTop: 2 }}>{card.s}</div>
                </button>
              ))}
            </div>

            {/* FOCUS TIMER */}
            <div style={{ background: "#0d0d1f", border: "1px solid #1a1a30", borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: "#4a5568", letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>⏱ FOCUS TIMER (POMODORO 25 MIN)</div>
              <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                <svg width={110} height={110} style={{ transform: "rotate(-90deg)" }}>
                  <circle cx={55} cy={55} r={r} fill="none" stroke="#1a1a30" strokeWidth={8} />
                  <circle cx={55} cy={55} r={r} fill="none" stroke="#f59e0b" strokeWidth={8}
                    strokeDasharray={circ} strokeDashoffset={stroke} strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 1s linear" }} />
                </svg>
                <div>
                  <div style={{ fontFamily: "monospace", fontSize: 36, fontWeight: "bold", color: "#f59e0b", marginBottom: 8 }}>
                    {fmtTime(focusRemain)}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setFocusRunning(r => !r)} style={{ padding: "8px 18px", background: focusRunning ? "#374151" : "#f59e0b", color: focusRunning ? "#e2d9c8" : "#07070f", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: "bold", fontFamily: "inherit", fontSize: 13 }}>
                      {focusRunning ? "⏸ Pause" : "▶ Start"}
                    </button>
                    <button onClick={() => { setFocusRunning(false); setFocusRemain(25 * 60); }} style={{ padding: "8px 14px", background: "transparent", color: "#4a5568", border: "1px solid #1a1a30", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>↺</button>
                  </div>
                  <div style={{ fontSize: 11, color: "#4a5568", marginTop: 6 }}>Téléphone dans une autre pièce. 🙏</div>
                </div>
              </div>
            </div>

            {/* TRAPS */}
            <div style={{ background: "#0d0d1f", border: "1px solid #ef444433", borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 10, color: "#ef4444", letterSpacing: 3, textTransform: "uppercase", marginBottom: 10 }}>⚠️ 10 PIÈGES QUI COÛTENT LE PLUS CHER</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 6 }}>
                {TRAPS.map(t => (
                  <div key={t.n} style={{ background: "#12121f", borderRadius: 8, padding: "8px 12px", border: "1px solid #ef444422" }}>
                    <span style={{ color: "#ef4444", fontWeight: "bold", fontFamily: "monospace" }}>{t.n}. </span>
                    <span style={{ color: "#f0e8d8", fontWeight: "bold", fontSize: 12 }}>{t.trap}</span>
                    <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{t.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── PLANNING ───────────────────────────────── */}
        {tab === "schedule" && (
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              {["📅 Samedi", "📅 Dimanche", "🏆 Lundi"].map((d, i) => (
                <button key={i} onClick={() => setScheduleDay(i)} style={{
                  flex: 1, padding: "10px 8px", border: `1px solid ${scheduleDay === i ? ["#f59e0b","#10b981","#ef4444"][i] : "#1a1a30"}`,
                  borderRadius: 10, background: scheduleDay === i ? `${["#f59e0b","#10b981","#ef4444"][i]}22` : "#0d0d1f",
                  color: scheduleDay === i ? ["#f59e0b","#10b981","#ef4444"][i] : "#4a5568",
                  cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: "bold",
                }}>{d}</button>
              ))}
            </div>

            {/* Progress bar */}
            {(() => {
              const daySlots = SCHEDULE.filter(s => s.day === scheduleDay && s.xp > 0);
              const done = daySlots.filter(s => checkedSlots[`${s.day}-${s.time}`]).length;
              const pct = daySlots.length ? (done / daySlots.length) * 100 : 0;
              return (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#4a5568", marginBottom: 4 }}>
                    <span>Progression journée</span><span>{done}/{daySlots.length} tâches</span>
                  </div>
                  <div style={{ height: 6, background: "#1a1a2e", borderRadius: 3 }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: "#10b981", borderRadius: 3, transition: "width 0.3s" }} />
                  </div>
                </div>
              );
            })()}

            {SCHEDULE.filter(s => s.day === scheduleDay).map((slot, i) => {
              const key = `${slot.day}-${slot.time}`;
              const done = checkedSlots[key];
              return (
                <div key={i} onClick={() => !slot.mandatory && !slot.isExam && checkSlot(key, slot.xp)}
                  style={{
                    background: slot.isExam ? "#1a0a0a" : done ? "#0a1a0e" : "#0d0d1f",
                    border: `1px solid ${slot.isExam ? "#ef4444" : slot.mandatory ? "#f59e0b44" : done ? "#10b98133" : "#1a1a30"}`,
                    borderRadius: 10, padding: "10px 14px", marginBottom: 6,
                    display: "flex", alignItems: "center", gap: 10,
                    cursor: slot.mandatory || slot.isExam ? "default" : "pointer",
                    opacity: slot.mandatory ? 0.9 : 1,
                  }}>
                  {!slot.mandatory && !slot.isExam && (
                    <div style={{
                      width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                      border: `2px solid ${done ? "#10b981" : "#2a2a40"}`,
                      background: done ? "#10b981" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, color: "#07070f", fontWeight: "bold",
                    }}>{done ? "✓" : ""}</div>
                  )}
                  <div style={{ fontSize: 18, flexShrink: 0 }}>{slot.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "monospace", fontSize: 10, color: "#4a5568" }}>{slot.time}</div>
                    <div style={{ fontSize: 13, color: done ? "#4a5568" : slot.isExam ? "#ef4444" : "#e2d9c8", textDecoration: done ? "line-through" : "none", fontWeight: slot.isExam ? "bold" : "normal" }}>
                      {slot.label}
                    </div>
                  </div>
                  {slot.xp > 0 && <div style={{ fontSize: 11, color: "#f59e0b", fontFamily: "monospace", flexShrink: 0 }}>+{slot.xp}xp</div>}
                </div>
              );
            })}
          </div>
        )}

        {/* ── MODULES ────────────────────────────────── */}
        {tab === "modules" && (
          <div>
            <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
              {MODULES.map((m, i) => (
                <button key={i} onClick={() => { setModuleIdx(i); setModuleTab("simple"); setShowAnswer(false); }} style={{
                  padding: "8px 12px", borderRadius: 8,
                  border: `2px solid ${moduleIdx === i ? m.color : "#1a1a30"}`,
                  background: moduleIdx === i ? `${m.color}22` : "#0d0d1f",
                  color: moduleIdx === i ? m.color : "#4a5568",
                  cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: "bold",
                }}>{m.emoji} {m.id}</button>
              ))}
            </div>

            {(() => {
              const m = MODULES[moduleIdx];
              return (
                <div style={{ background: "#0d0d1f", borderRadius: 14, border: `2px solid ${m.color}44`, overflow: "hidden" }}>
                  <div style={{ background: `linear-gradient(135deg, ${m.color}22, #0d0d1f)`, padding: "16px 18px", borderBottom: "1px solid #1a1a30" }}>
                    <div style={{ fontSize: 10, color: m.color, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>{m.tag}</div>
                    <div style={{ fontSize: 18, fontWeight: "bold" }}>{m.emoji} {m.title}</div>
                  </div>

                  <div style={{ display: "flex", borderBottom: "1px solid #1a1a30" }}>
                    {[["simple","💡 Comprendre"],["formulas","📐 Formules"],["recipe","📋 Recette"],["exo","✏️ Exercice"]].map(([id, lb]) => (
                      <button key={id} onClick={() => { setModuleTab(id); setShowAnswer(false); }} style={{
                        flex: 1, padding: "10px 4px", border: "none",
                        background: moduleTab === id ? "#12121f" : "transparent",
                        color: moduleTab === id ? m.color : "#4a5568",
                        cursor: "pointer", fontFamily: "inherit", fontSize: 11,
                        borderBottom: `2px solid ${moduleTab === id ? m.color : "transparent"}`,
                        fontWeight: moduleTab === id ? "bold" : "normal",
                      }}>{lb}</button>
                    ))}
                  </div>

                  <div style={{ padding: 18 }}>
                    {moduleTab === "simple" && (
                      <p style={{ lineHeight: 1.85, color: "#c8c0b0", fontSize: 14, margin: 0, whiteSpace: "pre-line" }}>{m.simple}</p>
                    )}

                    {moduleTab === "formulas" && (
                      <div>{m.formulas.map((f, i) => (
                        <div key={i} style={{ marginBottom: 10, padding: "10px 14px", background: "#12121f", borderRadius: 8, borderLeft: `3px solid ${m.color}` }}>
                          <div style={{ fontSize: 10, color: "#4a5568", marginBottom: 4 }}>{f.label}</div>
                          <div style={{ fontFamily: "monospace", color: m.color, fontSize: 14, fontWeight: "bold" }}>{f.f}</div>
                        </div>
                      ))}</div>
                    )}

                    {moduleTab === "recipe" && (
                      <div>
                        <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 12 }}>Applique ces étapes dans l'ordre, mécaniquement :</div>
                        {m.recipe.map((step, i) => (
                          <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                            <div style={{ width: 22, height: 22, borderRadius: "50%", background: m.color, color: "#07070f", fontSize: 11, fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
                            <div style={{ fontSize: 13, color: "#c8c0b0", lineHeight: 1.6, paddingTop: 3, fontFamily: "monospace" }}>{step}</div>
                          </div>
                        ))}
                        <div style={{ marginTop: 14, padding: "10px 14px", background: "#1a0a0a", borderRadius: 8, border: "1px solid #ef444433", fontSize: 12, color: "#fca5a5", lineHeight: 1.6 }}>
                          {m.trap}
                        </div>
                      </div>
                    )}

                    {moduleTab === "exo" && (
                      <div>
                        <div style={{ padding: 14, background: "#12121f", borderRadius: 8, marginBottom: 12, fontSize: 13, lineHeight: 1.8, color: "#c8c0b0", whiteSpace: "pre-wrap" }}>
                          <div style={{ color: "#f59e0b", fontWeight: "bold", marginBottom: 6, fontSize: 12 }}>📝 Énoncé</div>
                          {m.exo.q}
                        </div>
                        {!showAnswer ? (
                          <button onClick={() => { setShowAnswer(true); setXp(x => x + 30); }} style={{ width: "100%", padding: 13, background: m.color, color: "#07070f", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontWeight: "bold", fontSize: 14 }}>
                            Voir la correction +30xp →
                          </button>
                        ) : (
                          <div style={{ padding: 14, background: "#0a1a0a", borderRadius: 8, fontSize: 13, lineHeight: 1.8, color: "#86efac", fontFamily: "monospace", whiteSpace: "pre-wrap", border: "1px solid #10b98133" }}>
                            <div style={{ color: "#10b981", fontWeight: "bold", marginBottom: 6, fontFamily: "Georgia, serif" }}>✅ Correction</div>
                            {m.exo.a}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ── FICHE A4 ───────────────────────────────── */}
        {tab === "a4" && (
          <div>
            <div style={{ background: "#0d0d1f", border: "1px solid #8b5cf644", borderRadius: 10, padding: 12, marginBottom: 14, fontSize: 12, color: "#94a3b8" }}>
              📄 <strong style={{ color: "#8b5cf6" }}>Feuille A4 — 9 zones à recopier à la main.</strong> C'est ton arme principale à l'exam. Rédige-la samedi soir (zones 1-4 recto) et dimanche après-midi (zones 5-9 verso). Stylo 0,3mm, 3 couleurs max.
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
              {FORMULA_ZONES.map((z, i) => (
                <button key={i} onClick={() => setFormulaZone(i)} style={{
                  padding: "6px 10px", borderRadius: 6,
                  border: `1px solid ${formulaZone === i ? z.color : "#1a1a30"}`,
                  background: formulaZone === i ? `${z.color}22` : "#0d0d1f",
                  color: formulaZone === i ? z.color : "#4a5568",
                  cursor: "pointer", fontFamily: "monospace", fontSize: 11,
                }}>{i + 1}</button>
              ))}
            </div>

            {(() => {
              const z = FORMULA_ZONES[formulaZone];
              return (
                <div style={{ background: "#0d0d1f", border: `1px solid ${z.color}44`, borderRadius: 12, padding: 18 }}>
                  <div style={{ fontSize: 11, color: z.color, fontWeight: "bold", letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>{z.title}</div>
                  {z.items.map((item, i) => (
                    <div key={i} style={{
                      fontFamily: "monospace", fontSize: 13, padding: "8px 12px",
                      background: "#12121f", borderRadius: 6, marginBottom: 6,
                      color: item.startsWith("⚠️") ? "#fca5a5" : "#a5f3fc",
                      border: item.startsWith("⚠️") ? "1px solid #ef444433" : "1px solid #1a1a30",
                      lineHeight: 1.5,
                    }}>{item}</div>
                  ))}
                </div>
              );
            })()}

            {/* All zones grid */}
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 11, color: "#4a5568", marginBottom: 8 }}>Vue d'ensemble toutes les zones :</div>
              {FORMULA_ZONES.map((z, zi) => (
                <div key={zi} style={{ background: "#0d0d1f", border: `1px solid ${z.color}22`, borderRadius: 8, padding: "10px 14px", marginBottom: 8 }}>
                  <div style={{ fontSize: 10, color: z.color, fontWeight: "bold", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{z.title}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {z.items.map((item, i) => (
                      <div key={i} style={{ fontFamily: "monospace", fontSize: 10, color: "#6b7280", background: "#12121f", padding: "3px 8px", borderRadius: 4 }}>{item}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SIMULATEUR ─────────────────────────────── */}
        {tab === "simulator" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
              <div>
                <div style={{ fontSize: 10, color: "#ef4444", letterSpacing: 3, textTransform: "uppercase" }}>SIMULATEUR D'EXAMEN</div>
                <div style={{ fontSize: 14, color: "#e2d9c8" }}>2h · Calculatrice · Feuille A4 uniquement</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "monospace", fontSize: 32, fontWeight: "bold", color: simSec < 1200 ? "#ef4444" : "#f59e0b" }}>{fmtTime(simSec)}</div>
                <div style={{ height: 4, width: 120, background: "#1a1a2e", borderRadius: 2, marginTop: 4 }}>
                  <div style={{ width: `${(simSec / (120 * 60)) * 100}%`, height: "100%", background: "#f59e0b", borderRadius: 2 }} />
                </div>
              </div>
            </div>

            {/* Exo selector */}
            <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
              {SIM_EXOS.map((e, i) => (
                <button key={i} onClick={() => { setSimExoIdx(i); setSimDone(false); setSimAnswer(""); }} style={{
                  padding: "6px 10px", borderRadius: 6, border: `1px solid ${simExoIdx === i ? "#ef4444" : "#1a1a30"}`,
                  background: simExoIdx === i ? "#ef444422" : "#0d0d1f", color: simExoIdx === i ? "#ef4444" : "#4a5568",
                  cursor: "pointer", fontFamily: "inherit", fontSize: 11,
                }}>Ex.{i + 1}</button>
              ))}
            </div>

            <div style={{ background: "#0d0d1f", border: "1px solid #1a1a30", borderRadius: 12, padding: 18, marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: "#ef4444", fontWeight: "bold", marginBottom: 10 }}>{SIM_EXOS[simExoIdx].title}</div>
              <div style={{ fontSize: 13, lineHeight: 1.85, color: "#c8c0b0", whiteSpace: "pre-wrap", fontFamily: "monospace", marginBottom: 16 }}>{SIM_EXOS[simExoIdx].q}</div>
              <textarea
                value={simAnswer}
                onChange={e => setSimAnswer(e.target.value)}
                placeholder="Écris ta réponse ici..."
                style={{
                  width: "100%", minHeight: 150, background: "#12121f", border: "1px solid #2a2a40",
                  borderRadius: 8, padding: 12, color: "#e2d9c8", fontFamily: "monospace",
                  fontSize: 13, resize: "vertical", outline: "none", boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
              <button onClick={() => setSimRunning(r => !r)} style={{ flex: 1, padding: "12px", background: simRunning ? "#374151" : "#ef4444", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: "bold", fontFamily: "inherit", fontSize: 14 }}>
                {simRunning ? "⏸ Pause" : simSec === 120 * 60 ? "▶ Démarrer le chrono" : "▶ Reprendre"}
              </button>
              <button onClick={() => { setSimDone(true); setSimRunning(false); }} style={{ flex: 1, padding: "12px", background: "#10b981", color: "#07070f", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: "bold", fontFamily: "inherit", fontSize: 14 }}>
                ✓ Voir correction
              </button>
              <button onClick={() => { setSimSec(120 * 60); setSimRunning(false); setSimDone(false); setSimAnswer(""); }} style={{ padding: "12px 16px", background: "transparent", color: "#4a5568", border: "1px solid #1a1a30", borderRadius: 8, cursor: "pointer", fontFamily: "inherit" }}>↺</button>
            </div>

            {simDone && (
              <div style={{ background: "#0a1a0a", border: "1px solid #10b98133", borderRadius: 12, padding: 18 }}>
                <div style={{ color: "#10b981", fontWeight: "bold", marginBottom: 10 }}>✅ Correction — {SIM_EXOS[simExoIdx].title}</div>
                <div style={{ fontFamily: "monospace", fontSize: 13, color: "#86efac", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{SIM_EXOS[simExoIdx].a}</div>
              </div>
            )}

            {/* Stratégie exam */}
            <div style={{ background: "#0d0d1f", border: "1px solid #1a1a30", borderRadius: 12, padding: 16, marginTop: 14 }}>
              <div style={{ fontSize: 10, color: "#f59e0b", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>⚡ STRATÉGIE 2H</div>
              {[
                ["10 min", "Lire TOUT avant d'écrire. Annoter ✅⚠️❌ par question.", "#f59e0b"],
                ["30-40 min", "Attaquer les ✅ d'abord. Photoélectrique + Puits infini.", "#10b981"],
                ["50-60 min", "⚠️ Tunnel, superposition, Stern-Gerlach. Règle : blocage > 5min → passer.", "#06b6d4"],
                ["15-20 min", "❌ Poser le problème formellement même sans conclure.", "#8b5cf6"],
                ["10 min", "Relecture : unités, R+T=1, Σ|cₙ|²=1, ordres de grandeur.", "#ef4444"],
              ].map(([t, d, c], i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                  <div style={{ width: 56, flexShrink: 0, fontFamily: "monospace", fontSize: 11, color: c, fontWeight: "bold", paddingTop: 2 }}>{t}</div>
                  <div style={{ fontSize: 12, color: "#c8c0b0", lineHeight: 1.6 }}>{d}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CHAT ───────────────────────────────────── */}
        {tab === "chat" && (
          <div style={{ display: "flex", flexDirection: "column", height: 520 }}>
            <div style={{ flex: 1, overflowY: "auto", background: "#0d0d1f", borderRadius: 12, padding: 14, marginBottom: 10, border: "1px solid #1a1a30" }}>
              {chat.map((msg, i) => (
                <div key={i} style={{ marginBottom: 12, display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                  <div style={{
                    maxWidth: "85%", padding: "10px 14px",
                    borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                    background: msg.role === "user" ? "#1a2a3a" : "#12121f",
                    border: `1px solid ${msg.role === "user" ? "#3b82f633" : "#1a1a30"}`,
                    fontSize: 13, lineHeight: 1.7, color: "#e2d9c8", whiteSpace: "pre-wrap",
                  }}>{msg.content}</div>
                </div>
              ))}
              {chatLoading && (
                <div style={{ display: "flex", gap: 4, padding: "8px 14px" }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#f59e0b", animation: `blink 1.2s ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Shortcuts */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
              {["Explique le puits infini simplement", "Différence entre h et ℏ ?", "Comment calculer P(aₙ) ?", "Je bloque sur le spin"].map(q => (
                <button key={q} onClick={() => setChatInput(q)} style={{
                  padding: "4px 10px", background: "#0d0d1f", border: "1px solid #1a1a30",
                  borderRadius: 6, color: "#6b7280", cursor: "pointer", fontSize: 11, fontFamily: "inherit",
                }}>{q}</button>
              ))}
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendChat()}
                placeholder="Pose ta question sur le cours de Goguenheim..."
                style={{
                  flex: 1, padding: "12px 16px", background: "#0d0d1f",
                  border: "1px solid #2a2a40", borderRadius: 10, color: "#e2d9c8",
                  fontFamily: "inherit", fontSize: 13, outline: "none",
                }}
              />
              <button onClick={sendChat} disabled={chatLoading} style={{
                padding: "12px 20px", background: chatLoading ? "#1a1a30" : "#f59e0b",
                color: chatLoading ? "#4a5568" : "#07070f", border: "none", borderRadius: 10,
                cursor: chatLoading ? "not-allowed" : "pointer", fontWeight: "bold", fontSize: 16,
              }}>→</button>
            </div>
          </div>
        )}
      </div>

      {/* PARKING LOT */}
      {parkingOpen && (
        <div style={{ position: "fixed", inset: 0, background: "#07070fcc", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div style={{ background: "#0d0d1f", border: "1px solid #1a1a30", borderRadius: "16px 16px 0 0", padding: 20, width: "100%", maxWidth: 500 }}>
            <div style={{ fontSize: 14, fontWeight: "bold", color: "#f59e0b", marginBottom: 4 }}>🅿️ Parking Lot — Session terminée !</div>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 12 }}>Note tes pensées parasites ici. Tu y reviendras après.</div>
            <input
              autoFocus
              value={parkingText}
              onChange={e => setParkingText(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && parkingText.trim()) { setParkingList(l => [...l, parkingText.trim()]); setParkingText(""); } }}
              placeholder="Ta pensée ici (Entrée pour valider)..."
              style={{ width: "100%", padding: 10, background: "#12121f", border: "1px solid #2a2a40", borderRadius: 8, color: "#e2d9c8", fontFamily: "inherit", fontSize: 13, marginBottom: 8, boxSizing: "border-box" }}
            />
            {parkingList.map((p, i) => (
              <div key={i} style={{ fontSize: 12, color: "#6b7280", padding: "4px 0", borderBottom: "1px solid #1a1a3044" }}>• {p}</div>
            ))}
            <button onClick={() => { setParkingOpen(false); setFocusRemain(25 * 60); }} style={{ width: "100%", marginTop: 14, padding: 12, background: "#f59e0b", color: "#07070f", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: "bold", fontFamily: "inherit", fontSize: 14 }}>
              ▶ Reprendre le focus (nouvelle session)
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes blink { 0%,100%{opacity:0.2;transform:scale(0.7)} 50%{opacity:1;transform:scale(1)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a2a40; border-radius: 2px; }
        button:active { transform: scale(0.97); }
        textarea { line-height: 1.6; }
      `}</style>
    </div>
  );
}
