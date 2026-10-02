import { copy, go, lesson, pick, say, solved, testEx, testFile, tests, text, unit, withHint, withinHelper } from "./helpers.mjs";

export const advancedRest = [
  lesson({
    id: "a06-goroutines",
    level: "advanced",
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
      withHint(testEx(say("twist", "เขียน CountAsync ให้ goroutine n ตัวส่ง 1 แล้วรวมผล", "Write CountAsync so n goroutines each send 1 and you add the results"), tests, 'package main\n\nfunc CountAsync(n int) int {\n\treturn 0\n}\n', 'package main\n\nimport "testing"\n\nfunc TestCountAsync(t *testing.T) {\n\tif CountAsync(3) != 3 {\n\t\tt.Fatal("three")\n\t}\n\tif CountAsync(0) != 0 {\n\t\tt.Fatal("zero")\n\t}\n}\n'), "เปิด n goroutine ให้แต่ละตัวส่ง 1 แล้วรวม", "Start n goroutines, have each send 1, then add the results"),
    ],
  }),
  lesson({
    id: "a07-channels",
    level: "advanced",
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
      withHint(testEx(say("twist", "เขียน Drain ให้รวมค่าจาก channel ที่ผู้เรียกปิดแล้ว รวม channel ปิดที่ว่าง", "Write Drain to sum a channel the caller already closed, including a closed empty channel"), tests, 'package main\n\nfunc Drain(ch <-chan int) int {\n\treturn 0\n}\n', 'package main\n\nimport "testing"\n\nfunc TestDrain(t *testing.T) {\n\tch := make(chan int, 2)\n\tch <- 2\n\tch <- 3\n\tclose(ch)\n\tif Drain(ch) != 5 {\n\t\tt.Fatal("sum")\n\t}\n\tempty := make(chan int)\n\tclose(empty)\n\tif Drain(empty) != 0 {\n\t\tt.Fatal("empty")\n\t}\n}\n'), "range บน channel จนมันถูกปิด channel ปิดที่ว่างรวมได้ 0", "Range the channel until it is closed. A closed empty channel sums to 0"),
    ],
  }),
  lesson({
    id: "a08-select",
    level: "advanced",
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
      withHint(testEx(say("twist", "เขียน FirstOr ให้คืนค่าที่พร้อมก่อน หรือค่าสำรองทันทีเมื่อไม่มี channel ไหนพร้อม", "Write FirstOr to return the value that is ready first, or the fallback immediately when neither channel is ready"), tests, 'package main\n\nfunc FirstOr(a, b <-chan int, fallback int) int {\n\treturn 0\n}\n', 'package main\n\nimport "testing"\n\nfunc TestFirstOr(t *testing.T) {\n\ta := make(chan int, 1)\n\ta <- 8\n\tb := make(chan int)\n\tif FirstOr(a, b, 1) != 8 {\n\t\tt.Fatal("ready")\n\t}\n\tif FirstOr(make(chan int), make(chan int), 1) != 1 {\n\t\tt.Fatal("fallback")\n\t}\n}\n'), "ใช้ select รับค่าที่พร้อม หรือ default เมื่อไม่มีใครพร้อม", "Use select to take a ready value, or default when neither channel is ready"),
    ],
  }),
  lesson({
    id: "a09-context",
    level: "advanced",
    title: text("context", "context"),
    goal: text("หยุดงานที่รออยู่เมื่อผู้เรียกยกเลิกหรือหมดเวลา และตั้งเวลาจำกัดให้งานเอง", "Stop waiting work when the caller cancels or time runs out, and set a time limit yourself"),
    exercises: [
      solved(
        withHint(
          testEx(
            say("easy", "เขียน Done ให้คืน true เมื่อ context จบแล้ว และคืน false ทันทีเมื่อยังไม่จบ", "Write Done to return true when the context has ended, and false right away when it has not"),
            tests,
            unit(go`import "context"

func Done(ctx context.Context) bool {
	return false
}`),
            testFile(go`import (
	"context"
	"testing"
)

func TestDone(t *testing.T) {
	if Done(context.Background()) {
		t.Fatal("an open context is not done")
	}
	ctx, cancel := context.WithCancel(context.Background())
	cancel()
	if !Done(ctx) {
		t.Fatal("a canceled context is done")
	}
}`),
          ),
          "ใช้ select ที่มี case <-ctx.Done() กับ default ตัว default ทำให้ไม่ต้องรอเมื่อยังไม่จบ",
          "Use a select with case <-ctx.Done() and a default. The default means you never wait when it is still open",
        ),
        unit(go`import "context"

func Done(ctx context.Context) bool {
	select {
	case <-ctx.Done():
		return true
	default:
		return false
	}
}`),
      ),
      solved(
        withHint(
          testEx(
            say("mid", "เขียน Sleep ให้รอ d แล้วคืน nil แต่ถ้า context จบก่อนให้เลิกรอทันทีแล้วคืน ctx.Err()", "Write Sleep to wait for d and return nil, but if the context ends first, stop waiting at once and return ctx.Err()"),
            tests,
            unit(go`import (
	"context"
	"time"
)

func Sleep(ctx context.Context, d time.Duration) error {
	time.Sleep(d)
	return nil
}`),
            testFile(go`import (
	"context"
	"errors"
	"testing"
	"time"
)

func TestSleep(t *testing.T) {
	if err := Sleep(context.Background(), 5*time.Millisecond); err != nil {
		t.Fatalf("open context: %v", err)
	}
	ctx, cancel := context.WithCancel(context.Background())
	cancel()
	var err error
	within(t, func() { err = Sleep(ctx, time.Hour) })
	if !errors.Is(err, context.Canceled) {
		t.Fatalf("canceled context must return context.Canceled, got %v", err)
	}
}` + withinHelper),
          ),
          "select รอสองอย่างพร้อมกัน: case <-time.After(d) คืน nil และ case <-ctx.Done() คืน ctx.Err() อันไหนมาก่อนก็ได้อันนั้น",
          "Select on two things at once: case <-time.After(d) returns nil and case <-ctx.Done() returns ctx.Err(). Whichever comes first wins",
        ),
        unit(go`import (
	"context"
	"time"
)

func Sleep(ctx context.Context, d time.Duration) error {
	select {
	case <-time.After(d):
		return nil
	case <-ctx.Done():
		return ctx.Err()
	}
}`),
      ),
      solved(
        withHint(
          testEx(
            say("hard", "เขียน SumUntil ให้บวกค่าจาก ch จนกว่า ch จะถูกปิดแล้วคืนผลรวมกับ nil ถ้า context จบก่อนให้คืนผลรวมเท่าที่ได้กับ ctx.Err()", "Write SumUntil to add values from ch until ch is closed, then return the sum and nil. If the context ends first, return the sum so far and ctx.Err()"),
            tests,
            unit(go`import "context"

func SumUntil(ctx context.Context, ch <-chan int) (int, error) {
	return 0, nil
}`),
            testFile(go`import (
	"context"
	"errors"
	"testing"
	"time"
)

func TestSumUntil(t *testing.T) {
	ch := make(chan int, 3)
	ch <- 1
	ch <- 2
	ch <- 3
	close(ch)
	if sum, err := SumUntil(context.Background(), ch); err != nil || sum != 6 {
		t.Fatalf("closed channel: %d, %v", sum, err)
	}
	ctx, cancel := context.WithCancel(context.Background())
	open := make(chan int)
	go func() {
		open <- 4
		cancel()
	}()
	var sum int
	var err error
	within(t, func() { sum, err = SumUntil(ctx, open) })
	if !errors.Is(err, context.Canceled) || sum != 4 {
		t.Fatalf("canceled: %d, %v", sum, err)
	}
}` + withinHelper),
          ),
          "วนด้วย for แล้วใช้ select: case v, ok := <-ch ถ้า ok เป็น false แปลว่าปิดแล้วให้คืนผลรวม ส่วน case <-ctx.Done() คืนผลรวมกับ ctx.Err()",
          "Loop with for and select: in case v, ok := <-ch, ok is false once the channel is closed, so return the sum. In case <-ctx.Done(), return the sum and ctx.Err()",
        ),
        unit(go`import "context"

func SumUntil(ctx context.Context, ch <-chan int) (int, error) {
	sum := 0
	for {
		select {
		case v, ok := <-ch:
			if !ok {
				return sum, nil
			}
			sum += v
		case <-ctx.Done():
			return sum, ctx.Err()
		}
	}
}`),
      ),
      solved(
        withHint(
          testEx(
            say("twist", "เขียน Within ให้เรียก work ด้วย context ที่หมดเวลาหลัง d และคืน error ของ work อย่าลืมยกเลิก context เมื่อเสร็จ", "Write Within to call work with a context that times out after d, and return work's error. Remember to cancel the context when done"),
            tests,
            unit(go`import (
	"context"
	"time"
)

func Within(parent context.Context, d time.Duration, work func(context.Context) error) error {
	return work(parent)
}`),
            testFile(go`import (
	"context"
	"errors"
	"testing"
	"time"
)

func waitForEnd(ctx context.Context) error {
	<-ctx.Done()
	return ctx.Err()
}

func TestWithin(t *testing.T) {
	var err error
	within(t, func() { err = Within(context.Background(), 10*time.Millisecond, waitForEnd) })
	if !errors.Is(err, context.DeadlineExceeded) {
		t.Fatalf("slow work must hit the deadline, got %v", err)
	}
	if Within(context.Background(), time.Second, func(context.Context) error { return nil }) != nil {
		t.Fatal("fast work returns its own result")
	}
	parent, cancel := context.WithCancel(context.Background())
	cancel()
	within(t, func() { err = Within(parent, time.Hour, waitForEnd) })
	if !errors.Is(err, context.Canceled) {
		t.Fatalf("a canceled parent must cancel the child, got %v", err)
	}
}` + withinHelper),
          ),
          "ctx, cancel := context.WithTimeout(parent, d) แล้ว defer cancel() ทันที จากนั้น return work(ctx)",
          "ctx, cancel := context.WithTimeout(parent, d), then defer cancel() right away, then return work(ctx)",
        ),
        unit(go`import (
	"context"
	"time"
)

func Within(parent context.Context, d time.Duration, work func(context.Context) error) error {
	ctx, cancel := context.WithTimeout(parent, d)
	defer cancel()
	return work(ctx)
}`),
      ),
    ],
  }),
  lesson({
    id: "a10-testing",
    level: "advanced",
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
      withHint(testEx(say("twist", "เขียน Clamp ให้จำกัดค่าในช่วงปิด ทั้งค่าในขอบและนอกขอบ", "Write Clamp to limit a value to a closed range, both on the boundary and outside it"), tests, 'package main\n\nfunc Clamp(n, low, high int) int {\n\treturn n\n}\n', 'package main\n\nimport "testing"\n\nfunc TestClamp(t *testing.T) {\n\tif Clamp(5, 1, 3) != 3 {\n\t\tt.Fatal("high")\n\t}\n\tif Clamp(-1, 0, 2) != 0 {\n\t\tt.Fatal("low")\n\t}\n\tif Clamp(2, 0, 2) != 2 {\n\t\tt.Fatal("edge")\n\t}\n}\n'), "ถ้าต่ำกว่า low ให้คืน low ถ้าสูงกว่า high ให้คืน high ค่าที่เท่าขอบอยู่ได้", "Return low when the value is below it and high when it is above. A value on the boundary stays"),
    ],
  }),
  lesson({
    id: "a11-modules",
    level: "advanced",
    title: text("module และ workspace", "Modules and workspaces"),
    goal: text("อ่าน go.mod ออก แยกได้ว่า import ไหนอยู่ในหรือนอกโมดูล และรู้ว่าเมื่อไรใช้ go.work", "Read go.mod, tell which imports are inside or outside the module, and know when to use go.work"),
    exercises: [
      pick(
        "easy",
        "บรรทัด require golang.org/x/mod v0.21.0 ใน go.mod หมายถึงอะไร",
        "What does the line require golang.org/x/mod v0.21.0 in go.mod mean?",
        text("require บันทึกว่าโมดูลนี้ใช้โมดูล golang.org/x/mod รุ่น v0.21.0", "require records that this module uses the module golang.org/x/mod at version v0.21.0"),
        {
          th: ["ลบโฟลเดอร์นั้นตอน build", "โมดูลนี้ใช้ golang.org/x/mod รุ่น v0.21.0", "ตั้งค่า GOPROXY", "ปิดการตรวจ checksum"],
          en: ["Delete that folder during the build", "This module uses golang.org/x/mod at version v0.21.0", "Set GOPROXY", "Turn off checksum checks"],
        },
        1,
      ),
      pick(
        "mid",
        "go.mod เขียนว่า module example.com/app import ไหนมาจากนอกโมดูล",
        "go.mod says module example.com/app. Which import comes from outside the module?",
        text("path ที่ไม่ได้ขึ้นต้นด้วย example.com/app เป็นของโมดูลอื่น", "A path that does not start with example.com/app belongs to another module"),
        {
          th: ["example.com/app/internal/web", "example.com/app", "golang.org/x/mod/semver", "example.com/app/cmd/api"],
          en: ["example.com/app/internal/web", "example.com/app", "golang.org/x/mod/semver", "example.com/app/cmd/api"],
        },
        2,
      ),
      pick(
        "hard",
        "แก้โมดูล app กับโมดูล lib บนเครื่องพร้อมกัน และอยากให้ app ใช้ lib ฉบับในเครื่องโดยไม่แก้ go.mod ควรใช้อะไร",
        "You are editing module app and module lib on your machine together, and want app to use the local lib without editing go.mod. What do you use?",
        text("go.work บอกให้ใช้โมดูลจากโฟลเดอร์ในเครื่องระหว่างพัฒนา ส่วน go.mod ของแต่ละโมดูลยังอยู่ครบ", "go.work points the build at local module folders while you develop, and each module keeps its own go.mod"),
        {
          th: ["ลบ go.mod ของ lib", "ไฟล์ go.work ที่มี use ./app และ use ./lib", "ตั้ง GOMAXPROCS", "คัดลอกโค้ด lib ไปไว้ใน app"],
          en: ["Delete lib's go.mod", "A go.work file with use ./app and use ./lib", "Set GOMAXPROCS", "Copy lib's code into app"],
        },
        1,
      ),
      pick(
        "twist",
        "เพิ่ม import ของโมดูลใหม่ในโค้ดแล้ว build ไม่ผ่านเพราะ go.mod ยังไม่มี require ของโมดูลนั้น ควรรันคำสั่งไหน",
        "You added an import from a new module and the build fails because go.mod has no require for it. Which command do you run?",
        text("go mod tidy อ่าน import ทั้งหมดแล้วเพิ่ม require ที่ขาดและลบ require ที่ไม่ได้ใช้", "go mod tidy reads every import, adds missing requires, and removes unused ones"),
        {
          th: ["go mod tidy", "go vet", "go fmt", "go clean"],
          en: ["go mod tidy", "go vet", "go fmt", "go clean"],
        },
        0,
      ),
    ],
  }),
];
