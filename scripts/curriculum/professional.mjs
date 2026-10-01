import { copy, lesson, quiz, testEx, tests, text, withHint } from "./helpers.mjs";

function say(id, th, en) {
  return { id, th, en };
}

export const professional = [
  lesson({
    id: "p01-worker-pool",
    level: "professional",
    order: 22,
    title: text("รูปแบบงานคู่ขนาน", "Concurrent work patterns"),
    goal: text("จำกัดจำนวน goroutine ที่ทำงานพร้อมกัน", "Limit how many goroutines run at once"),
    copy: copy(
      [
        "worker pool จำกัดจำนวนงานที่ทำพร้อมกันด้วย channel ของ token หรือด้วยจำนวน goroutine คงที่ งานที่เหลือต้องรอคิว ไม่งั้นโปรแกรมจะเปิด goroutine ตามจำนวนงานทั้งก้อน\n\n```\nslots := make(chan struct{}, limit)\nslots <- struct{}{}\n```",
        "ใช้ตอนยิง request จำนวนมาก หรือประมวลผลไฟล์ โดยไม่อยากให้เครื่องรับงานพร้อมกันเกินที่กำหนด",
        "รวมผลจากงานหลายชิ้น",
        "พิสูจน์ว่าจำนวนงานที่ซ้อนกันไม่เกิน limit",
        ["สร้างที่ว่างเท่า limit", "จองก่อนเริ่มงาน", "คืนที่ว่างเมื่อจบ", "รอจนทุกงานเสร็จ"],
      ],
      [
        "A worker pool caps how much work runs at once, with a token channel or a fixed set of goroutines. The rest waits in a queue. Otherwise the program starts one goroutine per job.\n\n```\nslots := make(chan struct{}, limit)\nslots <- struct{}{}\n```",
        "Use it when sending many requests or processing files without exceeding a chosen concurrency.",
        "Combine the results of several jobs.",
        "Prove that overlapping jobs never exceed the limit.",
        ["Create capacity equal to the limit", "Take a slot before starting", "Release the slot when finished", "Wait until every job is done"],
      ],
    ),
    exercises: [
      testEx(say("easy", "เขียน SumJobs ให้บวกค่าใน slice", "Write SumJobs to add the values in the slice"), tests, 'package main\n\nfunc SumJobs(values []int) int {\n\treturn 0\n}\n', 'package main\n\nimport "testing"\n\nfunc TestSumJobs(t *testing.T) {\n\tif SumJobs([]int{1, 2, 3, 4}) != 10 {\n\t\tt.Fatal("sum")\n\t}\n}\n'),
      testEx(say("mid", "เขียน CountJobs ให้คืนจำนวนงาน", "Write CountJobs to return how many jobs there are"), tests, 'package main\n\nfunc CountJobs(limit int, jobs []int) int {\n\treturn 0\n}\n', 'package main\n\nimport "testing"\n\nfunc TestCountJobs(t *testing.T) {\n\tif CountJobs(2, []int{1, 2, 3}) != 3 {\n\t\tt.Fatal("count")\n\t}\n}\n'),
      testEx(say("hard", "เขียน Run ให้ทำงาน jobs พร้อมกันได้ไม่เกิน limit", "Write Run so at most limit jobs run at the same time"), tests, 'package main\n\nfunc Run(limit int, jobs []func()) {\n}\n', 'package main\n\nimport (\n\t"testing"\n\t"time"\n)\n\nfunc TestRun(t *testing.T) {\n\tstarted := make(chan struct{}, 4)\n\trelease := make(chan struct{})\n\tjobs := make([]func(), 4)\n\tfor i := range jobs {\n\t\tjobs[i] = func() {\n\t\t\tstarted <- struct{}{}\n\t\t\t<-release\n\t\t}\n\t}\n\tdone := make(chan struct{})\n\tgo func() {\n\t\tRun(2, jobs)\n\t\tclose(done)\n\t}()\n\t<-started\n\t<-started\n\tselect {\n\tcase <-started:\n\t\tt.Fatal("too many")\n\tcase <-time.After(50 * time.Millisecond):\n\t}\n\t	close(release)\n\t<-done\n}\n'),
      withHint(testEx(say("twist", "เขียน ErrCount ให้นับงานที่คืน error โดยทำงานพร้อมกันไม่เกิน limit", "Write ErrCount to count jobs that return an error, with at most limit running at once"), tests, 'package main\n\nfunc ErrCount(limit int, jobs []func() error) int {\n\treturn 0\n}\n', 'package main\n\nimport (\n\t"errors"\n\t"testing"\n\t"time"\n)\n\nfunc TestErrCount(t *testing.T) {\n\tif ErrCount(2, []func() error{\n\t\tfunc() error { return errors.New("a") },\n\t\tfunc() error { return errors.New("b") },\n\t\tfunc() error { return nil },\n\t}) != 2 {\n\t\tt.Fatal("two")\n\t}\n\tstarted := make(chan struct{}, 4)\n\trelease := make(chan struct{})\n\tjobs := make([]func() error, 4)\n\tfor i := range jobs {\n\t\tjobs[i] = func() error {\n\t\t\tstarted <- struct{}{}\n\t\t\t<-release\n\t\t\tif i == 0 {\n\t\t\t\treturn errors.New("bad")\n\t\t\t}\n\t\t\treturn nil\n\t\t}\n\t}\n\tdone := make(chan int, 1)\n\tgo func() {\n\t\tdone <- ErrCount(2, jobs)\n\t}()\n\t<-started\n\t<-started\n\tselect {\n\tcase <-started:\n\t\tt.Fatal("too many")\n\tcase <-time.After(50 * time.Millisecond):\n\t}\n\tclose(release)\n\tif got := <-done; got != 1 {\n\t\tt.Fatal(got)\n\t}\n}\n'), "นับเฉพาะงานที่คืน error และอย่าให้ทำงานพร้อมกันเกิน limit", "Count only jobs that return an error, and do not let more than limit run at once"),
    ],
  }),
  lesson({
    id: "p02-waitgroup",
    level: "professional",
    order: 23,
    title: text("sync.WaitGroup และ vet", "sync.WaitGroup and vet"),
    goal: text("เรียก Add ก่อนเริ่ม goroutine และให้ go vet ผ่าน", "Call Add before starting the goroutine and keep go vet clean"),
    copy: copy(
      [
        "WaitGroup.Add ต้องถูกเรียกก่อน go และควรถูกเรียกใน goroutine เดิมที่รอ ไม่ใช่ข้างใน goroutine ใหม่ go vet มีตัวตรวจ waitgroup ที่เตือนเมื่อ Add อยู่ใน goroutine ที่เพิ่งสร้าง Done ควรวางใน defer\n\n```\nwg.Add(1)\ngo func() {\n\tdefer wg.Done()\n}()\nwg.Wait()\n```",
        "ใช้รอชุดงานที่ไม่มีผลส่งกลับทีละค่า เช่น ปิดทรัพยากรหลายชิ้นพร้อมกัน",
        "นับงานที่จบครบ",
        "จัด Add ให้อยู่ก่อน go เพื่อให้ vet ผ่าน",
        ["เรียก Add ก่อน go", "วาง Done ใน defer", "เรียก Wait หลังปล่อยงานแล้ว", "รัน go vet ให้เงียบ"],
      ],
      [
        "WaitGroup.Add must run before go, in the goroutine that will Wait, not inside the new goroutine. go vet has a waitgroup check that warns when Add happens inside the goroutine that was just started. Done belongs in defer.\n\n```\nwg.Add(1)\ngo func() {\n\tdefer wg.Done()\n}()\nwg.Wait()\n```",
        "Use it to wait for a batch that does not return one value at a time, such as closing several resources together.",
        "Count finished jobs.",
        "Place Add before go so vet stays quiet.",
        ["Call Add before go", "Put Done in defer", "Call Wait after the jobs are started", "Keep go vet quiet"],
      ],
    ),
    exercises: [
      testEx(say("easy", "เขียน FanIn ให้คืน n โดยรอ goroutine ให้ครบ", "Write FanIn to return n after waiting for the goroutines"), tests, 'package main\n\nfunc FanIn(n int) int {\n\treturn 0\n}\n', 'package main\n\nimport "testing"\n\nfunc TestFanIn(t *testing.T) {\n\tif FanIn(4) != 4 {\n\t\tt.Fatal("fan")\n\t}\n}\n'),
      testEx(say("mid", "เขียน Total ให้บวก 1 ต่อหนึ่ง goroutine อย่างปลอดภัย", "Write Total to add 1 per goroutine without a data race"), tests, 'package main\n\nfunc Total(n int) int {\n\treturn 0\n}\n', 'package main\n\nimport "testing"\n\nfunc TestTotal(t *testing.T) {\n\tif Total(5) != 5 {\n\t\tt.Fatal("total")\n\t}\n}\n'),
      testEx(say("hard", "ย้าย wg.Add ออกจากใน goroutine แล้วให้ FanIn(3) คืน 3", "Move wg.Add out of the goroutine and make FanIn(3) return 3"), tests, 'package main\n\nimport "sync"\n\nfunc FanIn(n int) int {\n\tvar wg sync.WaitGroup\n\tfor i := 0; i < n; i++ {\n\t\tgo func() {\n\t\t\twg.Add(1)\n\t\t\twg.Done()\n\t\t}()\n\t}\n\twg.Wait()\n\treturn 0\n}\n', 'package main\n\nimport "testing"\n\nfunc TestFanIn(t *testing.T) {\n\tif FanIn(3) != 3 {\n\t\tt.Fatal("fan")\n\t}\n}\n'),
      withHint(testEx(say("twist", "เขียน Sum ให้แต่ละ goroutine บวกเลขดัชนีของตัวเองอย่างปลอดภัย ผลของ 4 คือ 6", "Write Sum so each goroutine safely adds its own index. Sum(4) is 6"), tests, 'package main\n\nfunc Sum(n int) int {\n\treturn 0\n}\n', 'package main\n\nimport "testing"\n\nfunc TestSum(t *testing.T) {\n\tif Sum(4) != 6 {\n\t\tt.Fatal("four")\n\t}\n\tif Sum(0) != 0 {\n\t\tt.Fatal("zero")\n\t}\n}\n'), "แต่ละ goroutine บวกดัชนีของตัวเอง แล้วรอให้ครบก่อนคืนผลรวม", "Each goroutine adds its own index, and you wait for all of them before returning the sum"),
    ],
  }),
  lesson({
    id: "p03-cancel",
    level: "professional",
    order: 24,
    title: text("ยกเลิกงานด้วย context", "Cancel work with context"),
    goal: text("หยุดงานเมื่อ context ของผู้เรียกจบ", "Stop the work when the caller's context ends"),
    copy: copy(
      [
        "งานที่บล็อกต้องฟัง ctx.Done() คู่กับช่องทางของงานเอง ถ้าผู้เรียกยกเลิก ฟังก์ชันควรคืน ctx.Err() แทนที่จะรอต่อ\n\n```\nselect {\ncase <-ctx.Done():\n\treturn ctx.Err()\ncase v := <-work:\n\treturn use(v)\n}\n```",
        "ใช้ใน handler ที่ต้องเลิกคำนวณเมื่อ client ตัดการเชื่อมต่อ",
        "คืน error เมื่อ context จบแล้ว",
        "เลือกได้ทั้งผลงานกับสัญญาณยกเลิก",
        ["ส่ง ctx ลงไปทุกชั้น", "เลือก Done กับงานใน select", "คืน ctx.Err()", "อย่ารอ sleep คงที่แทนการยกเลิก"],
      ],
      [
        "Blocking work must listen to ctx.Done() as well as its own channel. If the caller cancels, return ctx.Err() instead of waiting longer.\n\n```\nselect {\ncase <-ctx.Done():\n\treturn ctx.Err()\ncase v := <-work:\n\treturn use(v)\n}\n```",
        "Use it in a handler that must stop calculating when the client disconnects.",
        "Return an error when the context has already ended.",
        "Choose between a result and the cancel signal.",
        ["Pass ctx down every layer", "Select on Done and the work", "Return ctx.Err()", "Do not replace cancellation with a fixed sleep"],
      ],
    ),
    exercises: [
      testEx(say("easy", "เขียน Stopped ให้คืน ctx.Err() เมื่อ context จบแล้ว", "Write Stopped to return ctx.Err() when the context has ended"), tests, 'package main\n\nimport "context"\n\nfunc Stopped(ctx context.Context) error {\n\treturn nil\n}\n', 'package main\n\nimport (\n\t"context"\n\t"testing"\n)\n\nfunc TestStopped(t *testing.T) {\n\tctx, cancel := context.WithCancel(context.Background())\n\tcancel()\n\tif err := Stopped(ctx); err == nil {\n\t\tt.Fatal("err")\n\t}\n}\n'),
      testEx(say("mid", "เขียน Take ให้คืนค่าจาก channel เมื่อมีค่า และคืน 0 เมื่อ context จบ", "Write Take to return the channel value when present and 0 when the context has ended"), tests, 'package main\n\nimport "context"\n\nfunc Take(ctx context.Context, ch <-chan int) int {\n\treturn 1\n}\n', 'package main\n\nimport (\n\t"context"\n\t"testing"\n)\n\nfunc TestTake(t *testing.T) {\n\tch := make(chan int, 1)\n\tch <- 4\n\tif Take(context.Background(), ch) != 4 {\n\t\tt.Fatal("value")\n\t}\n\tctx, cancel := context.WithCancel(context.Background())\n\tcancel()\n\tif Take(ctx, make(chan int)) != 0 {\n\t\tt.Fatal("cancel")\n\t}\n}\n'),
      testEx(say("hard", "เขียน Wait ให้บล็อกจน context จบแล้วคืน ctx.Err()", "Write Wait to block until the context ends and return ctx.Err()"), tests, 'package main\n\nimport "context"\n\nfunc Wait(ctx context.Context) error {\n\treturn nil\n}\n', 'package main\n\nimport (\n\t"context"\n\t"testing"\n)\n\nfunc TestWait(t *testing.T) {\n\tctx, cancel := context.WithCancel(context.Background())\n\tcancel()\n\tif err := Wait(ctx); err == nil {\n\t\tt.Fatal("err")\n\t}\n}\n'),
      withHint(testEx(say("twist", "เขียน Remain ให้นับรอบที่ทำได้ก่อน context จบ context ที่จบแล้วได้ 0", "Write Remain to count rounds finished before the context ends. An ended context returns 0"), tests, 'package main\n\nimport "context"\n\nfunc Remain(ctx context.Context, n int) int {\n\treturn 0\n}\n', 'package main\n\nimport (\n\t"context"\n\t"testing"\n)\n\nfunc TestRemain(t *testing.T) {\n\tctx, cancel := context.WithCancel(context.Background())\n\tcancel()\n\tif Remain(ctx, 4) != 0 {\n\t\tt.Fatal("canceled")\n\t}\n\tif Remain(context.Background(), 3) != 3 {\n\t\tt.Fatal("open")\n\t}\n}\n'), "ถ้า context จบแล้วอย่าเริ่มรอบ ถ้ายังทำงานให้นับครบ n", "If the context has ended, do not start a round. If it is still active, count all n rounds"),
    ],
  }),
  lesson({
    id: "p04-http",
    level: "professional",
    order: 25,
    title: text("net/http", "net/http"),
    goal: text("ตรวจ method ของ request และตั้ง timeout ของ client", "Check the request method and set a client timeout"),
    copy: copy(
      [
        "handler ควรปฏิเสธ method ที่ไม่รองรับด้วย 405 client ควรมี Timeout เพื่อไม่ให้คำขอแขวน httptest.NewRequest สร้าง request ในเทสต์โดยไม่ต้องเปิดพอร์ต\n\n```\nif r.Method != http.MethodPost {\n\treturn http.StatusMethodNotAllowed\n}\n```",
        "ใช้ทั้งตอนเขียน API เล็กๆ และตอนเรียก service อื่นจาก backend",
        "รับเฉพาะ POST",
        "ตั้ง timeout ให้ client หรือเขียนสถานะลง ResponseWriter",
        ["เทียบ r.Method กับค่าคงที่ของ http", "คืน 405 เมื่อ method ไม่ถูก", "ตั้ง Client.Timeout", "ใช้ httptest ในเทสต์ ไม่เปิดพอร์ตจริง"],
      ],
      [
        "A handler should reject an unsupported method with 405. A client should have a Timeout so a call cannot hang. httptest.NewRequest builds a request in a test without opening a port.\n\n```\nif r.Method != http.MethodPost {\n\treturn http.StatusMethodNotAllowed\n}\n```",
        "Use it when writing a small API and when this backend calls another service.",
        "Accept only POST.",
        "Set a client timeout, or write a status to the ResponseWriter.",
        ["Compare r.Method with an http constant", "Return 405 for the wrong method", "Set Client.Timeout", "Use httptest in tests instead of a real port"],
      ],
    ),
    exercises: [
      testEx(say("easy", "เขียน Status ให้คืน 200 สำหรับ POST และ 405 สำหรับ method อื่น", "Write Status to return 200 for POST and 405 for any other method"), tests, 'package main\n\nimport "net/http"\n\nfunc Status(r *http.Request) int {\n\treturn 0\n}\n', 'package main\n\nimport (\n\t"net/http"\n\t"net/http/httptest"\n\t"testing"\n)\n\nfunc TestStatus(t *testing.T) {\n\tif Status(httptest.NewRequest(http.MethodPost, "/", nil)) != http.StatusOK {\n\t\tt.Fatal("post")\n\t}\n\tif Status(httptest.NewRequest(http.MethodGet, "/", nil)) != http.StatusMethodNotAllowed {\n\t\tt.Fatal("get")\n\t}\n}\n'),
      testEx(say("mid", "เขียน Client ให้คืน http.Client ที่ Timeout เป็น 1 วินาที", "Write Client to return an http.Client whose Timeout is one second"), tests, 'package main\n\nimport "net/http"\n\nfunc Client() *http.Client {\n\treturn nil\n}\n', 'package main\n\nimport (\n\t"net/http"\n\t"testing"\n\t"time"\n)\n\nfunc TestClient(t *testing.T) {\n\tc := Client()\n\tif c == nil || c.Timeout != time.Second {\n\t\tt.Fatal("timeout")\n\t}\n}\n'),
      testEx(say("hard", "เขียน WriteOK ให้ตอบ 200 และเนื้อหา ok", "Write WriteOK to respond with 200 and the body ok"), tests, 'package main\n\nimport "net/http"\n\nfunc WriteOK(w http.ResponseWriter) {\n}\n', 'package main\n\nimport (\n\t"net/http"\n\t"net/http/httptest"\n\t"testing"\n)\n\nfunc TestWriteOK(t *testing.T) {\n\trec := httptest.NewRecorder()\n\tWriteOK(rec)\n\tif rec.Code != http.StatusOK || rec.Body.String() != "ok" {\n\t\tt.Fatal(rec.Body.String())\n\t}\n}\n'),
      withHint(testEx(say("twist", "เขียน Allow ให้คืน 200 เมื่อ method อยู่ในรายการ และ 405 เมื่อไม่อยู่", "Write Allow to return 200 when the method is in the list and 405 when it is not"), tests, 'package main\n\nimport "net/http"\n\nfunc Allow(r *http.Request, methods ...string) int {\n\treturn 0\n}\n', 'package main\n\nimport (\n\t"net/http"\n\t"net/http/httptest"\n\t"testing"\n)\n\nfunc TestAllow(t *testing.T) {\n\tget := httptest.NewRequest(http.MethodGet, "/", nil)\n\tif Allow(get, http.MethodGet, http.MethodPost) != http.StatusOK {\n\t\tt.Fatal("get")\n\t}\n\tput := httptest.NewRequest(http.MethodPut, "/", nil)\n\tif Allow(put, http.MethodGet) != http.StatusMethodNotAllowed {\n\t\tt.Fatal("put")\n\t}\n}\n'), "คืน 200 เมื่อ method ตรงกับรายการ และ 405 เมื่อไม่ตรง", "Return 200 when the method is in the list and 405 when it is not"),
    ],
  }),
  lesson({
    id: "p05-synctest",
    level: "professional",
    order: 26,
    title: text("testing/synctest", "testing/synctest"),
    goal: text("ทดสอบโค้ดที่รอเวลาด้วยนาฬิกาใน bubble ของ synctest", "Test code that waits on time by using the synctest bubble clock"),
    copy: copy(
      [
        "testing/synctest ใน Go 1.25 ให้ทดสอบโค้ดที่เรียก time.Sleep โดยนาฬิกาใน bubble เดินเมื่อ goroutine ใน bubble ว่างทั้งหมด เทสต์จึงไม่ต้องรอเวลาจริงหนึ่งวินาที\n\n```\nsynctest.Test(t, func(t *testing.T) {\n\ttime.Sleep(time.Second)\n})\n```",
        "ใช้กับโค้ดที่ยกเลิกตามเวลา หรือหน่วงก่อนลองใหม่ โดยไม่ทำให้ชุดเทสต์ช้า",
        "นอนหนึ่งวินาทีใน bubble แล้วคืน 1",
        "คืนระยะเวลาที่นาฬิกาใน bubble เดินไป",
        ["เรียก time.Sleep ในฟังก์ชันที่ถูกเทสต์", "อย่าใช้เวลาจริงนอก bubble", "ให้เทสต์ที่ซ่อนไว้เป็นคนห่อ synctest.Test", "ตรวจทั้งค่าที่คืนและเวลาที่เดิน"],
      ],
      [
        "testing/synctest in Go 1.25 tests code that calls time.Sleep. The clock inside the bubble advances when every goroutine in the bubble is idle, so the test does not wait a real second.\n\n```\nsynctest.Test(t, func(t *testing.T) {\n\ttime.Sleep(time.Second)\n})\n```",
        "Use it for code that cancels on a timer or waits before a retry, without slowing the suite down.",
        "Sleep one second inside the bubble and return 1.",
        "Return how far the bubble clock moved.",
        ["Call time.Sleep in the function under test", "Do not depend on real time outside the bubble", "The hidden test wraps the call in synctest.Test", "Check both the returned value and the clock"],
      ],
    ),
    exercises: [
      testEx(say("easy", "เขียน WaitTick ให้ time.Sleep หนึ่งวินาทีแล้วคืน 1", "Write WaitTick to time.Sleep for one second and return 1"), tests, 'package main\n\nfunc WaitTick() int {\n\treturn 0\n}\n', 'package main\n\nimport (\n\t"testing"\n\t"testing/synctest"\n\t"time"\n)\n\nfunc TestWaitTick(t *testing.T) {\n\tsynctest.Test(t, func(t *testing.T) {\n\t\tstart := time.Now()\n\t\tif WaitTick() != 1 {\n\t\t\tt.Fatal("value")\n\t\t}\n\t\tif time.Since(start) < time.Second {\n\t\t\tt.Fatal("clock")\n\t\t}\n\t})\n}\n'),
      testEx(say("mid", "เขียน Nap ให้คืนเวลาที่ผ่านไปหลัง time.Sleep สองวินาที", "Write Nap to return the elapsed time after a two-second time.Sleep"), tests, 'package main\n\nimport "time"\n\nfunc Nap(start time.Time) time.Duration {\n\treturn 0\n}\n', 'package main\n\nimport (\n\t"testing"\n\t"testing/synctest"\n\t"time"\n)\n\nfunc TestNap(t *testing.T) {\n\tsynctest.Test(t, func(t *testing.T) {\n\t\tstart := time.Now()\n\t\tif Nap(start) < 2*time.Second {\n\t\t\tt.Fatal("nap")\n\t\t}\n\t})\n}\n'),
      testEx(say("hard", "เขียน AfterTick ให้คืน true เฉพาะเมื่อ time.After หนึ่งวินาทีพร้อมแล้ว", "Write AfterTick to return true only after a one-second time.After is ready"), tests, 'package main\n\nfunc AfterTick() bool {\n\treturn false\n}\n', 'package main\n\nimport (\n\t"testing"\n\t"testing/synctest"\n\t"time"\n)\n\nfunc TestAfterTick(t *testing.T) {\n\tsynctest.Test(t, func(t *testing.T) {\n\t\tstart := time.Now()\n\t\tif !AfterTick() {\n\t\t\tt.Fatal("after")\n\t\t}\n\t\tif time.Since(start) < time.Second {\n\t\t\tt.Fatal("clock")\n\t\t}\n\t})\n}\n'),
      withHint(testEx(say("twist", "เขียน Ticks ให้นอน 500 มิลลิวินาทีสามครั้งแล้วคืน 3", "Write Ticks to sleep for 500 milliseconds three times and return 3"), tests, 'package main\n\nfunc Ticks() int {\n\treturn 0\n}\n', 'package main\n\nimport (\n\t"testing"\n\t"testing/synctest"\n\t"time"\n)\n\nfunc TestTicks(t *testing.T) {\n\tsynctest.Test(t, func(t *testing.T) {\n\t\tstart := time.Now()\n\t\tif Ticks() != 3 {\n\t\t\tt.Fatal("value")\n\t\t}\n\t\telapsed := time.Since(start)\n\t\tif elapsed < 1500*time.Millisecond || elapsed >= 2*time.Second {\n\t\t\tt.Fatal("clock")\n\t\t}\n\t})\n}\n'), "นอนครึ่งวินาทีสามครั้งในฟังก์ชัน แล้วคืน 3", "Sleep for half a second three times inside the function, then return 3"),
    ],
  }),
  lesson({
    id: "p06-bench-fuzz",
    level: "professional",
    order: 27,
    title: text("benchmark และ fuzz", "Benchmarks and fuzzing"),
    goal: text("อ่านผล benchmark และรู้ว่า fuzz target ขั้นต่ำหน้าตาเป็นอย่างไร", "Read a benchmark result and recognize a minimal fuzz target"),
    copy: copy(
      [
        "go test -bench วัดเวลาต่องานหนึ่งหน่วย ผลมี ns/op และอาจมี allocs/op fuzz ส่งข้อมูลสุ่มเข้าฟังก์ชันแล้วดูว่า panic หรือไม่ เป้าหมาย fuzz รับ *testing.F แล้วเรียก f.Add กับ f.Fuzz\n\n```\nfunc FuzzParse(f *testing.F) {\n\tf.Add(\"seed\")\n\tf.Fuzz(func(t *testing.T, s string) {\n\t\t_ = len(s)\n\t})\n}\n```",
        "ใช้ตอนจูนฟังก์ชันที่ถูกเรียกบ่อย และตอนหา input ที่ทำให้ parser พัง",
        "อ่านคอลัมน์ของผล bench",
        "รูปร่างของ fuzz target",
        ["แยก ns/op ออกจาก allocs/op", "ดูว่าตัวเลขน้อยลงคือเร็วขึ้น", "จำว่า fuzz อยู่ใน _test.go", "ตอบในหน้านี้"],
      ],
      [
        "go test -bench measures time per operation. The result shows ns/op and may show allocs/op. Fuzzing feeds random inputs and watches for a panic. A fuzz target takes *testing.F, then calls f.Add and f.Fuzz.\n\n```\nfunc FuzzParse(f *testing.F) {\n\tf.Add(\"seed\")\n\tf.Fuzz(func(t *testing.T, s string) {\n\t\t_ = len(s)\n\t})\n}\n```",
        "Use it when tuning a hot function and when searching for input that breaks a parser.",
        "Read the columns of a bench result.",
        "The shape of a fuzz target.",
        ["Separate ns/op from allocs/op", "A smaller number means faster", "Remember that fuzz lives in _test.go", "Answer on this page"],
      ],
    ),
    exercises: [
      quiz(
        say("easy", "ns/op ในผล benchmark หมายถึงอะไร", "What does ns/op in a benchmark result mean?"),
        { th: "มันคือเวลาเฉลี่ยเป็นนาโนวินาทีต่องานหนึ่งครั้ง", en: "It is the average time in nanoseconds for one operation" },
        {
          th: ["จำนวน goroutine", "เวลาเฉลี่ยเป็นนาโนวินาทีต่องานหนึ่งครั้ง", "ขนาดไบนารี", "จำนวนเทสต์ที่พัง"],
          en: ["The goroutine count", "The average time in nanoseconds for one operation", "The binary size", "The number of failing tests"],
        },
        1,
      ),
      quiz(
        say("mid", "allocs/op ที่ลดลงบอกอะไร", "What does a lower allocs/op tell you?"),
        { th: "งานหนึ่งครั้งจองหน่วยความจำบน heap น้อยลง", en: "One operation allocates less on the heap" },
        {
          th: ["โปรแกรมใช้ CPU มากขึ้นเสมอ", "งานหนึ่งครั้งจองหน่วยความจำบน heap น้อยลง", "เทสต์ถูกลบ", "โมดูลไม่มี dependency"],
          en: ["The program always uses more CPU", "One operation allocates less on the heap", "The test was deleted", "The module has no dependencies"],
        },
        1,
      ),
      quiz(
        say("hard", "fuzz target ขั้นต่ำต้องมีอะไร", "What does a minimal fuzz target need?"),
        { th: "ฟังก์ชัน Fuzz ที่รับ *testing.F แล้วเรียก f.Fuzz", en: "A Fuzz function that takes *testing.F and calls f.Fuzz" },
        {
          th: ["ฟังก์ชัน main ที่เรียก rand", "ไฟล์ go.mod เท่านั้น", "ฟังก์ชัน Fuzz ที่รับ *testing.F แล้วเรียก f.Fuzz", "คำสั่ง go vet"],
          en: ["A main function that calls rand", "Only a go.mod file", "A Fuzz function that takes *testing.F and calls f.Fuzz", "The go vet command"],
        },
        2,
      ),
    ],
  }),
  lesson({
    id: "p07-vet-mod",
    level: "professional",
    order: 28,
    title: text("hostport และ go.mod ignore", "hostport and go.mod ignore"),
    goal: text("ใช้ net.JoinHostPort และบอกได้ว่า ignore ทำให้คำสั่ง go ข้ามไดเรกทอรีใด", "Use net.JoinHostPort and say which directory ignore makes the go command skip"),
    copy: copy(
      [
        "การต่อ host กับ port ด้วยสตริงพังเมื่อ host เป็น IPv6 เพราะต้องมีวงเล็บ net.JoinHostPort จัดการให้ ใน Go 1.25 บล็อก ignore ใน go.mod บอกไดเรกทอรีที่คำสั่ง go จะไม่เข้าไปดู\n\n```\nnet.JoinHostPort(\"::1\", \"80\")\n```",
        "ใช้ตอนประกอบที่อยู่สำหรับ dial และตอนกันโฟลเดอร์เครื่องมือออกจากแพ็กเกจที่ go test เดิน",
        "ต่อ host กับ port ของ IPv4",
        "ต่อ IPv6 ให้ถูก และตอบว่า ignore ทำอะไร",
        ["อย่าต่อ host:port เอง", "ใช้ JoinHostPort", "จำว่า IPv6 ต้องมีวงเล็บ", "ตอบข้อ ignore ในหน้าบท"],
      ],
      [
        "Joining a host and port with string concatenation breaks for IPv6 because the host needs brackets. net.JoinHostPort handles that. In Go 1.25 an ignore block in go.mod names directories the go command will not look at.\n\n```\nnet.JoinHostPort(\"::1\", \"80\")\n```",
        "Use it when building an address to dial and when keeping a tools folder out of the packages go test walks.",
        "Join an IPv4 host and port.",
        "Join IPv6 correctly, and answer what ignore does.",
        ["Do not concatenate host:port yourself", "Call JoinHostPort", "Remember that IPv6 needs brackets", "Answer the ignore question on the lesson page"],
      ],
    ),
    exercises: [
      testEx(say("easy", "เขียน Host ให้คืน net.JoinHostPort ของ 127.0.0.1 และ 8080", "Write Host to return net.JoinHostPort of 127.0.0.1 and 8080"), tests, 'package main\n\nfunc Host() string {\n\treturn ""\n}\n', 'package main\n\nimport "testing"\n\nfunc TestHost(t *testing.T) {\n\tif Host() != "127.0.0.1:8080" {\n\t\tt.Fatal("host")\n\t}\n}\n'),
      testEx(say("mid", "เขียน V6 ให้คืนที่อยู่ของ ::1 พอร์ต 80 พร้อมวงเล็บ", "Write V6 to return the address of ::1 port 80 with brackets"), tests, 'package main\n\nfunc V6() string {\n\treturn ""\n}\n', 'package main\n\nimport "testing"\n\nfunc TestV6(t *testing.T) {\n\tif V6() != "[::1]:80" {\n\t\tt.Fatal("v6")\n\t}\n}\n'),
      withHint(testEx(say("twist", "เขียน Join ให้ใช้ net.JoinHostPort กับ host และ port ที่ส่งเข้า", "Write Join to pass the given host and port to net.JoinHostPort"), tests, 'package main\n\nfunc Join(host, port string) string {\n\treturn ""\n}\n', 'package main\n\nimport "testing"\n\nfunc TestJoin(t *testing.T) {\n\tif Join("localhost", "443") != "localhost:443" {\n\t\tt.Fatal("v4")\n\t}\n\tif Join("::1", "443") != "[::1]:443" {\n\t\tt.Fatal("v6")\n\t}\n}\n'), "ส่ง host กับ port เข้า net.JoinHostPort อย่าต่อสตริงเอง", "Pass host and port to net.JoinHostPort. Do not join the strings yourself"),
      quiz(
        say("hard", "บล็อก ignore ใน go.mod ของ Go 1.25 ทำให้เกิดอะไร", "What does an ignore block in a Go 1.25 go.mod do?"),
        { th: "คำสั่ง go ข้ามไดเรกทอรีที่ระบุ และไม่ถือว่าเป็นแพ็กเกจในโมดูล", en: "The go command skips the named directories and does not treat them as packages in the module" },
        {
          th: ["ลบไฟล์ตอน build", "คำสั่ง go ข้ามไดเรกทอรีที่ระบุ", "ปิด go vet ทั้งโมดูล", "เปลี่ยนรุ่นภาษา"],
          en: ["It deletes files during the build", "The go command skips the named directories", "It disables go vet for the whole module", "It changes the language version"],
        },
        1,
      ),
    ],
  }),
  lesson({
    id: "p08-slog",
    level: "professional",
    order: 29,
    title: text("log/slog", "log/slog"),
    goal: text("เขียน log เป็น key และ value", "Write logs as keys and values"),
    copy: copy(
      [
        "log/slog ส่งข้อความพร้อมคู่ key และ value handler แบบ text พิมพ์เป็น msg= และ key=value การต่อสตริงเองทำให้เครื่องที่อ่าน log แยกฟิลด์ไม่ได้\n\n```\nlogger.Info(\"hello\", \"user\", \"ada\")\n```",
        "ใช้ใน service ที่ต้องค้น log ตามรหัสผู้ใช้หรือรหัส request",
        "เขียนหนึ่งบรรทัดที่มี msg และ key",
        "ส่งค่าคนละชนิดโดยยังเป็นคู่",
        ["สร้าง logger จาก handler", "ส่ง key แล้วตามด้วย value", "อย่าต่อข้อความทั้งก้อนเอง", "ตรวจว่าผลมีทั้ง msg และ key"],
      ],
      [
        "log/slog records a message plus key and value pairs. The text handler prints msg= and key=value. Concatenating one string makes it hard for a machine to split the fields.\n\n```\nlogger.Info(\"hello\", \"user\", \"ada\")\n```",
        "Use it in a service that searches logs by user id or request id.",
        "Write one line that has a message and a key.",
        "Pass values of different kinds while keeping pairs.",
        ["Build a logger from a handler", "Pass a key followed by its value", "Do not concatenate the whole line yourself", "Check that the result has both msg and the key"],
      ],
    ),
    exercises: [
      testEx(say("easy", "เขียน Line ให้บันทึก msg กับคู่ key value ลง Writer", "Write Line to record msg and a key value pair to a Writer"), tests, 'package main\n\nimport "io"\n\nfunc Line(w io.Writer, msg, key, value string) {\n}\n', 'package main\n\nimport (\n\t"bytes"\n\t"strings"\n\t"testing"\n)\n\nfunc TestLine(t *testing.T) {\n\tvar b bytes.Buffer\n\tLine(&b, "hello", "user", "ada")\n\tgot := b.String()\n\tif !strings.Contains(got, "msg=hello") || !strings.Contains(got, "user=ada") {\n\t\tt.Fatal(got)\n\t}\n}\n'),
      testEx(say("mid", "เขียน Warn ให้ใช้ระดับ Warn และมี key code", "Write Warn to use level Warn and include the key code"), tests, 'package main\n\nimport "io"\n\nfunc Warn(w io.Writer, code int) {\n}\n', 'package main\n\nimport (\n\t"bytes"\n\t"strings"\n\t"testing"\n)\n\nfunc TestWarn(t *testing.T) {\n\tvar b bytes.Buffer\n\tWarn(&b, 7)\n\tgot := b.String()\n\tif !strings.Contains(got, "level=WARN") || !strings.Contains(got, "code=7") {\n\t\tt.Fatal(got)\n\t}\n}\n'),
      testEx(say("hard", "เขียน WithUser ให้ logger มี attribute user ติดไปกับทุกบรรทัด", "Write WithUser so the logger attaches the user attribute to the line"), tests, 'package main\n\nimport "io"\n\nfunc WithUser(w io.Writer, user, msg string) {\n}\n', 'package main\n\nimport (\n\t"bytes"\n\t"strings"\n\t"testing"\n)\n\nfunc TestWithUser(t *testing.T) {\n\tvar b bytes.Buffer\n\tWithUser(&b, "ada", "saved")\n\tgot := b.String()\n\tif !strings.Contains(got, "user=ada") || !strings.Contains(got, "msg=saved") {\n\t\tt.Fatal(got)\n\t}\n}\n'),
      withHint(testEx(say("twist", "เขียน InfoPair ให้บันทึกระดับ Info พร้อม attribute left และ right และข้อความ pair", "Write InfoPair to log at Info with attributes left and right and the message pair"), tests, 'package main\n\nimport "io"\n\nfunc InfoPair(w io.Writer, left, right string) {\n}\n', 'package main\n\nimport (\n\t"bytes"\n\t"strings"\n\t"testing"\n)\n\nfunc TestInfoPair(t *testing.T) {\n\tvar b bytes.Buffer\n\tInfoPair(&b, "a", "b")\n\tgot := b.String()\n\tif !strings.Contains(got, "level=INFO") || !strings.Contains(got, "msg=pair") || !strings.Contains(got, "left=a") || !strings.Contains(got, "right=b") {\n\t\tt.Fatal(got)\n\t}\n\tb.Reset()\n\tInfoPair(&b, "x", "y")\n\tgot = b.String()\n\tif !strings.Contains(got, "left=x") || !strings.Contains(got, "right=y") {\n\t\tt.Fatal(got)\n\t}\n}\n'), "ใช้ slog ระดับ Info และใส่ attribute สองตัวชื่อ left กับ right", "Use slog at Info and attach two attributes named left and right"),
    ],
  }),
  lesson({
    id: "p09-generic-api",
    level: "professional",
    order: 30,
    title: text("generics ใน API จริง", "Generics in a real API"),
    goal: text("เลือก generic เมื่อชนิดต้องไปกับผู้เรียก", "Choose generics when the type must follow the caller"),
    copy: copy(
      [
        "ถ้าฟังก์ชันคืนค่าชนิดเดียวกับที่รับมา และไม่ได้เรียก method ของค่านั้น generic ชัดกว่า interface ว่าง ถ้าพฤติกรรมคือ Speak ให้ใช้ interface แทน\n\n```\nfunc First[T any](items []T) (T, bool) {\n\tif len(items) == 0 {\n\t\tvar zero T\n\t\treturn zero, false\n\t}\n\treturn items[0], true\n}\n```",
        "ใช้ใน helper ของไลบรารีที่รับ slice ของชนิดที่ผู้เรียกกำหนด",
        "คืนสมาชิกตัวแรก",
        "คืนตัวสุดท้ายพร้อมบอกว่ามีค่า",
        ["ใช้ type parameter เมื่อต้องคืนชนิดเดิม", "คืน zero value เมื่อว่าง", "อย่าใช้ any แล้วให้ผู้เรียก assert", "ใช้ interface เมื่อต้องการพฤติกรรม"],
      ],
      [
        "If a function returns the same type it received and does not call methods on that value, a generic is clearer than the empty interface. If the behavior is Speak, use an interface instead.\n\n```\nfunc First[T any](items []T) (T, bool) {\n\tif len(items) == 0 {\n\t\tvar zero T\n\t\treturn zero, false\n\t}\n\treturn items[0], true\n}\n```",
        "Use it in a library helper that accepts a slice of a caller-chosen type.",
        "Return the first element.",
        "Return the last element and whether it exists.",
        ["Use a type parameter when you must return the same type", "Return the zero value when empty", "Do not return any and force the caller to assert", "Use an interface when you need behavior"],
      ],
    ),
    exercises: [
      testEx(say("easy", "เขียน First ให้คืนสมาชิกแรกและ true หรือ zero กับ false เมื่อว่าง", "Write First to return the first element and true, or the zero value and false when empty"), tests, 'package main\n\nfunc First[T any](items []T) (T, bool) {\n\tvar zero T\n\treturn zero, false\n}\n', 'package main\n\nimport "testing"\n\nfunc TestFirst(t *testing.T) {\n\tgot, ok := First([]int{4, 5})\n\tif !ok || got != 4 {\n\t\tt.Fatal("int")\n\t}\n\tif _, ok = First([]string{}); ok {\n\t\tt.Fatal("empty")\n\t}\n}\n'),
      testEx(say("mid", "เขียน Last ให้คืนสมาชิกสุดท้ายและ true", "Write Last to return the last element and true"), tests, 'package main\n\nfunc Last[T any](items []T) (T, bool) {\n\tvar zero T\n\treturn zero, false\n}\n', 'package main\n\nimport "testing"\n\nfunc TestLast(t *testing.T) {\n\tgot, ok := Last([]string{"a", "b"})\n\tif !ok || got != "b" {\n\t\tt.Fatal("last")\n\t}\n}\n'),
      testEx(say("hard", "เขียน At ให้คืนสมาชิกที่ index เมื่ออยู่ในขอบ และ false เมื่อเกิน", "Write At to return the element at index when it is in range, and false otherwise"), tests, 'package main\n\nfunc At[T any](items []T, index int) (T, bool) {\n\tvar zero T\n\treturn zero, false\n}\n', 'package main\n\nimport "testing"\n\nfunc TestAt(t *testing.T) {\n\tgot, ok := At([]int{7, 8}, 1)\n\tif !ok || got != 8 {\n\t\tt.Fatal("at")\n\t}\n\tif _, ok = At([]int{7}, 3); ok {\n\t\tt.Fatal("oob")\n\t}\n}\n'),
      withHint(testEx(say("twist", "เขียน NonZero ให้คืน slice ที่ตัด zero value ออก ทั้งตัวเลขและสตริง", "Write NonZero to return the slice with zero values removed, for both numbers and strings"), tests, 'package main\n\nfunc NonZero[T comparable](items []T) []T {\n\treturn nil\n}\n', 'package main\n\nimport "testing"\n\nfunc TestNonZero(t *testing.T) {\n\tgot := NonZero([]int{0, 2, 0, 3})\n\tif len(got) != 2 || got[0] != 2 || got[1] != 3 {\n\t\tt.Fatal("ints")\n\t}\n\twords := NonZero([]string{"", "a"})\n\tif len(words) != 1 || words[0] != "a" {\n\t\tt.Fatal("strings")\n\t}\n}\n'), "ตัดค่าที่เป็น zero value ของชนิดนั้นออก ทั้ง 0 และสตริงว่าง", "Drop values that are the zero value of the type, both 0 and the empty string"),
    ],
  }),
  lesson({
    id: "p10-mod-prod",
    level: "professional",
    order: 31,
    title: text("module ในงานจริง", "Modules in production"),
    goal: text("กำหนดรุ่น Go ใน go.mod และรู้ว่า Go 1.25 เลือก toolchain อย่างไร", "Set the Go version in go.mod and know how Go 1.25 selects a toolchain"),
    copy: copy(
      [
        "บรรทัด go ใน go.mod คือรุ่นภาษาขั้นต่ำของโมดูล บรรทัด toolchain ถ้าระบุ จะขอ toolchain นั้น GOTOOLCHAIN=local หมายถึงใช้ toolchain ที่ติดตั้งอยู่ ไม่ดาวน์โหลดเพิ่ม Go 1.25 ยังใช้กติกานี้\n\n```\ngo 1.25\n\ntoolchain go1.25.0\n```",
        "ใช้ตอนล็อกเวอร์ชันใน CI และตอนกันไม่ให้เครื่องพัฒนาไปดึง toolchain คนละรุ่นเงียบๆ",
        "ความหมายของบรรทัด go",
        "toolchain กับ GOTOOLCHAIN=local",
        ["แยกบรรทัด go ออกจากบรรทัด toolchain", "รู้ว่า local ไม่ดาวน์โหลด", "อย่าเดาว่ารุ่นภาษาเท่ากับรุ่นไบนารีเสมอ", "ตอบในหน้านี้"],
      ],
      [
        "The go line in go.mod is the module's minimum language version. A toolchain line, when present, requests that toolchain. GOTOOLCHAIN=local means use the installed toolchain and do not download another. Go 1.25 still uses this rule.\n\n```\ngo 1.25\n\ntoolchain go1.25.0\n```",
        "Use it to pin CI and to stop a developer machine from quietly fetching a different toolchain.",
        "What the go line means.",
        "toolchain and GOTOOLCHAIN=local.",
        ["Separate the go line from the toolchain line", "Know that local does not download", "Do not assume the language version always equals the binary version", "Answer on this page"],
      ],
    ),
    exercises: [
      quiz(
        say("easy", "บรรทัด go 1.25 ใน go.mod บอกอะไร", "What does the line go 1.25 in go.mod say?"),
        { th: "โมดูลนี้ใช้ภาษาอย่างน้อยรุ่น 1.25", en: "This module uses at least language version 1.25" },
        {
          th: ["ต้องมีไฟล์ 25 ไฟล์", "โมดูลนี้ใช้ภาษาอย่างน้อยรุ่น 1.25", "ปิด module", "ตั้งพอร์ต 25"],
          en: ["The module must contain 25 files", "This module uses at least language version 1.25", "It disables modules", "It sets port 25"],
        },
        1,
      ),
      quiz(
        say("mid", "บรรทัด toolchain ต่างจากบรรทัด go อย่างไร", "How is a toolchain line different from the go line?"),
        { th: "toolchain ขอชุดเครื่องมือรุ่นนั้น ส่วน go บอกรุ่นภาษา", en: "toolchain requests that toolset, while go states the language version" },
        {
          th: ["ทั้งสองบรรทัดคือสิ่งเดียวกัน", "toolchain ขอชุดเครื่องมือรุ่นนั้น ส่วน go บอกรุ่นภาษา", "toolchain ลบ dependency", "go ตั้ง GOPROXY"],
          en: ["The two lines are the same thing", "toolchain requests that toolset, while go states the language version", "toolchain deletes dependencies", "go sets GOPROXY"],
        },
        1,
      ),
      quiz(
        say("hard", "GOTOOLCHAIN=local ทำให้เกิดอะไร", "What does GOTOOLCHAIN=local do?"),
        { th: "ใช้ toolchain ที่ติดตั้งอยู่ และไม่ดาวน์โหลด toolchain อื่น", en: "Use the installed toolchain and do not download another one" },
        {
          th: ["ใช้ toolchain ที่ติดตั้งอยู่ และไม่ดาวน์โหลด toolchain อื่น", "ดาวน์โหลด toolchain ล่าสุดทุกครั้ง", "ปิด go test", "เปลี่ยนชื่อโมดูล"],
          en: ["Use the installed toolchain and do not download another one", "Download the newest toolchain every time", "Disable go test", "Rename the module"],
        },
        0,
      ),
    ],
  }),
];
