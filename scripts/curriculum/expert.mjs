import { copy, lesson, panicEx, panicRule, quiz, text, withHint } from "./helpers.mjs";

function say(id, th, en) {
  return { id, th, en };
}

const quiet = 'package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("ok")\n}\n';

function quizLesson(id, title, goal, bodyTh, bodyEn, questions) {
  return lesson({
    id,
    level: "expert",
    title: text(title[0], title[1]),
    goal: text(goal[0], goal[1]),
    copy: copy(bodyTh, bodyEn),
    exercises: questions,
  });
}

function q(id, promptTh, promptEn, ruleTh, ruleEn, choicesTh, choicesEn, answer) {
  return quiz(say(id, promptTh, promptEn), { th: ruleTh, en: ruleEn }, { th: choicesTh, en: choicesEn }, answer);
}

const answerHere = [
  "ใช้เมื่อต้องอธิบายพฤติกรรมที่การรันครั้งเดียวพิสูจน์ไม่ได้",
  "เคสง่ายคือตัวเลือกที่ตรงนิยาม",
  "เคสยากคือตัวเลือกที่คนมักสับสนกับของใกล้เคียง",
  ["อ่านคำถาม", "ตัดตัวเลือกที่ขัดกติกา", "เลือกข้อที่ตรงพฤติกรรม", "ส่งคำตอบในหน้านี้"],
];

const answerHereEn = [
  "Use it when one run cannot prove the behavior.",
  "The easy case is the choice that matches the definition.",
  "The hard case is the choice people mix up with a neighbor.",
  ["Read the question", "Drop the choice that breaks the rule", "Pick the one that matches the behavior", "Submit on this page"],
];

export const expert = [
  quizLesson(
    "e01-memory-model",
    ["memory model", "Memory model"],
    ["อธิบาย happens-before ของ channel และ sync", "Explain happens-before for channels and sync"],
    [
      "memory model บอกว่าการเขียนค่าหนึ่งจะถูกการอ่านอีก goroutine เห็นเมื่อไร การส่งผ่าน channel มี happens-before ระหว่างการส่งที่สำเร็จกับการรับที่คู่กัน แค่เห็นลำดับครั้งเดียวไม่ได้พิสูจน์ว่าไม่มี data race\n\n```\nch <- 1\nv := <-ch\n```",
      ...answerHere,
    ],
    [
      "The memory model says when a write in one goroutine becomes visible to a read in another. A successful send happens before the matching receive. Seeing one order once does not prove there is no data race.\n\n```\nch <- 1\nv := <-ch\n```",
      ...answerHereEn,
    ],
    [
      q("easy", "การส่งค่าเข้า channel ที่สำเร็จ สัมพันธ์กับการรับคู่นั้นอย่างไร", "How does a successful send relate to its matching receive?", "การส่ง happens-before การรับที่คู่กัน", "The send happens before the matching receive", ["การรับมาก่อนการส่งเสมอ", "การส่ง happens-before การรับที่คู่กัน", "ไม่มีลำดับใดๆ", "ขึ้นกับความเร็วของ CPU เท่านั้น"], ["The receive always happens first", "The send happens before the matching receive", "There is no order", "It depends only on CPU speed"], 1),
      q("mid", "เห็นลำดับผลครั้งเดียวแล้วสรุปว่าไม่มี data race ได้ไหม", "Can one observed order prove there is no data race?", "ไม่ได้ ต้องมี happens-before จาก channel หรือ sync", "No. You need happens-before from a channel or from sync", ["ได้เสมอ", "ไม่ได้ ต้องมี happens-before จาก channel หรือ sync", "ได้ถ้ารันบนเครื่องเดียว", "ได้ถ้าใช้ fmt.Println"], ["Yes, always", "No. You need happens-before from a channel or from sync", "Yes on one machine", "Yes if you use fmt.Println"], 1),
      q("hard", "sync.Mutex ที่ Lock และ Unlock ถูกต้องให้อะไร", "What does a correctly used sync.Mutex give you?", "happens-before ระหว่าง Unlock กับ Lock ถัดไปของ mutex เดียวกัน", "Happens-before between Unlock and the next Lock of the same mutex", ["เร่งความเร็วเสมอ", "happens-before ระหว่าง Unlock กับ Lock ถัดไป", "ปิด garbage collector", "ทำให้ channel ไม่ต้องใช้"], ["It always makes the program faster", "Happens-before between Unlock and the next Lock", "It disables the garbage collector", "It removes the need for channels"], 1),
    ],
  ),
  quizLesson(
    "e02-gomaxprocs",
    ["GOMAXPROCS ใน container", "GOMAXPROCS in a container"],
    ["อธิบายว่า Go 1.25 ปรับค่าเริ่มต้นจาก cgroup เมื่อใด", "Explain when Go 1.25 sets the default from a cgroup"],
    [
      "บน Linux ถ้าโปรแกรมรันใน cgroup ที่มีลิมิต CPU Go 1.25 ปรับ GOMAXPROCS เริ่มต้นให้สอดคล้องกับลิมิตนั้น ค่าที่ผู้ใช้ตั้งเองยังชนะ และพฤติกรรมนี้เป็นของ Linux ไม่ใช่ทุกระบบ",
      ...answerHere,
    ],
    [
      "On Linux, when the process runs in a cgroup with a CPU limit, Go 1.25 adjusts the default GOMAXPROCS to match that limit. An explicit setting still wins. This behavior is for Linux, not every operating system.",
      ...answerHereEn,
    ],
    [
      q("easy", "Go 1.25 ปรับ GOMAXPROCS เริ่มต้นจากอะไรบน Linux", "What does Go 1.25 use for the default GOMAXPROCS on Linux?", "ลิมิต CPU ของ cgroup เมื่อมีลิมิตนั้น", "The cgroup CPU limit when one is set", ["จำนวนไฟล์ในโมดูล", "ลิมิต CPU ของ cgroup เมื่อมีลิมิตนั้น", "พอร์ตของ HTTP", "ขนาดของ go.mod"], ["The number of files in the module", "The cgroup CPU limit when one is set", "The HTTP port", "The size of go.mod"], 1),
      q("mid", "ถ้าตั้ง GOMAXPROCS เองแล้วจะเกิดอะไร", "What happens if you set GOMAXPROCS yourself?", "ค่าที่ตั้งเองชนะค่าที่ปรับจาก cgroup", "The explicit value wins over the cgroup adjustment", ["โปรแกรมไม่เริ่ม", "ค่าที่ตั้งเองชนะค่าที่ปรับจาก cgroup", "cgroup ถูกลบ", "ต้องใช้ root"], ["The program refuses to start", "The explicit value wins over the cgroup adjustment", "The cgroup is deleted", "You must be root"], 1),
      q("hard", "พฤติกรรมนี้ใช้ที่ไหน", "Where does this behavior apply?", "บน Linux เมื่อมีลิมิตของ cgroup ไม่ใช่ทุกแพลตฟอร์ม", "On Linux when a cgroup limit exists, not on every platform", ["ทุกแพลตฟอร์มเหมือนกัน", "บน Linux เมื่อมีลิมิตของ cgroup", "เฉพาะ Windows", "เฉพาะตอน go test"], ["On every platform the same way", "On Linux when a cgroup limit exists", "Only on Windows", "Only during go test"], 1),
    ],
  ),
  quizLesson(
    "e03-greenteagc",
    ["GC ทดลอง", "Experimental GC"],
    ["อธิบายว่า GOEXPERIMENT=greenteagc เปลี่ยนอะไร", "Explain what GOEXPERIMENT=greenteagc changes"],
    [
      "GOEXPERIMENT=greenteagc เปิดตัวเก็บขยะแบบทดลองของ Go 1.25 มันยังไม่ใช่ค่าเริ่มต้น เพราะยังต้องวัดผลในงานจริงก่อนจะแทนที่ตัวเก็บขยะปกติ",
      ...answerHere,
    ],
    [
      "GOEXPERIMENT=greenteagc turns on an experimental garbage collector in Go 1.25. It is not the default, because it still needs measurement on real workloads before it can replace the ordinary collector.",
      ...answerHereEn,
    ],
    [
      q("easy", "greenteagc คืออะไร", "What is greenteagc?", "ตัวเก็บขยะแบบทดลองที่ต้องเปิดด้วย GOEXPERIMENT", "An experimental collector that you enable with GOEXPERIMENT", ["ชนิดของ channel", "ตัวเก็บขยะแบบทดลองที่ต้องเปิดด้วย GOEXPERIMENT", "คำสั่งใน go.mod", "รูปแบบของ JSON"], ["A channel type", "An experimental collector that you enable with GOEXPERIMENT", "A go.mod directive", "A JSON format"], 1),
      q("mid", "ทำไมมันยังไม่ใช่ค่าเริ่มต้น", "Why is it not the default yet?", "ยังต้องวัดผลในงานจริงก่อนแทนที่ตัวเก็บขยะปกติ", "It still needs measurement on real workloads before replacing the ordinary collector", ["เพราะใช้ไม่ได้บน Linux", "ยังต้องวัดผลในงานจริงก่อน", "เพราะเลิกใช้แล้วใน 1.25", "เพราะต้องมี cgo"], ["Because it cannot run on Linux", "It still needs measurement on real workloads", "Because Go 1.25 removed it", "Because it requires cgo"], 1),
      q("hard", "จะเปิดมันได้อย่างไร", "How do you turn it on?", "ตั้ง GOEXPERIMENT=greenteagc ตอน build หรือรันตามกติกาของ experiment", "Set GOEXPERIMENT=greenteagc for the build or run, following the experiment rules", ["แก้ go.mod เป็น ignore", "ตั้ง GOEXPERIMENT=greenteagc", "เรียก go vet", "ใช้ build tag jsonv2"], ["Change go.mod to ignore", "Set GOEXPERIMENT=greenteagc", "Run go vet", "Use the jsonv2 build tag"], 1),
    ],
  ),
  quizLesson(
    "e04-flight-recorder",
    ["FlightRecorder", "FlightRecorder"],
    ["อธิบายการเก็บบันทึกช่วงสั้นไว้ในหน่วยความจำ", "Explain keeping a short trace in memory"],
    [
      "runtime/trace.FlightRecorder เก็บบันทึก execution trace ช่วงสั้นไว้ในหน่วยความจำ แล้วค่อยเขียนออกเมื่อเกิดเหตุ จึงไม่ต้องเปิด trace ทั้งกระบวนการไว้บนดิสก์ตลอดเวลา",
      ...answerHere,
    ],
    [
      "runtime/trace.FlightRecorder keeps a short execution trace in memory and writes it out when an event happens. You do not have to leave a full trace running to disk the whole time.",
      ...answerHereEn,
    ],
    [
      q("easy", "FlightRecorder เก็บข้อมูลไว้ที่ไหนก่อนเกิดเหตุ", "Where does FlightRecorder keep data before the event?", "ไว้ในหน่วยความจำเป็นช่วงสั้น", "In memory, as a short window", ["ในฐานข้อมูล", "ไว้ในหน่วยความจำเป็นช่วงสั้น", "ใน go.mod", "ในไฟล์ทุก request"], ["In a database", "In memory, as a short window", "In go.mod", "In a file for every request"], 1),
      q("mid", "มันเขียนออกเมื่อไร", "When does it write the trace out?", "เมื่อเกิดเหตุที่โปรแกรมตัดสินใจบันทึก", "When the program decides an event is worth saving", ["ทุกนาโนวินาที", "เมื่อเกิดเหตุที่โปรแกรมตัดสินใจบันทึก", "ตอนคอมไพล์", "ตอน gofmt"], ["Every nanosecond", "When the program decides an event is worth saving", "At compile time", "During gofmt"], 1),
      q("hard", "มันต่างจากการเปิด trace ทั้งกระบวนการอย่างไร", "How is it different from tracing the whole process?", "ไม่ต้องเขียน trace ลงดิสก์ตลอดเวลา เก็บแค่หน้าต่างล่าสุด", "It does not write a trace to disk the whole time. It keeps the latest window", ["มันปิด scheduler", "ไม่ต้องเขียน trace ลงดิสก์ตลอดเวลา", "มันแทนที่ testing", "มันใช้ได้เฉพาะ quiz"], ["It disables the scheduler", "It does not write a trace to disk the whole time", "It replaces testing", "It works only in quizzes"], 1),
    ],
  ),
  lesson({
    id: "e05-nil-check",
    level: "expert",
    title: text("nil-check ของ Go 1.25", "Go 1.25 nil check"),
    goal: text("ชี้โปรแกรมที่ใช้ค่าก่อนตรวจความพร้อม แล้วคาดว่าต้อง panic", "Point at a program that uses a value before it is ready and expect a panic"),
    copy: copy(
      [
        "การใช้ pointer ที่เป็น nil อ่านฟิลด์หรือเรียก method ที่แตะฟิลด์ จะ panic ว่า nil pointer dereference Go 1.25 ยังคงตรวจจุดนี้ตอนรัน แบบฝึกนี้ให้โปรแกรม panic จริงบน runner ไม่ใช่ข้อควิซ\n\n```\nvar p *int\nfmt.Println(*p)\n```",
        "ใช้เป็นตัวอย่างของบั๊กที่ได้ผลลัพธ์มาก่อนตรวจ error หรือตรวจ nil",
        "dereference pointer ที่เป็น nil",
        "อ่านฟิลด์หรือเรียก method ผ่าน pointer ที่เป็น nil",
        ["ประกาศ pointer โดยไม่ชี้ค่า", "ใช้ค่านั้นทันที", "รันแล้วดู panic", "ส่งคำตอบเมื่อ stderr มี nil pointer"],
      ],
      [
        "Using a nil pointer to read a field, or calling a method that touches a field, panics with a nil pointer dereference. Go 1.25 still checks this at run time. This lesson really panics on the runner. It is not a quiz.\n\n```\nvar p *int\nfmt.Println(*p)\n```",
        "Use it as the example of a bug that uses a result before checking an error or a nil.",
        "Dereference a nil pointer.",
        "Read a field or call a method through a nil pointer.",
        ["Declare a pointer with no target", "Use that value immediately", "Run and read the panic", "Check passes when stderr contains nil pointer"],
      ],
    ),
    exercises: [
      panicEx(say("easy", "ทำให้ main panic โดย dereference *int ที่เป็น nil", "Make main panic by dereferencing a nil *int"), panicRule, quiet, "nil pointer"),
      panicEx(say("mid", "ทำให้ panic โดยอ่านฟิลด์ผ่าน pointer ของ struct ที่เป็น nil", "Panic by reading a field through a nil struct pointer"), panicRule, quiet, "nil pointer"),
      panicEx(say("hard", "ทำให้ panic โดยเรียก method ที่อ่านฟิลด์บน receiver ที่เป็น nil", "Panic by calling a method that reads a field on a nil receiver"), panicRule, quiet, "nil pointer"),
      withHint(panicEx(say("twist", "เรียก load แล้วใช้ *int ก่อนตรวจ error จนโปรแกรม panic", "Call load and use the *int before checking the error so the program panics"), panicRule, 'package main\n\nimport "fmt"\n\nfunc load() (*int, error) {\n\treturn nil, nil\n}\n\nfunc main() {\n\tfmt.Println("ok")\n}\n', "nil pointer"), "เรียก load แล้วใช้ pointer ก่อนดู error", "Call load and use the pointer before you look at the error"),
    ],
  }),
  quizLesson(
    "e06-escape",
    ["escape analysis", "Escape analysis"],
    ["อธิบายว่าทำไม slice บางก้อนอยู่บน stack ได้มากขึ้น", "Explain why more slices can stay on the stack"],
    [
      "escape analysis ตัดสินว่าค่าต้องหนีไป heap หรืออยู่บน stack ได้ Go รุ่นใหม่วาง backing array ของ slice บน stack ได้ในกรณีมากขึ้น ถ้าใช้ unsafe ชี้เข้าไปในหน่วยความจำที่คอมไพเลอร์คิดว่าอยู่บน stack โปรแกรมจะพังเมื่อ stack ถูกใช้ซ้ำ",
      ...answerHere,
    ],
    [
      "Escape analysis decides whether a value must move to the heap or can stay on the stack. Newer Go can keep more slice backing arrays on the stack. If unsafe points into memory the compiler thought was on the stack, the program breaks when that stack is reused.",
      ...answerHereEn,
    ],
    [
      q("easy", "escape analysis ตัดสินอะไร", "What does escape analysis decide?", "ค่าต้องไป heap หรืออยู่บน stack ได้", "Whether a value must go to the heap or can stay on the stack", ["ชื่อแพ็กเกจ", "ค่าต้องไป heap หรืออยู่บน stack ได้", "รุ่นของ go.mod", "พอร์ตของ HTTP"], ["The package name", "Whether a value must go to the heap or can stay on the stack", "The go.mod version", "The HTTP port"], 1),
      q("mid", "การย้าย backing array ของ slice ไป stack ได้มากขึ้นหมายถึงอะไร", "What does keeping more slice backing arrays on the stack mean?", "บาง slice ไม่ต้องจอง heap ถ้าคอมไพเลอร์พิสูจน์ได้ว่าไม่หนี", "Some slices skip the heap when the compiler proves they do not escape", ["slice ใช้ไม่ได้แล้ว", "บาง slice ไม่ต้องจอง heap ถ้าไม่หนี", "map ถูกห้าม", "channel ช้าลงเสมอ"], ["Slices no longer work", "Some slices skip the heap when they do not escape", "Maps are forbidden", "Channels are always slower"], 1),
      q("hard", "ทำไม unsafe ที่ผิดจึงอันตรายขึ้น", "Why does incorrect unsafe become more dangerous?", "มันอาจชี้เข้า stack ที่ถูกใช้ซ้ำหลังฟังก์ชันคืน", "It can point into a stack that is reused after the function returns", ["เพราะ gofmt ลบมัน", "มันอาจชี้เข้า stack ที่ถูกใช้ซ้ำ", "เพราะ JSON เปลี่ยน", "เพราะ vet ปิดเอง"], ["Because gofmt deletes it", "It can point into a stack that is reused", "Because JSON changed", "Because vet turns itself off"], 1),
    ],
  ),
  quizLesson(
    "e07-unsafe",
    ["กับดักของ unsafe", "unsafe traps"],
    ["บอกผลที่พังของการใช้ unsafe ผิด โดยไม่ส่งโค้ด unsafe ไปรัน", "Describe what incorrect unsafe breaks, without sending unsafe code to the runner"],
    [
      "unsafe.Pointer ข้ามระบบชนิดของภาษา การแปลงผิดทำให้ได้ pointer ที่ไม่ชี้ออบเจ็กต์ที่มีชีวิต แบบฝึกนี้เป็นควิซอย่างเดียว เพื่อไม่ส่งโค้ด unsafe ไปรันบน runner\n\n```\n// อธิบายผลที่พัง อย่าส่งแพ็กเกจ unsafe ไปรัน\n```",
      ...answerHere,
    ],
    [
      "unsafe.Pointer steps outside the language type system. A bad conversion yields a pointer that does not refer to a live object. This lesson is a quiz only, so unsafe code is not sent to the runner.\n\n```\n// Describe the failure. Do not send package unsafe to the runner.\n```",
      ...answerHereEn,
    ],
    [
      q("easy", "ทำไมข้อนี้ไม่ให้รันโค้ด unsafe", "Why does this exercise not run unsafe code?", "เพราะตัวตรวจไม่รับโค้ดที่ข้ามชนิดแบบนั้น", "Because the checker does not accept code that bypasses the type system that way", ["เพราะ Go 1.25 ลบ unsafe", "เพราะตัวตรวจไม่รับโค้ดที่ข้ามชนิดแบบนั้น", "เพราะไม่มี package main", "เพราะใช้ได้เฉพาะ Windows"], ["Because Go 1.25 removed unsafe", "Because the checker does not accept code that bypasses the type system that way", "Because there is no package main", "Because it works only on Windows"], 1),
      q("mid", "การแปลง pointer ผิดมักพังอย่างไร", "How does a bad pointer conversion usually fail?", "ได้ pointer ที่ไม่ชี้ออบเจ็กต์ที่มีชีวิต แล้วอ่านค่ามั่วหรือ panic", "You get a pointer that does not refer to a live object, then read garbage or panic", ["ได้ error ค่า nil เสมอ", "ได้ pointer ที่ไม่ชี้ออบเจ็กต์ที่มีชีวิต", "โปรแกรมเร็วขึ้นเสมอ", "gofmt แก้ให้"], ["You always get a nil error", "You get a pointer that does not refer to a live object", "The program is always faster", "gofmt fixes it"], 1),
      q("hard", "ทางที่ปลอดภัยกว่าการใช้ unsafe เพื่อดูไบต์ของสตริงคืออะไร", "What is safer than unsafe when you want the bytes of a string?", "ใช้การแปลง []byte(s) แม้จะก็อป หรือ API ที่มีอยู่แล้ว", "Use a []byte(s) conversion, which copies, or an existing API", ["เก็บ pointer ไว้ในตัวแปร global", "ใช้การแปลง []byte(s) หรือ API ที่มีอยู่", "ปิด garbage collector", "เขียนลง stack ของคนเรียก"], ["Store the pointer in a global", "Use a []byte(s) conversion or an existing API", "Disable the garbage collector", "Write into the caller's stack"], 1),
    ],
  ),
  quizLesson(
    "e08-json-v2",
    ["encoding/json/v2", "encoding/json/v2"],
    ["เปรียบเทียบ API ทดลองกับ encoding/json", "Compare the experimental API with encoding/json"],
    [
      "encoding/json/v2 เป็น API ทดลอง คนละชุดกับ encoding/json ที่ใช้เป็นค่าเริ่มต้น การเปิดใช้ต้องตามกติกา experiment ของรุ่นนั้น ไม่ใช่การแทนที่แบบเงียบในทุกโปรแกรม",
      ...answerHere,
    ],
    [
      "encoding/json/v2 is an experimental API, separate from the default encoding/json. Turning it on follows that release's experiment rules. It does not silently replace JSON in every program.",
      ...answerHereEn,
    ],
    [
      q("easy", "encoding/json/v2 คืออะไร", "What is encoding/json/v2?", "API ทดลองที่แยกจาก encoding/json ตัวปกติ", "An experimental API separate from the ordinary encoding/json", ["ชื่อเดิมของ fmt", "API ทดลองที่แยกจาก encoding/json ตัวปกติ", "ตัวตรวจ vet", "คำสั่ง go run"], ["The old name of fmt", "An experimental API separate from the ordinary encoding/json", "The vet checker", "The go run command"], 1),
      q("mid", "โปรแกรมทั่วไปที่ใช้ encoding/json เปลี่ยนเองไหม", "Do ordinary programs that import encoding/json change by themselves?", "ไม่เปลี่ยน ตัวปกติยังเป็น encoding/json", "No. The default stays encoding/json", ["เปลี่ยนทุกไฟล์", "ไม่เปลี่ยน ตัวปกติยังเป็น encoding/json", "ลบ tag ทั้งหมด", "ต้องใช้ cgo"], ["Every file changes", "No. The default stays encoding/json", "All tags are removed", "It requires cgo"], 1),
      q("hard", "จะทดลอง v2 ได้อย่างไร", "How do you try v2?", "เปิดตามกติกา experiment ของรุ่นนั้น ไม่ใช่แค่เปลี่ยน import แล้วคาดว่าเป็นค่าเริ่มต้น", "Enable it under that release's experiment rules. Do not expect a plain import to become the default", ["ลบ go.mod", "เปิดตามกติกา experiment ของรุ่นนั้น", "ตั้ง GOPROXY=off เท่านั้น", "เรียก gofmt"], ["Delete go.mod", "Enable it under that release's experiment rules", "Only set GOPROXY=off", "Run gofmt"], 1),
    ],
  ),
  quizLesson(
    "e09-core-types",
    ["core types ออกจากสเปก", "Core types leave the spec"],
    ["อธิบาย operand ที่เป็น type parameter โดยไม่ใช้คำว่า core type", "Explain a type-parameter operand without the words core type"],
    [
      "สเปกเลิกใช้คำว่า core type เป็นทางอธิบาย operand ที่เป็น type parameter กติกาที่เหลือพูดตรงๆ ว่าการดำเนินการนั้นใช้ได้เมื่อ type parameter มี constraint ที่รองรับการกระทำนั้น",
      ...answerHere,
    ],
    [
      "The spec no longer uses the term core type to explain an operand that is a type parameter. The remaining rule says the operation is allowed when the type parameter's constraint supports that operation.",
      ...answerHereEn,
    ],
    [
      q("easy", "คำว่า core type ในสเปกตอนนี้เป็นอย่างไร", "What happened to the term core type in the spec?", "ไม่ใช้เป็นทางอธิบายหลักแล้ว", "It is no longer the way the spec explains the rule", ["กลายเป็นคีย์เวิร์ด", "ไม่ใช้เป็นทางอธิบายหลักแล้ว", "เป็นชื่อแพ็กเกจ", "เป็นคำสั่ง go"], ["It became a keyword", "It is no longer the way the spec explains the rule", "It is a package name", "It is a go command"], 1),
      q("mid", "จะอธิบายว่า type parameter บวกกันได้โดยไม่ใช้คำนั้นได้อย่างไร", "How do you explain that a type parameter can be added without that term?", "บอกว่า constraint รองรับการบวก", "Say that the constraint supports addition", ["บอกว่ามันเป็น interface ว่าง", "บอกว่า constraint รองรับการบวก", "บอกว่ามันเป็น channel", "บอกว่า gofmt อนุญาต"], ["Say it is the empty interface", "Say that the constraint supports addition", "Say it is a channel", "Say gofmt allows it"], 1),
      q("hard", "constraint แบบ cmp.Ordered ให้อะไร", "What does a cmp.Ordered constraint give you?", "เปรียบเทียบค่าด้วยเครื่องหมายลำดับได้", "You can compare values with ordering operators", ["เรียก method Speak ได้", "เปรียบเทียบค่าด้วยเครื่องหมายลำดับได้", "เปิดไฟล์ได้", "เริ่ม goroutine ได้"], ["You can call Speak", "You can compare values with ordering operators", "You can open files", "You can start a goroutine"], 1),
    ],
  ),
  quizLesson(
    "e10-api-design",
    ["ออกแบบ API", "API design"],
    ["ตัด interface ให้เล็ก ตั้งชื่อ package และตัดสินใจเรื่อง error", "Keep interfaces small, name the package, and decide the errors"],
    [
      "API ที่คนเรียกใช้ต่อได้มี interface เล็กเท่าพฤติกรรมที่ต้องการ ชื่อ package สั้นและเป็นคำนาม error ที่ผู้เรียกต้องแยกแยะควรเป็นค่าที่ errors.Is ตรวจได้ ไม่ใช่ข้อความอย่างเดียว",
      ...answerHere,
    ],
    [
      "An API other people can keep using has an interface only as wide as the needed behavior. The package name is short and a noun. An error the caller must distinguish should be a value errors.Is can see, not only a sentence.",
      ...answerHereEn,
    ],
    [
      q("easy", "interface ที่ดีสำหรับผู้เรียกควรมีขนาดเท่าไร", "How wide should an interface be for a caller?", "เท่าพฤติกรรมที่ผู้เรียกต้องใช้", "Only as wide as the behavior the caller needs", ["มีทุก method ของ struct", "เท่าพฤติกรรมที่ผู้เรียกต้องใช้", "ว่างเสมอ", "มีอย่างน้อยสิบ method"], ["Every method of the struct", "Only as wide as the behavior the caller needs", "Always empty", "At least ten methods"], 1),
      q("mid", "ชื่อ package ควรเป็นแบบไหน", "What should a package name be like?", "สั้น เป็นคำนาม และไม่ซ้ำกับชื่อที่ผู้เรียกต้องพูดซ้ำ", "Short, a noun, and not something the caller has to stutter", ["เป็นประโยคยาว", "สั้น เป็นคำนาม", "ขึ้นต้นด้วยตัวเลข", "เป็นชื่อไฟล์เทสต์"], ["A long sentence", "Short, a noun", "Starting with a digit", "The name of the test file"], 1),
      q("hard", "error ที่ผู้เรียกต้องแยกเคสควรออกแบบอย่างไร", "How should an error the caller must branch on be designed?", "ให้เป็นค่าที่ตรวจด้วย errors.Is หรือ errors.As ได้", "Make it a value the caller can check with errors.Is or errors.As", ["ต่อข้อความอย่างเดียว", "ให้เป็นค่าที่ตรวจด้วย errors.Is หรือ errors.As ได้", "ใช้ panic เสมอ", "คืนเฉพาะ bool"], ["Only concatenate text", "Make it a value the caller can check with errors.Is or errors.As", "Always panic", "Return only a bool"], 1),
    ],
  ),
];
