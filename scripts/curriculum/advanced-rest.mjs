import { copy, lesson, quiz, testEx, tests, text } from "./helpers.mjs";

function say(id, th, en) {
  return { id, th, en };
}

export const advancedRest = [
  lesson({
    id: "a06-goroutines",
    level: "advanced",
    order: 16,
    title: text("goroutine", "Goroutines"),
    goal: text("เริ่มงานคู่ขนานแล้วยังรอให้งานจบ", "Start concurrent work and still wait for it to finish"),
    copy: copy(
      [
        "go ข้างหน้าการเรียกฟังก์ชันเริ่ม goroutine งานนั้นไม่ได้แชร์ลำดับกับผู้เรียกโดยอัตโนมัติ ต้องมี channel หรือ sync เพื่อรู้ว่าจบแล้ว ถ้า main จบก่อน งานที่ค้างจะถูกตัด\n\n```\nch := make(chan int, 1)\ngo func() { ch <- a + b }()\nfmt.Println(<-ch)\n```",
        "ใช้แยกงานที่ใช้เวลารอ เช่น เรียก service สองตัวพร้อมกัน แล้วค่อยรวมผล",
        "บวกเลขใน goroutine แล้วรับผลกลับ",
        "รวมผลจากสองงาน",
        ["เริ่ม goroutine ด้วย go", "ส่งผลกลับทาง channel", "รับให้ครบก่อนคืน", "อย่าจบฟังก์ชันทั้งที่ยังไม่มีใครรับ"],
      ],
      [
        "go before a call starts a goroutine. That work does not line up with the caller by itself. Use a channel or sync to know it finished. If main returns first, leftover work is dropped.\n\n```\nch := make(chan int, 1)\ngo func() { ch <- a + b }()\nfmt.Println(<-ch)\n```",
        "Use it to overlap waiting, such as calling two services and then combining the results.",
        "Add numbers in a goroutine and receive the result.",
        "Combine two pieces of work.",
        ["Start the goroutine with go", "Send the result on a channel", "Receive everything before returning", "Do not return while nobody is receiving"],
      ],
    ),
    exercises: [
      testEx(say("easy", "เขียน AddAsync ให้คืน a+b โดยส่งผลผ่าน channel", "Write AddAsync to return a+b by sending the result on a channel"), tests, 'package main\n\nfunc AddAsync(a, b int) int {\n\treturn 0\n}\n', 'package main\n\nimport "testing"\n\nfunc TestAddAsync(t *testing.T) {\n\tif AddAsync(2, 3) != 5 {\n\t\tt.Fatal("add")\n\t}\n}\n'),
      testEx(say("mid", "เขียน SumParts ให้รวม a กับ b จากคนละ goroutine", "Write SumParts to add a and b from separate goroutines"), tests, 'package main\n\nfunc SumParts(a, b int) int {\n\treturn 0\n}\n', 'package main\n\nimport "testing"\n\nfunc TestSumParts(t *testing.T) {\n\tif SumParts(1, 2) != 3 {\n\t\tt.Fatal("sum")\n\t}\n}\n'),
      testEx(say("hard", "เขียน WaitBoth ให้คืนจำนวน goroutine ที่ทำงานจบ ซึ่งต้องเป็น 2", "Write WaitBoth to return how many goroutines finished, which must be 2"), tests, 'package main\n\nfunc WaitBoth() int {\n\treturn 0\n}\n', 'package main\n\nimport "testing"\n\nfunc TestWaitBoth(t *testing.T) {\n\tif WaitBoth() != 2 {\n\t\tt.Fatal("both")\n\t}\n}\n'),
    ],
  }),
  lesson({
    id: "a07-channels",
    level: "advanced",
    order: 17,
    title: text("channel", "Channels"),
    goal: text("ส่งและรับค่าผ่าน channel โดยไม่มี goroutine ค้าง", "Send and receive on a channel without leaving a goroutine stuck"),
    copy: copy(
      [
        "channel ที่ไม่มี buffer จะให้ผู้ส่งรอจนกว่าจะมีผู้รับ channel ที่มี buffer รับค่าได้เท่าความจุ การ close บอกว่าจะไม่มีค่าใหม่ และ range จะจบเมื่อ channel ถูกปิด\n\n```\nch := make(chan int, 1)\nch <- 1\nfmt.Println(<-ch)\n```",
        "ใช้ส่งงานเข้า worker และส่งผลกลับโดยไม่แชร์ตัวแปรตรงๆ",
        "ส่งแล้วรับค่าเดียว",
        "รวมค่าจาก channel ที่ถูกปิด",
        ["เลือก buffer ให้พอ หรือมีผู้รับรออยู่", "ปิด channel ที่ฝั่งผู้ส่ง", "ใช้ range หลังปิด", "อย่าส่งเข้า channel ที่ปิดแล้ว"],
      ],
      [
        "An unbuffered channel makes the sender wait until someone receives. A buffered channel accepts values up to its capacity. close says no more values are coming, and range ends when the channel is closed.\n\n```\nch := make(chan int, 1)\nch <- 1\nfmt.Println(<-ch)\n```",
        "Use it to hand work to a worker and return results without sharing a variable directly.",
        "Send and receive one value.",
        "Sum values from a closed channel.",
        ["Pick a buffer or have a receiver waiting", "Close the channel from the sender side", "Use range after close", "Do not send on a closed channel"],
      ],
    ),
    exercises: [
      testEx(say("easy", "เขียน SendRecv ให้ส่ง v เข้า channel แล้วรับกลับ", "Write SendRecv to send v on a channel and receive it back"), tests, 'package main\n\nfunc SendRecv(v int) int {\n\treturn 0\n}\n', 'package main\n\nimport "testing"\n\nfunc TestSendRecv(t *testing.T) {\n\tif SendRecv(4) != 4 {\n\t\tt.Fatal("recv")\n\t}\n}\n'),
      testEx(say("mid", "เขียน SumClosed ให้ส่งทุกค่าแล้วปิด channel จากนั้นรวมด้วย range", "Write SumClosed to send every value, close the channel, then sum with range"), tests, 'package main\n\nfunc SumClosed(values []int) int {\n\treturn 0\n}\n', 'package main\n\nimport "testing"\n\nfunc TestSumClosed(t *testing.T) {\n\tif SumClosed([]int{1, 2, 3}) != 6 {\n\t\tt.Fatal("sum")\n\t}\n}\n'),
      testEx(say("hard", "เขียน First ให้รับค่าแรกจาก channel ที่มี buffer และมีค่าอยู่แล้ว", "Write First to receive the first value from a channel that already holds one"), tests, 'package main\n\nfunc First(ch <-chan int) int {\n\treturn 0\n}\n', 'package main\n\nimport "testing"\n\nfunc TestFirst(t *testing.T) {\n\tch := make(chan int, 1)\n\tch <- 9\n\tif First(ch) != 9 {\n\t\tt.Fatal("first")\n\t}\n}\n'),
    ],
  }),
  lesson({
    id: "a08-select",
    level: "advanced",
    order: 18,
    title: text("select และ timeout", "select and timeout"),
    goal: text("เลือก channel ที่พร้อม และหยุดเมื่อหมดเวลา", "Choose the channel that is ready and stop when time runs out"),
    copy: copy(
      [
        "select รอหลาย channel พร้อมกัน เคสที่พร้อมก่อนจะถูกเลือก ถ้ามี default จะไม่รอ ถ้าใส่ time.After จะออกเมื่อหมดเวลา\n\n```\nselect {\ncase v := <-ch:\n\treturn v\ndefault:\n\treturn 0\n}\n```",
        "ใช้ใน client ที่ต้องไม่แขวน และในลูปที่รับได้ทั้งงานกับสัญญาณยกเลิก",
        "เลือก channel ที่พร้อม",
        "คืนค่าทันทีเมื่อยังไม่พร้อม หรือคืนค่าพิเศษเมื่อหมดเวลา",
        ["ใส่ทุก channel ที่รอได้ใน select", "ใช้ default เมื่อห้ามบล็อก", "ใช้ time.After เมื่อต้องจำกัดเวลา", "อย่าลืมว่า After สร้าง timer"],
      ],
      [
        "select waits on several channels. The case that is ready first runs. default does not wait. time.After leaves when the time is up.\n\n```\nselect {\ncase v := <-ch:\n\treturn v\ndefault:\n\treturn 0\n}\n```",
        "Use it in a client that must not hang and in a loop that accepts either work or a cancel signal.",
        "Pick the channel that is ready.",
        "Return immediately when nothing is ready, or return a sentinel when time runs out.",
        ["Put every channel you can wait on in the select", "Use default when you must not block", "Use time.After when you must bound the wait", "Remember that After starts a timer"],
      ],
    ),
    exercises: [
      testEx(say("easy", "เขียน FirstReady ให้คืนค่าจาก channel ที่พร้อมก่อน", "Write FirstReady to return the value from the channel that is ready first"), tests, 'package main\n\nfunc FirstReady(a, b <-chan int) int {\n\treturn 0\n}\n', 'package main\n\nimport "testing"\n\nfunc TestFirstReady(t *testing.T) {\n\ta := make(chan int, 1)\n\ta <- 3\n\tb := make(chan int)\n\tif FirstReady(a, b) != 3 {\n\t\tt.Fatal("ready")\n\t}\n}\n'),
      testEx(say("mid", "เขียน OrZero ให้คืนค่าใน channel หรือ 0 ทันทีถ้ายังไม่มีค่า", "Write OrZero to return the channel value, or 0 immediately when it is empty"), tests, 'package main\n\nfunc OrZero(ch <-chan int) int {\n\treturn 1\n}\n', 'package main\n\nimport "testing"\n\nfunc TestOrZero(t *testing.T) {\n\tif OrZero(make(chan int)) != 0 {\n\t\tt.Fatal("empty")\n\t}\n\tch := make(chan int, 1)\n\tch <- 4\n\tif OrZero(ch) != 4 {\n\t\tt.Fatal("value")\n\t}\n}\n'),
      testEx(say("hard", "เขียน OrTimeout ให้คืน -1 เมื่อ channel ว่างเกิน 20 มิลลิวินาที", "Write OrTimeout to return -1 when the channel stays empty for 20 milliseconds"), tests, 'package main\n\nimport "time"\n\nfunc OrTimeout(ch <-chan int) int {\n\treturn 0\n}\n', 'package main\n\nimport "testing"\n\nfunc TestOrTimeout(t *testing.T) {\n\tif OrTimeout(nil) != -1 {\n\t\tt.Fatal("timeout")\n\t}\n\tch := make(chan int, 1)\n\tch <- 6\n\tif OrTimeout(ch) != 6 {\n\t\tt.Fatal("value")\n\t}\n}\n'),
    ],
  }),
  lesson({
    id: "a09-context",
    level: "advanced",
    order: 19,
    title: text("context", "context"),
    goal: text("ส่ง cancellation ข้ามฟังก์ชันและเลิกงานเมื่อ context จบ", "Pass cancellation across functions and stop when the context ends"),
    copy: copy(
      [
        "context.Context พกสัญญาณยกเลิกและเส้นตาย ผู้เรียกสร้างด้วย WithCancel หรือ WithTimeout แล้วส่งเป็นอาร์กิวเมนต์แรก งานที่รอต้องเลือก ctx.Done()\n\n```\nif err := ctx.Err(); err != nil {\n\treturn err\n}\n```",
        "ใช้ตัดงาน HTTP เมื่อผู้ใช้ปิดหน้า หรือเมื่อหมดเวลาที่กำหนดไว้ที่ขอบของ request",
        "บอกว่า context จบแล้วหรือยัง",
        "คืนค่าเริ่มเมื่อถูกยกเลิก หรือรอจน Done",
        ["รับ ctx เป็นอาร์กิวเมนต์แรก", "ตรวจ ctx.Err()", "เลิกงานเมื่อ Done", "อย่าเก็บ context ไว้ใน struct ของ request"],
      ],
      [
        "context.Context carries cancellation and a deadline. The caller builds it with WithCancel or WithTimeout and passes it as the first argument. Waiting work selects on ctx.Done().\n\n```\nif err := ctx.Err(); err != nil {\n\treturn err\n}\n```",
        "Use it to stop HTTP work when the user leaves or when the deadline set at the request boundary is reached.",
        "Report whether the context has already ended.",
        "Return a default when it is canceled, or wait until Done.",
        ["Take ctx as the first argument", "Check ctx.Err()", "Stop on Done", "Do not store a request context in a struct"],
      ],
    ),
    exercises: [
      testEx(say("easy", "เขียน Done ให้คืน true เมื่อ context จบแล้ว", "Write Done to return true when the context has ended"), tests, 'package main\n\nimport "context"\n\nfunc Done(ctx context.Context) bool {\n\treturn false\n}\n', 'package main\n\nimport (\n\t"context"\n\t"testing"\n)\n\nfunc TestDone(t *testing.T) {\n\tif Done(context.Background()) {\n\t\tt.Fatal("open")\n\t}\n\tctx, cancel := context.WithCancel(context.Background())\n\tcancel()\n\tif !Done(ctx) {\n\t\tt.Fatal("canceled")\n\t}\n}\n'),
      testEx(say("mid", "เขียน OrDefault ให้คืน 0 เมื่อ context จบ และคืน value เมื่อยังไม่จบ", "Write OrDefault to return 0 when the context has ended and value otherwise"), tests, 'package main\n\nimport "context"\n\nfunc OrDefault(ctx context.Context, value int) int {\n\treturn 0\n}\n', 'package main\n\nimport (\n\t"context"\n\t"testing"\n)\n\nfunc TestOrDefault(t *testing.T) {\n\tif OrDefault(context.Background(), 5) != 5 {\n\t\tt.Fatal("open")\n\t}\n\tctx, cancel := context.WithCancel(context.Background())\n\tcancel()\n\tif OrDefault(ctx, 5) != 0 {\n\t\tt.Fatal("canceled")\n\t}\n}\n'),
      testEx(say("hard", "เขียน Wait ให้รอจน context จบแล้วคืน ctx.Err()", "Write Wait to wait until the context ends and return ctx.Err()"), tests, 'package main\n\nimport "context"\n\nfunc Wait(ctx context.Context) error {\n\treturn nil\n}\n', 'package main\n\nimport (\n\t"context"\n\t"testing"\n)\n\nfunc TestWait(t *testing.T) {\n\tctx, cancel := context.WithCancel(context.Background())\n\tcancel()\n\tif err := Wait(ctx); err == nil {\n\t\tt.Fatal("err")\n\t}\n}\n'),
    ],
  }),
  lesson({
    id: "a10-testing",
    level: "advanced",
    order: 20,
    title: text("table test", "Table tests"),
    goal: text("เขียนฟังก์ชันที่เทสต์แบบตารางครอบคลุมเคสปกติและเคสพัง", "Write a function whose hidden test is a table of normal and failing cases"),
    copy: copy(
      [
        "table test เก็บ input กับผลที่ต้องการไว้ใน slice แล้ววนเรียกฟังก์ชันเดียว เคสพังควรอยู่แถวเดียวกับเคสปกติ เพื่อไม่ให้ลืม\n\n```\ncases := []struct {\n\tn    int\n\twant string\n}{\n\t{-1, \"neg\"},\n\t{0, \"zero\"},\n\t{2, \"pos\"},\n}\n```",
        "ใช้กับฟังก์ชันบริสุทธิ์ที่แปลงค่า เช่น จัดประเภทตัวเลขหรือตรวจช่วง",
        "จัดประเภทจำนวน",
        "ตรวจว่าค่าอยู่ในช่วง หรือคืนเครื่องหมาย",
        ["แยกเคสปกติกับเคสขอบ", "ใช้ชื่อเคสในข้อความ error", "อย่าแชร์ตัวแปรระหว่างแถว", "รันทุกแถวแม้แถวก่อนหน้าพังด้วย t.Run"],
      ],
      [
        "A table test stores inputs and wanted results in a slice and calls one function in a loop. Failing cases belong in the same table as the normal ones so they are not forgotten.\n\n```\ncases := []struct {\n\tn    int\n\twant string\n}{\n\t{-1, \"neg\"},\n\t{0, \"zero\"},\n\t{2, \"pos\"},\n}\n```",
        "Use it for a pure function that classifies a number or checks a range.",
        "Classify a number.",
        "Check that a value is inside a range, or return its sign.",
        ["Include both normal and boundary rows", "Put the case name in the error", "Do not share a variable across rows", "Keep going after a failure with t.Run"],
      ],
    ),
    exercises: [
      testEx(say("easy", "เขียน Classify ให้คืน neg, zero หรือ pos", "Write Classify to return neg, zero, or pos"), tests, 'package main\n\nfunc Classify(n int) string {\n\treturn ""\n}\n', 'package main\n\nimport "testing"\n\nfunc TestClassify(t *testing.T) {\n\tcases := []struct {\n\t\tn    int\n\t\twant string\n\t}{\n\t\t{-1, "neg"},\n\t\t{0, "zero"},\n\t\t{2, "pos"},\n\t}\n\tfor _, tc := range cases {\n\t\tif got := Classify(tc.n); got != tc.want {\n\t\t\tt.Fatalf("%d: %s", tc.n, got)\n\t\t}\n\t}\n}\n'),
      testEx(say("mid", "เขียน InRange ให้คืน true เมื่อ low <= n <= high", "Write InRange to return true when low <= n <= high"), tests, 'package main\n\nfunc InRange(n, low, high int) bool {\n\treturn false\n}\n', 'package main\n\nimport "testing"\n\nfunc TestInRange(t *testing.T) {\n\tif !InRange(2, 1, 3) || InRange(0, 1, 3) || !InRange(1, 1, 1) {\n\t\tt.Fatal("range")\n\t}\n}\n'),
      testEx(say("hard", "เขียน Sign ให้คืน -1, 0 หรือ 1", "Write Sign to return -1, 0, or 1"), tests, 'package main\n\nfunc Sign(n int) int {\n\treturn 2\n}\n', 'package main\n\nimport "testing"\n\nfunc TestSign(t *testing.T) {\n\tif Sign(-4) != -1 || Sign(0) != 0 || Sign(8) != 1 {\n\t\tt.Fatal("sign")\n\t}\n}\n'),
    ],
  }),
  lesson({
    id: "a11-modules",
    level: "advanced",
    order: 21,
    title: text("module และ workspace", "Modules and workspaces"),
    goal: text("อ่าน go.mod และแยกของในโมดูลกับของข้างนอก", "Read go.mod and separate what is inside the module from what is outside"),
    copy: copy(
      [
        "go.mod บรรทัด module คือ path ของโมดูลนี้ บรรทัด go คือรุ่นภาษา บรรทัด require คือโมดูลอื่นที่ต้องใช้ ของที่ import แล้ว path ไม่ได้อยู่ใต้ module path นี้คือของข้างนอก ไฟล์ go.work ใช้ตอนพัฒนาหลายโมดูลบนเครื่องเดียวกัน และไม่ได้แทน go.mod\n\n```\nmodule example.com/app\n\ngo 1.25\n```",
        "ใช้ตอนแยก service ออกเป็นโมดูล หรือตอนแก้ของในเครื่องโดยยังไม่เผยแพร่",
        "ความหมายของ require",
        "อะไรอยู่ข้างนอกโมดูล และ go.work ทำอะไร",
        ["อ่านบรรทัด module", "ตาม import ว่าอยู่ใต้ path นั้นไหม", "อย่าสับสน go.work กับ go.mod", "ตอบในหน้านี้โดยไม่ส่งโค้ดไปรัน"],
      ],
      [
        "The module line in go.mod is this module's path. The go line is the language version. A require line is another module you need. An import whose path is not under this module path is outside. A go.work file is for developing several modules on one machine and does not replace go.mod.\n\n```\nmodule example.com/app\n\ngo 1.25\n```",
        "Use it when splitting a service into modules or when editing local code that is not published yet.",
        "What require means.",
        "What sits outside the module, and what go.work does.",
        ["Read the module line", "Check whether an import is under that path", "Do not confuse go.work with go.mod", "Answer on this page without sending code to the runner"],
      ],
    ),
    exercises: [
      quiz(
        say("easy", "บรรทัด require ใน go.mod หมายถึงอะไร", "What does a require line in go.mod mean?"),
        { th: "มันบันทึกว่าโมดูลนี้ต้องการโมดูลนั้นที่รุ่นที่ระบุ", en: "It records that this module needs that module at the given version" },
        {
          th: ["สั่งให้ลบโฟลเดอร์นั้นตอน build", "บันทึกว่าโมดูลนี้ต้องการโมดูลนั้นที่รุ่นที่ระบุ", "ตั้งค่า GOPROXY", "ปิดการตรวจ checksum"],
          en: ["It deletes that folder during the build", "It records that this module needs that module at the given version", "It sets GOPROXY", "It turns off checksum checks"],
        },
        1,
      ),
      quiz(
        say("mid", "import แบบไหนอยู่นอกโมดูล example.com/app", "Which import is outside the module example.com/app?"),
        { th: "path ที่ไม่ได้ขึ้นต้นด้วย module path เป็นของโมดูลอื่น", en: "A path that does not start with the module path belongs to another module" },
        {
          th: ["example.com/app/internal/web", "example.com/app", "golang.org/x/mod", "example.com/app/cmd/api"],
          en: ["example.com/app/internal/web", "example.com/app", "golang.org/x/mod", "example.com/app/cmd/api"],
        },
        2,
      ),
      quiz(
        say("hard", "ไฟล์ go.work ใช้ทำอะไร", "What is a go.work file for?"),
        { th: "มันจัดหลายโมดูลบนดิสก์ให้พัฒนาพร้อมกัน โดยไม่แทน go.mod", en: "It groups modules on disk for local development and does not replace go.mod" },
        {
          th: ["แทนที่ go.mod ทั้งไฟล์", "ปิด checksum database", "จัดหลายโมดูลบนดิสก์ให้พัฒนาพร้อมกัน", "ตั้ง GOMAXPROCS"],
          en: ["It replaces go.mod", "It disables the checksum database", "It groups modules on disk for local development", "It sets GOMAXPROCS"],
        },
        2,
      ),
    ],
  }),
];
