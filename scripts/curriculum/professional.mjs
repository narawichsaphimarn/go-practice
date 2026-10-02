import { copy, go, lesson, pick, quiz, say, solved, testEx, testFile, tests, text, unit, withHint } from "./helpers.mjs";

export const professional = [
  lesson({
    id: "p01-worker-pool",
    level: "professional",
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
    title: text("sync.WaitGroup, Mutex และ vet", "sync.WaitGroup, Mutex, and vet"),
    goal: text("รองาน goroutine ให้ครบ ป้องกันข้อมูลที่ใช้ร่วมกัน และให้ go vet จับบั๊กของ WaitGroup", "Wait for every goroutine, protect shared data, and let go vet catch WaitGroup bugs"),
    exercises: [
      solved(
        withHint(
          testEx(
            say("easy", "เขียน RunAll ให้เริ่มทุกงานใน jobs เป็น goroutine พร้อมกัน แล้วรอจนทุกงานจบก่อนคืน", "Write RunAll to start every job in jobs as a goroutine at the same time, and wait for all of them before returning"),
            tests,
            unit(go`func RunAll(jobs []func()) {
	for _, job := range jobs {
		job()
	}
}`),
            testFile(go`import (
	"sync/atomic"
	"testing"
	"time"
)

func TestRunAll(t *testing.T) {
	var done atomic.Int64
	jobs := make([]func(), 10)
	for i := range jobs {
		jobs[i] = func() {
			time.Sleep(50 * time.Millisecond)
			done.Add(1)
		}
	}
	start := time.Now()
	RunAll(jobs)
	if done.Load() != 10 {
		t.Fatalf("only %d of 10 jobs finished before RunAll returned", done.Load())
	}
	if time.Since(start) > 300*time.Millisecond {
		t.Fatal("jobs ran one after another; start them all as goroutines")
	}
}`),
          ),
          "ประกาศ var wg sync.WaitGroup แล้วใช้ wg.Go(job) กับทุกงาน (Go 1.25) จากนั้น wg.Wait()",
          "Declare var wg sync.WaitGroup, call wg.Go(job) for every job (Go 1.25), then wg.Wait()",
        ),
        unit(go`import "sync"

func RunAll(jobs []func()) {
	var wg sync.WaitGroup
	for _, job := range jobs {
		wg.Go(job)
	}
	wg.Wait()
}`),
      ),
      solved(
        withHint(
          testEx(
            say("mid", "แก้ Counter ให้ Inc ถูกเรียกจากหลาย goroutine พร้อมกันได้โดยไม่นับหาย", "Fix Counter so Inc can be called from many goroutines at once without losing counts"),
            tests,
            unit(go`type Counter struct {
	n int
}

func (c *Counter) Inc() {
	c.n++
}

func (c *Counter) Value() int {
	return c.n
}`),
            testFile(go`import (
	"runtime"
	"sync"
	"testing"
)

func TestCounter(t *testing.T) {
	runtime.GOMAXPROCS(4)
	var c Counter
	var wg sync.WaitGroup
	for range 50 {
		wg.Go(func() {
			for range 2000 {
				c.Inc()
			}
		})
	}
	wg.Wait()
	if c.Value() != 100000 {
		t.Fatalf("Value = %d, want 100000; some increments were lost", c.Value())
	}
}`),
          ),
          "เพิ่มฟิลด์ mu sync.Mutex แล้วครอบ c.n++ และการอ่าน c.n ด้วย c.mu.Lock() กับ defer c.mu.Unlock()",
          "Add a field mu sync.Mutex and wrap both c.n++ and the read of c.n with c.mu.Lock() and defer c.mu.Unlock()",
        ),
        unit(go`import "sync"

type Counter struct {
	mu sync.Mutex
	n  int
}

func (c *Counter) Inc() {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.n++
}

func (c *Counter) Value() int {
	c.mu.Lock()
	defer c.mu.Unlock()
	return c.n
}`),
      ),
      solved(
        withHint(
          testEx(
            say("hard", "ย้าย wg.Add ไปไว้ก่อนคำสั่ง go ให้ FanIn(50) นับงานครบ 50 ทุกครั้ง", "Move wg.Add before the go statement so FanIn(50) counts all 50 jobs every time"),
            tests,
            unit(go`import (
	"sync"
	"sync/atomic"
)

func FanIn(n int) int {
	var wg sync.WaitGroup
	var done atomic.Int64
	for i := 0; i < n; i++ {
		go func() {
			wg.Add(1)
			defer wg.Done()
			done.Add(1)
		}()
	}
	wg.Wait()
	return int(done.Load())
}`),
            testFile(go`func TestFanIn(t *testing.T) {
	for i := 0; i < 100; i++ {
		if got := FanIn(50); got != 50 {
			t.Fatalf("FanIn(50) = %d", got)
		}
	}
}`),
          ),
          "ถ้า Add อยู่ใน goroutine Wait อาจทำงานตอนตัวนับยังเป็น 0 ย้าย wg.Add(1) ออกมาไว้ในลูปก่อน go หรือเปลี่ยนเป็น wg.Go",
          "With Add inside the goroutine, Wait may run while the counter is still 0. Move wg.Add(1) into the loop before go, or switch to wg.Go",
        ),
        unit(go`import (
	"sync"
	"sync/atomic"
)

func FanIn(n int) int {
	var wg sync.WaitGroup
	var done atomic.Int64
	for i := 0; i < n; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			done.Add(1)
		}()
	}
	wg.Wait()
	return int(done.Load())
}`),
      ),
      solved(
        withHint(
          testEx(
            say("twist", "เขียน Squares ให้คำนวณกำลังสองของแต่ละตัวใน goroutine ของมันเอง แล้วคืนผลเรียงตามลำดับเดิม โดยไม่ใช้ Mutex", "Write Squares to compute each square in its own goroutine and return the results in the original order, without a Mutex"),
            tests,
            unit(go`func Squares(nums []int) []int {
	return nil
}`),
            testFile(go`func TestSquares(t *testing.T) {
	got := Squares([]int{1, 2, 3, 4})
	want := []int{1, 4, 9, 16}
	if len(got) != len(want) {
		t.Fatalf("Squares = %v", got)
	}
	for i := range want {
		if got[i] != want[i] {
			t.Fatalf("Squares = %v, want %v", got, want)
		}
	}
	if len(Squares(nil)) != 0 {
		t.Fatal("no numbers gives an empty slice")
	}
}`),
          ),
          "สร้าง out := make([]int, len(nums)) ก่อน แต่ละ goroutine เขียนแค่ช่อง out[i] ของตัวเอง ช่องไม่ทับกันจึงไม่ต้องล็อก แล้ว wg.Wait() ก่อนคืน",
          "Make out := make([]int, len(nums)) first. Each goroutine writes only its own slot out[i]; the slots never overlap, so no lock is needed. Call wg.Wait() before returning",
        ),
        unit(go`import "sync"

func Squares(nums []int) []int {
	out := make([]int, len(nums))
	var wg sync.WaitGroup
	for i, n := range nums {
		wg.Go(func() {
			out[i] = n * n
		})
	}
	wg.Wait()
	return out
}`),
      ),
    ],
  }),
  lesson({
    id: "p03-cancel",
    level: "professional",
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
      withHint(testEx(say("twist", "เขียน Remain ให้วน n รอบ ก่อนเริ่มแต่ละรอบให้เช็กว่า context จบหรือยัง แล้วคืนจำนวนรอบที่ได้ทำ context ที่จบแล้วได้ 0", "Write Remain to loop n rounds, checking before each round whether the context has ended, and return how many rounds ran. An ended context returns 0"), tests, 'package main\n\nimport "context"\n\nfunc Remain(ctx context.Context, n int) int {\n\treturn 0\n}\n', 'package main\n\nimport (\n\t"context"\n\t"testing"\n)\n\nfunc TestRemain(t *testing.T) {\n\tctx, cancel := context.WithCancel(context.Background())\n\tcancel()\n\tif Remain(ctx, 4) != 0 {\n\t\tt.Fatal("canceled")\n\t}\n\tif Remain(context.Background(), 3) != 3 {\n\t\tt.Fatal("open")\n\t}\n}\n'), "ถ้า context จบแล้วอย่าเริ่มรอบ ถ้ายังทำงานให้นับครบ n", "If the context has ended, do not start a round. If it is still active, count all n rounds"),
    ],
  }),
  lesson({
    id: "p04-http",
    level: "professional",
    title: text("net/http", "net/http"),
    goal: text("เขียน HTTP handler ที่ตรวจ method อ่าน request ตอบสถานะให้ถูก และเรียก service อื่นโดยมี timeout", "Write HTTP handlers that check the method, read the request, answer with the right status, and call other services with a timeout"),
    exercises: [
      solved(
        withHint(
          testEx(
            say("easy", "เขียน Status ให้คืน 200 สำหรับ POST และ 405 สำหรับ method อื่น", "Write Status to return 200 for POST and 405 for any other method"),
            tests,
            unit(go`import "net/http"

func Status(r *http.Request) int {
	return 0
}`),
            testFile(go`import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestStatus(t *testing.T) {
	if Status(httptest.NewRequest(http.MethodPost, "/", nil)) != http.StatusOK {
		t.Fatal("POST must give 200")
	}
	for _, m := range []string{http.MethodGet, http.MethodPut, http.MethodDelete} {
		if Status(httptest.NewRequest(m, "/", nil)) != http.StatusMethodNotAllowed {
			t.Fatalf("%s must give 405", m)
		}
	}
}`),
          ),
          "เทียบ r.Method กับ http.MethodPost แล้วคืน http.StatusOK หรือ http.StatusMethodNotAllowed",
          "Compare r.Method with http.MethodPost and return http.StatusOK or http.StatusMethodNotAllowed",
        ),
        unit(go`import "net/http"

func Status(r *http.Request) int {
	if r.Method == http.MethodPost {
		return http.StatusOK
	}
	return http.StatusMethodNotAllowed
}`),
      ),
      solved(
        withHint(
          testEx(
            say("mid", "เขียน handler Hello ให้ตอบ hello, ตามด้วยค่าของ query name เช่น /?name=ann ได้ hello, ann และถ้าไม่มี name ให้ใช้ world", "Write the handler Hello to answer hello, followed by the query value name, so /?name=ann gives hello, ann. Without name, use world"),
            tests,
            unit(go`import "net/http"

func Hello(w http.ResponseWriter, r *http.Request) {
}`),
            testFile(go`import (
	"net/http/httptest"
	"testing"
)

func TestHello(t *testing.T) {
	cases := map[string]string{"/?name=ann": "hello, ann", "/?name=bo": "hello, bo", "/": "hello, world"}
	for url, want := range cases {
		rec := httptest.NewRecorder()
		Hello(rec, httptest.NewRequest("GET", url, nil))
		if rec.Code != 200 || rec.Body.String() != want {
			t.Fatalf("%s gave %d %q, want %q", url, rec.Code, rec.Body.String(), want)
		}
	}
}`),
          ),
          "r.URL.Query().Get(\"name\") คืนข้อความว่างเมื่อไม่มี แล้วเขียนคำตอบด้วย fmt.Fprintf(w, \"hello, %s\", name)",
          "r.URL.Query().Get(\"name\") returns empty text when it is missing. Write the answer with fmt.Fprintf(w, \"hello, %s\", name)",
        ),
        unit(go`import (
	"fmt"
	"net/http"
)

func Hello(w http.ResponseWriter, r *http.Request) {
	name := r.URL.Query().Get("name")
	if name == "" {
		name = "world"
	}
	fmt.Fprintf(w, "hello, %s", name)
}`),
      ),
      solved(
        withHint(
          testEx(
            say("hard", "เขียน handler CreateItem: รับเฉพาะ POST (ไม่งั้นตอบ 405), อ่าน JSON {\"name\":...} จาก body ถ้าอ่านไม่ได้หรือ name ว่างตอบ 400 ถ้าผ่านตอบ 201 พร้อม JSON {\"name\":...} กลับไป", "Write the handler CreateItem: accept only POST (otherwise 405), read the JSON {\"name\":...} from the body, answer 400 if it cannot be read or name is empty, and otherwise 201 with the JSON {\"name\":...} back"),
            tests,
            unit(go`import "net/http"

type Item struct {
	Name string ` + "`json:\"name\"`" + `
}

func CreateItem(w http.ResponseWriter, r *http.Request) {
}`),
            testFile(go`import (
	"net/http/httptest"
	"strings"
	"testing"
)

func call(method, body string) *httptest.ResponseRecorder {
	rec := httptest.NewRecorder()
	CreateItem(rec, httptest.NewRequest(method, "/items", strings.NewReader(body)))
	return rec
}

func TestCreateItem(t *testing.T) {
	ok := call("POST", ` + "`{\"name\":\"tea\"}`" + `)
	if ok.Code != 201 || strings.TrimSpace(ok.Body.String()) != ` + "`{\"name\":\"tea\"}`" + ` {
		t.Fatalf("good POST: %d %s", ok.Code, ok.Body.String())
	}
	if c := call("GET", "").Code; c != 405 {
		t.Fatalf("GET: %d, want 405", c)
	}
	if c := call("POST", "{").Code; c != 400 {
		t.Fatalf("bad JSON: %d, want 400", c)
	}
	if c := call("POST", ` + "`{\"name\":\"\"}`" + `).Code; c != 400 {
		t.Fatalf("empty name: %d, want 400", c)
	}
}`),
          ),
          "ลำดับคือ: เช็ก method, json.NewDecoder(r.Body).Decode(&item), เช็ก name แล้ว w.WriteHeader(http.StatusCreated) ก่อน json.NewEncoder(w).Encode(item) ใช้ http.Error ตอบ error",
          "In order: check the method, json.NewDecoder(r.Body).Decode(&item), check name, then w.WriteHeader(http.StatusCreated) before json.NewEncoder(w).Encode(item). Use http.Error for failures",
        ),
        unit(go`import (
	"encoding/json"
	"net/http"
)

type Item struct {
	Name string ` + "`json:\"name\"`" + `
}

func CreateItem(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var item Item
	if err := json.NewDecoder(r.Body).Decode(&item); err != nil || item.Name == "" {
		http.Error(w, "bad item", http.StatusBadRequest)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(item)
}`),
      ),
      solved(
        withHint(
          testEx(
            say("twist", "เขียน NewClient ให้คืน http.Client ที่ยอมรอคำตอบไม่เกิน 100 มิลลิวินาที เซิร์ฟเวอร์ที่ช้ากว่านั้นต้องทำให้ Get คืน error", "Write NewClient to return an http.Client that waits at most 100 milliseconds for an answer. A slower server must make Get return an error"),
            tests,
            unit(go`import "net/http"

func NewClient() *http.Client {
	return &http.Client{}
}`),
            testFile(go`import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

func TestNewClient(t *testing.T) {
	slow := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		time.Sleep(500 * time.Millisecond)
	}))
	defer slow.Close()
	fast := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {}))
	defer fast.Close()
	c := NewClient()
	if _, err := c.Get(slow.URL); err == nil {
		t.Fatal("a slow server must time out")
	}
	resp, err := c.Get(fast.URL)
	if err != nil {
		t.Fatalf("a fast server must answer: %v", err)
	}
	resp.Body.Close()
}`),
          ),
          "ตั้งฟิลด์ Timeout: &http.Client{Timeout: 100 * time.Millisecond} ค่าศูนย์ของ Timeout แปลว่ารอได้ไม่จำกัด",
          "Set the Timeout field: &http.Client{Timeout: 100 * time.Millisecond}. A zero Timeout means wait forever",
        ),
        unit(go`import (
	"net/http"
	"time"
)

func NewClient() *http.Client {
	return &http.Client{Timeout: 100 * time.Millisecond}
}`),
      ),
    ],
  }),
  lesson({
    id: "p05-synctest",
    level: "professional",
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
    title: text("benchmark และ fuzz", "Benchmarks and fuzzing"),
    goal: text("อ่านผล benchmark ออก และใช้ fuzz หาค่าที่ทำให้ฟังก์ชันพัง", "Read benchmark results and use fuzzing to find inputs that break a function"),
    exercises: [
      pick(
        "easy",
        "ผล benchmark บรรทัด BenchmarkJoin-8  2000000  612 ns/op ตัวเลข 612 ns/op หมายถึงอะไร",
        "In the benchmark line BenchmarkJoin-8  2000000  612 ns/op, what does 612 ns/op mean?",
        text("ns/op คือเวลาเฉลี่ยเป็นนาโนวินาทีต่อการเรียกหนึ่งครั้ง ส่วน 2000000 คือจำนวนรอบที่วัด", "ns/op is the average time in nanoseconds per call; 2000000 is how many rounds were measured"),
        {
          th: ["มี goroutine 612 ตัว", "เรียกหนึ่งครั้งใช้เวลาเฉลี่ย 612 นาโนวินาที", "ไบนารีมีขนาด 612 ไบต์", "มีเทสต์พัง 612 ข้อ"],
          en: ["There are 612 goroutines", "One call takes 612 nanoseconds on average", "The binary is 612 bytes", "612 tests failed"],
        },
        1,
      ),
      pick(
        "mid",
        "หลังแก้โค้ด allocs/op ลดจาก 5 เหลือ 1 แปลว่าอะไร",
        "After a change, allocs/op drops from 5 to 1. What does that mean?",
        text("allocs/op คือจำนวนครั้งที่จองหน่วยความจำบน heap ต่อการเรียกหนึ่งครั้ง น้อยลงแปลว่าตัวเก็บขยะมีงานน้อยลง", "allocs/op is how many heap allocations one call makes. Fewer means less work for the garbage collector"),
        {
          th: ["โปรแกรมใช้ CPU มากขึ้นเสมอ", "การเรียกหนึ่งครั้งจองหน่วยความจำบน heap น้อยลง", "เทสต์ถูกลบไป 4 ข้อ", "โมดูลไม่มี dependency แล้ว"],
          en: ["The program always uses more CPU", "One call makes fewer heap allocations", "Four tests were deleted", "The module has no dependencies now"],
        },
        1,
      ),
      pick(
        "hard",
        "fuzz target ขั้นต่ำต้องมีอะไร",
        "What does a minimal fuzz target need?",
        text("ชื่อขึ้นต้นด้วย Fuzz รับ *testing.F และเรียก f.Fuzz ด้วยฟังก์ชันที่รับ *testing.T กับค่าที่จะสุ่ม", "A name starting with Fuzz, a *testing.F parameter, and a call to f.Fuzz with a function that takes *testing.T and the values to vary"),
        {
          th: ["ฟังก์ชัน main ที่เรียก rand", "ไฟล์ go.mod อย่างเดียว", "ฟังก์ชันชื่อขึ้นต้นด้วย Fuzz ที่รับ *testing.F แล้วเรียก f.Fuzz", "คำสั่ง go vet"],
          en: ["A main function that calls rand", "Only a go.mod file", "A function whose name starts with Fuzz, takes *testing.F, and calls f.Fuzz", "The go vet command"],
        },
        2,
      ),
      solved(
        withHint(
          testEx(
            say("twist", "แก้ Reverse ให้กลับลำดับข้อความได้ถูกต้องกับทุกภาษา โค้ดทดสอบเป็น fuzz target ที่มีข้อความไทยอยู่ในชุดเริ่มต้น", "Fix Reverse so it reverses text correctly in every language. The hidden test is a fuzz target whose seed inputs include Thai text"),
            tests,
            unit(go`func Reverse(s string) string {
	b := []byte(s)
	for i, j := 0, len(b)-1; i < j; i, j = i+1, j-1 {
		b[i], b[j] = b[j], b[i]
	}
	return string(b)
}`),
            testFile(go`import (
	"testing"
	"unicode/utf8"
)

func FuzzReverse(f *testing.F) {
	for _, seed := range []string{"go", "", "สวัสดี", "héllo"} {
		f.Add(seed)
	}
	f.Fuzz(func(t *testing.T, s string) {
		if !utf8.ValidString(s) {
			t.Skip()
		}
		r := Reverse(s)
		if !utf8.ValidString(r) {
			t.Fatalf("Reverse(%q) = %q is not valid UTF-8", s, r)
		}
		if Reverse(r) != s {
			t.Fatalf("reversing twice changed %q", s)
		}
	})
}`),
          ),
          "ตัวอักษรไทยหนึ่งตัวใช้หลายไบต์ การสลับไบต์จึงทำให้ตัวอักษรแตก แปลงเป็น []rune ก่อนสลับ แล้วแปลงกลับด้วย string(...)",
          "One Thai character takes several bytes, so swapping bytes breaks it. Convert to []rune before swapping, then back with string(...)",
        ),
        unit(go`func Reverse(s string) string {
	r := []rune(s)
	for i, j := 0, len(r)-1; i < j; i, j = i+1, j-1 {
		r[i], r[j] = r[j], r[i]
	}
	return string(r)
}`),
      ),
    ],
  }),
  lesson({
    id: "p07-vet-mod",
    level: "professional",
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
    title: text("log/slog", "log/slog"),
    goal: text("เขียน log แบบมีโครงสร้างเป็นคู่ key กับ value ผูกข้อมูลประจำ logger และกรองตามระดับ", "Write structured logs as key and value pairs, attach shared fields to a logger, and filter by level"),
    exercises: [
      solved(
        withHint(
          testEx(
            say("easy", "เขียน Line ให้บันทึกข้อความ msg พร้อมคู่ key กับ value ลง w ด้วย slog แบบข้อความ", "Write Line to log the message msg with one key and value pair to w, using slog's text format"),
            tests,
            unit(go`import "io"

func Line(w io.Writer, msg, key, value string) {
}`),
            testFile(go`import (
	"bytes"
	"strings"
	"testing"
)

func TestLine(t *testing.T) {
	var b bytes.Buffer
	Line(&b, "hello", "user", "ada")
	got := b.String()
	if !strings.Contains(got, "level=INFO") || !strings.Contains(got, "msg=hello") || !strings.Contains(got, "user=ada") {
		t.Fatal(got)
	}
}`),
          ),
          "slog.New(slog.NewTextHandler(w, nil)) ได้ logger แล้วเรียก .Info(msg, key, value)",
          "slog.New(slog.NewTextHandler(w, nil)) gives a logger; then call .Info(msg, key, value)",
        ),
        unit(go`import (
	"io"
	"log/slog"
)

func Line(w io.Writer, msg, key, value string) {
	slog.New(slog.NewTextHandler(w, nil)).Info(msg, key, value)
}`),
      ),
      solved(
        withHint(
          testEx(
            say("mid", "เขียน Warn ให้บันทึกข้อความ slow ระดับ Warn พร้อม key code ที่เป็นตัวเลข", "Write Warn to log the message slow at level Warn, with a numeric key code"),
            tests,
            unit(go`import "io"

func Warn(w io.Writer, code int) {
}`),
            testFile(go`import (
	"bytes"
	"fmt"
	"strings"
	"testing"
)

func TestWarn(t *testing.T) {
	for _, code := range []int{7, 503} {
		var b bytes.Buffer
		Warn(&b, code)
		got := b.String()
		if !strings.Contains(got, "level=WARN") || !strings.Contains(got, "msg=slow") || !strings.Contains(got, fmt.Sprintf("code=%d", code)) {
			t.Fatal(got)
		}
	}
}`),
          ),
          "ใช้ .Warn(\"slow\", \"code\", code) หรือ slog.Int(\"code\", code) ถ้าอยากระบุชนิดให้ชัด",
          "Use .Warn(\"slow\", \"code\", code), or slog.Int(\"code\", code) to make the type explicit",
        ),
        unit(go`import (
	"io"
	"log/slog"
)

func Warn(w io.Writer, code int) {
	slog.New(slog.NewTextHandler(w, nil)).Warn("slow", slog.Int("code", code))
}`),
      ),
      solved(
        withHint(
          testEx(
            say("hard", "เขียน ForUser ให้คืน logger ที่ทุกบรรทัดที่บันทึกผ่านมันมี user ติดไปด้วยเสมอ", "Write ForUser to return a logger whose every line carries the user field"),
            tests,
            unit(go`import (
	"io"
	"log/slog"
)

func ForUser(w io.Writer, user string) *slog.Logger {
	return slog.New(slog.NewTextHandler(w, nil))
}`),
            testFile(go`import (
	"bytes"
	"strings"
	"testing"
)

func TestForUser(t *testing.T) {
	var b bytes.Buffer
	log := ForUser(&b, "ada")
	log.Info("login")
	log.Warn("retry", "n", 2)
	lines := strings.Split(strings.TrimSpace(b.String()), "\n")
	if len(lines) != 2 {
		t.Fatalf("want 2 lines, got %q", b.String())
	}
	for _, line := range lines {
		if !strings.Contains(line, "user=ada") {
			t.Fatalf("line without user: %s", line)
		}
	}
}`),
          ),
          "logger.With(\"user\", user) คืน logger ใหม่ที่แนบ user ไปกับทุกบรรทัด",
          "logger.With(\"user\", user) returns a new logger that attaches user to every line",
        ),
        unit(go`import (
	"io"
	"log/slog"
)

func ForUser(w io.Writer, user string) *slog.Logger {
	return slog.New(slog.NewTextHandler(w, nil)).With("user", user)
}`),
      ),
      solved(
        withHint(
          testEx(
            say("twist", "เขียน Quiet ให้คืน logger ที่ทิ้งบรรทัดระดับ Info แต่ยังบันทึกระดับ Warn และ Error", "Write Quiet to return a logger that drops Info lines but still records Warn and Error"),
            tests,
            unit(go`import (
	"io"
	"log/slog"
)

func Quiet(w io.Writer) *slog.Logger {
	return slog.New(slog.NewTextHandler(w, nil))
}`),
            testFile(go`import (
	"bytes"
	"strings"
	"testing"
)

func TestQuiet(t *testing.T) {
	var b bytes.Buffer
	log := Quiet(&b)
	log.Info("noise")
	log.Warn("disk")
	log.Error("down")
	got := b.String()
	if strings.Contains(got, "noise") {
		t.Fatalf("Info must be dropped: %s", got)
	}
	if !strings.Contains(got, "msg=disk") || !strings.Contains(got, "msg=down") {
		t.Fatalf("Warn and Error must stay: %s", got)
	}
}`),
          ),
          "ส่ง &slog.HandlerOptions{Level: slog.LevelWarn} เป็นค่าตัวที่สองของ slog.NewTextHandler",
          "Pass &slog.HandlerOptions{Level: slog.LevelWarn} as the second argument of slog.NewTextHandler",
        ),
        unit(go`import (
	"io"
	"log/slog"
)

func Quiet(w io.Writer) *slog.Logger {
	return slog.New(slog.NewTextHandler(w, &slog.HandlerOptions{Level: slog.LevelWarn}))
}`),
      ),
    ],
  }),
  lesson({
    id: "p09-generic-api",
    level: "professional",
    title: text("generics ใน API จริง", "Generics in real APIs"),
    goal: text("ออกแบบชนิดและฟังก์ชัน generic ที่ผู้เรียกใช้ได้กับข้อมูลของตัวเอง และคืนผลแบบ (ค่า, ok) เมื่ออาจไม่มีค่า", "Design generic types and functions callers can use with their own data, returning (value, ok) when a value may be missing"),
    exercises: [
      solved(
        withHint(
          testEx(
            say("easy", "เขียน First ให้คืนสมาชิกแรกกับ true หรือค่าศูนย์กับ false เมื่อ slice ว่าง", "Write First to return the first item and true, or the zero value and false when the slice is empty"),
            tests,
            unit(go`func First[T any](items []T) (T, bool) {
	var zero T
	return zero, false
}`),
            testFile(go`func TestFirst(t *testing.T) {
	if got, ok := First([]int{4, 5}); !ok || got != 4 {
		t.Fatal("ints")
	}
	if got, ok := First([]string{"x"}); !ok || got != "x" {
		t.Fatal("strings")
	}
	if got, ok := First([]string{}); ok || got != "" {
		t.Fatal("empty")
	}
}`),
          ),
          "ถ้า len(items) == 0 ให้คืน zero, false ไม่งั้นคืน items[0], true",
          "If len(items) == 0, return zero, false; otherwise return items[0], true",
        ),
        unit(go`func First[T any](items []T) (T, bool) {
	if len(items) == 0 {
		var zero T
		return zero, false
	}
	return items[0], true
}`),
      ),
      solved(
        withHint(
          testEx(
            say("mid", "เขียน method Add และ Has ของชนิด generic Set[T] ที่เก็บค่าไม่ซ้ำ และ Len ที่คืนจำนวนค่า", "Write the methods Add and Has of the generic type Set[T], which stores distinct values, and Len, which returns how many"),
            tests,
            unit(go`type Set[T comparable] struct {
	items map[T]struct{}
}

func (s *Set[T]) Add(v T) {
}

func (s *Set[T]) Has(v T) bool {
	return false
}

func (s *Set[T]) Len() int {
	return 0
}`),
            testFile(go`func TestSet(t *testing.T) {
	var s Set[string]
	s.Add("go")
	s.Add("go")
	s.Add("rust")
	if !s.Has("go") || s.Has("c") || s.Len() != 2 {
		t.Fatalf("set: has go=%v c=%v len=%d", s.Has("go"), s.Has("c"), s.Len())
	}
	var n Set[int]
	if n.Has(1) || n.Len() != 0 {
		t.Fatal("a zero Set is empty")
	}
}`),
          ),
          "map ที่เป็น nil อ่านได้แต่เขียนไม่ได้ ใน Add ให้สร้าง s.items = make(map[T]struct{}) ถ้ายังเป็น nil แล้วค่อยใส่ s.items[v] = struct{}{}",
          "A nil map can be read but not written. In Add, create s.items = make(map[T]struct{}) if it is still nil, then set s.items[v] = struct{}{}",
        ),
        unit(go`type Set[T comparable] struct {
	items map[T]struct{}
}

func (s *Set[T]) Add(v T) {
	if s.items == nil {
		s.items = make(map[T]struct{})
	}
	s.items[v] = struct{}{}
}

func (s *Set[T]) Has(v T) bool {
	_, ok := s.items[v]
	return ok
}

func (s *Set[T]) Len() int {
	return len(s.items)
}`),
      ),
      solved(
        withHint(
          testEx(
            say("hard", "เขียน GetOr ของ Cache[K, V]: ถ้ามี key อยู่แล้วให้คืนค่าเดิม ถ้าไม่มีให้เรียก load หนึ่งครั้ง เก็บผลไว้ แล้วคืนผลนั้น", "Write GetOr on Cache[K, V]: if the key is there, return its value; otherwise call load once, store the result, and return it"),
            tests,
            unit(go`type Cache[K comparable, V any] struct {
	data map[K]V
}

func (c *Cache[K, V]) GetOr(key K, load func() V) V {
	return load()
}`),
            testFile(go`func TestGetOr(t *testing.T) {
	var c Cache[string, int]
	calls := 0
	load := func() int {
		calls++
		return 42
	}
	if c.GetOr("a", load) != 42 || c.GetOr("a", load) != 42 {
		t.Fatal("GetOr must return the loaded value")
	}
	if calls != 1 {
		t.Fatalf("load ran %d times, want 1", calls)
	}
	if c.GetOr("b", func() int { return 7 }) != 7 {
		t.Fatal("a new key loads again")
	}
}`),
          ),
          "ใช้ v, ok := c.data[key] ถ้า ok ให้คืน v ถ้าไม่ ให้สร้าง map เมื่อยังเป็น nil แล้วเก็บ c.data[key] = load()",
          "Use v, ok := c.data[key]. If ok, return v. Otherwise create the map when it is nil and store c.data[key] = load()",
        ),
        unit(go`type Cache[K comparable, V any] struct {
	data map[K]V
}

func (c *Cache[K, V]) GetOr(key K, load func() V) V {
	if v, ok := c.data[key]; ok {
		return v
	}
	if c.data == nil {
		c.data = make(map[K]V)
	}
	v := load()
	c.data[key] = v
	return v
}`),
      ),
      solved(
        withHint(
          testEx(
            say("twist", "เขียน NonZero ให้คืน slice ใหม่ที่ตัดค่าศูนย์ของชนิดนั้นออก ใช้ได้ทั้งตัวเลขและข้อความ", "Write NonZero to return a new slice without the zero values of the type, for numbers and text alike"),
            tests,
            unit(go`func NonZero[T comparable](items []T) []T {
	return nil
}`),
            testFile(go`func TestNonZero(t *testing.T) {
	got := NonZero([]int{0, 2, 0, 3})
	if len(got) != 2 || got[0] != 2 || got[1] != 3 {
		t.Fatalf("ints: %v", got)
	}
	words := NonZero([]string{"", "a", ""})
	if len(words) != 1 || words[0] != "a" {
		t.Fatalf("strings: %v", words)
	}
}`),
          ),
          "ประกาศ var zero T ไว้เทียบ แล้วเก็บเฉพาะค่าที่ v != zero",
          "Declare var zero T to compare against, and keep only values where v != zero",
        ),
        unit(go`func NonZero[T comparable](items []T) []T {
	var zero T
	var out []T
	for _, v := range items {
		if v != zero {
			out = append(out, v)
		}
	}
	return out
}`),
      ),
    ],
  }),
  lesson({
    id: "p10-mod-prod",
    level: "professional",
    title: text("module ในงานจริง", "Modules in production"),
    goal: text("กำหนดรุ่น Go ใน go.mod และรู้ว่า Go เลือก toolchain ที่ใช้ build อย่างไร", "Set the Go version in go.mod and know how Go picks the toolchain that builds it"),
    exercises: [
      pick(
        "easy",
        "บรรทัด go 1.25 ใน go.mod บอกอะไร",
        "What does the line go 1.25 in go.mod say?",
        text("โมดูลนี้ต้องใช้ภาษา Go รุ่น 1.25 ขึ้นไป Go รุ่นเก่ากว่านั้นจะไม่ build ให้เอง", "This module needs Go language version 1.25 or newer. An older Go will not build it on its own"),
        {
          th: ["โมดูลมีไฟล์ 25 ไฟล์", "โมดูลนี้ต้องใช้ Go รุ่น 1.25 ขึ้นไป", "ปิดการใช้โมดูล", "ตั้งพอร์ต 25"],
          en: ["The module has 25 files", "This module needs Go 1.25 or newer", "It turns modules off", "It sets port 25"],
        },
        1,
      ),
      pick(
        "mid",
        "บรรทัด toolchain go1.25.3 ต่างจากบรรทัด go 1.25 อย่างไร",
        "How is the line toolchain go1.25.3 different from the line go 1.25?",
        text("go บอกรุ่นภาษาขั้นต่ำ ส่วน toolchain บอกชุดเครื่องมือที่แนะนำให้ใช้ build ถ้าเครื่องมีรุ่นเก่ากว่า", "go states the minimum language version; toolchain names the tool set suggested for the build when the installed one is older"),
        {
          th: ["สองบรรทัดเหมือนกัน", "go คือรุ่นภาษาขั้นต่ำ ส่วน toolchain คือชุดเครื่องมือที่แนะนำ", "toolchain ลบ dependency", "go ตั้งค่า GOPROXY"],
          en: ["They mean the same", "go is the minimum language version; toolchain is the suggested tool set", "toolchain deletes dependencies", "go sets GOPROXY"],
        },
        1,
      ),
      pick(
        "hard",
        "ตั้ง GOTOOLCHAIN=local แล้วเกิดอะไร",
        "What happens with GOTOOLCHAIN=local?",
        text("Go ใช้เฉพาะ toolchain ที่ติดตั้งในเครื่อง ไม่ดาวน์โหลดรุ่นอื่น ถ้า go.mod ขอรุ่นที่ใหม่กว่าจะ build ไม่ผ่าน", "Go uses only the installed toolchain and never downloads another. If go.mod asks for a newer one, the build fails"),
        {
          th: ["ใช้ toolchain ในเครื่องเท่านั้นและไม่ดาวน์โหลดรุ่นอื่น", "ดาวน์โหลดรุ่นใหม่สุดทุกครั้ง", "ปิด go test", "เปลี่ยนชื่อโมดูล"],
          en: ["Use only the installed toolchain and never download another", "Download the newest toolchain every time", "Disable go test", "Rename the module"],
        },
        0,
      ),
      pick(
        "twist",
        "เครื่องติดตั้ง Go 1.25 แต่ go.mod ของโปรเจกต์เขียนว่า go 1.26 และไม่ได้ตั้ง GOTOOLCHAIN (ค่าเริ่มต้นคือ auto) สั่ง go build แล้วเกิดอะไร",
        "Go 1.25 is installed, but the project's go.mod says go 1.26 and GOTOOLCHAIN is not set (the default is auto). What happens on go build?",
        text("ค่า auto ให้ Go ดาวน์โหลด toolchain 1.26 มาใช้ build เอง ถ้าตั้งเป็น local จะ build ไม่ผ่านแทน", "With auto, Go downloads the 1.26 toolchain and builds with it. With local, the build would fail instead"),
        {
          th: ["build ด้วย 1.25 แล้วข้ามโค้ดใหม่", "ดาวน์โหลด toolchain 1.26 มาใช้ build", "ลบบรรทัด go 1.26 ออกให้", "แก้ go.mod เป็น 1.25 ให้เอง"],
          en: ["Build with 1.25 and skip the new code", "Download the 1.26 toolchain and build with it", "Delete the go 1.26 line", "Rewrite go.mod to 1.25"],
        },
        1,
      ),
    ],
  }),
];
