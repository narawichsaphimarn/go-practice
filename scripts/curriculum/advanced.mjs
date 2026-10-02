import { go, lesson, say, solved, testEx, testFile, tests, text, unit, withHint } from "./helpers.mjs";

// Lesson text lives in src/content/advanced/<id>/{th,en}.md. This file holds titles, goals, and exercises.
export const advanced = [
  lesson({
    id: "a01-interfaces",
    level: "advanced",
    title: text("interface", "Interfaces"),
    goal: text("เขียน interface เล็ก ๆ แล้วใช้ชนิดต่างกันผ่าน interface เดียวกัน", "Write a small interface and use different types through it"),
    exercises: [
      solved(
        withHint(
          testEx(
            say("easy", "เขียน method Speak ของ Dog ให้คืน woof", "Write the Speak method of Dog to return woof"),
            tests,
            unit(go`type Dog struct{}

func (Dog) Speak() string {
	return ""
}`),
            testFile(go`type Speaker interface {
	Speak() string
}

func TestDog(t *testing.T) {
	var s Speaker = Dog{}
	if s.Speak() != "woof" {
		t.Fatal("Dog must say woof")
	}
}`),
          ),
          "แก้ return \"\" เป็น return \"woof\" แค่มี method Speak ครบ Dog ก็ทำตาม Speaker ได้ ไม่ต้องประกาศอะไรเพิ่ม",
          "Change return \"\" to return \"woof\". Having the Speak method is all Dog needs to satisfy Speaker; nothing else is declared",
        ),
        unit(go`type Dog struct{}

func (Dog) Speak() string {
	return "woof"
}`),
      ),
      solved(
        withHint(
          testEx(
            say("mid", "เขียน Announce ให้รับ Speaker อะไรก็ได้ แล้วคืนสิ่งที่มันพูด", "Write Announce to take any Speaker and return what it says"),
            tests,
            unit(go`type Speaker interface {
	Speak() string
}

func Announce(s Speaker) string {
	return ""
}`),
            testFile(go`type robot struct{ word string }

func (r robot) Speak() string { return r.word }

func TestAnnounce(t *testing.T) {
	if Announce(robot{"beep"}) != "beep" || Announce(robot{"boop"}) != "boop" {
		t.Fatal("Announce must return s.Speak()")
	}
}`),
          ),
          "Announce ไม่รู้ว่า s เป็นชนิดไหน แต่รู้ว่ามี Speak จึงคืน s.Speak()",
          "Announce does not know the type of s, only that it has Speak, so return s.Speak()",
        ),
        unit(go`type Speaker interface {
	Speak() string
}

func Announce(s Speaker) string {
	return s.Speak()
}`),
      ),
      solved(
        withHint(
          testEx(
            say("hard", "เขียน TotalArea ให้รวมพื้นที่ของทุก Shape ใน slice ไม่ว่าจะเป็น Rect, Square หรือชนิดอื่นที่มี Area", "Write TotalArea to add up the area of every Shape in the slice, whether it is a Rect, a Square, or any other type with Area"),
            tests,
            unit(go`type Shape interface {
	Area() int
}

type Rect struct{ W, H int }

func (r Rect) Area() int { return r.W * r.H }

type Square struct{ Side int }

func (s Square) Area() int { return s.Side * s.Side }

func TotalArea(shapes []Shape) int {
	return 0
}`),
            testFile(go`type unit struct{}

func (unit) Area() int { return 1 }

func TestTotalArea(t *testing.T) {
	shapes := []Shape{Rect{W: 2, H: 3}, Square{Side: 4}, unit{}}
	if got := TotalArea(shapes); got != 23 {
		t.Fatalf("TotalArea = %d, want 23", got)
	}
	if TotalArea(nil) != 0 {
		t.Fatal("no shapes gives 0")
	}
}`),
          ),
          "ไล่ shapes ด้วย range แล้วบวก s.Area() ทุกตัว ไม่ต้องเช็กว่าเป็นชนิดไหน",
          "Range over shapes and add s.Area() for each one. You never need to check which type it is",
        ),
        unit(go`type Shape interface {
	Area() int
}

type Rect struct{ W, H int }

func (r Rect) Area() int { return r.W * r.H }

type Square struct{ Side int }

func (s Square) Area() int { return s.Side * s.Side }

func TotalArea(shapes []Shape) int {
	total := 0
	for _, s := range shapes {
		total += s.Area()
	}
	return total
}`),
      ),
      solved(
        withHint(
          testEx(
            say("twist", "เขียน Kind ให้คืน dog เมื่อ s เป็น Dog, cat เมื่อเป็น Cat และ other สำหรับชนิดอื่น", "Write Kind to return dog when s is a Dog, cat when it is a Cat, and other for any other type"),
            tests,
            unit(go`type Speaker interface {
	Speak() string
}

type Dog struct{}

func (Dog) Speak() string { return "woof" }

type Cat struct{}

func (Cat) Speak() string { return "meow" }

func Kind(s Speaker) string {
	return ""
}`),
            testFile(go`type cow struct{}

func (cow) Speak() string { return "moo" }

func TestKind(t *testing.T) {
	if Kind(Dog{}) != "dog" || Kind(Cat{}) != "cat" || Kind(cow{}) != "other" {
		t.Fatal("Kind returned the wrong name")
	}
}`),
          ),
          "ใช้ type switch: switch s.(type) { case Dog: ... case Cat: ... default: ... }",
          "Use a type switch: switch s.(type) { case Dog: ... case Cat: ... default: ... }",
        ),
        unit(go`type Speaker interface {
	Speak() string
}

type Dog struct{}

func (Dog) Speak() string { return "woof" }

type Cat struct{}

func (Cat) Speak() string { return "meow" }

func Kind(s Speaker) string {
	switch s.(type) {
	case Dog:
		return "dog"
	case Cat:
		return "cat"
	default:
		return "other"
	}
}`),
      ),
    ],
  }),
  lesson({
    id: "a02-generics",
    level: "advanced",
    title: text("generics", "Generics"),
    goal: text("เขียนฟังก์ชันเดียวที่ใช้ได้กับหลายชนิด และเลือก constraint ให้ตรงกับสิ่งที่ฟังก์ชันทำ", "Write one function that works for many types, and pick the constraint that matches what it does"),
    exercises: [
      solved(
        withHint(
          testEx(
            say("easy", "เขียน Contains ให้คืน true เมื่อ v อยู่ใน s ใช้ได้ทั้ง slice ของ int และ string", "Write Contains to return true when v is in s. It must work for slices of int and of string"),
            tests,
            unit(go`func Contains[T comparable](s []T, v T) bool {
	return false
}`),
            testFile(go`func TestContains(t *testing.T) {
	if !Contains([]int{1, 2, 3}, 2) || Contains([]int{1, 2, 3}, 9) {
		t.Fatal("ints")
	}
	if !Contains([]string{"go", "rust"}, "go") || Contains([]string{}, "go") {
		t.Fatal("strings")
	}
}`),
          ),
          "ไล่ s ด้วย range แล้วเทียบ x == v ได้ เพราะ constraint comparable รับประกันว่าใช้ == ได้",
          "Range over s and compare x == v. The comparable constraint guarantees that == works",
        ),
        unit(go`func Contains[T comparable](s []T, v T) bool {
	for _, x := range s {
		if x == v {
			return true
		}
	}
	return false
}`),
      ),
      solved(
        withHint(
          testEx(
            say("mid", "เขียน Min ให้คืนค่าที่น้อยกว่าระหว่าง a กับ b เช่น Min(2, 5) ได้ 2 และ Min(\"b\", \"a\") ได้ a", "Write Min to return the smaller of a and b. Min(2, 5) is 2 and Min(\"b\", \"a\") is a"),
            tests,
            unit(go`import "cmp"

func Min[T cmp.Ordered](a, b T) T {
	var zero T
	return zero
}`),
            testFile(go`func TestMin(t *testing.T) {
	if Min(2, 5) != 2 || Min(5, 2) != 2 || Min("b", "a") != "a" || Min(1.5, -1.5) != -1.5 {
		t.Fatal("Min returned the wrong value")
	}
}`),
          ),
          "cmp.Ordered อนุญาตให้ใช้ < กับ T ได้ ถ้า a < b ให้คืน a ไม่งั้นคืน b",
          "cmp.Ordered lets you use < on T. If a < b, return a; otherwise return b",
        ),
        unit(go`import "cmp"

func Min[T cmp.Ordered](a, b T) T {
	if a < b {
		return a
	}
	return b
}`),
      ),
      solved(
        withHint(
          testEx(
            say("hard", "เขียน Map ให้คืน slice ใหม่ที่ได้จากการเรียก f กับทุกสมาชิก ชนิดของผลต่างจากชนิดเข้าได้ เช่น int เป็น string", "Write Map to return a new slice made by calling f on every item. The result type may differ from the input type, such as int to string"),
            tests,
            unit(go`func Map[T, U any](in []T, f func(T) U) []U {
	return nil
}`),
            testFile(go`import (
	"strconv"
	"testing"
)

func TestMap(t *testing.T) {
	got := Map([]int{1, 2, 3}, strconv.Itoa)
	if len(got) != 3 || got[0] != "1" || got[2] != "3" {
		t.Fatalf("Map = %v", got)
	}
	if len(Map([]int{}, strconv.Itoa)) != 0 {
		t.Fatal("empty in, empty out")
	}
}`),
          ),
          "สร้าง out := make([]U, len(in)) แล้วใส่ out[i] = f(v) ทุกรอบ",
          "Make out := make([]U, len(in)) and set out[i] = f(v) each round",
        ),
        unit(go`func Map[T, U any](in []T, f func(T) U) []U {
	out := make([]U, len(in))
	for i, v := range in {
		out[i] = f(v)
	}
	return out
}`),
      ),
      solved(
        withHint(
          testEx(
            say("twist", "เขียน SortedKeys ให้คืน key ทั้งหมดของ map เรียงจากน้อยไปมาก ใช้ได้กับ map ทุกแบบที่ key เรียงลำดับได้", "Write SortedKeys to return all keys of a map in ascending order. It must work for any map whose keys can be ordered"),
            tests,
            unit(go`import "cmp"

func SortedKeys[K cmp.Ordered, V any](m map[K]V) []K {
	return nil
}`),
            testFile(go`func TestSortedKeys(t *testing.T) {
	got := SortedKeys(map[string]int{"b": 1, "c": 2, "a": 3})
	if len(got) != 3 || got[0] != "a" || got[1] != "b" || got[2] != "c" {
		t.Fatalf("SortedKeys = %v", got)
	}
	nums := SortedKeys(map[int]bool{3: true, 1: false})
	if len(nums) != 2 || nums[0] != 1 || nums[1] != 3 {
		t.Fatalf("SortedKeys = %v", nums)
	}
}`),
          ),
          "เก็บ key ทุกตัวด้วย for k := range m แล้วเรียงด้วย slices.Sort ซึ่งต้อง import \"slices\"",
          "Collect every key with for k := range m, then sort with slices.Sort, which needs import \"slices\"",
        ),
        unit(go`import (
	"cmp"
	"slices"
)

func SortedKeys[K cmp.Ordered, V any](m map[K]V) []K {
	keys := make([]K, 0, len(m))
	for k := range m {
		keys = append(keys, k)
	}
	slices.Sort(keys)
	return keys
}`),
      ),
    ],
  }),
  lesson({
    id: "a03-error-wrapping",
    level: "advanced",
    title: text("ห่อ error และหาสาเหตุ", "Wrapping errors and finding the cause"),
    goal: text("ห่อ error เพื่อเพิ่มบริบท แล้วตรวจสาเหตุด้วย errors.Is และ errors.As โดยไม่เทียบข้อความ", "Wrap errors to add context, then find the cause with errors.Is and errors.As instead of comparing text"),
    exercises: [
      solved(
        withHint(
          testEx(
            say("easy", "เขียน Load ให้คืน error ที่มีข้อความ load config: boom และยังตรวจเจอ ErrBoom ด้วย errors.Is", "Write Load to return an error whose message is load config: boom and that errors.Is still matches to ErrBoom"),
            tests,
            unit(go`import "errors"

var ErrBoom = errors.New("boom")

func Load() error {
	return ErrBoom
}`),
            testFile(go`import (
	"errors"
	"testing"
)

func TestLoad(t *testing.T) {
	err := Load()
	if err == nil || err.Error() != "load config: boom" {
		t.Fatalf("message = %v", err)
	}
	if !errors.Is(err, ErrBoom) {
		t.Fatal("errors.Is must still find ErrBoom")
	}
}`),
          ),
          "ใช้ fmt.Errorf(\"load config: %w\", ErrBoom) ตัว %w เก็บ error เดิมไว้ข้างใน ส่วน %v เก็บแค่ข้อความ",
          "Use fmt.Errorf(\"load config: %w\", ErrBoom). %w keeps the original error inside; %v keeps only its text",
        ),
        unit(go`import (
	"errors"
	"fmt"
)

var ErrBoom = errors.New("boom")

func Load() error {
	return fmt.Errorf("load config: %w", ErrBoom)
}`),
      ),
      solved(
        withHint(
          testEx(
            say("mid", "เขียน HasBoom ให้คืน true เมื่อมี ErrBoom อยู่ข้างใน error แม้ถูกห่อหลายชั้น แต่ error อื่นที่ข้อความเป็น boom เหมือนกันต้องได้ false", "Write HasBoom to return true when ErrBoom is inside the error, even several layers deep. A different error that also says boom must return false"),
            tests,
            unit(go`import "errors"

var ErrBoom = errors.New("boom")

func HasBoom(err error) bool {
	return false
}`),
            testFile(go`import (
	"errors"
	"fmt"
	"testing"
)

func TestHasBoom(t *testing.T) {
	deep := fmt.Errorf("a: %w", fmt.Errorf("b: %w", ErrBoom))
	if !HasBoom(ErrBoom) || !HasBoom(deep) {
		t.Fatal("must find ErrBoom")
	}
	if HasBoom(errors.New("boom")) || HasBoom(nil) {
		t.Fatal("same text is not the same error")
	}
}`),
          ),
          "errors.Is(err, ErrBoom) ไล่ดูทุกชั้นที่ห่อด้วย %w และเทียบว่าเป็น error ตัวเดียวกัน ไม่ได้เทียบข้อความ",
          "errors.Is(err, ErrBoom) walks every layer wrapped with %w and checks for the same error value, not the same text",
        ),
        unit(go`import "errors"

var ErrBoom = errors.New("boom")

func HasBoom(err error) bool {
	return errors.Is(err, ErrBoom)
}`),
      ),
      solved(
        withHint(
          testEx(
            say("hard", "เขียน CodeOr ให้ดึง Code จาก CodeError ที่อยู่ข้างใน error (อาจห่อหลายชั้น) ถ้าไม่มีให้คืน fallback", "Write CodeOr to read Code from a CodeError inside the error, possibly several layers deep. If there is none, return fallback"),
            tests,
            unit(go`type CodeError struct {
	Code int
}

func (e CodeError) Error() string {
	return "code error"
}

func CodeOr(err error, fallback int) int {
	return fallback
}`),
            testFile(go`import (
	"errors"
	"fmt"
	"testing"
)

func TestCodeOr(t *testing.T) {
	deep := fmt.Errorf("outer: %w", fmt.Errorf("inner: %w", CodeError{Code: 3}))
	if CodeOr(deep, 9) != 3 || CodeOr(CodeError{Code: 404}, 9) != 404 {
		t.Fatal("must read Code from the CodeError")
	}
	if CodeOr(errors.New("nope"), 9) != 9 || CodeOr(nil, 7) != 7 {
		t.Fatal("must fall back")
	}
}`),
          ),
          "ประกาศ var target CodeError แล้ว if errors.As(err, &target) { return target.Code }",
          "Declare var target CodeError, then if errors.As(err, &target) { return target.Code }",
        ),
        unit(go`import "errors"

type CodeError struct {
	Code int
}

func (e CodeError) Error() string {
	return "code error"
}

func CodeOr(err error, fallback int) int {
	var target CodeError
	if errors.As(err, &target) {
		return target.Code
	}
	return fallback
}`),
      ),
      solved(
        withHint(
          testEx(
            say("twist", "เขียน Validate ให้คืน error ที่รวมทุกปัญหา: ErrNoName เมื่อ name ว่าง และ ErrBadAge เมื่อ age ติดลบ ถ้าไม่มีปัญหาให้คืน nil", "Write Validate to return one error holding every problem: ErrNoName when name is empty and ErrBadAge when age is negative. Return nil when there is no problem"),
            tests,
            unit(go`import "errors"

var (
	ErrNoName = errors.New("no name")
	ErrBadAge = errors.New("bad age")
)

func Validate(name string, age int) error {
	return nil
}`),
            testFile(go`import (
	"errors"
	"testing"
)

func TestValidate(t *testing.T) {
	if Validate("ann", 20) != nil {
		t.Fatal("valid input gives nil")
	}
	both := Validate("", -1)
	if !errors.Is(both, ErrNoName) || !errors.Is(both, ErrBadAge) {
		t.Fatalf("must hold both problems: %v", both)
	}
	age := Validate("ann", -1)
	if errors.Is(age, ErrNoName) || !errors.Is(age, ErrBadAge) {
		t.Fatalf("must hold only the age problem: %v", age)
	}
}`),
          ),
          "เก็บปัญหาไว้ใน var errs []error แล้วคืน errors.Join(errs...) ซึ่งคืน nil เองเมื่อไม่มีปัญหา",
          "Collect problems in var errs []error and return errors.Join(errs...), which returns nil by itself when there are none",
        ),
        unit(go`import "errors"

var (
	ErrNoName = errors.New("no name")
	ErrBadAge = errors.New("bad age")
)

func Validate(name string, age int) error {
	var errs []error
	if name == "" {
		errs = append(errs, ErrNoName)
	}
	if age < 0 {
		errs = append(errs, ErrBadAge)
	}
	return errors.Join(errs...)
}`),
      ),
    ],
  }),
  lesson({
    id: "a04-io",
    level: "advanced",
    title: text("io.Reader และ io.Writer", "io.Reader and io.Writer"),
    goal: text("อ่านและเขียนข้อมูลผ่าน io.Reader กับ io.Writer โดยไม่โหลดทั้งก้อนเมื่อไม่จำเป็น", "Read and write through io.Reader and io.Writer without loading everything when you do not need to"),
    exercises: [
      solved(
        withHint(
          testEx(
            say("easy", "เขียน ReadAll ให้อ่าน r จนหมดแล้วคืนเป็นข้อความ", "Write ReadAll to read r to the end and return it as text"),
            tests,
            unit(go`import "io"

func ReadAll(r io.Reader) (string, error) {
	return "", nil
}`),
            testFile(go`import (
	"strings"
	"testing"
)

func TestReadAll(t *testing.T) {
	for _, want := range []string{"go", "", "hello, reader"} {
		got, err := ReadAll(strings.NewReader(want))
		if err != nil || got != want {
			t.Fatalf("ReadAll = %q, %v; want %q", got, err, want)
		}
	}
}`),
          ),
          "data, err := io.ReadAll(r) ได้ []byte มา แล้วแปลงด้วย string(data)",
          "data, err := io.ReadAll(r) gives you a []byte; convert it with string(data)",
        ),
        unit(go`import "io"

func ReadAll(r io.Reader) (string, error) {
	data, err := io.ReadAll(r)
	return string(data), err
}`),
      ),
      solved(
        withHint(
          testEx(
            say("mid", "เขียน WriteTwice ให้เขียน s ลง w สองครั้ง และคืน error ทันทีถ้าเขียนไม่สำเร็จ", "Write WriteTwice to write s to w two times, returning the error at once if a write fails"),
            tests,
            unit(go`import "io"

func WriteTwice(w io.Writer, s string) error {
	return nil
}`),
            testFile(go`import (
	"bytes"
	"errors"
	"testing"
)

type broken struct{}

func (broken) Write([]byte) (int, error) { return 0, errors.New("disk full") }

func TestWriteTwice(t *testing.T) {
	var b bytes.Buffer
	if err := WriteTwice(&b, "go"); err != nil || b.String() != "gogo" {
		t.Fatalf("got %q, %v", b.String(), err)
	}
	if WriteTwice(broken{}, "go") == nil {
		t.Fatal("a failed write must return its error")
	}
}`),
          ),
          "io.WriteString(w, s) คืน error มาด้วย เช็ก err != nil หลังครั้งแรกก่อนเขียนครั้งที่สอง",
          "io.WriteString(w, s) returns an error too. Check err != nil after the first write, before the second",
        ),
        unit(go`import "io"

func WriteTwice(w io.Writer, s string) error {
	for range 2 {
		if _, err := io.WriteString(w, s); err != nil {
			return err
		}
	}
	return nil
}`),
      ),
      solved(
        withHint(
          testEx(
            say("hard", "เขียน Count ให้คืนจำนวนไบต์ทั้งหมดใน r โดยไม่เก็บเนื้อหาไว้ในหน่วยความจำ", "Write Count to return how many bytes r holds without keeping the contents in memory"),
            tests,
            unit(go`import "io"

func Count(r io.Reader) (int64, error) {
	return 0, nil
}`),
            testFile(go`import (
	"strings"
	"testing"
)

func TestCount(t *testing.T) {
	big := strings.Repeat("x", 1<<20)
	if n, err := Count(strings.NewReader(big)); err != nil || n != 1<<20 {
		t.Fatalf("Count = %d, %v", n, err)
	}
	if n, _ := Count(strings.NewReader("")); n != 0 {
		t.Fatal("empty reader has 0 bytes")
	}
}`),
          ),
          "io.Copy(io.Discard, r) อ่านทีละช่วงแล้วทิ้งลง io.Discard และคืนจำนวนไบต์ที่ส่งผ่านเป็น int64",
          "io.Copy(io.Discard, r) reads piece by piece, throws the data into io.Discard, and returns the byte count as an int64",
        ),
        unit(go`import "io"

func Count(r io.Reader) (int64, error) {
	return io.Copy(io.Discard, r)
}`),
      ),
      solved(
        withHint(
          testEx(
            say("twist", "เขียน Head ให้อ่านจาก r ไม่เกิน n ไบต์แล้วคืนเป็นข้อความ ถ้ามีข้อมูลน้อยกว่า n ให้คืนเท่าที่มี", "Write Head to read at most n bytes from r and return them as text. If r has fewer than n bytes, return what there is"),
            tests,
            unit(go`import "io"

func Head(r io.Reader, n int64) (string, error) {
	return "", nil
}`),
            testFile(go`import (
	"strings"
	"testing"
)

func TestHead(t *testing.T) {
	cases := map[int64]string{2: "go", 0: "", 6: "golang", 99: "golang"}
	for n, want := range cases {
		got, err := Head(strings.NewReader("golang"), n)
		if err != nil || got != want {
			t.Fatalf("Head(%d) = %q, %v; want %q", n, got, err, want)
		}
	}
}`),
          ),
          "io.LimitReader(r, n) คืน Reader ที่หยุดหลังครบ n ไบต์ แล้วอ่านมันด้วย io.ReadAll",
          "io.LimitReader(r, n) gives a Reader that stops after n bytes; read it with io.ReadAll",
        ),
        unit(go`import "io"

func Head(r io.Reader, n int64) (string, error) {
	data, err := io.ReadAll(io.LimitReader(r, n))
	return string(data), err
}`),
      ),
    ],
  }),
  lesson({
    id: "a05-json",
    level: "advanced",
    title: text("encoding/json", "encoding/json"),
    goal: text("แปลง struct เป็น JSON และกลับ โดยกำหนดชื่อฟิลด์ด้วย tag", "Turn structs into JSON and back, naming the fields with tags"),
    exercises: [
      solved(
        withHint(
          testEx(
            say("easy", "เขียน DecodeName ให้อ่าน JSON แล้วคืนค่าของฟิลด์ name และคืน error เมื่อ JSON ผิดรูป", "Write DecodeName to read the JSON and return the name field, and an error when the JSON is malformed"),
            tests,
            unit(go`type Person struct {
	Name string ` + "`json:\"name\"`" + `
}

func DecodeName(data []byte) (string, error) {
	return "", nil
}`),
            testFile(go`func TestDecodeName(t *testing.T) {
	if got, err := DecodeName([]byte(` + "`{\"name\":\"ada\"}`" + `)); err != nil || got != "ada" {
		t.Fatalf("got %q, %v", got, err)
	}
	if _, err := DecodeName([]byte("{")); err == nil {
		t.Fatal("malformed JSON must return an error")
	}
}`),
          ),
          "ประกาศ var p Person แล้วเรียก json.Unmarshal(data, &p) ต้องส่ง &p เพื่อให้ Unmarshal เขียนลงตัวจริง",
          "Declare var p Person and call json.Unmarshal(data, &p). Pass &p so Unmarshal writes into the real value",
        ),
        unit(go`import "encoding/json"

type Person struct {
	Name string ` + "`json:\"name\"`" + `
}

func DecodeName(data []byte) (string, error) {
	var p Person
	err := json.Unmarshal(data, &p)
	return p.Name, err
}`),
      ),
      solved(
        withHint(
          testEx(
            say("mid", "เขียน EncodeName ให้คืน JSON รูป {\"name\":\"...\"} ต้องรองรับชื่อที่มีเครื่องหมายคำพูดด้วย", "Write EncodeName to return JSON shaped like {\"name\":\"...\"}. Names containing quotes must work too"),
            tests,
            unit(go`func EncodeName(name string) ([]byte, error) {
	return nil, nil
}`),
            testFile(go`func TestEncodeName(t *testing.T) {
	cases := map[string]string{"ada": ` + "`{\"name\":\"ada\"}`" + `, ` + "`say \"hi\"`" + `: ` + "`{\"name\":\"say \\\"hi\\\"\"}`" + `}
	for in, want := range cases {
		got, err := EncodeName(in)
		if err != nil || string(got) != want {
			t.Fatalf("EncodeName(%q) = %s, %v; want %s", in, got, err, want)
		}
	}
}`),
          ),
          "สร้าง struct ที่มี tag json:\"name\" แล้วใช้ json.Marshal อย่าต่อข้อความเอง เพราะ Marshal จัดการเครื่องหมายคำพูดให้",
          "Make a struct with the tag json:\"name\" and use json.Marshal. Do not build the text yourself; Marshal escapes the quotes for you",
        ),
        unit(go`import "encoding/json"

func EncodeName(name string) ([]byte, error) {
	return json.Marshal(struct {
		Name string ` + "`json:\"name\"`" + `
	}{name})
}`),
      ),
      solved(
        withHint(
          testEx(
            say("hard", "เขียน TotalQty ให้อ่านคำสั่งซื้อ JSON แล้วคืนผลรวมของ qty ทุกรายการใน items", "Write TotalQty to read an order in JSON and return the sum of qty over every entry in items"),
            tests,
            unit(go`func TotalQty(data []byte) (int, error) {
	return 0, nil
}`),
            testFile(go`func TestTotalQty(t *testing.T) {
	order := ` + "`{\"id\":7,\"items\":[{\"sku\":\"tea\",\"qty\":2},{\"sku\":\"cake\",\"qty\":3}]}`" + `
	if got, err := TotalQty([]byte(order)); err != nil || got != 5 {
		t.Fatalf("TotalQty = %d, %v", got, err)
	}
	if got, err := TotalQty([]byte(` + "`{\"id\":8}`" + `)); err != nil || got != 0 {
		t.Fatalf("no items = %d, %v", got, err)
	}
	if _, err := TotalQty([]byte("[")); err == nil {
		t.Fatal("malformed JSON must return an error")
	}
}`),
          ),
          "ประกาศ struct ซ้อนกัน: Order มี Items []Item และ Item มี Qty int ใส่ tag json:\"items\" กับ json:\"qty\" ฟิลด์ที่ไม่ได้ประกาศ เช่น sku จะถูกข้ามไปเอง",
          "Declare nested structs: Order has Items []Item and Item has Qty int, with the tags json:\"items\" and json:\"qty\". Fields you do not declare, such as sku, are skipped",
        ),
        unit(go`import "encoding/json"

type Item struct {
	Qty int ` + "`json:\"qty\"`" + `
}

type Order struct {
	Items []Item ` + "`json:\"items\"`" + `
}

func TotalQty(data []byte) (int, error) {
	var o Order
	if err := json.Unmarshal(data, &o); err != nil {
		return 0, err
	}
	total := 0
	for _, it := range o.Items {
		total += it.Qty
	}
	return total, nil
}`),
      ),
      solved(
        withHint(
          testEx(
            say("twist", "เพิ่ม tag ให้ User เพื่อให้ JSON ใช้ชื่อ name และ email, ไม่ใส่ email เมื่อว่าง และไม่ส่ง Password ออกไปเลย", "Add tags to User so the JSON uses the names name and email, leaves email out when empty, and never includes Password"),
            tests,
            unit(go`import "encoding/json"

type User struct {
	Name     string
	Email    string
	Password string
}

func Encode(u User) ([]byte, error) {
	return json.Marshal(u)
}`),
            testFile(go`func TestEncode(t *testing.T) {
	cases := map[User]string{
		{Name: "ann", Password: "x"}:                 ` + "`{\"name\":\"ann\"}`" + `,
		{Name: "ann", Email: "a@b.c", Password: "x"}: ` + "`{\"name\":\"ann\",\"email\":\"a@b.c\"}`" + `,
	}
	for u, want := range cases {
		got, err := Encode(u)
		if err != nil || string(got) != want {
			t.Fatalf("Encode = %s, %v; want %s", got, err, want)
		}
	}
}`),
          ),
          "tag json:\"email,omitempty\" ข้ามค่าว่าง และ json:\"-\" ข้ามฟิลด์นั้นเสมอ",
          "The tag json:\"email,omitempty\" skips an empty value, and json:\"-\" always skips the field",
        ),
        unit(go`import "encoding/json"

type User struct {
	Name     string ` + "`json:\"name\"`" + `
	Email    string ` + "`json:\"email,omitempty\"`" + `
	Password string ` + "`json:\"-\"`" + `
}

func Encode(u User) ([]byte, error) {
	return json.Marshal(u)
}`),
      ),
    ],
  }),
];
