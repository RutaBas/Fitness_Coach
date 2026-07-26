/* exercises.js — exercise library: figure geometry, cues, mistakes, video links.
   Figures are drawn as stick skeletons in a 100x100 viewBox (y increases downward).
   Joints: hd(head centre), nk(neck), hp(hip), el/hn (elbow/hand), kn/ft (knee/foot).
   Optional second limb set: el2/hn2, kn2/ft2. props: floor, wallR, wallL, box, bar, bell. */

const EX = {

/* ---------- PREP ---------- */
wristPrep: {
  name: "Wrist prep",
  cat: "Prep",
  dose: "2 min · 15–20 sec each",
  why: "Your wrists are the only joint holding your whole bodyweight in a handstand, and they're the most common reason people quit. Two minutes here protects the whole program.",
  how: [
    "On all fours. Palm circles both directions, 15 sec each.",
    "Fingers forward: rock weight gently forward over the wrists, 15 sec.",
    "Fingers backward, palms down: rock back gently, 15 sec.",
    "Flip to backs of hands, fingers toward knees: light pressure, 15 sec.",
    "Fingertip push-ups on the floor: 10 slow reps."
  ],
  cues: ["Move slowly — this is circulation and tissue prep, not a stretch contest.",
         "Never push into sharp pain. Discomfort at the edge is fine, pinching is not."],
  mistake: "Skipping it because you feel fine. Wrist pain shows up cumulatively, three weeks in.",
  vid: "wrist warm up handstand prep",
  fig: { hd:[26,54], nk:[33,58], hp:[62,58], el:[33,72], hn:[33,88], kn:[64,76], ft:[74,88], props:["floor"] }
},

/* ---------- HANDSTAND LINE ---------- */
hollow: {
  name: "Hollow body hold",
  cat: "Line",
  dose: "3–4 × 20–30 sec",
  why: "This IS the handstand shape, just lying down. If you can't hold a hollow, you can't hold a straight handstand — your low back will arch and the balance becomes impossible. This is the single highest-value drill in the program.",
  how: [
    "Lie on your back, arms overhead, legs straight.",
    "Press your low back flat into the floor — no daylight underneath.",
    "Lift shoulders and legs a few inches, keeping the low back glued down.",
    "Hold. The moment your low back lifts off, the set is over."
  ],
  cues: ["Ribs down, belly button to spine.", "Squeeze glutes and quads — the whole body is one rigid piece.",
         "Easier version: bend the knees or keep arms by your sides."],
  mistake: "Letting the low back arch to hold longer. A shorter honest hold beats a long arched one.",
  vid: "hollow body hold tutorial",
  fig: { hd:[34,62], nk:[42,64], hp:[64,68], el:[26,58], hn:[16,54], kn:[78,62], ft:[90,56], props:["floor80"] }
},

wallPlank: {
  name: "Wall plank (feet on wall)",
  cat: "Line",
  dose: "3 × 30 sec",
  why: "Teaches the handstand line horizontally, where you can actually feel and fix it without the fear of falling.",
  how: [
    "Hands on floor, feet up on the wall at hip height, body horizontal.",
    "Push the floor away — shoulders as far from the ground as possible.",
    "Tuck ribs and posterior-tilt the pelvis until the body is one straight line."
  ],
  cues: ["Hands directly under shoulders.", "Push tall through the shoulders — don't sink."],
  mistake: "Sagging hips. If the line breaks, walk feet lower on the wall.",
  vid: "wall plank handstand shape drill",
  fig: { hd:[20,60], nk:[28,60], hp:[58,58], el:[24,74], hn:[24,90], kn:[72,56], ft:[86,54], props:["floor","wallR"] }
},

chestWall: {
  name: "Chest-to-wall handstand",
  cat: "Line",
  dose: "3–4 × 30–60 sec",
  why: "The line-builder. Facing the wall forces a straight body — unlike back-to-wall, which lets you hang out in a banana shape. If your handstand is stalling, it is probably because you've been training the wrong wall orientation.",
  how: [
    "Hands about 25–30 cm from the wall, facing it.",
    "Walk your feet up the wall until your chest is close to it and your body is vertical.",
    "Stack: hands, shoulders, hips, feet in one line. Toes pointed."
  ],
  cues: ["Ribs DOWN — this is the whole drill.", "Squeeze glutes; posterior pelvic tilt.",
         "Push the floor away, ears between your arms.", "Look at the floor between your hands, not forward."],
  mistake: "Arching the low back (the banana). Film yourself from the side — almost everyone is more banana than they think.",
  vid: "chest to wall handstand alignment",
  fig: { hd:[45,60], nk:[41,58], hp:[43,38], el:[40,76], hn:[40,92], kn:[44,24], ft:[45,11], props:["floor","wallNear"] }
},

/* ---------- HANDSTAND BALANCE ---------- */
weightShift: {
  name: "Wall weight-shift",
  cat: "Balance",
  dose: "5 × 3 sec per hand",
  why: "Introduces one-hand loading and teaches you that your fingers, not your arms, do the balancing.",
  how: [
    "Get into a chest-to-wall handstand.",
    "Shift your weight side to side over each hand.",
    "At the far end of the shift, lift the unloaded hand a few centimetres off the floor. Hold 3 sec."
  ],
  cues: ["Keep the line while you shift — don't pike or twist.", "Grip the floor with the fingers of the loaded hand."],
  mistake: "Shifting from the hips instead of the shoulders.",
  vid: "handstand weight shift drill wall",
  fig: { hd:[45,60], nk:[41,58], hp:[43,38], el:[40,76], hn:[40,92], el2:[52,74], hn2:[56,86], kn:[44,24], ft:[45,11], props:["floor","wallNear"] }
},

heelPull: {
  name: "Heel pulls",
  cat: "Balance",
  dose: "8–10 attempts",
  why: "This is the bridge from wall to freestanding, and your main working drill. It's where you learn what balance actually feels like, in small safe doses.",
  how: [
    "Chest-to-wall handstand, fully vertical.",
    "Peel one heel off the wall, then the other.",
    "Hold the balance as long as you can, then let the toes return to the wall.",
    "Rest fully between attempts — this is a skill, not a conditioning drill."
  ],
  cues: ["Balance with your FINGERTIPS: pressing the fingers stops you falling over; releasing lets you come back.",
         "Keep the ribs tucked as the feet leave — most people arch the second they lose the wall.",
         "Aim for quality seconds, not maximum seconds."],
  mistake: "Rushing. If you're gasping and flailing, you're training panic. Stop while it still feels crisp.",
  vid: "handstand heel pulls drill",
  fig: { hd:[45,60], nk:[41,58], hp:[43,38], el:[40,76], hn:[40,92], kn:[41,24], ft:[39,11], props:["floor","wallFar"] }
},

kickUp: {
  name: "Freestanding kick-up",
  cat: "Balance",
  dose: "10–15 attempts",
  why: "The only way to learn to catch balance is to kick up into empty space, over and over, expecting nothing.",
  how: [
    "Hands shoulder-width, staggered stance, front leg bent.",
    "Kick the back leg up and push off the front leg with controlled force.",
    "Aim to arrive just short of vertical, then let the fingers pull you into balance.",
    "If you go over, cartwheel out. If you fall short, step down and go again."
  ],
  cues: ["Look at the floor between your hands.", "Kick with about 70% force — most people kick far too hard.",
         "Arms locked and pushing tall the entire time."],
  mistake: "Bending the arms on the kick-up. Straight arms or nothing.",
  vid: "how to kick up to handstand",
  fig: { hd:[47,60], nk:[44,57], hp:[46,37], el:[43,75], hn:[43,92], kn:[48,23], ft:[50,10], props:["floor"] }
},

bail: {
  name: "Bail practice (cartwheel out)",
  cat: "Balance",
  dose: "5 reps every skill session",
  why: "Do not skip this. Until falling is boring, your nervous system will refuse to let you tip past vertical — and past vertical is exactly where balance is learned. This drill is what unlocks the freestanding handstand.",
  how: [
    "Kick up deliberately hard so you go past vertical.",
    "As you tip, turn your shoulders and hips to one side and step down like a cartwheel.",
    "Pick a preferred side and practise until it's automatic."
  ],
  cues: ["Turn, don't collapse — never fold in half and land on your back.",
         "Practise it fresh at the start, not exhausted at the end."],
  mistake: "Only practising bails when you accidentally need one.",
  vid: "how to bail out of a handstand safely",
  fig: { hd:[54,62], nk:[50,58], hp:[46,40], el:[48,76], hn:[46,92], kn:[38,28], ft:[28,20], props:["floor"] }
},

wallWalk: {
  name: "Wall walk",
  cat: "Balance",
  dose: "3 × 4–6 reps",
  why: "Builds the overhead pushing strength and shoulder confidence that hold the position together.",
  how: [
    "Start in a push-up position with feet against the wall.",
    "Walk your feet up the wall while walking your hands toward it.",
    "Go as close to vertical as you can control, then walk back down slowly."
  ],
  cues: ["Slow on the way down — that's where the strength is built.", "Keep ribs tucked throughout."],
  mistake: "Dropping out of the top instead of walking down.",
  vid: "wall walk handstand exercise",
  fig: { hd:[36,64], nk:[33,60], hp:[38,44], el:[31,76], hn:[30,92], kn:[42,32], ft:[47,24], props:["floor","wallRfar"] }
},

freestanding: {
  name: "Freestanding handstand",
  cat: "Balance",
  dose: "The goal — 10 sec",
  why: "The finish line.",
  how: ["Kick up, catch the balance, breathe, hold.", "Correct with fingers and wrists only."],
  cues: ["Falling forward → press the fingertips down.", "Falling backward → release the fingers, press the heel of the hand.",
         "Breathe. Holding your breath makes you rigid and unbalanceable."],
  mistake: "Chasing time before the line is solid. A straight 5 seconds beats a banana 15.",
  vid: "freestanding handstand balance tips",
  fig: { hd:[50,60], nk:[47,57], hp:[48,37], el:[46,75], hn:[46,92], kn:[48,23], ft:[49,10], props:["floor"] }
},

/* ---------- ARM BALANCE ---------- */
crow: {
  name: "Crow (bakasana)",
  cat: "Skill",
  dose: "4 × as long as clean",
  why: "Your existing arm balances keep the fun in the program and reinforce the same fingertip balance skill.",
  how: ["Squat, hands down shoulder-width, knees high onto the triceps.",
        "Shift weight forward until the feet float.", "Round the upper back, look slightly forward."],
  cues: ["Grip the floor with the fingers.", "Knees as high up the arms as possible — leverage beats strength here."],
  mistake: "Looking straight down, which tips you back to your feet.",
  vid: "crow pose bakasana tutorial",
  fig: { hd:[62,58], nk:[54,58], hp:[36,52], el:[54,72], hn:[52,88], kn:[42,66], ft:[26,60], props:["floor"] }
},

/* ---------- STRENGTH ---------- */
ohp: {
  name: "Overhead press (dumbbells)",
  cat: "Strength",
  dose: "4 × 8",
  why: "The most direct strength carryover to a handstand: it's the same shoulder position, right way up, and you can load it progressively.",
  how: ["Stand tall, dumbbells at shoulder height, elbows slightly forward.",
        "Press overhead until arms are locked and biceps are beside your ears.",
        "Lower under control to the shoulders."],
  cues: ["Ribs down — don't lean back to press. Same rule as the handstand.",
         "Squeeze glutes to lock the pelvis.", "Finish with arms fully overhead, not in front."],
  mistake: "Turning it into a leaning-back bench press. If you have to arch, go lighter.",
  vid: "dumbbell overhead press proper form",
  fig: { hd:[48,32], nk:[48,40], hp:[48,62], el:[40,32], hn:[42,20], kn:[48,80], ft:[48,94], props:["floor","bellUp"] }
},

pikePushup: {
  name: "Pike push-up",
  cat: "Strength",
  dose: "3 × 6",
  why: "Bodyweight overhead pressing in an inverted position — the closest thing to a handstand push-up you can do without going upside down.",
  how: ["Downward dog with feet walked in, hips high.",
        "Bend elbows and lower the crown of your head toward the floor between your hands.",
        "Press back up."],
  cues: ["Elbows track back at ~45°, not flared wide.", "Keep hips stacked over shoulders — the higher the hips, the harder."],
  mistake: "Turning it into a regular push-up by letting the hips drop.",
  vid: "pike push up form tutorial",
  fig: { hd:[32,74], nk:[38,68], hp:[58,42], el:[30,82], hn:[26,92], kn:[70,64], ft:[80,90], props:["floor"] }
},

row: {
  name: "Single-arm row",
  cat: "Strength",
  dose: "3 × 10/side",
  why: "Balances all the pressing. A healthy shoulder needs pulling volume to match, or the joint gets cranky three weeks in.",
  how: ["Hinge at the hips, one hand on a chair for support, back flat.",
        "Row the dumbbell to your hip, elbow close to the ribs.", "Lower under full control."],
  cues: ["Pull with the back, not the biceps — think elbow to back pocket.", "Don't twist the torso to get extra range."],
  mistake: "Yanking with momentum.",
  vid: "single arm dumbbell row form",
  fig: { hd:[26,50], nk:[34,52], hp:[64,52], el:[38,66], hn:[38,78], kn:[68,74], ft:[70,92], props:["floor","bellDown"] }
},

splitSquat: {
  name: "Bulgarian split squat",
  cat: "Strength",
  dose: "3 × 10/side",
  why: "Single-leg strength and hip stability, and the rear leg gets a hip-flexor stretch under load — which is exactly the flexibility you're trying to get back.",
  how: ["Rear foot elevated on a chair, front foot a long stride ahead.",
        "Lower straight down until the front thigh is roughly parallel.", "Drive through the front heel to stand."],
  cues: ["Torso upright, front knee tracking over the toes.", "Squeeze the rear glute at the bottom to feel the hip flexor open."],
  mistake: "Too short a stance, which turns it into a knee-crusher instead of a hip exercise.",
  vid: "bulgarian split squat proper form",
  fig: { hd:[42,26], nk:[42,34], hp:[42,58], el:[36,46], hn:[34,58], kn:[36,76], ft:[36,94], kn2:[58,64], ft2:[72,72], props:["floor","boxR"] }
},

rdl: {
  name: "Romanian deadlift",
  cat: "Strength",
  dose: "3 × 10",
  why: "Hamstring strength through range IS hamstring flexibility. Passive stretching alone is why the flexibility you had didn't stick.",
  how: ["Dumbbells in front of the thighs, knees softly bent.",
        "Push the hips back, letting the weights slide down the legs, back flat.",
        "Stop when you feel a strong hamstring stretch, then drive the hips forward to stand."],
  cues: ["The movement is hips back, NOT bending down.", "Chest stays proud; spine never rounds."],
  mistake: "Squatting instead of hinging. If your knees travel forward, you've lost the exercise.",
  vid: "romanian deadlift dumbbell form",
  fig: { hd:[24,46], nk:[32,48], hp:[62,46], el:[34,62], hn:[34,76], kn:[64,68], ft:[64,94], props:["floor","bellDown"] }
},

sidePlank: {
  name: "Side plank",
  cat: "Strength",
  dose: "3 × 30 sec/side",
  why: "The lateral core keeps you from twisting out of a handstand — an underrated cause of falling sideways.",
  how: ["On your side, elbow under shoulder, body in a straight line.",
        "Lift the hips until shoulder, hip and ankle line up.", "Hold, breathing normally."],
  cues: ["Push the floor away with the bottom shoulder.", "Don't let the hips sag or rotate."],
  mistake: "Letting the top hip roll forward.",
  vid: "side plank correct form",
  fig: { hd:[22,62], nk:[30,64], hp:[58,70], el:[28,80], hn:[22,90], kn:[74,76], ft:[88,84], props:["floor"] }
},

carry: {
  name: "Loaded carry",
  cat: "Strength",
  dose: "3 × 40 sec",
  why: "Underrated for handstands: it teaches the trunk to stay rigid under load while everything else moves.",
  how: ["Heavy dumbbell in one hand (or overhead for extra shoulder work).",
        "Walk slowly, tall and level.", "Switch sides."],
  cues: ["Don't lean away from the weight — stay stacked.", "Ribs down, shoulders level."],
  mistake: "Going too light. This should be genuinely hard to hold on to.",
  vid: "farmers carry suitcase carry form",
  fig: { hd:[48,26], nk:[48,34], hp:[48,58], el:[42,46], hn:[40,60], kn:[44,76], ft:[42,94], kn2:[54,76], ft2:[58,94], props:["floor","bellSide"] }
},

/* ---------- FLEXIBILITY ---------- */
jefferson: {
  name: "Jefferson curl",
  cat: "Flexibility",
  dose: "3 × 8, light",
  why: "The most effective hamstring exercise there is, because it builds strength at end range rather than just stretching. This is how lost flexibility comes back and stays.",
  how: ["Stand on a step or the floor, holding a LIGHT dumbbell.",
        "Tuck the chin, then roll down one vertebra at a time, legs straight.",
        "Let the weight hang at the bottom, then roll back up the same way, one vertebra at a time."],
  cues: ["Deliberately round the spine — that's the point of this exercise.",
         "Start ridiculously light (2–5 kg). Ego here causes injuries.",
         "Slow: 3–4 seconds down, 3–4 seconds up."],
  mistake: "Loading heavy too soon. Progress by millimetres of range, not kilos.",
  vid: "jefferson curl tutorial hamstring",
  fig: { hd:[46,50], nk:[46,42], hp:[50,42], el:[44,60], hn:[44,74], kn:[50,68], ft:[50,94], props:["floor","bellDown"] }
},

pigeon: {
  name: "Elevated pigeon",
  cat: "Flexibility",
  dose: "90 sec/side",
  why: "Opens the outer hip and glute, which is what actually limits most people's forward folds and deep hip poses.",
  how: ["Front shin across a chair or block, back leg extended behind.",
        "Square the hips forward, then fold over the front leg."],
  cues: ["Keep both hip points facing forward — don't collapse to one side.",
         "Breathe into it; back off if you feel anything in the front knee."],
  mistake: "Letting the front knee take the stretch instead of the hip.",
  vid: "pigeon pose hip opener modification",
  fig: { hd:[30,54], nk:[36,58], hp:[52,62], el:[32,72], hn:[26,86], kn:[42,74], ft:[62,76], kn2:[70,72], ft2:[86,84], props:["floor"] }
},

couch: {
  name: "Couch stretch",
  cat: "Flexibility",
  dose: "90 sec/side + 10 glute bridges",
  why: "Hip flexors that don't extend force the low back to arch — which is exactly the banana handstand you're trying to fix. This stretch is secretly a handstand drill.",
  how: ["Kneel with the back shin against a wall or couch, foot up.",
        "Front foot planted ahead. Tuck the pelvis under and stand tall.",
        "Immediately after, do 10 glute bridges to lock in the new range."],
  cues: ["Posterior pelvic tilt is what makes this work — without it you're just kneeling.",
         "Squeeze the glute of the back leg hard."],
  mistake: "Arching the low back to get 'deeper'. That's cheating the stretch out of the hip.",
  vid: "couch stretch hip flexor proper form",
  fig: { hd:[36,28], nk:[38,36], hp:[42,58], el:[34,48], hn:[32,60], kn:[30,76], ft:[24,94], kn2:[54,74], ft2:[62,54], props:["floor","wallRfar"] }
},

puppy: {
  name: "Puppy pose",
  cat: "Flexibility",
  dose: "90 sec",
  why: "Direct shoulder-flexion mobility — the ability to get your arms fully overhead without arching. Without it, a straight handstand is anatomically impossible.",
  how: ["Kneel, walk the hands forward, hips stay over the knees.",
        "Melt the chest toward the floor, arms straight."],
  cues: ["Hips stay stacked over knees — don't slide back into child's pose.",
         "Keep ribs down; the stretch should be in the armpits, not the low back.",
         "Elbows off the floor, palms down, thumbs up if you can."],
  mistake: "Letting the low back arch to fake more shoulder range.",
  vid: "puppy pose shoulder opener",
  fig: { hd:[34,76], nk:[40,72], hp:[64,54], el:[30,82], hn:[18,88], kn:[66,78], ft:[80,84], props:["floor"] }
},

thoracic: {
  name: "Thoracic extension over a roll",
  cat: "Flexibility",
  dose: "2 min",
  why: "A stiff upper back forces the low back to do the arching. Free the thoracic spine and your overhead position improves immediately.",
  how: ["Roll up a mat or use a foam roller, place it across the mid-back.",
        "Support the head with the hands, lie back over the roll.",
        "Breathe, then move the roll a few centimetres and repeat."],
  cues: ["Keep the ribs from flaring — the extension should happen at the roller, not the low back.",
         "Exhale into the position."],
  mistake: "Rolling too low, into the lumbar spine.",
  vid: "thoracic extension foam roller mobility",
  fig: { hd:[26,64], nk:[34,64], hp:[62,72], el:[30,54], hn:[22,52], kn:[74,62], ft:[86,72], props:["floor80","roller"] }
},

thread: {
  name: "Thread the needle",
  cat: "Flexibility",
  dose: "60 sec/side",
  why: "Thoracic rotation, which keeps the shoulders healthy under all the pressing volume.",
  how: ["On all fours, slide one arm underneath the body, palm up.",
        "Rest the shoulder and side of the head on the floor.", "Breathe and let it settle."],
  cues: ["Keep the hips high and square.", "The rotation comes from the ribcage, not the low back."],
  mistake: "Dropping the hips, which turns it into a shoulder squash.",
  vid: "thread the needle stretch yoga",
  fig: { hd:[30,86], nk:[38,78], hp:[64,58], el:[46,84], hn:[58,88], kn:[68,78], ft:[80,86], props:["floor"] }
},

deadHang: {
  name: "Dead hang",
  cat: "Flexibility",
  dose: "3 × 20–30 sec",
  why: "Decompresses the spine and builds overhead shoulder range under load — plus grip, which never hurts.",
  how: ["Hang from a bar, arms straight, shoulders relaxed but not fully limp.",
        "Breathe. Build up total hang time over the weeks."],
  cues: ["Slight active tension in the shoulders is safer than a total dead flop.", "Ribs down, legs quiet."],
  mistake: "Swinging.",
  vid: "dead hang benefits shoulder mobility",
  fig: { hd:[48,32], nk:[48,38], hp:[48,60], el:[46,26], hn:[44,16], kn:[48,78], ft:[48,92], props:["bar"] }
},

dislocates: {
  name: "Band dislocates",
  cat: "Flexibility",
  dose: "3 × 10",
  why: "Actively takes the shoulders through full overhead range — the cheapest, fastest shoulder-mobility win in the program.",
  how: ["Hold a band wide, arms straight.",
        "Sweep it overhead and behind you, keeping the elbows locked.",
        "Return the same way. Narrow the grip as you get more mobile."],
  cues: ["Arms stay straight the whole time — bending is how people fake range.",
         "Go wide enough that it never pinches.", "Ribs down: don't arch to get the band over."],
  mistake: "Grip too narrow too soon.",
  vid: "shoulder dislocates band mobility",
  fig: { hd:[48,32], nk:[48,40], hp:[48,62], el:[32,26], hn:[22,22], el2:[64,26], hn2:[74,22], kn:[48,80], ft:[48,94], props:["floor","bandArc"] }
},

ankle: {
  name: "Knee-to-wall ankle",
  cat: "Flexibility",
  dose: "2 × 60 sec/side",
  why: "Ankle range shows up everywhere in yoga — squats, lunges, chair pose — and it's easy to measure, which makes it a good benchmark.",
  how: ["Foot a few centimetres from the wall, drive the knee forward to touch the wall.",
        "Heel stays down. Move the foot back until the knee just barely reaches.",
        "Measure that distance in cm — that's your benchmark."],
  cues: ["Heel glued down. The second it lifts, the rep doesn't count.", "Knee tracks over the middle toes."],
  mistake: "Letting the arch collapse inward to reach further.",
  vid: "knee to wall ankle mobility test",
  fig: { hd:[30,40], nk:[34,46], hp:[40,62], el:[40,54], hn:[52,58], kn:[54,72], ft:[44,92], kn2:[36,76], ft2:[24,92], props:["floor","wallRfar"] }
},

bridge: {
  name: "Bridge / wheel",
  cat: "Flexibility",
  dose: "3 × 20–30 sec",
  why: "A full-body extension test. If the wheel feels stuck, it's almost always hip flexors and thoracic spine, not your low back.",
  how: ["Lie on your back, feet planted, hands by the ears, fingers toward the shoulders.",
        "Press up to a bridge; straighten the arms as far as comfortable.",
        "Push the chest toward the wall behind you."],
  cues: ["Press the floor away through the hands and squeeze the glutes.",
         "Think length, not depth — reach the chest through, don't crunch the low back."],
  mistake: "Feet turning out and knees splaying, which dumps the load into the lumbar spine.",
  vid: "wheel pose urdhva dhanurasana tutorial",
  fig: { hd:[26,72], nk:[34,66], hp:[54,44], el:[26,80], hn:[20,90], kn:[70,64], ft:[76,90], props:["floor"] }
},

cardio: {
  name: "Zone 2 cardio",
  cat: "Cardio",
  dose: "30–40 min",
  why: "Builds the aerobic base that makes everything else recover faster. Deliberately low-decision: this is the session for days when your brain is done.",
  how: ["Brisk walk, easy jog, or bike for 30–40 minutes.",
        "Conversational pace — you should be able to speak in full sentences.",
        "Every second week, optionally swap in 8 × 30 sec hard / 90 sec easy."],
  cues: ["If you can't talk, you're going too hard. Zone 2 feels almost too easy — that's correct.",
         "Podcast or music on. No thinking required."],
  mistake: "Going moderately hard every time, which is too hard to recover from and too easy to build fitness.",
  vid: "zone 2 training explained",
  fig: { hd:[52,28], nk:[50,36], hp:[46,58], el:[58,44], hn:[64,36], el2:[38,46], hn2:[32,56], kn:[58,68], ft:[64,82], kn2:[36,72], ft2:[26,86], props:["floor"] }
},

/* ---------- RELOAD BLOCK (added after week-1 feedback: 3 months detrained) ---------- */
deadBug: {
  name: "Dead bug",
  cat: "Reload",
  dose: "3 × 8/side",
  why: "The hollow body hold you couldn't finish, broken into pieces. Same job — teaching your low back to stay flat while your limbs move — but with none of the endurance demand. Earn the hollow from here.",
  how: [
    "Lie on your back, knees bent 90° over your hips, arms straight up at the ceiling.",
    "Press your low back flat into the floor. Keep it there for the whole set.",
    "Slowly lower one arm overhead and the opposite leg toward the floor.",
    "Return, then switch sides. That's one rep per side."
  ],
  cues: ["The only rule: the low back never lifts off the floor. Stop the range short if it does.",
         "Move slowly — 3 seconds out, 3 seconds back.",
         "Exhale as the limbs extend."],
  mistake: "Going too far. Shorter range with a flat back beats a full reach with an arched one.",
  vid: "dead bug exercise proper form",
  fig: { hd:[30,62], nk:[38,64], hp:[62,68], el:[34,50], hn:[30,38], kn:[66,52], ft:[64,38], kn2:[74,74], ft2:[86,70], props:["floor80"] }
},

plankHold: {
  name: "Forearm plank",
  cat: "Reload",
  dose: "4 × 15–20 sec",
  why: "You couldn't hold the wall plank for 30 seconds — that's information, not failure. This is the same shape at ground level, where you can build the time honestly before adding an inversion.",
  how: [
    "Forearms on the floor, elbows under shoulders, feet hip-width.",
    "Push the floor away, tuck the ribs, squeeze glutes: one straight line from head to heels.",
    "Hold for 15 seconds. Rest 45. Repeat."
  ],
  cues: ["Short and perfect beats long and sagging.",
         "Tuck the pelvis slightly — you should feel the lower abs, not the low back.",
         "Too hard? Drop to your knees and keep the same rib-tuck."],
  mistake: "Holding to failure. Stop each set while the line is still good; add 5 seconds next week.",
  vid: "forearm plank correct form",
  fig: { hd:[22,74], nk:[30,76], hp:[58,80], el:[26,86], hn:[16,88], kn:[74,82], ft:[90,90], props:["floor"] }
},

shoulderTaps: {
  name: "Plank shoulder taps",
  cat: "Reload",
  dose: "3 × 8/side",
  why: "Teaches one-arm loading and anti-rotation — the exact skill the wall weight-shift needs, learned safely on the ground first.",
  how: [
    "High plank, hands under shoulders, feet a little wider than normal for stability.",
    "Lift one hand and tap the opposite shoulder. Return it.",
    "Alternate. Keep the hips completely still."
  ],
  cues: ["Widen the feet if the hips rock — stability first.",
         "Push tall through the supporting shoulder.",
         "Slow. Speed hides the wobble instead of fixing it."],
  mistake: "Rushing so the hips swing. The point is that nothing moves except the arm.",
  vid: "plank shoulder taps exercise",
  fig: { hd:[22,72], nk:[30,74], hp:[58,78], el:[28,84], hn:[26,92], el2:[38,72], hn2:[34,68], kn:[74,80], ft:[90,90], props:["floor"] }
},

inclinePush: {
  name: "Incline push-up",
  cat: "Reload",
  dose: "3 × 8–10",
  why: "Rebuilds pressing strength from wherever you actually are today. Hands on your couch is a real exercise, not a consolation prize — and you lower the surface as you get stronger, which is progression you can see.",
  how: [
    "Hands on the arm of the couch, a table, or a counter — the higher the surface, the easier.",
    "Walk your feet back so your body is one straight line.",
    "Lower your chest to the surface, elbows at about 45°, then press up.",
    "When 3 × 10 feels solid, use a lower surface."
  ],
  cues: ["Ribs down, glutes on — it's a moving plank.",
         "Elbows back at 45°, not flared out to the sides.",
         "Full range: chest actually touches."],
  mistake: "Letting the hips lead so it becomes a hip-hinge instead of a press.",
  vid: "incline push up progression beginner",
  fig: { hd:[38,58], nk:[44,62], hp:[66,76], el:[38,64], hn:[30,62], kn:[78,86], ft:[90,93], props:["floor","boxL"] }
},

bearHold: {
  name: "Bear hold",
  cat: "Reload",
  dose: "3 × 20 sec",
  why: "Gets weight into your hands and wrists with your feet still on the ground — the gentlest possible on-ramp back to loading your upper body.",
  how: [
    "All fours, hands under shoulders, knees under hips.",
    "Tuck the toes and lift the knees a couple of centimetres off the floor.",
    "Hold. Back flat, hips level."
  ],
  cues: ["Knees barely hover — height isn't the point, the flat back is.",
         "Push the floor away and feel the shoulders working.",
         "Breathe normally; don't brace so hard you hold your breath."],
  mistake: "Hips rising into a pike, which takes the load off the shoulders.",
  vid: "bear hold plank exercise",
  fig: { hd:[26,62], nk:[34,64], hp:[62,64], el:[32,78], hn:[32,92], kn:[64,78], ft:[76,88], props:["floor"] }
},

dogHold: {
  name: "Downward dog hold",
  cat: "Reload",
  dose: "3 × 30 sec",
  why: "You already own this pose. Here it's used deliberately as loaded overhead shoulder work and wrist conditioning — the two things that need to come back before anything goes vertical.",
  how: [
    "Downward dog. Hands shoulder-width, fingers spread wide.",
    "Push the floor away, ears between the arms, hips high.",
    "Hold 30 seconds, feeling the weight in the hands and shoulders."
  ],
  cues: ["Spread the fingers and grip lightly — that's the handstand hand position.",
         "Straight arms, external rotation: think 'turn the armpits toward each other'.",
         "Bend the knees as much as you like; the shoulders are the target, not the hamstrings."],
  mistake: "Hanging in the shoulders instead of actively pushing.",
  vid: "downward dog shoulder alignment",
  fig: { hd:[32,72], nk:[38,68], hp:[58,44], el:[28,80], hn:[22,92], kn:[72,66], ft:[84,92], props:["floor"] }
},

boxPike: {
  name: "Box pike hold",
  cat: "Reload",
  dose: "3 × 20–30 sec",
  why: "The safe substitute for chest-to-wall, and the most useful drill in this whole block. Feet on a chair puts your shoulders in almost the handstand position with most of your bodyweight overhead — but your feet are already resting on something, so there is no way to fall on your head. It also needs about a metre of floor, which solves your space problem.",
  how: [
    "Put your feet on a chair or couch, hands on the floor.",
    "Walk your hands back until your hips stack over your shoulders — a steep upside-down V.",
    "Push tall through the shoulders, tuck the ribs, look at the floor between your hands.",
    "To come out: walk your hands forward and step down. Never a fall, just a step."
  ],
  cues: ["The closer your hands are to the chair, the more vertical and the harder it gets.",
         "Same rules as the handstand: ribs tucked, straight arms, push the floor away.",
         "Progress by walking the hands in a few centimetres, not by adding time forever."],
  mistake: "Bent arms. If the elbows soften, walk the hands out and make it easier.",
  vid: "elevated pike hold handstand progression",
  fig: { hd:[30,68], nk:[36,64], hp:[58,42], el:[28,78], hn:[26,92], kn:[72,56], ft:[84,70], props:["floor","boxR"] }
},

boxPikePush: {
  name: "Box pike push-up",
  cat: "Reload",
  dose: "3 × 5–8",
  why: "Once you can hold the box pike, this is how the overhead pressing strength comes back — and it's the honest prerequisite for wall walks.",
  how: [
    "Set up in the box pike hold.",
    "Bend the elbows and lower the crown of your head toward the floor between your hands.",
    "Press back up to straight arms."
  ],
  cues: ["Elbows track back, not out.", "Only go as low as you can press back up from.",
         "Fewer clean reps beat more sloppy ones."],
  mistake: "Letting the hips drop forward so it becomes a normal push-up.",
  vid: "pike push up feet elevated tutorial",
  fig: { hd:[28,78], nk:[36,66], hp:[58,42], el:[24,80], hn:[26,92], kn:[72,56], ft:[84,70], props:["floor","boxR"] }
},

partialWall: {
  name: "Partial wall walk",
  cat: "Reload",
  dose: "3 × 3–4 reps",
  why: "The wall walk, but you decide where to stop. Going only as high as feels calm is not cheating — it's how you build the strength and the nerve at the same time. Height comes on its own over the weeks.",
  how: [
    "Start in a push-up position with your feet against the wall.",
    "Walk your feet a few steps up the wall — stop wherever it still feels completely controlled.",
    "Hold 3–5 seconds, then walk back down slowly.",
    "Each week, one step higher. There's no deadline."
  ],
  cues: ["You can always come down the way you came up — this drill has no fall in it.",
         "Ribs tucked as you climb; that's what stops the low back arching.",
         "If your arms shake, that's your stopping height for today."],
  mistake: "Racing to vertical. A controlled half-height walk builds more than a panicky full one.",
  vid: "wall walk beginner progression",
  fig: { hd:[30,72], nk:[36,68], hp:[48,62], el:[34,80], hn:[34,92], kn:[64,58], ft:[78,54], props:["floor","wallRfar"] }
},

stepDown: {
  name: "Walk-down exit",
  cat: "Reload",
  dose: "Learn it once, use it always",
  why: "This replaces the cartwheel bail, and it's the right call for a tight apartment. Every drill in this block is one you can reverse: you walk in, you walk out. You'll only need the cartwheel much later, if you ever choose to go freestanding — and by then it won't scare you.",
  how: [
    "From any wall or elevated position, the exit is the entry in reverse.",
    "Wall walk: walk the feet back down the wall, one step at a time.",
    "Box pike: walk the hands forward until the hips drop, then step off the chair.",
    "Practise the exit deliberately a few times before you push the position."
  ],
  cues: ["Rehearse coming out BEFORE you go further in. Knowing the way out is what removes the fear.",
         "Slow exits build as much strength as the hold itself.",
         "If you can't exit under control, the position was too advanced for today."],
  mistake: "Only thinking about getting in. Half of every drill is the way back out.",
  vid: "how to come down from wall handstand safely",
  fig: { hd:[34,74], nk:[38,70], hp:[50,64], el:[36,82], hn:[36,92], kn:[64,62], ft:[76,60], props:["floor","wallRfar"] }
}
};


/* ---------- SESSION DEFINITIONS ----------
   Day A is phase-aware: items is a function of the current week, so the app serves
   the reload block first and only introduces inversion work once it's earned. */

const RELOAD_A = [
  ["wristPrep","3 min"],["dogHold","3 × 30 sec"],["bearHold","3 × 20 sec"],
  ["plankHold","4 × 15–20 sec"],["deadBug","3 × 8/side"],["shoulderTaps","3 × 8/side"],
  ["boxPike","3 × 20–30 sec"],["stepDown","rehearse the exit"],["crow","3 easy sets"]
];
const SKILL_A = [
  ["wristPrep","3 min"],["thoracic","2 min"],["dogHold","2 × 30 sec"],["hollow","4 × 30 sec"],
  ["boxPikePush","3 × 5–8"],["partialWall","3 × 3–4 reps"],["wallPlank","3 × 30 sec"],
  ["chestWall","3 × 30 sec"],["stepDown","every rep"],["crow","4 sets"]
];
const BALANCE_A = [
  ["wristPrep","3 min"],["hollow","4 × 30 sec"],["chestWall","4 × 40 sec"],
  ["weightShift","5 × 3 sec/hand"],["heelPull","8–10 attempts"],["stepDown","every rep"],["crow","4 sets"]
];

const SESSIONS = {
  daily: { id:"daily", name:"Daily 10", sub:"The floor — every day, including rest days", mins:10, color:"#5ee0b0",
    items: w => w<=4
      ? [["wristPrep","2 min"],["dogHold","2 × 30 sec"],["deadBug","2 × 8/side"],["puppy","3 min (rotate the target)"]]
      : [["wristPrep","2 min"],["boxPike","3 × 30 sec"],["hollow","3 × 20 sec"],["puppy","3 min (rotate the target)"]] },

  A: { id:"A", name:"Day A — Skill", sub:"45 min · do this fresh, never after strength", mins:45, color:"#7c9cff",
    items: w => w<=4 ? RELOAD_A : (w<=8 ? SKILL_A : BALANCE_A) },

  B: { id:"B", name:"Day B — Strength", sub:"45 min · dumbbells + bodyweight", mins:45, color:"#f0b45e",
    items: w => (w<=4
      ? [["wristPrep","2 min"],["inclinePush","3 × 8–10"],["ohp","3 × 8, light"],["row","3 × 10/side"],
         ["splitSquat","2 × 8/side"],["rdl","3 × 10"],["deadBug","3 × 8/side"],
         ["sidePlank","3 × 15 sec/side"],["carry","3 × 30 sec"]]
      : [["wristPrep","2 min"],["ohp","4 × 8"],["boxPikePush","3 × 6"],["inclinePush","3 × 10"],["row","3 × 10/side"],
         ["splitSquat","3 × 10/side"],["rdl","3 × 10"],["hollow","3 × 20 reps (rocks)"],
         ["sidePlank","3 × 30 sec/side"],["carry","3 × 40 sec"]]) },

  C: { id:"C", name:"Day C — Cardio", sub:"30–40 min · zone 2, no decisions required", mins:35, color:"#e08b8b",
    items: [["cardio","30–40 min"]] },

  D: { id:"D", name:"Day D — Flexibility", sub:"45 min · optional but this is how you get it back", mins:45, color:"#b98bde",
    items: [["jefferson","3 × 8"],["pigeon","90 sec/side"],["couch","90 sec/side"],["deadHang","3 × 25 sec"],
            ["dislocates","3 × 10"],["puppy","90 sec"],["thoracic","2 min"],["thread","60 sec/side"],
            ["ankle","2 × 60 sec/side"],["bridge","3 × 25 sec"]] }
};

/* Stage 1 is new: nobody skips it, and it's where you actually are today. */
const STAGES = [
  ["Foundations","Rebuild pressing strength and the hollow shape on the ground","4 × 20 sec forearm plank · 3 × 10 incline push-ups · 3 × 30 sec box pike"],
  ["Elevated pike","Box pike push-ups and partial wall walks, feet always supported","3 × 6 box pike push-ups · partial wall walk to hip height, calm"],
  ["Line","Chest-to-wall, ribs down, no low-back arch","3 × 60 sec with a straight line on video"],
  ["Wall weight-shift","Shift side to side, briefly lift one hand","3 sec per hand, 5 times"],
  ["Heel pulls","Peel both heels off the wall and find balance","5 sec off the wall, 3 sessions running"],
  ["Freestanding kick-up","Kick up into the room, catch the balance","3 sec unassisted, consistently"],
  ["The hold","Freestanding handstand","10 seconds — the goal"],
  ["Control","Press to handstand, handstand → chaturanga, in flow","Bonus territory"]
];

const PHASES = [
  [1,4,"Reload","Three months off is real, and this block respects it. Everything stays on the ground or with your feet supported. No falling, no kick-ups, nothing that needs more floor space than a yoga mat."],
  [5,8,"Elevated","Feet on a chair, then partway up the wall. You still walk out of every position — the exit is always the entry in reverse."],
  [9,12,"Line","Chest-to-wall work once the strength is there to hold it. Expect a plateau around week 10; it's normal."],
  [13,16,"Balance","Weight shifts and heel pulls. Freestanding work only if and when you want it — the program is complete without it."]
];

const BENCH = [
  ["plank","Forearm plank hold","sec"],
  ["incline","Incline push-ups (couch height)","reps"],
  ["pike","Box pike hold","sec"],
  ["fold","Forward fold — how far do the fingers reach?","text"],
  ["cw","Chest-to-wall handstand hold","sec"],
  ["ankle","Knee-to-wall ankle","cm"]
];

const RULES = [
  ["Miss one, never miss two","The second missed day is the one that ends programs."],
  ["The Daily 10 always counts","Showing up beats optimising. On a bad day it IS the workout."],
  ["Scared means the drill is wrong, not you","Every position here has a walk-out. If one has no exit you're comfortable with, it's too early — regress it."],
  ["Never train skill work tired","Fatigued reps teach bad patterns. Stop while it still feels crisp."],
  ["Track the stage, not the day","Moving from Stage 1 to 2 is real progress even in a week you only trained twice."]
];
