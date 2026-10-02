import { copy, lesson, solved, testEx, tests, text, withHint } from "./helpers.mjs";

function say(id, th, en) {
  return { id, th, en };
}

function task(id, th, en, starter, test, hintTh, hintEn) {
  return withHint(
    { ...testEx(say(id, th, en), tests, starter, test), difficulty: "capstone" },
    hintTh,
    hintEn,
  );
}

// Reference answers for scripts/verify-solutions.mjs, keyed by exercise id.
const solutions = {
  1: `package main

import "errors"

type Item struct {
	Name string
	N    int
}

func Apply(items []Item) ([]Item, error) {
	if items == nil {
		return nil, nil
	}
	out := make([]Item, len(items))
	for i, it := range items {
		if it.Name == "" {
			return nil, errors.New("empty name")
		}
		it.N = min(max(it.N, 1), 10)
		out[i] = it
	}
	return out, nil
}
`,
  2: `package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
)

var ErrNegative = errors.New("negative")

func SumPositive(r io.Reader) (int, error) {
	var rows []struct {
		N int ` + "`json:\"n\"`" + `
	}
	if err := json.NewDecoder(r).Decode(&rows); err != nil {
		return 0, err
	}
	sum := 0
	for _, row := range rows {
		if row.N < 0 {
			return 0, fmt.Errorf("value %d: %w", row.N, ErrNegative)
		}
		sum += row.N
	}
	return sum, nil
}
`,
  3: `package main

import (
	"context"
	"sync"
)

func RunAll(ctx context.Context, limit int, jobs []func() error) (done int, failed int) {
	var wg sync.WaitGroup
	var mu sync.Mutex
	slots := make(chan struct{}, limit)
	for _, job := range jobs {
		if ctx.Err() != nil {
			break
		}
		slots <- struct{}{}
		wg.Go(func() {
			defer func() { <-slots }()
			err := job()
			mu.Lock()
			defer mu.Unlock()
			if err != nil {
				failed++
			} else {
				done++
			}
		})
	}
	wg.Wait()
	return done, failed
}
`,
  4: `package main

import (
	"encoding/json"
	"io"
	"log/slog"
	"net"
	"net/http"
)

func Handle(w http.ResponseWriter, r *http.Request, log io.Writer) {
	logger := slog.New(slog.NewTextHandler(log, nil))
	if r.Method != http.MethodPost {
		logger.Warn("method not allowed", "method", r.Method)
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var in struct {
		Host string ` + "`json:\"host\"`" + `
		Port string ` + "`json:\"port\"`" + `
	}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		http.Error(w, "bad JSON", http.StatusBadRequest)
		return
	}
	addr := net.JoinHostPort(in.Host, in.Port)
	logger.Info("joined", "addr", addr)
	io.WriteString(w, addr)
}
`,
  5: `package main

type Speaker interface {
	Speak() string
}

func Collect(items []Speaker) (said []string, panicked int) {
	for _, it := range items {
		text, ok := speak(it)
		if !ok {
			panicked++
			continue
		}
		said = append(said, text)
	}
	return said, panicked
}

func speak(s Speaker) (text string, ok bool) {
	defer func() {
		if recover() != nil {
			ok = false
		}
	}()
	if s == nil {
		return "", false
	}
	return s.Speak(), true
}
`,
};

export const finale = lesson({
  id: "z01-finale",
  level: "expert",
  title: text("โจทย์ปิดท้าย", "Final problems"),
  goal: text(
    "แก้ห้าปัญหาที่แต่ละข้อต้องประกอบความรู้จากหลายบท",
    "Solve five problems that each combine several lessons",
  ),
  copy: copy(
    [
      "ห้าข้อนี้ไม่มีตัวอย่างให้คัดลอก แต่ละข้อต้องใช้ของจากคนละกลุ่มบท เช่น struct กับ error, JSON กับ error ที่ห่อไว้, งานคู่ขนานที่หยุดตาม context, HTTP ที่ต่อที่อยู่แล้วเขียน log, และการเรียก interface ที่อาจ panic\n\nตัวอย่างในบทก่อนหน้าแก้โจทย์ข้อนั้นข้อเดียว การส่งโค้ดจากบทเดียวมาจึงไม่ผ่านเทสต์ที่ซ่อนไว้",
      "ใช้ตอนงานจริงที่ฟังก์ชันเดียวต้องตรวจ input, จำกัดงานคู่ขนาน, และรายงานความพลาดโดยไม่ให้ทั้งก้อนล่ม",
      "จัดข้อมูลใน slice ให้เข้าช่วง และปฏิเสธชื่อที่ว่างโดยไม่ panic เมื่อได้ nil",
      "เรียกพฤติกรรมที่อาจ panic ทีละตัว แล้วไปต่อตัวที่เหลือ",
      ["อ่านสัญญาของฟังก์ชัน", "แยกเคสสำเร็จ เคส error และเคส panic", "อย่า hardcode ค่าจากตัวอย่างในหัว", "ให้ผ่านทุกชุดที่เทสต์ซ่อนไว้"],
    ],
    [
      "These five problems do not come with an example to copy. Each one mixes a different group of lessons: structs with errors, JSON with a wrapped error, concurrent work that stops for a context, HTTP that joins an address and writes a log, and interface calls that may panic.\n\nAn example from an earlier lesson solves only that lesson. Pasting one lesson's code does not pass the hidden tests.",
      "Use this when one function must check input, limit concurrent work, and report failure without taking down the whole call.",
      "Fit slice data into a range and reject an empty name without panicking on nil.",
      "Call behavior that may panic one item at a time, then continue with the rest.",
      ["Read the function contract", "Separate success, errors, and panics", "Do not hardcode a sample from the prompt", "Pass every hidden case"],
    ],
  ),
  exercises: [
    task(
      "1",
      "เขียน Apply ให้ clamp N ของแต่ละ Item เข้าช่วง 1 ถึง 10 คืน error เมื่อชื่อว่าง และคืน nil เมื่อได้ nil",
      "Write Apply to clamp each Item N into 1 through 10, return an error for an empty name, and return nil for a nil slice",
      'package main\n\ntype Item struct {\n\tName string\n\tN int\n}\n\nfunc Apply(items []Item) ([]Item, error) {\n\treturn nil, nil\n}\n',
      'package main\n\nimport "testing"\n\nfunc TestApply(t *testing.T) {\n\tout, err := Apply(nil)\n\tif err != nil || out != nil {\n\t\tt.Fatal("nil")\n\t}\n\tout, err = Apply([]Item{{Name: "a", N: 0}, {Name: "b", N: 15}, {Name: "c", N: 4}})\n\tif err != nil || len(out) != 3 || out[0].N != 1 || out[1].N != 10 || out[2].N != 4 {\n\t\tt.Fatal("clamp")\n\t}\n\tif _, err = Apply([]Item{{Name: "", N: 3}}); err == nil {\n\t\tt.Fatal("name")\n\t}\n}\n',
      "ตรวจชื่อก่อน แล้วดึง N ที่ต่ำกว่า 1 ขึ้นมา และกด N ที่สูงกว่า 10 ลง",
      "Check the name first. Raise N when it is below 1 and lower N when it is above 10",
    ),
    task(
      "2",
      "เขียน SumPositive ให้อ่าน JSON array ของฟิลด์ n จาก Reader รวมค่าที่ไม่มีฟิลด์เป็น 0 และห่อ ErrNegative เมื่อมีค่าติดลบ",
      "Write SumPositive to read a JSON array of n from a Reader, treat a missing n as 0, and wrap ErrNegative when a value is negative",
      'package main\n\nimport (\n\t"errors"\n\t"io"\n)\n\nvar ErrNegative = errors.New("negative")\n\nfunc SumPositive(r io.Reader) (int, error) {\n\treturn 0, nil\n}\n',
      'package main\n\nimport (\n\t"errors"\n\t"strings"\n\t"testing"\n)\n\nfunc TestSumPositive(t *testing.T) {\n\tgot, err := SumPositive(strings.NewReader(`[{"n":2},{"n":3}]`))\n\tif err != nil || got != 5 {\n\t\tt.Fatal("sum")\n\t}\n\tgot, err = SumPositive(strings.NewReader(`[{"n":2},{}]`))\n\tif err != nil || got != 2 {\n\t\tt.Fatal("missing")\n\t}\n\t_, err = SumPositive(strings.NewReader(`[{"n":-4}]`))\n\tif !errors.Is(err, ErrNegative) {\n\t\tt.Fatal("negative")\n\t}\n\t_, err = SumPositive(strings.NewReader(`{`))\n\tif err == nil || errors.Is(err, ErrNegative) {\n\t\tt.Fatal("json")\n\t}\n}\n',
      "ถอด JSON ทั้งก้อน ถ้า n ติดลบให้ห่อ ErrNegative ด้วย %w ถ้า JSON พังให้คืน error นั้นตรงๆ",
      "Decode the whole JSON. Wrap ErrNegative with %w when n is negative. Return the decode error as it is when the JSON is broken",
    ),
    task(
      "3",
      "เขียน RunAll ให้ทำงานพร้อมกันไม่เกิน limit นับงานที่สำเร็จกับงานที่คืน error และไม่เริ่มงานเมื่อ context จบแล้ว",
      "Write RunAll so at most limit jobs run at once, count successes and errors, and start nothing when the context has already ended",
      'package main\n\nimport "context"\n\nfunc RunAll(ctx context.Context, limit int, jobs []func() error) (done int, failed int) {\n\treturn 0, 0\n}\n',
      'package main\n\nimport (\n\t"context"\n\t"errors"\n\t"testing"\n\t"time"\n)\n\nfunc TestRunAll(t *testing.T) {\n\tctx, cancel := context.WithCancel(context.Background())\n\tcancel()\n\tdone, failed := RunAll(ctx, 2, []func() error{func() error { return nil }})\n\tif done != 0 || failed != 0 {\n\t\tt.Fatal("canceled")\n\t}\n\tdone, failed = RunAll(context.Background(), 2, []func() error{\n\t\tfunc() error { return nil },\n\t\tfunc() error { return errors.New("x") },\n\t\tfunc() error { return nil },\n\t})\n\tif done != 2 || failed != 1 {\n\t\tt.Fatal("count")\n\t}\n\tstarted := make(chan struct{}, 4)\n\trelease := make(chan struct{})\n\tjobs := make([]func() error, 4)\n\tfor i := range jobs {\n\t\tjobs[i] = func() error {\n\t\t\tstarted <- struct{}{}\n\t\t\t<-release\n\t\t\treturn nil\n\t\t}\n\t}\n\tfinished := make(chan struct{})\n\tgo func() {\n\t\tRunAll(context.Background(), 2, jobs)\n\t\tclose(finished)\n\t}()\n\t<-started\n\t<-started\n\tselect {\n\tcase <-started:\n\t\tt.Fatal("too many")\n\tcase <-time.After(50 * time.Millisecond):\n\t}\n\tclose(release)\n\t<-finished\n}\n',
      "ถ้า context จบแล้วให้คืนทันที ที่เหลือจองที่ว่างเท่า limit แล้วรอให้ทุกงานที่เริ่มแล้วจบก่อนคืนผลนับ",
      "Return immediately when the context has ended. Otherwise reserve only limit slots and wait for every started job before returning the counts",
    ),
    task(
      "4",
      "เขียน Handle ให้รับ POST ที่เป็น JSON ของ host กับ port ตอบที่อยู่จาก net.JoinHostPort พร้อม log ระดับ Info method อื่นตอบ 405 พร้อม log ระดับ Warn และ JSON ที่พังตอบ 400",
      "Write Handle to accept a POST JSON host and port, respond with net.JoinHostPort, log Info, answer 405 with a Warn log for any other method, and answer 400 for broken JSON",
      'package main\n\nimport (\n\t"io"\n\t"net/http"\n)\n\nfunc Handle(w http.ResponseWriter, r *http.Request, log io.Writer) {\n}\n',
      'package main\n\nimport (\n\t"bytes"\n\t"io"\n\t"net/http"\n\t"net/http/httptest"\n\t"strings"\n\t"testing"\n)\n\nfunc TestHandle(t *testing.T) {\n\tvar log bytes.Buffer\n\trec := httptest.NewRecorder()\n\treq := httptest.NewRequest(http.MethodPost, "/", strings.NewReader(`{"host":"::1","port":"80"}`))\n\tHandle(rec, req, &log)\n\tif rec.Code != http.StatusOK || rec.Body.String() != "[::1]:80" {\n\t\tt.Fatal(rec.Body.String())\n\t}\n\tif !strings.Contains(log.String(), "level=INFO") || !strings.Contains(log.String(), "::1") {\n\t\tt.Fatal(log.String())\n\t}\n\tlog.Reset()\n\trec = httptest.NewRecorder()\n\treq = httptest.NewRequest(http.MethodGet, "/", nil)\n\tHandle(rec, req, &log)\n\tif rec.Code != http.StatusMethodNotAllowed || !strings.Contains(log.String(), "level=WARN") {\n\t\tt.Fatal("get")\n\t}\n\trec = httptest.NewRecorder()\n\treq = httptest.NewRequest(http.MethodPost, "/", strings.NewReader(`{"host":"localhost","port":"443"}`))\n\tHandle(rec, req, io.Discard)\n\tif rec.Code != http.StatusOK || rec.Body.String() != "localhost:443" {\n\t\tt.Fatal(rec.Body.String())\n\t}\n\trec = httptest.NewRecorder()\n\treq = httptest.NewRequest(http.MethodPost, "/", strings.NewReader(`{`))\n\tHandle(rec, req, io.Discard)\n\tif rec.Code != http.StatusBadRequest {\n\t\tt.Fatal("bad")\n\t}\n}\n',
      "แยก method ก่อนถอด JSON แล้วส่ง host กับ port เข้า JoinHostPort อย่าต่อสตริงเอง",
      "Branch on the method before decoding JSON, then pass host and port to JoinHostPort. Do not join the strings yourself",
    ),
    task(
      "5",
      "เขียน Collect ให้เรียก Speak ทีละตัว เก็บข้อความที่สำเร็จ นับตัวที่ panic หรือเป็น nil แล้วไปต่อตัวที่เหลือโดยที่ฟังก์ชันเองไม่ panic",
      "Write Collect to call Speak one item at a time, keep the successful text, count panics and nils, and continue without Collect itself panicking",
      'package main\n\ntype Speaker interface {\n\tSpeak() string\n}\n\nfunc Collect(items []Speaker) (said []string, panicked int) {\n\treturn nil, 0\n}\n',
      'package main\n\nimport (\n\t"strconv"\n\t"testing"\n)\n\ntype cow struct{}\n\nfunc (cow) Speak() string { return "moo" }\n\ntype boom struct{}\n\nfunc (boom) Speak() string { panic("boom") }\n\ntype box struct{ n int }\n\nfunc (b *box) Speak() string { return strconv.Itoa(b.n) }\n\nfunc TestCollect(t *testing.T) {\n\tsaid, n := Collect([]Speaker{cow{}, nil, cow{}})\n\tif n != 1 || len(said) != 2 || said[0] != "moo" || said[1] != "moo" {\n\t\tt.Fatal("mix")\n\t}\n\tsaid, n = Collect([]Speaker{boom{}, (*box)(nil)})\n\tif n != 2 || len(said) != 0 {\n\t\tt.Fatal("panic")\n\t}\n\tsaid, n = Collect(nil)\n\tif n != 0 || len(said) != 0 {\n\t\tt.Fatal("empty")\n\t}\n}\n',
      "ตรวจ nil ก่อนเรียก และใส่ recover ไว้ในฟังก์ชันย่อยที่เรียก Speak ทีละตัว",
      "Check nil before the call, and recover inside a helper that calls Speak for one item",
    ),
  ].map((exercise) => solved(exercise, solutions[exercise.id])),
});
