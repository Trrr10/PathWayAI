/**
 * Quiz.jsx — Hardcoded Question Bank Quiz
 * Instant load, no API needed, detailed inline explanations
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

/* ═══════════════════════════════════════════════
   QUESTION BANK
═══════════════════════════════════════════════ */
const QUESTION_BANK = {
  math: {
    easy: [
      { question: "What is 15 × 8?", options: ["110", "120", "125", "115"], correctIndex: 1, explanation: "15 × 8 = 120. You can break it down: 10×8=80 and 5×8=40, then 80+40=120." },
      { question: "What is the square root of 144?", options: ["11", "13", "12", "14"], correctIndex: 2, explanation: "√144 = 12, because 12 × 12 = 144. Memorising perfect squares up to 20 is very useful." },
      { question: "What is 25% of 200?", options: ["40", "50", "60", "45"], correctIndex: 1, explanation: "25% = 1/4. So 200 ÷ 4 = 50. Always convert percentages to fractions for quick mental math." },
      { question: "What is the value of π (pi) approximately?", options: ["3.14", "3.41", "3.12", "3.16"], correctIndex: 0, explanation: "π ≈ 3.14159… The value 3.14 is the standard approximation used in most calculations." },
      { question: "If a triangle has angles 60° and 80°, what is the third angle?", options: ["30°", "40°", "50°", "60°"], correctIndex: 1, explanation: "Sum of angles in a triangle = 180°. So third angle = 180 - 60 - 80 = 40°." },
      { question: "What is the LCM of 4 and 6?", options: ["8", "12", "16", "24"], correctIndex: 1, explanation: "LCM(4,6) = 12. Multiples of 4: 4,8,12… Multiples of 6: 6,12… The smallest common one is 12." },
      { question: "Solve: 3x = 21", options: ["x = 6", "x = 7", "x = 8", "x = 9"], correctIndex: 1, explanation: "Divide both sides by 3: x = 21/3 = 7. Always isolate the variable to solve linear equations." },
      { question: "What is the area of a rectangle 8cm × 5cm?", options: ["30 cm²", "35 cm²", "40 cm²", "45 cm²"], correctIndex: 2, explanation: "Area = length × width = 8 × 5 = 40 cm². This is one of the most fundamental geometry formulas." },
    ],
    medium: [
      { question: "What is the value of 2³ + 3²?", options: ["15", "17", "19", "13"], correctIndex: 1, explanation: "2³ = 8 and 3² = 9. So 8 + 9 = 17. Remember: 2³ means 2×2×2, not 2×3." },
      { question: "If f(x) = x² - 3x + 2, what is f(3)?", options: ["1", "2", "0", "4"], correctIndex: 1, explanation: "f(3) = 3² - 3(3) + 2 = 9 - 9 + 2 = 2. Always substitute carefully and follow BODMAS." },
      { question: "What is the HCF of 36 and 48?", options: ["6", "8", "12", "18"], correctIndex: 2, explanation: "Factors of 36: 1,2,3,4,6,9,12,18,36. Factors of 48: 1,2,3,4,6,8,12,16,24,48. HCF = 12." },
      { question: "A train travels 300 km in 5 hours. What is its speed?", options: ["50 km/h", "55 km/h", "60 km/h", "65 km/h"], correctIndex: 2, explanation: "Speed = Distance ÷ Time = 300 ÷ 5 = 60 km/h. This is the fundamental speed-distance-time formula." },
      { question: "What is the slope of the line y = 3x - 7?", options: ["−7", "3", "7", "−3"], correctIndex: 1, explanation: "In y = mx + c form, m is the slope. Here y = 3x - 7, so slope = 3 and y-intercept = -7." },
      { question: "Simplify: (x² - 4) ÷ (x - 2)", options: ["x + 2", "x - 2", "x² + 2", "2x"], correctIndex: 0, explanation: "x² - 4 = (x+2)(x-2). Dividing by (x-2) cancels it, leaving x + 2. This uses the difference of squares identity." },
      { question: "What is sin 30°?", options: ["√3/2", "1/2", "1/√2", "√3"], correctIndex: 1, explanation: "sin 30° = 1/2. Key trig values to memorise: sin 0°=0, sin 30°=1/2, sin 45°=1/√2, sin 60°=√3/2, sin 90°=1." },
      { question: "What is the probability of getting heads twice in 2 coin tosses?", options: ["1/2", "1/3", "1/4", "1/8"], correctIndex: 2, explanation: "P(H) = 1/2 each toss. For two independent events: P(HH) = 1/2 × 1/2 = 1/4." },
    ],
    hard: [
      { question: "What is the derivative of x³ - 5x² + 6x?", options: ["3x² - 10x + 6", "x² - 5x + 6", "3x² - 5x + 6", "3x - 10x"], correctIndex: 0, explanation: "Using power rule: d/dx(xⁿ) = nxⁿ⁻¹. So d/dx(x³)=3x², d/dx(-5x²)=-10x, d/dx(6x)=6. Combined: 3x²-10x+6." },
      { question: "What is the sum of the infinite geometric series 1 + 1/2 + 1/4 + …?", options: ["1.5", "2", "2.5", "3"], correctIndex: 1, explanation: "Sum = a/(1-r) where a=1 (first term) and r=1/2 (common ratio). Sum = 1/(1-1/2) = 1/(1/2) = 2." },
      { question: "Solve: log₂(32) = ?", options: ["4", "5", "6", "3"], correctIndex: 1, explanation: "log₂(32) asks: 2 to what power = 32? Since 2⁵ = 32, the answer is 5. Always think: 'base to what power gives this number?'" },
      { question: "If a matrix A = [[2,1],[3,4]], what is det(A)?", options: ["5", "8", "11", "3"], correctIndex: 0, explanation: "det([[a,b],[c,d]]) = ad - bc = (2)(4) - (1)(3) = 8 - 3 = 5. Determinants are key for solving linear systems." },
    ],
  },
  science: {
    easy: [
      { question: "What is the chemical formula of water?", options: ["H₂O₂", "HO₂", "H₂O", "H₃O"], correctIndex: 2, explanation: "Water is H₂O — two hydrogen atoms bonded to one oxygen atom. This covalent bond makes water a polar molecule." },
      { question: "What is the unit of electric current?", options: ["Volt", "Watt", "Ampere", "Ohm"], correctIndex: 2, explanation: "Electric current is measured in Amperes (A), named after André-Marie Ampère. Voltage is in Volts, resistance in Ohms." },
      { question: "Which planet is known as the Red Planet?", options: ["Venus", "Jupiter", "Saturn", "Mars"], correctIndex: 3, explanation: "Mars appears red due to iron oxide (rust) on its surface. It's the fourth planet from the Sun." },
      { question: "What is the powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondria", "Chloroplast"], correctIndex: 2, explanation: "Mitochondria produce ATP (energy) through cellular respiration. They have their own DNA and are thought to have been free-living bacteria." },
      { question: "What is the speed of light in a vacuum?", options: ["3×10⁶ m/s", "3×10⁷ m/s", "3×10⁸ m/s", "3×10⁹ m/s"], correctIndex: 2, explanation: "Speed of light c = 3×10⁸ m/s (approximately 300,000 km/s). Nothing in the universe can travel faster than this." },
      { question: "What gas do plants absorb during photosynthesis?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], correctIndex: 2, explanation: "Plants absorb CO₂ and release O₂ during photosynthesis. The equation: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂." },
      { question: "What is Newton's first law also called?", options: ["Law of Energy", "Law of Inertia", "Law of Motion", "Law of Gravity"], correctIndex: 1, explanation: "Newton's first law states an object at rest stays at rest and an object in motion stays in motion unless acted on by an external force — hence 'Law of Inertia'." },
      { question: "What is the atomic number of Carbon?", options: ["4", "6", "8", "12"], correctIndex: 1, explanation: "Carbon has atomic number 6, meaning it has 6 protons. Its atomic mass is 12 (6 protons + 6 neutrons)." },
    ],
    medium: [
      { question: "What is Ohm's Law?", options: ["V = IR", "P = IV", "F = ma", "E = mc²"], correctIndex: 0, explanation: "Ohm's Law: V = IR (Voltage = Current × Resistance). This is fundamental to all circuit analysis." },
      { question: "What type of bond exists between Na and Cl in NaCl?", options: ["Covalent", "Metallic", "Ionic", "Hydrogen"], correctIndex: 2, explanation: "NaCl (table salt) has an ionic bond. Na donates one electron to Cl, forming Na⁺ and Cl⁻ ions attracted by electrostatic force." },
      { question: "What is the process by which plants lose water through leaves?", options: ["Transpiration", "Respiration", "Evaporation", "Osmosis"], correctIndex: 0, explanation: "Transpiration is water loss through stomata (tiny pores) in leaves. It drives water uptake from roots and cools the plant." },
      { question: "What is the formula for kinetic energy?", options: ["mgh", "½mv²", "mv²", "Fd"], correctIndex: 1, explanation: "KE = ½mv² where m=mass and v=velocity. Doubling speed quadruples KE because velocity is squared." },
      { question: "Which organelle is responsible for protein synthesis?", options: ["Golgi body", "Mitochondria", "Ribosome", "Lysosome"], correctIndex: 2, explanation: "Ribosomes translate mRNA into proteins. They can be free in the cytoplasm or attached to the rough endoplasmic reticulum." },
      { question: "What is the pH of a neutral solution at 25°C?", options: ["0", "7", "10", "14"], correctIndex: 1, explanation: "Pure water at 25°C has pH = 7 (neutral). pH < 7 is acidic, pH > 7 is basic/alkaline. The scale runs from 0 to 14." },
      { question: "What happens to resistance when temperature increases in a conductor?", options: ["Decreases", "Stays same", "Increases", "Becomes zero"], correctIndex: 2, explanation: "In conductors, higher temperature causes more atomic vibration, increasing resistance to electron flow. (Opposite is true for semiconductors.)" },
    ],
    hard: [
      { question: "What is the de Broglie wavelength formula?", options: ["λ = h/mv", "λ = mv/h", "λ = hv/m", "λ = m/hv"], correctIndex: 0, explanation: "λ = h/mv (or h/p where p=momentum). This shows all matter has wave-like properties. For large objects, λ is negligibly small." },
      { question: "What is the hybridization of carbon in CH₄?", options: ["sp", "sp²", "sp³", "sp³d"], correctIndex: 2, explanation: "In methane (CH₄), carbon forms 4 equivalent bonds with H. This requires sp³ hybridization — one s orbital mixes with three p orbitals to form 4 tetrahedral bonds." },
      { question: "Which enzyme unwinds the DNA double helix during replication?", options: ["DNA Polymerase", "Ligase", "Helicase", "Primase"], correctIndex: 2, explanation: "Helicase breaks hydrogen bonds between base pairs to unwind DNA. DNA Polymerase then adds new nucleotides, and Ligase joins fragments together." },
    ],
  },
  history: {
    easy: [
      { question: "In which year did India gain independence?", options: ["1945", "1947", "1948", "1950"], correctIndex: 1, explanation: "India gained independence on 15 August 1947. The Constitution came into effect on 26 January 1950, which is why we celebrate Republic Day." },
      { question: "Who was the first Prime Minister of India?", options: ["Sardar Patel", "Rajendra Prasad", "Jawaharlal Nehru", "B.R. Ambedkar"], correctIndex: 2, explanation: "Jawaharlal Nehru was India's first PM (1947–1964). Rajendra Prasad was the first President, and Ambedkar was the chief architect of the Constitution." },
      { question: "The Battle of Plassey was fought in which year?", options: ["1757", "1857", "1657", "1947"], correctIndex: 0, explanation: "Battle of Plassey (1757) — Robert Clive defeated Siraj ud-Daulah, marking the beginning of British political power in India." },
      { question: "Who launched the Non-Cooperation Movement?", options: ["Subhas Chandra Bose", "Bal Gangadhar Tilak", "Mahatma Gandhi", "Lala Lajpat Rai"], correctIndex: 2, explanation: "Gandhi launched the Non-Cooperation Movement in 1920, calling on Indians to boycott British goods, institutions, and services." },
      { question: "Which civilisation built the Colosseum?", options: ["Greek", "Egyptian", "Roman", "Persian"], correctIndex: 2, explanation: "The Colosseum in Rome was built by the Romans (70–80 AD) during Emperor Vespasian's reign. It could hold 50,000–80,000 spectators." },
      { question: "World War II ended in which year?", options: ["1943", "1944", "1945", "1946"], correctIndex: 2, explanation: "WWII ended in 1945 — Germany surrendered in May (V-E Day) and Japan surrendered in September (V-J Day) after atomic bombs were dropped." },
    ],
    medium: [
      { question: "The Dandi March was related to which issue?", options: ["Untouchability", "Salt Tax", "Land Rights", "Textile Mills"], correctIndex: 1, explanation: "Gandhi's Dandi March (1930) was a protest against the British salt tax. He walked 241 miles to the sea to make salt illegally, igniting civil disobedience nationwide." },
      { question: "Who wrote the 'Arthashastra'?", options: ["Kalidasa", "Chanakya", "Ashoka", "Aryabhata"], correctIndex: 1, explanation: "Chanakya (also called Kautilya) wrote the Arthashastra — an ancient treatise on statecraft, economic policy, and military strategy, written around 300 BCE." },
      { question: "The Quit India Movement was launched in which year?", options: ["1940", "1941", "1942", "1943"], correctIndex: 2, explanation: "Gandhi launched 'Quit India' on 8 August 1942 with the call 'Do or Die'. It demanded immediate independence and led to mass arrests across India." },
      { question: "Which empire did Genghis Khan found?", options: ["Ottoman Empire", "Mongol Empire", "Mughal Empire", "Persian Empire"], correctIndex: 1, explanation: "Genghis Khan founded the Mongol Empire in 1206, which became the largest contiguous land empire in history, stretching from Asia to Eastern Europe." },
    ],
    hard: [
      { question: "The Treaty of Versailles (1919) imposed war guilt on which country?", options: ["Austria", "Ottoman Empire", "Germany", "Hungary"], correctIndex: 2, explanation: "Article 231 (the 'War Guilt Clause') of the Treaty of Versailles assigned full blame for WWI to Germany, leading to massive reparations and humiliation that contributed to WWII." },
      { question: "What was the significance of the Cabinet Mission Plan (1946)?", options: ["Proposed Partition", "Proposed Federal Structure", "Granted Independence", "Created INC"], correctIndex: 1, explanation: "The Cabinet Mission Plan proposed keeping India united with a three-tier federal structure. Its failure and disagreements between Congress and the Muslim League accelerated partition." },
    ],
  },
  language: {
    easy: [
      { question: "What is the plural of 'child'?", options: ["Childs", "Childes", "Children", "Childrens"], correctIndex: 2, explanation: "'Children' is an irregular plural — it doesn't follow the standard '-s' rule. Other irregular plurals: man→men, mouse→mice, tooth→teeth." },
      { question: "Which of these is a noun?", options: ["Run", "Beautiful", "Happiness", "Quickly"], correctIndex: 2, explanation: "'Happiness' is an abstract noun. 'Run' is a verb, 'Beautiful' is an adjective, 'Quickly' is an adverb." },
      { question: "What is the synonym of 'happy'?", options: ["Sad", "Angry", "Joyful", "Tired"], correctIndex: 2, explanation: "'Joyful' is a synonym of 'happy' — both express a positive emotional state. Building a synonym vocabulary helps in reading comprehension and writing." },
      { question: "Which sentence is grammatically correct?", options: ["She don't know.", "She doesn't knows.", "She doesn't know.", "She not know."], correctIndex: 2, explanation: "'She doesn't know' is correct. With third-person singular (he/she/it), use 'doesn't' (not 'don't'), and the main verb stays in base form." },
      { question: "What is the antonym of 'ancient'?", options: ["Old", "Historic", "Modern", "Traditional"], correctIndex: 2, explanation: "'Modern' is the antonym of 'ancient'. Antonyms are words with opposite meanings — learning them in pairs strengthens vocabulary effectively." },
    ],
    medium: [
      { question: "Identify the figure of speech: 'The wind whispered through the trees.'", options: ["Simile", "Metaphor", "Personification", "Alliteration"], correctIndex: 2, explanation: "This is personification — giving human qualities (whispering) to a non-human thing (wind). It makes writing more vivid and engaging." },
      { question: "What is a 'clause' in grammar?", options: ["A type of noun", "A group of words with subject and verb", "A punctuation mark", "A type of sentence"], correctIndex: 1, explanation: "A clause contains a subject and a predicate (verb). Independent clauses can stand alone; dependent clauses cannot. Understanding clauses is key to complex sentence construction." },
      { question: "What does the prefix 'mis-' mean?", options: ["Again", "Before", "Wrongly", "Against"], correctIndex: 2, explanation: "'Mis-' means wrongly or badly — as in misspell (spell wrongly), misunderstand, misjudge. Knowing prefixes helps decode unfamiliar words." },
      { question: "Which tense is used in: 'By tomorrow, I will have finished the project'?", options: ["Simple Future", "Future Perfect", "Present Perfect", "Future Continuous"], correctIndex: 1, explanation: "Future Perfect (will have + past participle) describes an action completed before a specific future time. It always involves a future deadline." },
    ],
    hard: [
      { question: "What is a 'soliloquy' in literature?", options: ["Conversation between two characters", "A poem with 14 lines", "Character speaking thoughts aloud alone", "Exaggeration for effect"], correctIndex: 2, explanation: "A soliloquy is when a character speaks their inner thoughts aloud while alone on stage. Shakespeare famously used it — Hamlet's 'To be or not to be' is the most famous soliloquy." },
      { question: "Which literary device is used in 'It was the best of times, it was the worst of times'?", options: ["Alliteration", "Oxymoron", "Antithesis", "Hyperbole"], correctIndex: 2, explanation: "Antithesis places contrasting ideas in parallel structure. Dickens opens A Tale of Two Cities with this device to capture the contradictions of the French Revolution era." },
    ],
  },
  coding: {
    easy: [
      { question: "What does HTML stand for?", options: ["HyperText Machine Language", "HyperText Markup Language", "HyperText Modern Language", "HighText Markup Language"], correctIndex: 1, explanation: "HTML = HyperText Markup Language. It defines the structure of web pages using tags like <html>, <body>, <p>, <div> etc." },
      { question: "Which symbol is used for single-line comments in Python?", options: ["//", "/*", "#", "--"], correctIndex: 2, explanation: "Python uses # for single-line comments. JavaScript/Java use //, SQL uses --, and /* */ is for multi-line comments in C/Java." },
      { question: "What is the output of print(2 ** 3) in Python?", options: ["6", "8", "9", "5"], correctIndex: 1, explanation: "** is the exponentiation operator in Python. 2**3 = 2³ = 8. Note: ^ in Python is bitwise XOR, not exponentiation." },
      { question: "What data structure uses LIFO order?", options: ["Queue", "Array", "Stack", "Linked List"], correctIndex: 2, explanation: "Stack uses Last In, First Out (LIFO). Queue uses FIFO (First In, First Out). Think of a stack of plates — you add and remove from the top." },
      { question: "What is the index of the first element in an array?", options: ["1", "-1", "0", "2"], correctIndex: 2, explanation: "Arrays in most languages (Python, Java, C, JavaScript) are zero-indexed — the first element is at index 0, second at 1, and so on." },
      { question: "What does 'len([1,2,3,4])' return in Python?", options: ["3", "4", "5", "2"], correctIndex: 1, explanation: "len() returns the number of elements. [1,2,3,4] has 4 elements, so len() = 4. This works for lists, strings, tuples, and dictionaries." },
    ],
    medium: [
      { question: "What is the time complexity of binary search?", options: ["O(n)", "O(n²)", "O(log n)", "O(n log n)"], correctIndex: 2, explanation: "Binary search is O(log n) because it halves the search space each step. Linear search is O(n). Always use binary search on sorted arrays." },
      { question: "What is a Python list comprehension for squares of 0-4?", options: ["[x*x in range(5)]", "[x**2 for x in range(5)]", "(x**2 for x in 5)", "[x^2 for x in range(5)]"], correctIndex: 1, explanation: "[x**2 for x in range(5)] produces [0,1,4,9,16]. List comprehensions are concise and typically faster than equivalent for-loops." },
      { question: "What does OOP stand for?", options: ["Object Oriented Programming", "Output Oriented Processing", "Open Object Protocol", "Operator Oriented Programming"], correctIndex: 0, explanation: "OOP = Object-Oriented Programming. Its four pillars are Encapsulation, Abstraction, Inheritance, and Polymorphism." },
      { question: "Which sorting algorithm has worst-case O(n log n)?", options: ["Bubble Sort", "Selection Sort", "Insertion Sort", "Merge Sort"], correctIndex: 3, explanation: "Merge Sort guarantees O(n log n) in all cases. Bubble, Selection, and Insertion sorts are O(n²) in the worst case." },
      { question: "What is a recursive function?", options: ["A function that runs infinitely", "A function that calls itself", "A function with no return", "A function inside a class"], correctIndex: 1, explanation: "A recursive function calls itself with a smaller input until it reaches a base case. It must always have a base case to avoid infinite recursion." },
    ],
    hard: [
      { question: "What is a closure in JavaScript?", options: ["A loop that closes", "A function with access to its outer scope variables", "A sealed class", "An error handler"], correctIndex: 1, explanation: "A closure is a function that 'remembers' variables from its outer lexical scope even after the outer function has returned. This is fundamental to functional JavaScript patterns." },
      { question: "What is the difference between '==' and '===' in JavaScript?", options: ["No difference", "=== checks type too", "== checks type too", "=== is assignment"], correctIndex: 1, explanation: "'==' checks value with type coercion (1 == '1' is true). '===' checks both value and type strictly (1 === '1' is false). Always prefer === to avoid bugs." },
      { question: "What is dynamic programming?", options: ["Programming with dynamic typing", "Solving problems by breaking into overlapping subproblems", "Real-time programming", "Using dynamic memory allocation"], correctIndex: 1, explanation: "Dynamic programming solves complex problems by breaking them into overlapping subproblems and storing results (memoization) to avoid recomputation. Examples: Fibonacci, Knapsack problem." },
    ],
  },
  general: {
    easy: [
      { question: "What is the capital of India?", options: ["Mumbai", "Kolkata", "New Delhi", "Chennai"], correctIndex: 2, explanation: "New Delhi is the capital of India. It is located within Delhi and serves as the seat of the Indian government and Parliament." },
      { question: "How many states are there in India (as of 2024)?", options: ["25", "28", "29", "32"], correctIndex: 1, explanation: "India has 28 states and 8 Union Territories after the reorganisation of Jammu & Kashmir in 2019, which split it into two UTs." },
      { question: "Which is the largest planet in our solar system?", options: ["Saturn", "Uranus", "Neptune", "Jupiter"], correctIndex: 3, explanation: "Jupiter is the largest planet — so massive that all other planets could fit inside it. It's a gas giant made mostly of hydrogen and helium." },
      { question: "Who invented the telephone?", options: ["Thomas Edison", "Nikola Tesla", "Alexander Graham Bell", "Guglielmo Marconi"], correctIndex: 2, explanation: "Alexander Graham Bell is credited with inventing the telephone in 1876. He made the first successful call to his assistant Watson: 'Mr. Watson, come here!'" },
      { question: "What is the national sport of India?", options: ["Cricket", "Kabaddi", "Field Hockey", "Badminton"], correctIndex: 2, explanation: "Field Hockey is India's national sport. India won 8 Olympic gold medals in hockey between 1928 and 1980." },
      { question: "Which is the longest river in India?", options: ["Yamuna", "Brahmaputra", "Godavari", "Ganga"], correctIndex: 3, explanation: "The Ganga (Ganges) is the longest river in India at about 2,525 km. It flows from the Himalayas to the Bay of Bengal." },
    ],
    medium: [
      { question: "What does GDP stand for?", options: ["Gross Domestic Product", "General Development Plan", "Global Development Progress", "Gross Daily Production"], correctIndex: 0, explanation: "GDP = Gross Domestic Product — the total monetary value of all goods and services produced in a country in a year. It's the main measure of economic size." },
      { question: "The Chandrayaan-3 mission landed on which part of the Moon?", options: ["North Pole", "Equator", "South Pole", "Dark Side"], correctIndex: 2, explanation: "Chandrayaan-3 landed near the South Pole of the Moon in August 2023, making India the first country to achieve this. The region is scientifically important for potential water ice." },
      { question: "Which Article of the Indian Constitution abolishes untouchability?", options: ["Article 14", "Article 15", "Article 17", "Article 21"], correctIndex: 2, explanation: "Article 17 abolishes untouchability and forbids its practice in any form. Violation is a punishable offence under the Protection of Civil Rights Act." },
      { question: "What is the name of India's first indigenously built aircraft carrier?", options: ["INS Vikrant", "INS Vikramaditya", "INS Viraat", "INS Arihant"], correctIndex: 0, explanation: "INS Vikrant (commissioned 2022) is India's first indigenously built aircraft carrier. INS Vikramaditya was purchased from Russia." },
    ],
    hard: [
      { question: "The Preamble to the Indian Constitution was amended in which year?", options: ["1971", "1976", "1978", "1985"], correctIndex: 1, explanation: "The Preamble was amended by the 42nd Constitutional Amendment in 1976 (during Emergency) to add the words 'Socialist', 'Secular', and 'Integrity'." },
      { question: "What is the Heliocentric model of the solar system?", options: ["Earth at the center", "Moon at the center", "Sun at the center", "Jupiter at the center"], correctIndex: 2, explanation: "The Heliocentric model (proposed by Copernicus in 1543) correctly places the Sun at the center. Before this, the Geocentric model (Earth at center) was widely accepted." },
    ],
  },
};

/* ═══════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════ */
function getQuestions(topicId, difficulty, count) {
  const pool = QUESTION_BANK[topicId]?.[difficulty] || [];
  // Shuffle and pick
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

const TOPICS = [
  { id: "math",     label: "Mathematics", icon: "∑",   subs: ["Algebra","Geometry","Trigonometry","Calculus","Statistics"] },
  { id: "science",  label: "Science",     icon: "⚗",   subs: ["Physics","Chemistry","Biology","Environmental Science"] },
  { id: "history",  label: "History",     icon: "🏛",  subs: ["Ancient History","Modern History","Indian Freedom Movement","World Wars"] },
  { id: "language", label: "Language",    icon: "✍",   subs: ["Grammar","Literature","Comprehension","Writing Skills"] },
  { id: "coding",   label: "Coding",      icon: "</>", subs: ["Arrays & Sorting","Data Structures","OOP Concepts","Algorithms","Python Basics"] },
  { id: "general",  label: "General GK",  icon: "✦",   subs: ["Current Affairs","Science & Tech","Sports","Geography","Art & Culture"] },
];

const DIFFICULTY = [
  { id: "easy",   label: "Easy",   color: "#22C55E", desc: "Basic concepts" },
  { id: "medium", label: "Medium", color: "#F59E0B", desc: "Application-level" },
  { id: "hard",   label: "Hard",   color: "#EF4444", desc: "Advanced thinking" },
];

const QUESTION_COUNTS = [3, 5, 8];
const TIME_PER_Q = 30;

/* ═══════════════════════════════════════════════
   CSS
═══════════════════════════════════════════════ */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .quiz-app { min-height: 100vh; font-family: 'DM Sans', sans-serif; }
  .quiz-app.dark  { background: #070E1C; color: #E2EEFF; }
  .quiz-app.light { background: #EBF4FF; color: #0F172A; }

  .mesh-bg { position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden; }
  .mesh-orb { position:absolute;border-radius:50%;animation:orb-drift 12s ease-in-out infinite; }
  @keyframes orb-drift { 0%,100%{transform:translate(0,0)scale(1)} 33%{transform:translate(20px,-15px)scale(1.04)} 66%{transform:translate(-15px,20px)scale(0.97)} }

  .card { border-radius:24px; }
  .dark  .card { background:rgba(13,27,46,0.85);border:1px solid rgba(59,130,246,0.2);backdrop-filter:blur(20px); }
  .light .card { background:rgba(255,255,255,0.88);border:1px solid rgba(147,197,253,0.4);backdrop-filter:blur(20px);box-shadow:0 8px 32px rgba(37,99,235,0.07); }

  .topic-card { border-radius:20px;padding:20px;cursor:pointer;transition:all .25s cubic-bezier(.4,0,.2,1);border:2px solid transparent; }
  .dark  .topic-card { background:rgba(15,30,55,0.7); }
  .light .topic-card { background:rgba(255,255,255,0.7);border-color:rgba(147,197,253,0.3); }
  .topic-card:hover { transform:translateY(-4px); }
  .topic-card.selected { border-color:#3B82F6!important; }
  .dark  .topic-card.selected { background:rgba(59,130,246,0.15); }
  .light .topic-card.selected { background:rgba(59,130,246,0.08); }

  .option-btn { width:100%;text-align:left;padding:16px 20px;border-radius:16px;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:500;transition:all .2s ease;display:flex;align-items:center;gap:14px;border:2px solid transparent; }
  .dark  .option-btn { background:rgba(15,30,55,0.8);color:#CBD5E1;border-color:rgba(59,130,246,0.15); }
  .light .option-btn { background:rgba(255,255,255,0.9);color:#334155;border-color:rgba(147,197,253,0.35); }
  .option-btn:hover:not(:disabled) { border-color:#3B82F6; }
  .dark  .option-btn:hover:not(:disabled) { background:rgba(59,130,246,0.12);color:#E2EEFF; }
  .light .option-btn:hover:not(:disabled) { background:rgba(219,234,254,0.6);color:#1E3A5F; }
  .option-btn:disabled { cursor:default; }
  .option-btn.correct { border-color:#22C55E!important;background:rgba(34,197,94,0.15)!important;color:#86EFAC!important; }
  .option-btn.wrong   { border-color:#EF4444!important;background:rgba(239,68,68,0.12)!important;color:#FCA5A5!important; }

  .timer-ring { transform:rotate(-90deg); }
  .timer-circle-bg { fill:none;stroke:rgba(100,116,139,0.2); }
  .timer-circle-fg { fill:none;stroke-linecap:round;transition:stroke-dashoffset 1s linear,stroke .5s ease; }

  .progress-bar  { height:4px;border-radius:2px;background:rgba(100,116,139,0.2);overflow:hidden; }
  .progress-fill { height:100%;border-radius:2px;background:linear-gradient(90deg,#3B82F6,#818CF8);transition:width .5s ease; }

  @keyframes fade-up   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fade-in   { from{opacity:0} to{opacity:1} }
  @keyframes scale-in  { from{opacity:0;transform:scale(0.88)} to{opacity:1;transform:scale(1)} }
  @keyframes bounce-in { 0%{transform:scale(0.5);opacity:0} 60%{transform:scale(1.15)} 80%{transform:scale(0.95)} 100%{transform:scale(1);opacity:1} }
  @keyframes shimmer   { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes bounce    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes pulse-glow{ 0%,100%{box-shadow:0 0 0 0 rgba(59,130,246,0.3)} 50%{box-shadow:0 0 0 14px rgba(59,130,246,0)} }
  @keyframes typewriter{ from{width:0} to{width:100%} }

  .animate-fade-up   { animation:fade-up   .6s cubic-bezier(.16,1,.3,1) both; }
  .animate-fade-in   { animation:fade-in   .5s ease both; }
  .animate-scale-in  { animation:scale-in  .5s cubic-bezier(.16,1,.3,1) both; }
  .animate-bounce-in { animation:bounce-in .7s cubic-bezier(.16,1,.3,1) both; }
  .d1{animation-delay:.05s} .d2{animation-delay:.1s} .d3{animation-delay:.15s} .d4{animation-delay:.2s}

  .text-shimmer { background:linear-gradient(90deg,#60a5fa,#a78bfa,#34d399,#60a5fa);background-size:200% auto;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:shimmer 3s linear infinite; }

  .explanation-box { border-radius:16px;padding:18px 20px;margin-top:14px;font-size:14px;line-height:1.75;animation:fade-up .4s ease both; }
  .dark  .explanation-box { background:rgba(30,58,138,0.25);border:1px solid rgba(59,130,246,0.3);color:#93C5FD; }
  .light .explanation-box { background:rgba(219,234,254,0.6);border:1px solid rgba(147,197,253,0.6);color:#1E40AF; }

  .score-ring { filter:drop-shadow(0 0 16px rgba(59,130,246,0.4)); }
  ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-thumb{background:rgba(59,130,246,0.3);border-radius:3px}

  .btn-primary { display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:14px 32px;border-radius:16px;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:700;color:white;background:linear-gradient(135deg,#2563EB,#3B82F6);box-shadow:0 4px 20px rgba(37,99,235,0.35);transition:all .2s ease; }
  .btn-primary:hover { transform:translateY(-2px);box-shadow:0 8px 28px rgba(37,99,235,0.45); }
  .btn-primary:disabled { opacity:.5;cursor:not-allowed;transform:none; }
  .btn-ghost { display:inline-flex;align-items:center;gap:6px;padding:10px 20px;border-radius:12px;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;transition:all .2s ease;background:transparent; }
  .dark  .btn-ghost { border:1px solid rgba(59,130,246,0.3);color:#94A3B8; }
  .light .btn-ghost { border:1px solid rgba(147,197,253,0.5);color:#64748B; }
  .btn-ghost:hover { border-color:#3B82F6;color:#3B82F6; }
  .diff-pill { padding:8px 18px;border-radius:20px;font-size:13px;font-weight:700;cursor:pointer;border:2px solid transparent;transition:all .2s; }
  .sub-chip  { padding:6px 14px;border-radius:20px;font-size:12px;font-weight:600;cursor:pointer;border:1.5px solid transparent;transition:all .2s; }
  .dark  .sub-chip { background:rgba(15,30,55,0.8);color:#64748B;border-color:rgba(59,130,246,0.15); }
  .light .sub-chip { background:rgba(241,245,249,0.8);color:#94A3B8;border-color:rgba(147,197,253,0.3); }
  .sub-chip:hover { border-color:#3B82F6;color:#3B82F6; }
  .sub-chip.active{ background:rgba(59,130,246,0.2);color:#60A5FA;border-color:#3B82F6; }

  /* Ollama loading dots */
  @keyframes dot-bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-12px)} }
  .dot { width:10px;height:10px;border-radius:50%;background:#3B82F6;display:inline-block; }
  .dot:nth-child(1){animation:dot-bounce 1.4s .0s infinite ease-in-out}
  .dot:nth-child(2){animation:dot-bounce 1.4s .2s infinite ease-in-out}
  .dot:nth-child(3){animation:dot-bounce 1.4s .4s infinite ease-in-out}
`;

/* ── Mesh BG ── */
function MeshBg({ dark }) {
  return (
    <div className="mesh-bg">
      <div style={{ position:"absolute",inset:0,background:dark?"radial-gradient(ellipse at 20% 30%,#0d2744 0%,#070E1C 60%)":"radial-gradient(ellipse at 20% 30%,#dbeafe 0%,#EBF4FF 60%)" }}/>
      <div className="mesh-orb" style={{ width:500,height:500,top:"-10%",left:"-5%",background:dark?"radial-gradient(circle,rgba(59,130,246,0.1) 0%,transparent 70%)":"radial-gradient(circle,rgba(59,130,246,0.12) 0%,transparent 70%)" }}/>
      <div className="mesh-orb" style={{ width:400,height:400,bottom:"5%",right:"-8%",animationDelay:"4s",background:dark?"radial-gradient(circle,rgba(129,140,248,0.08) 0%,transparent 70%)":"radial-gradient(circle,rgba(129,140,248,0.1) 0%,transparent 70%)" }}/>
      <div style={{ position:"absolute",inset:0,backgroundImage:dark?"linear-gradient(rgba(59,130,246,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.03) 1px,transparent 1px)":"linear-gradient(rgba(59,130,246,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.05) 1px,transparent 1px)",backgroundSize:"60px 60px"}}/>
    </div>
  );
}

/* ── Timer ── */
function TimerRing({ total, questionKey, onExpire, paused }) {
  const [timeLeft, setTimeLeft] = useState(total);
  const ref = useRef(null);

  useEffect(() => {
    setTimeLeft(total);
    clearInterval(ref.current);
    ref.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(ref.current); onExpire(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(ref.current);
  }, [questionKey]);

  useEffect(() => {
    if (paused) clearInterval(ref.current);
  }, [paused]);

  const r = 36, circ = 2 * Math.PI * r;
  const color = timeLeft <= 5 ? "#EF4444" : timeLeft <= 10 ? "#F59E0B" : "#3B82F6";
  return (
    <div style={{ position:"relative",width:96,height:96,flexShrink:0 }}>
      <svg width="96" height="96" className="timer-ring">
        <circle className="timer-circle-bg" cx="48" cy="48" r={r} strokeWidth="6"/>
        <circle className="timer-circle-fg" cx="48" cy="48" r={r} strokeWidth="6" stroke={color} strokeDasharray={circ} strokeDashoffset={circ*(1-timeLeft/total)}/>
      </svg>
      <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center" }}>
        <span style={{ fontSize:22,fontWeight:900,color,fontFamily:"'Syne',sans-serif",lineHeight:1 }}>{timeLeft}</span>
        <span style={{ fontSize:9,color:"#64748B",fontWeight:600,letterSpacing:"0.05em" }}>SEC</span>
      </div>
    </div>
  );
}

/* ── Score ring ── */
function ScoreRing({ score, total }) {
  const pct = score / total, r = 60, circ = 2*Math.PI*r;
  const color = pct>=0.8?"#22C55E":pct>=0.5?"#F59E0B":"#EF4444";
  return (
    <div style={{ position:"relative",width:160,height:160,margin:"0 auto" }}>
      <svg width="160" height="160" className="score-ring timer-ring">
        <circle className="timer-circle-bg" cx="80" cy="80" r={r} strokeWidth="8"/>
        <circle className="timer-circle-fg" cx="80" cy="80" r={r} strokeWidth="8" stroke={color} strokeDasharray={circ} strokeDashoffset={circ*(1-pct)} style={{ transition:"stroke-dashoffset 1.5s cubic-bezier(.16,1,.3,1)" }}/>
      </svg>
      <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2 }}>
        <span style={{ fontSize:28 }}>{pct>=0.8?"🏆":pct>=0.5?"⭐":"💪"}</span>
        <span style={{ fontSize:28,fontWeight:900,color,fontFamily:"'Syne',sans-serif",lineHeight:1 }}>{score}/{total}</span>
        <span style={{ fontSize:12,color:"#64748B",fontWeight:600 }}>{Math.round(pct*100)}%</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════ */
export default function Quiz() {
  const navigate = useNavigate();
  const { dark, toggleDark } = useApp();

  const [screen, setScreen]               = useState("setup");
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedSub, setSelectedSub]     = useState(null);
  const [difficulty, setDifficulty]       = useState("medium");
  const [questionCount, setQuestionCount] = useState(5);

  const [questions, setQuestions]     = useState([]);
  const [currentQ, setCurrentQ]       = useState(0);
  const [selectedAns, setSelectedAns] = useState(null);
  const [answered, setAnswered]       = useState(false);
  const [answers, setAnswers]         = useState([]);

  // Fake Ollama loading state
  const [loadingMsg, setLoadingMsg] = useState("");
  const [loadingStep, setLoadingStep] = useState(0);

  const textMuted = dark ? "#64748B" : "#94A3B8";
  const textMain  = dark ? "#E2EEFF"  : "#0F172A";
  const cardStyle = { background:dark?"rgba(13,27,46,0.85)":"rgba(255,255,255,0.88)", border:`1px solid ${dark?"rgba(59,130,246,0.2)":"rgba(147,197,253,0.4)"}`, backdropFilter:"blur(20px)", borderRadius:24 };

  const handleAnswer = useCallback((chosenIdx, timedOut=false) => {
    setAnswered(true);
    setSelectedAns(chosenIdx);
    const q = questions[currentQ];
    setAnswers(prev => [...prev, {
      chosen: chosenIdx,
      correct: q.correctIndex,
      isCorrect: chosenIdx === q.correctIndex && !timedOut,
      timedOut,
    }]);
  }, [questions, currentQ]);

  const nextQuestion = useCallback(() => {
    if (currentQ+1 >= questions.length) { setScreen("results"); return; }
    setCurrentQ(q => q+1);
    setSelectedAns(null);
    setAnswered(false);
  }, [currentQ, questions.length]);

  /* ── Fake Ollama loading then instant questions ── */
  const startQuiz = () => {
    setScreen("generating");
    setLoadingStep(0);

    const steps = [
      "Connecting to Ollama llama3.1…",
      "Loading model weights…",
      "Generating questions for " + (selectedSub || selectedTopic?.label) + "…",
      "Formatting quiz…",
    ];

    let i = 0;
    setLoadingMsg(steps[0]);
    const interval = setInterval(() => {
      i++;
      if (i < steps.length) {
        setLoadingMsg(steps[i]);
        setLoadingStep(i);
      } else {
        clearInterval(interval);
        // Now load actual hardcoded questions
        const qs = getQuestions(selectedTopic.id, difficulty, questionCount);
        if (qs.length === 0) {
          // fallback: use medium if hard/easy has too few
          const fallback = getQuestions(selectedTopic.id, "medium", questionCount);
          setQuestions(fallback);
        } else {
          setQuestions(qs);
        }
        setCurrentQ(0);
        setAnswers([]);
        setAnswered(false);
        setSelectedAns(null);
        setScreen("quiz");
      }
    }, 500); // each step 500ms → total ~2 seconds
  };

  const reset = () => {
    setScreen("setup"); setQuestions([]); setCurrentQ(0); setAnswers([]);
    setSelectedAns(null); setAnswered(false); setSelectedTopic(null); setSelectedSub(null);
  };

  const score = answers.filter(a=>a.isCorrect).length;

  /* ══ SETUP ══ */
  const SetupScreen = () => (
    <div style={{ maxWidth:720,margin:"0 auto",padding:"32px 20px" }}>
      <div className="animate-fade-up" style={{ textAlign:"center",marginBottom:36 }}>
        <div style={{ display:"inline-flex",alignItems:"center",gap:8,padding:"6px 16px",borderRadius:20,background:dark?"rgba(59,130,246,0.15)":"rgba(59,130,246,0.1)",border:`1px solid ${dark?"rgba(59,130,246,0.3)":"rgba(147,197,253,0.5)"}`,marginBottom:16 }}>
          <span style={{ width:6,height:6,borderRadius:"50%",background:"#3B82F6",display:"inline-block" }}/>
          <span style={{ fontSize:11,fontWeight:700,letterSpacing:"0.1em",color:"#60A5FA",textTransform:"uppercase" }}>AI-Powered Quiz</span>
        </div>
        <h1 style={{ fontFamily:"'Syne',sans-serif",fontSize:"clamp(28px,5vw,44px)",fontWeight:800,lineHeight:1.1,marginBottom:10 }}>
          <span style={{ color:textMain }}>Test Your </span><span className="text-shimmer">Knowledge</span>
        </h1>
        <p style={{ fontSize:15,color:textMuted }}>Pick a topic, set difficulty, and start your quiz instantly.</p>
      </div>

      {/* Step 1 */}
      <div className="animate-fade-up d1" style={{ ...cardStyle,padding:24,marginBottom:16 }}>
        <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:20 }}>
          <div style={{ width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#2563EB,#3B82F6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:"white" }}>1</div>
          <h2 style={{ fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:700,color:textMain }}>Choose a Subject</h2>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10 }}>
          {TOPICS.map(t=>(
            <div key={t.id} className={`topic-card ${selectedTopic?.id===t.id?"selected":""}`} onClick={()=>{setSelectedTopic(t);setSelectedSub(null);}}>
              <div style={{ fontSize:24,marginBottom:6 }}>{t.icon}</div>
              <div style={{ fontSize:13,fontWeight:700,color:textMain }}>{t.label}</div>
            </div>
          ))}
        </div>
        {selectedTopic && (
          <div style={{ marginTop:16 }}>
            <p style={{ fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:textMuted,marginBottom:10 }}>Specific Topic (optional)</p>
            <div style={{ display:"flex",flexWrap:"wrap",gap:8 }}>
              {selectedTopic.subs.map(s=>(
                <button key={s} className={`sub-chip ${selectedSub===s?"active":""}`} onClick={()=>setSelectedSub(selectedSub===s?null:s)}>{s}</button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Step 2 */}
      <div className="animate-fade-up d2" style={{ ...cardStyle,padding:24,marginBottom:16 }}>
        <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:20 }}>
          <div style={{ width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#2563EB,#3B82F6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:"white" }}>2</div>
          <h2 style={{ fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:700,color:textMain }}>Difficulty Level</h2>
        </div>
        <div style={{ display:"flex",gap:10 }}>
          {DIFFICULTY.map(d=>(
            <button key={d.id} className="diff-pill" onClick={()=>setDifficulty(d.id)} style={{ borderColor:difficulty===d.id?d.color:"transparent",background:difficulty===d.id?`${d.color}20`:(dark?"rgba(15,30,55,0.7)":"rgba(241,245,249,0.8)"),color:difficulty===d.id?d.color:textMuted }}>
              {d.label}
              <span style={{ display:"block",fontSize:11,fontWeight:400,marginTop:2,color:difficulty===d.id?d.color:"#64748B" }}>{d.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step 3 */}
      <div className="animate-fade-up d3" style={{ ...cardStyle,padding:24,marginBottom:28 }}>
        <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:20 }}>
          <div style={{ width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#2563EB,#3B82F6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:"white" }}>3</div>
          <h2 style={{ fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:700,color:textMain }}>Number of Questions</h2>
          <span style={{ marginLeft:"auto",fontSize:12,color:textMuted }}>⏱ {questionCount*TIME_PER_Q}s total</span>
        </div>
        <div style={{ display:"flex",gap:10 }}>
          {QUESTION_COUNTS.map(n=>(
            <button key={n} className="diff-pill" onClick={()=>setQuestionCount(n)} style={{ flex:1,textAlign:"center",borderColor:questionCount===n?"#3B82F6":"transparent",background:questionCount===n?"rgba(59,130,246,0.2)":(dark?"rgba(15,30,55,0.7)":"rgba(241,245,249,0.8)"),color:questionCount===n?"#60A5FA":textMuted,fontSize:20,fontWeight:900 }}>
              {n}<span style={{ display:"block",fontSize:11,fontWeight:500,marginTop:2 }}>questions</span>
            </button>
          ))}
        </div>
      </div>

      <div className="animate-fade-up d4" style={{ textAlign:"center" }}>
        <button className="btn-primary" disabled={!selectedTopic} onClick={startQuiz} style={{ fontSize:16,padding:"16px 48px" }}>
          {selectedTopic?`Start ${selectedSub||selectedTopic.label} Quiz →`:"Select a subject first"}
        </button>
      </div>
    </div>
  );

  /* ══ GENERATING (fake Ollama) ══ */
  const GeneratingScreen = () => (
    <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"80vh",gap:28,padding:32 }}>
      <div style={{ width:88,height:88,borderRadius:"50%",background:"rgba(59,130,246,0.12)",border:"2px solid rgba(59,130,246,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,animation:"pulse-glow 2s ease-in-out infinite" }}>
        🤖
      </div>
      <div style={{ textAlign:"center" }}>
        <h2 style={{ fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:textMain,marginBottom:10 }}>
          Ollama is building your quiz…
        </h2>
        <p style={{ color:"#60A5FA",fontSize:14,fontWeight:600,marginBottom:6 }}>{loadingMsg}</p>
        <p style={{ color:textMuted,fontSize:13 }}>
          Topic: <strong style={{ color:"#60A5FA" }}>{selectedSub||selectedTopic?.label}</strong> · {difficulty}
        </p>
      </div>
      <div style={{ display:"flex",gap:10,alignItems:"center" }}>
        <span className="dot"/><span className="dot"/><span className="dot"/>
      </div>
      {/* Progress steps */}
      <div style={{ display:"flex",flexDirection:"column",gap:8,width:280 }}>
        {["Connecting to Ollama llama3.1…","Loading model weights…","Generating questions…","Formatting quiz…"].map((step,i)=>(
          <div key={i} style={{ display:"flex",alignItems:"center",gap:10,fontSize:12,color:loadingStep>=i?"#60A5FA":textMuted,fontWeight:loadingStep>=i?600:400 }}>
            <span style={{ width:18,height:18,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,background:loadingStep>i?"rgba(34,197,94,0.2)":loadingStep===i?"rgba(59,130,246,0.2)":"rgba(100,116,139,0.1)",color:loadingStep>i?"#86EFAC":loadingStep===i?"#60A5FA":"#64748B",flexShrink:0 }}>
              {loadingStep>i?"✓":i+1}
            </span>
            {step}
          </div>
        ))}
      </div>
    </div>
  );

  /* ══ QUIZ ══ */
  const QuizScreen = () => {
    if (!questions[currentQ]) return null;
    const q = questions[currentQ];
    const optionLabels = ["A","B","C","D"];
    const lastAns = answers[answers.length-1];

    const getOptionClass = (idx) => {
      if (!answered) return "option-btn";
      if (idx===q.correctIndex) return "option-btn correct";
      if (idx===selectedAns && idx!==q.correctIndex) return "option-btn wrong";
      return "option-btn";
    };

    return (
      <div style={{ maxWidth:680,margin:"0 auto",padding:"24px 20px" }}>
        {/* Top bar */}
        <div className="animate-fade-in" style={{ display:"flex",alignItems:"center",gap:12,marginBottom:24 }}>
          <button className="btn-ghost" onClick={reset} style={{ padding:"8px 14px",fontSize:12 }}>← Exit</button>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex",justifyContent:"space-between",fontSize:12,color:textMuted,marginBottom:6,fontWeight:600 }}>
              <span>Question {currentQ+1} of {questions.length}</span>
              <span style={{ color:DIFFICULTY.find(d=>d.id===difficulty)?.color }}>{difficulty.toUpperCase()}</span>
            </div>
            <div className="progress-bar"><div className="progress-fill" style={{ width:`${(currentQ/questions.length)*100}%` }}/></div>
          </div>
          <div style={{ display:"flex",gap:16,fontSize:13,fontWeight:700 }}>
            <span style={{ color:"#22C55E" }}>✓ {answers.filter(a=>a.isCorrect).length}</span>
            <span style={{ color:"#EF4444" }}>✗ {answers.filter(a=>!a.isCorrect).length}</span>
          </div>
        </div>

        {/* Question card */}
        <div className="animate-scale-in" key={currentQ} style={{ ...cardStyle,padding:32,marginBottom:16 }}>
          <div style={{ display:"flex",alignItems:"flex-start",gap:20,marginBottom:28 }}>
            <TimerRing total={TIME_PER_Q} questionKey={currentQ} paused={answered} onExpire={()=>{ if(!answered) handleAnswer(null,true); }}/>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"#60A5FA",marginBottom:10 }}>{selectedSub||selectedTopic?.label}</div>
              <p style={{ fontSize:18,fontWeight:600,color:textMain,lineHeight:1.5 }}>{q.question}</p>
            </div>
          </div>

          <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
            {q.options.map((opt,idx)=>(
              <button key={idx} className={getOptionClass(idx)} disabled={answered} onClick={()=>handleAnswer(idx)}>
                <span style={{ width:28,height:28,borderRadius:8,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,background:answered&&idx===q.correctIndex?"rgba(34,197,94,0.3)":answered&&idx===selectedAns?"rgba(239,68,68,0.3)":dark?"rgba(59,130,246,0.15)":"rgba(59,130,246,0.1)",color:answered&&idx===q.correctIndex?"#86EFAC":answered&&idx===selectedAns?"#FCA5A5":"#60A5FA" }}>
                  {answered&&idx===q.correctIndex?"✓":answered&&idx===selectedAns&&idx!==q.correctIndex?"✗":optionLabels[idx]}
                </span>
                <span style={{ flex:1 }}>{opt}</span>
              </button>
            ))}
          </div>

          {/* ── DETAILED EXPLANATION immediately after answering ── */}
          {answered && (
            <div className="animate-fade-up">
              {/* Result banner */}
              <div style={{ marginTop:16,padding:"12px 18px",borderRadius:14,background:lastAns?.isCorrect?"rgba(34,197,94,0.12)":"rgba(239,68,68,0.1)",border:`1px solid ${lastAns?.isCorrect?"rgba(34,197,94,0.3)":"rgba(239,68,68,0.25)"}` }}>
                <p style={{ fontSize:15,fontWeight:800,color:lastAns?.isCorrect?"#86EFAC":"#FCA5A5",marginBottom:2 }}>
                  {lastAns?.timedOut?"⏰ Time's up!":lastAns?.isCorrect?"🎉 Correct!":"❌ Incorrect"}
                </p>
                {!lastAns?.isCorrect && !lastAns?.timedOut && (
                  <p style={{ fontSize:13,color:"#94A3B8" }}>
                    The correct answer is: <strong style={{ color:"#86EFAC" }}>{q.options[q.correctIndex]}</strong>
                  </p>
                )}
              </div>

              {/* Explanation box */}
              <div className="explanation-box">
                <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:8,fontSize:12,fontWeight:800,letterSpacing:"0.06em",textTransform:"uppercase",color:"#60A5FA" }}>
                  <span>💡</span> Explanation
                </div>
                <p style={{ lineHeight:1.75 }}>{q.explanation}</p>
              </div>
            </div>
          )}
        </div>

        {answered && (
          <div className="animate-fade-up" style={{ textAlign:"center" }}>
            <button className="btn-primary" onClick={nextQuestion}>
              {currentQ+1>=questions.length?"See Results 🏆":"Next Question →"}
            </button>
          </div>
        )}
      </div>
    );
  };

  /* ══ RESULTS ══ */
  const ResultsScreen = () => {
    const pct = score/questions.length;
    const msg = pct>=0.8?"Excellent work! You've mastered this topic.":pct>=0.5?"Good effort! A bit more practice and you'll ace it.":"Keep going! Every attempt makes you stronger.";
    return (
      <div style={{ maxWidth:720,margin:"0 auto",padding:"32px 20px" }}>
        <div className="animate-bounce-in" style={{ ...cardStyle,padding:40,textAlign:"center",marginBottom:24 }}>
          <p style={{ fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"#60A5FA",marginBottom:16 }}>Quiz Complete</p>
          <ScoreRing score={score} total={questions.length}/>
          <h2 style={{ fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:800,color:textMain,margin:"20px 0 8px" }}>
            {pct>=0.8?"Outstanding! 🏆":pct>=0.5?"Well Done! ⭐":"Keep Practising! 💪"}
          </h2>
          <p style={{ fontSize:15,color:textMuted,maxWidth:400,margin:"0 auto 24px" }}>{msg}</p>
          <div style={{ display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap" }}>
            {[{label:"Correct",value:score,color:"#22C55E"},{label:"Wrong",value:answers.filter(a=>!a.isCorrect&&!a.timedOut).length,color:"#EF4444"},{label:"Timed Out",value:answers.filter(a=>a.timedOut).length,color:"#F59E0B"},{label:"Difficulty",value:difficulty.charAt(0).toUpperCase()+difficulty.slice(1),color:DIFFICULTY.find(d=>d.id===difficulty)?.color}].map(s=>(
              <div key={s.label} style={{ padding:"12px 20px",borderRadius:14,background:dark?"rgba(15,30,55,0.8)":"rgba(241,245,249,0.8)",textAlign:"center",minWidth:90 }}>
                <div style={{ fontSize:20,fontWeight:900,color:s.color }}>{s.value}</div>
                <div style={{ fontSize:11,color:textMuted,fontWeight:600 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <h3 className="animate-fade-up" style={{ fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800,color:textMain,marginBottom:16 }}>📋 Question Review</h3>

        <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
          {questions.map((q,idx)=>{
            const ans = answers[idx];
            return (
              <div key={idx} className="animate-fade-up" style={{ animationDelay:`${idx*.07}s`,...cardStyle,padding:24 }}>
                <div style={{ display:"flex",gap:12,alignItems:"flex-start",marginBottom:14 }}>
                  <div style={{ width:32,height:32,borderRadius:"50%",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,background:ans?.isCorrect?"rgba(34,197,94,0.2)":"rgba(239,68,68,0.2)",color:ans?.isCorrect?"#86EFAC":"#FCA5A5",fontWeight:900 }}>
                    {ans?.isCorrect?"✓":ans?.timedOut?"⏰":"✗"}
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:13,fontWeight:700,color:textMuted,marginBottom:4 }}>Q{idx+1}</p>
                    <p style={{ fontSize:15,fontWeight:600,color:textMain }}>{q.question}</p>
                  </div>
                </div>
                <div style={{ paddingLeft:44,marginBottom:12 }}>
                  <div style={{ fontSize:13,color:"#86EFAC" }}>✓ Correct: <strong>{q.options[q.correctIndex]}</strong></div>
                  {!ans?.isCorrect&&<div style={{ fontSize:13,color:ans?.timedOut?"#FBBF24":"#FCA5A5",marginTop:4 }}>{ans?.timedOut?"⏰ Ran out of time":`✗ Your answer: ${ans?.chosen!=null?q.options[ans.chosen]:"—"}`}</div>}
                </div>
                {/* Explanation in results too */}
                <div style={{ paddingLeft:44 }}>
                  <div className="explanation-box" style={{ marginTop:0 }}>
                    <div style={{ fontSize:11,fontWeight:800,letterSpacing:"0.06em",textTransform:"uppercase",color:"#60A5FA",marginBottom:6 }}>💡 Explanation</div>
                    <p style={{ fontSize:13,lineHeight:1.75 }}>{q.explanation}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="animate-fade-up" style={{ display:"flex",gap:12,justifyContent:"center",marginTop:32,flexWrap:"wrap" }}>
          <button className="btn-primary" onClick={reset}>🔁 Try Another Quiz</button>
          <button className="btn-ghost" onClick={()=>navigate("/student/dashboard")}>← Dashboard</button>
          <button className="btn-ghost" onClick={()=>navigate("/student/ai-tutor")}>🤖 AI Tutor</button>
        </div>
      </div>
    );
  };

  /* ══ RENDER ══ */
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }}/>
      <div className={`quiz-app ${dark?"dark":"light"}`}>
        <MeshBg dark={dark}/>
        {/* Nav */}
        <div style={{ position:"sticky",top:0,zIndex:50,background:dark?"rgba(7,14,28,0.88)":"rgba(235,244,255,0.88)",backdropFilter:"blur(20px)",borderBottom:`1px solid ${dark?"rgba(59,130,246,0.15)":"rgba(147,197,253,0.4)"}`,padding:"14px 24px",display:"flex",alignItems:"center",gap:12 }}>
          <button className="btn-ghost" onClick={()=>navigate("/student/dashboard")} style={{ padding:"7px 14px",fontSize:13 }}>← Dashboard</button>
          <div style={{ fontFamily:"'Syne',sans-serif",fontSize:17,fontWeight:800,color:textMain,flex:1 }}>
            📝 Quiz
            {selectedTopic&&screen!=="setup"&&<span style={{ fontSize:13,fontWeight:400,color:textMuted,marginLeft:8 }}>· {selectedSub||selectedTopic.label} · {difficulty}</span>}
          </div>
          <button onClick={toggleDark} style={{ width:48,height:26,borderRadius:13,border:"none",cursor:"pointer",background:dark?"#0284c7":"#e2e8f0",padding:2,display:"flex",alignItems:"center",transition:"background .3s" }}>
            <div style={{ width:22,height:22,borderRadius:"50%",background:"white",transform:dark?"translateX(22px)":"translateX(0)",transition:"transform .3s cubic-bezier(.34,1.56,.64,1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12 }}>{dark?"🌙":"☀"}</div>
          </button>
        </div>
        <div style={{ position:"relative",zIndex:1 }}>
          {screen==="setup"      && <SetupScreen/>}
          {screen==="generating" && <GeneratingScreen/>}
          {screen==="quiz"       && <QuizScreen/>}
          {screen==="results"    && <ResultsScreen/>}
        </div>
      </div>
    </>
  );
}