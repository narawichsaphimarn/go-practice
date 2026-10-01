import { exact, lesson, panicEx, quiz, solved, stdout, testEx, tests, text, withHint } from "./helpers.mjs";

// Lesson text lives in src/content/beginner/<id>/{th,en}.md. This file holds titles, goals, and exercises.
const go = String.raw;

const main = go`package main

import "fmt"

func main() {
	fmt.Println("todo")
}
`;

function say(id, th, en) {
  return { id, th, en };
}

function program(body, imports = `"fmt"`) {
  return `package main\n\nimport ${imports}\n\nfunc main() {\n${body}\n}\n`;
}

function unit(body) {
  return `package main\n\n${body}\n`;
}

function testFile(body, imports = `"testing"`) {
  return `package main\n\nimport ${imports}\n\n${body}\n`;
}

function pick(id, th, en, why, choices, answer) {
  return quiz(say(id, th, en), why, choices, answer);
}

export const beginner = [
  lesson({
    id: "b00-start",
    level: "beginner",
    title: text("เริ่มต้น: หน้าโจทย์ทำงานอย่างไร", "Start here: how the exercise page works"),
    goal: text("รู้จักโจทย์สามแบบ และส่งคำตอบข้อแรก", "Know the three kinds of exercise and submit your first answer"),
    exercises: [
      solved(
        withHint(
          stdout(say("easy", "โค้ดเริ่มต้นพิมพ์คำว่า todo ให้แก้เป็น ready แล้วกดส่งคำตอบ", "The starter prints todo. Change it to ready, then press Check"), exact, main, "ready\n"),
          "แก้แค่ข้อความในเครื่องหมายคำพูด จาก todo เป็น ready โดยไม่ลบเครื่องหมายคำพูด",
          "Change only the text inside the quotes, from todo to ready. Keep the quotes",
        ),
        program(`\tfmt.Println("ready")`),
      ),
      pick(
        "mid",
        "โจทย์แบบ test ไม่มี func main แล้วใครเป็นคนเรียกฟังก์ชันที่เราเขียน",
        "A test exercise has no func main. Who calls the function you write?",
        text("โค้ดทดสอบที่ซ่อนอยู่ในเว็บจะเรียกฟังก์ชันของเราด้วยค่าหลายชุด แล้วเทียบผลกับคำตอบที่ถูก", "Hidden test code on the site calls your function with several inputs and compares the results"),
        {
          th: ["เราต้องเขียน func main เรียกเอง", "โค้ดทดสอบที่ซ่อนอยู่ในเว็บ", "ไม่มีใครเรียก แค่ต้องคอมไพล์ผ่าน", "ปุ่มรันเป็นคนเรียก"],
          en: ["You must write func main to call it", "Hidden test code on the site", "Nobody calls it; it only has to compile", "The Run button calls it"],
        },
        1,
      ),
      solved(
        withHint(
          testEx(
            say("hard", "แก้ Double ให้คืนค่าสองเท่าของ n เช่น Double(4) ได้ 8 และ Double(-3) ได้ -6", "Fix Double to return twice n. Double(4) is 8 and Double(-3) is -6"),
            tests,
            unit(go`func Double(n int) int {
	return n
}`),
            testFile(go`func TestDouble(t *testing.T) {
	cases := map[int]int{4: 8, -3: -6, 0: 0}
	for in, want := range cases {
		if got := Double(in); got != want {
			t.Fatalf("Double(%d) = %d, want %d", in, got, want)
		}
	}
}`),
          ),
          "เปลี่ยนบรรทัด return n ให้คืน n คูณ 2 เครื่องหมายคูณคือ *",
          "Change the line return n so it returns n times 2. The multiply sign is *",
        ),
        unit(go`func Double(n int) int {
	return n * 2
}`),
      ),
      pick(
        "twist",
        "ปุ่มรันกับปุ่มส่งคำตอบต่างกันอย่างไร",
        "How is the Run button different from the Check button?",
        text("รันใช้ดูผลของโปรแกรมที่มี func main ส่วนส่งคำตอบจะตรวจตามกติกาของโจทย์และบันทึกว่าผ่าน", "Run shows what a program with func main prints. Check tests the exercise rule and records a pass"),
        {
          th: ["เหมือนกันทุกอย่าง", "รันบันทึกคะแนน ส่วนส่งคำตอบไม่บันทึก", "รันแค่แสดงผล ส่วนส่งคำตอบตรวจว่าผ่านหรือไม่", "ส่งคำตอบใช้ได้กับโจทย์ปรนัยเท่านั้น"],
          en: ["They do the same thing", "Run records points and Check does not", "Run only shows output; Check tests whether you passed", "Check only works for multiple choice"],
        },
        2,
      ),
    ],
  }),
  lesson({
    id: "b01-hello",
    level: "beginner",
    title: text("โปรแกรมแรก: พิมพ์ข้อความ", "First program: printing text"),
    goal: text("อ่านโครงของโปรแกรม Go ออก และพิมพ์ข้อความกับตัวเลขได้", "Read the shape of a Go program and print text and numbers"),
    exercises: [
      solved(
        withHint(stdout(say("easy", "พิมพ์คำว่า hello หนึ่งบรรทัด", "Print hello on one line"), exact, main, "hello\n"), "เปลี่ยน todo เป็น hello", "Change todo to hello"),
        program(`\tfmt.Println("hello")`),
      ),
      solved(
        withHint(
          stdout(say("mid", "พิมพ์ go ในบรรทัดแรก และ 1.25 ในบรรทัดที่สอง", "Print go on the first line and 1.25 on the second"), exact, main, "go\n1.25\n"),
          "เรียก fmt.Println สองครั้ง ครั้งละหนึ่งบรรทัด",
          "Call fmt.Println twice, once per line",
        ),
        program(`\tfmt.Println("go")\n\tfmt.Println("1.25")`),
      ),
      solved(
        withHint(
          stdout(say("hard", "พิมพ์ sum=3 โดยให้ Go บวก 1+2 เอง ด้วย fmt.Printf และ %d", "Print sum=3 and let Go add 1+2, using fmt.Printf and %d"), exact, main, "sum=3\n"),
          "Printf แทน %d ด้วยตัวเลขที่ส่งตามมา และไม่ขึ้นบรรทัดใหม่ให้ ต้องใส่ \\n ท้ายข้อความเอง",
          "Printf puts the next number where %d is. It does not add a newline, so end the text with \\n",
        ),
        program(go`	fmt.Printf("sum=%d\n", 1+2)`),
      ),
      solved(
        withHint(
          stdout(say("twist", "ต่อข้อความ \"go\" กับ \"1.25\" โดยมีขีดกลางคั่น แล้วพิมพ์ ผลต้องเป็น go-1.25", "Join the text \"go\" and \"1.25\" with a hyphen between them and print it. The result is go-1.25"), exact, main, "go-1.25\n"),
          "เครื่องหมาย + ต่อข้อความสองชิ้นเข้าด้วยกัน เช่น \"a\" + \"b\" ได้ \"ab\"",
          "The + sign joins two pieces of text. \"a\" + \"b\" gives \"ab\"",
        ),
        program(`\tfmt.Println("go" + "-" + "1.25")`),
      ),
    ],
  }),
  lesson({
    id: "b02-variables",
    level: "beginner",
    title: text("ตัวแปรและค่าศูนย์", "Variables and zero values"),
    goal: text("เก็บค่าไว้ในตัวแปร และบอกได้ว่าตัวแปรที่ยังไม่ใส่ค่ามีค่าอะไร", "Keep values in variables and say what an unset variable holds"),
    exercises: [
      solved(
        withHint(stdout(say("easy", "ประกาศ var n int โดยไม่ใส่ค่า แล้วพิมพ์ n", "Declare var n int without a value, then print n"), exact, main, "0\n"), "ค่าศูนย์ของ int คือ 0", "The zero value of an int is 0"),
        program(`\tvar n int\n\tfmt.Println(n)`),
      ),
      solved(
        withHint(
          stdout(say("mid", "เก็บคำว่า go ไว้ในตัวแปรชื่อ lang แล้วพิมพ์ lang", "Store go in a variable named lang, then print lang"), exact, main, "go\n"),
          "lang := \"go\" ประกาศตัวแปรพร้อมใส่ค่า แล้วส่ง lang เข้า Println โดยไม่ใส่เครื่องหมายคำพูด",
          "lang := \"go\" declares the variable with a value. Pass lang to Println without quotes",
        ),
        program(`\tlang := "go"\n\tfmt.Println(lang)`),
      ),
      solved(
        withHint(
          stdout(say("hard", "ประกาศ var ready bool แล้วพิมพ์ ready จากนั้นตั้ง ready เป็น true แล้วพิมพ์อีกครั้ง", "Declare var ready bool and print it. Then set ready to true and print it again"), exact, main, "false\ntrue\n"),
          "ครั้งแรกได้ค่าศูนย์ของ bool คือ false แล้วใช้ ready = true เปลี่ยนค่า (ใช้ = ไม่ใช่ := เพราะตัวแปรมีอยู่แล้ว)",
          "The first print shows the zero value, false. Then change it with ready = true (use =, not :=, because the variable exists)",
        ),
        program(`\tvar ready bool\n\tfmt.Println(ready)\n\tready = true\n\tfmt.Println(ready)`),
      ),
      solved(
        withHint(
          stdout(say("twist", "ประกาศ var n int แล้วพิมพ์ n ติดกับคำว่า go ในบรรทัดเดียว ผลต้องเป็น 0go", "Declare var n int and print n right next to go on one line. The result is 0go"), exact, main, "0go\n"),
          "fmt.Print ไม่ขึ้นบรรทัดใหม่ ให้ Print(n) ก่อน แล้วค่อย Println(\"go\")",
          "fmt.Print does not add a newline. Call Print(n) first, then Println(\"go\")",
        ),
        program(`\tvar n int\n\tfmt.Print(n)\n\tfmt.Println("go")`),
      ),
    ],
  }),
  lesson({
    id: "b03-control-flow",
    level: "beginner",
    title: text("เงื่อนไขและการวนซ้ำ", "Conditions and loops"),
    goal: text("ใช้ if เลือกทาง ใช้ for ทำซ้ำ และใช้ switch เลือกตามค่า", "Use if to choose, for to repeat, and switch to choose by value"),
    exercises: [
      solved(
        withHint(
          stdout(say("easy", "ให้ score เป็น 80 แล้วพิมพ์ pass เมื่อ score มากกว่าหรือเท่ากับ 80", "Set score to 80 and print pass when score is at least 80"), exact, main, "pass\n"),
          "มากกว่าหรือเท่ากับเขียนว่า >=",
          "At least is written >=",
        ),
        program(`\tscore := 80\n\tif score >= 80 {\n\t\tfmt.Println("pass")\n\t}`),
      ),
      solved(
        withHint(
          stdout(say("mid", "ใช้ for วน i จาก 1 ถึง 3 แล้วพิมพ์ i ติดกันเป็น 123", "Loop i from 1 to 3 with for and print the numbers together as 123"), exact, main, "123\n"),
          "ใช้ fmt.Print(i) ในลูปเพื่อไม่ให้ขึ้นบรรทัดใหม่ แล้ว fmt.Println() หลังลูปหนึ่งครั้ง",
          "Use fmt.Print(i) inside the loop so it stays on one line, then call fmt.Println() once after the loop",
        ),
        program(`\tfor i := 1; i <= 3; i++ {\n\t\tfmt.Print(i)\n\t}\n\tfmt.Println()`),
      ),
      solved(
        withHint(
          stdout(say("hard", "วน day จาก 1 ถึง 3 แล้วใช้ switch พิมพ์ mon, tue, wed บรรทัดละคำ", "Loop day from 1 to 3 and use switch to print mon, tue, wed, one per line"), exact, main, "mon\ntue\nwed\n"),
          "วาง switch day ไว้ในลูป แล้วเขียน case 1, case 2, case 3",
          "Put switch day inside the loop and write case 1, case 2, case 3",
        ),
        program(`\tfor day := 1; day <= 3; day++ {\n\t\tswitch day {\n\t\tcase 1:\n\t\t\tfmt.Println("mon")\n\t\tcase 2:\n\t\t\tfmt.Println("tue")\n\t\tcase 3:\n\t\t\tfmt.Println("wed")\n\t\t}\n\t}`),
      ),
      solved(
        withHint(
          stdout(say("twist", "วนนับถอยหลังจาก 3 ลงมา 1 แล้วพิมพ์ติดกันเป็น 321", "Count down from 3 to 1 and print the numbers together as 321"), exact, main, "321\n"),
          "เริ่ม i ที่ 3 วนตราบที่ i >= 1 และใช้ i-- ลด i ลงหนึ่งทุกรอบ",
          "Start i at 3, loop while i >= 1, and use i-- to lower i by one each round",
        ),
        program(`\tfor i := 3; i >= 1; i-- {\n\t\tfmt.Print(i)\n\t}\n\tfmt.Println()`),
      ),
    ],
  }),
  lesson({
    id: "b04-functions",
    level: "beginner",
    title: text("ฟังก์ชัน", "Functions"),
    goal: text("เขียนฟังก์ชันที่รับค่าและคืนผล รวมถึงฟังก์ชันที่คืนหลายค่า", "Write functions that take values and return results, including more than one result"),
    exercises: [
      solved(
        withHint(
          testEx(
            say("easy", "เขียน Add ให้คืนผลบวกของ a กับ b เช่น Add(2, 3) ได้ 5", "Write Add to return a plus b. Add(2, 3) is 5"),
            tests,
            unit(go`func Add(a, b int) int {
	return 0
}`),
            testFile(go`func TestAdd(t *testing.T) {
	if Add(2, 3) != 5 || Add(-4, 1) != -3 || Add(0, 0) != 0 {
		t.Fatal("Add returned the wrong sum")
	}
}`),
          ),
          "คืน a + b",
          "Return a + b",
        ),
        unit(go`func Add(a, b int) int {
	return a + b
}`),
      ),
      solved(
        withHint(
          testEx(
            say("mid", "เขียน DivMod ให้คืนผลหารกับเศษ เช่น DivMod(7, 2) ได้ 3 กับ 1", "Write DivMod to return the quotient and the remainder. DivMod(7, 2) gives 3 and 1"),
            tests,
            unit(go`func DivMod(a, b int) (int, int) {
	return 0, 0
}`),
            testFile(go`func TestDivMod(t *testing.T) {
	if q, r := DivMod(7, 2); q != 3 || r != 1 {
		t.Fatalf("DivMod(7, 2) = %d, %d", q, r)
	}
	if q, r := DivMod(9, 3); q != 3 || r != 0 {
		t.Fatalf("DivMod(9, 3) = %d, %d", q, r)
	}
}`),
          ),
          "a / b ของ int ตัดเศษทิ้ง ส่วน a % b ให้เศษ คืนทั้งสองค่าด้วย return a / b, a % b",
          "a / b on ints drops the remainder and a % b gives it. Return both with return a / b, a % b",
        ),
        unit(go`func DivMod(a, b int) (int, int) {
	return a / b, a % b
}`),
      ),
      solved(
        withHint(
          testEx(
            say("hard", "เขียน Clamp ให้บีบ v ให้อยู่ระหว่าง low กับ high เช่น Clamp(10, 0, 3) ได้ 3 และ Clamp(-5, 0, 3) ได้ 0", "Write Clamp to keep v between low and high. Clamp(10, 0, 3) is 3 and Clamp(-5, 0, 3) is 0"),
            tests,
            unit(go`func Clamp(v, low, high int) int {
	return v
}`),
            testFile(go`func TestClamp(t *testing.T) {
	cases := [][4]int{{10, 0, 3, 3}, {-5, 0, 3, 0}, {2, 0, 3, 2}, {3, 0, 3, 3}, {0, 0, 3, 0}}
	for _, c := range cases {
		if got := Clamp(c[0], c[1], c[2]); got != c[3] {
			t.Fatalf("Clamp(%d, %d, %d) = %d, want %d", c[0], c[1], c[2], got, c[3])
		}
	}
}`),
          ),
          "ถ้า v มากกว่า high ให้คืน high ถ้า v น้อยกว่า low ให้คืน low นอกนั้นคืน v",
          "If v is above high, return high. If it is below low, return low. Otherwise return v",
        ),
        unit(go`func Clamp(v, low, high int) int {
	if v > high {
		return high
	}
	if v < low {
		return low
	}
	return v
}`),
      ),
      solved(
        withHint(
          testEx(
            say("twist", "เขียน Twice ให้เรียกฟังก์ชัน f สองรอบต่อกัน เช่น ถ้า f บวก 1 แล้ว Twice(f, 5) ได้ 7", "Write Twice to call the function f two times in a row. If f adds 1, Twice(f, 5) is 7"),
            tests,
            unit(go`func Twice(f func(int) int, n int) int {
	return n
}`),
            testFile(go`func TestTwice(t *testing.T) {
	plusOne := func(x int) int { return x + 1 }
	double := func(x int) int { return x * 2 }
	if Twice(plusOne, 5) != 7 || Twice(double, 3) != 12 {
		t.Fatal("Twice must apply f to n, then f to that result")
	}
}`),
          ),
          "เรียก f(n) ได้ผลแรก แล้วเรียก f กับผลแรกอีกครั้ง",
          "Call f(n) for a first result, then call f again on that result",
        ),
        unit(go`func Twice(f func(int) int, n int) int {
	return f(f(n))
}`),
      ),
    ],
  }),
  lesson({
    id: "b05-collections",
    level: "beginner",
    title: text("slice และ map", "Slices and maps"),
    goal: text("เก็บหลายค่าใน slice แล้วไล่ทีละตัว และค้นค่าจาก map ด้วยชื่อ", "Keep many values in a slice and walk through them, and look values up in a map by name"),
    exercises: [
      solved(
        withHint(
          testEx(
            say("easy", "เขียน Sum ให้คืนผลรวมของตัวเลขใน values เช่น Sum([]int{1, 2, 3}) ได้ 6 และ slice ว่างได้ 0", "Write Sum to return the total of values. Sum([]int{1, 2, 3}) is 6 and an empty slice gives 0"),
            tests,
            unit(go`func Sum(values []int) int {
	return 0
}`),
            testFile(go`func TestSum(t *testing.T) {
	if Sum([]int{1, 2, 3}) != 6 || Sum([]int{-2, 2}) != 0 || Sum(nil) != 0 {
		t.Fatal("Sum returned the wrong total")
	}
}`),
          ),
          "ตั้ง total := 0 แล้วใช้ for _, v := range values บวก v เข้า total",
          "Start with total := 0, then use for _, v := range values to add each v",
        ),
        unit(go`func Sum(values []int) int {
	total := 0
	for _, v := range values {
		total += v
	}
	return total
}`),
      ),
      solved(
        withHint(
          testEx(
            say("mid", "เขียน Count ให้นับว่า target อยู่ใน values กี่ครั้ง เช่น Count([]int{4, 7, 7}, 7) ได้ 2", "Write Count to count how many times target is in values. Count([]int{4, 7, 7}, 7) is 2"),
            tests,
            unit(go`func Count(values []int, target int) int {
	return 0
}`),
            testFile(go`func TestCount(t *testing.T) {
	if Count([]int{4, 7, 7}, 7) != 2 || Count([]int{4, 7, 7}, 5) != 0 || Count(nil, 1) != 0 {
		t.Fatal("Count returned the wrong number")
	}
}`),
          ),
          "ไล่ทุกตัวด้วย range และบวก 1 เมื่อค่าเท่ากับ target",
          "Walk every item with range and add 1 when the item equals target",
        ),
        unit(go`func Count(values []int, target int) int {
	found := 0
	for _, v := range values {
		if v == target {
			found++
		}
	}
	return found
}`),
      ),
      solved(
        withHint(
          testEx(
            say("hard", "เขียน Index ให้คืนตำแหน่งแรกที่เจอ target (นับจาก 0) หรือ -1 เมื่อไม่เจอ เช่น Index([]int{4, 7, 7}, 7) ได้ 1", "Write Index to return the first position of target, counting from 0, or -1 when it is missing. Index([]int{4, 7, 7}, 7) is 1"),
            tests,
            unit(go`func Index(values []int, target int) int {
	return 0
}`),
            testFile(go`func TestIndex(t *testing.T) {
	if Index([]int{4, 7, 7}, 7) != 1 || Index([]int{4, 7, 7}, 4) != 0 || Index([]int{4}, 9) != -1 || Index(nil, 1) != -1 {
		t.Fatal("Index returned the wrong position")
	}
}`),
          ),
          "ใช้ for i, v := range values แล้ว return i ทันทีที่ v เท่ากับ target ถ้าวนจบแล้วยังไม่เจอให้ return -1",
          "Use for i, v := range values and return i as soon as v equals target. If the loop ends, return -1",
        ),
        unit(go`func Index(values []int, target int) int {
	for i, v := range values {
		if v == target {
			return i
		}
	}
	return -1
}`),
      ),
      solved(
        withHint(
          testEx(
            say("twist", "เขียน CountWords ให้คืน map ที่บอกว่าแต่ละคำโผล่กี่ครั้ง เช่น go, is, go ได้ go เป็น 2 และ is เป็น 1", "Write CountWords to return a map of how often each word appears. go, is, go gives go: 2 and is: 1"),
            tests,
            unit(go`func CountWords(words []string) map[string]int {
	return nil
}`),
            testFile(go`func TestCountWords(t *testing.T) {
	got := CountWords([]string{"go", "is", "go"})
	if len(got) != 2 || got["go"] != 2 || got["is"] != 1 {
		t.Fatalf("CountWords = %v", got)
	}
	if len(CountWords(nil)) != 0 {
		t.Fatal("no words gives an empty map")
	}
}`),
          ),
          "สร้าง counts := make(map[string]int) แล้วทำ counts[w]++ ทุกคำ คำที่ยังไม่มีใน map เริ่มที่ 0 เอง",
          "Make counts := make(map[string]int) and do counts[w]++ for every word. A missing word starts at 0",
        ),
        unit(go`func CountWords(words []string) map[string]int {
	counts := make(map[string]int)
	for _, w := range words {
		counts[w]++
	}
	return counts
}`),
      ),
    ],
  }),
  lesson({
    id: "b06-pointers",
    level: "beginner",
    title: text("pointer", "Pointers"),
    goal: text("ส่งที่อยู่ของตัวแปรให้ฟังก์ชัน เพื่อให้ฟังก์ชันแก้ค่าตัวจริงได้", "Pass a variable's address so a function can change the real value"),
    exercises: [
      solved(
        withHint(
          testEx(
            say("easy", "เขียน Inc ให้เพิ่มค่าที่ n ชี้อยู่ขึ้นหนึ่ง เช่น x เป็น 1 หลัง Inc(&x) ต้องเป็น 2", "Write Inc to add one to the value n points at. If x is 1, after Inc(&x) it is 2"),
            tests,
            unit(go`func Inc(n *int) {
}`),
            testFile(go`func TestInc(t *testing.T) {
	x := 1
	Inc(&x)
	Inc(&x)
	if x != 3 {
		t.Fatalf("x = %d, want 3", x)
	}
}`),
          ),
          "*n คือค่าที่ n ชี้อยู่ เขียน *n = *n + 1 หรือ *n++",
          "*n is the value n points at. Write *n = *n + 1 or *n++",
        ),
        unit(go`func Inc(n *int) {
	*n++
}`),
      ),
      solved(
        withHint(
          testEx(
            say("mid", "เขียน Swap ให้สลับค่าที่ a กับ b ชี้อยู่", "Write Swap to exchange the values a and b point at"),
            tests,
            unit(go`func Swap(a, b *int) {
}`),
            testFile(go`func TestSwap(t *testing.T) {
	x, y := 1, 2
	Swap(&x, &y)
	if x != 2 || y != 1 {
		t.Fatalf("x, y = %d, %d", x, y)
	}
}`),
          ),
          "เก็บ *a ไว้ในตัวแปรชั่วคราวก่อน แล้วค่อยเขียนทับ หรือใช้ *a, *b = *b, *a",
          "Keep *a in a temporary variable before you overwrite it, or use *a, *b = *b, *a",
        ),
        unit(go`func Swap(a, b *int) {
	*a, *b = *b, *a
}`),
      ),
      solved(
        withHint(
          testEx(
            say("hard", "เขียน SafeInc ให้คืน false เมื่อ n เป็น nil ถ้าไม่ใช่ให้เพิ่มค่าขึ้นหนึ่งแล้วคืน true", "Write SafeInc to return false when n is nil. Otherwise add one and return true"),
            tests,
            unit(go`func SafeInc(n *int) bool {
	return false
}`),
            testFile(go`func TestSafeInc(t *testing.T) {
	if SafeInc(nil) {
		t.Fatal("nil must return false")
	}
	x := 5
	if !SafeInc(&x) || x != 6 {
		t.Fatalf("x = %d, want 6", x)
	}
}`),
          ),
          "เช็ก if n == nil ก่อนอ่าน *n เพราะการอ่านผ่าน pointer ที่เป็น nil ทำให้โปรแกรม panic",
          "Check if n == nil before reading *n, because reading through a nil pointer makes the program panic",
        ),
        unit(go`func SafeInc(n *int) bool {
	if n == nil {
		return false
	}
	*n++
	return true
}`),
      ),
      solved(
        withHint(
          testEx(
            say("twist", "เขียน Add ให้บวก delta เข้ากับค่าที่ n ชี้อยู่ delta ติดลบได้", "Write Add to add delta to the value n points at. delta may be negative"),
            tests,
            unit(go`func Add(n *int, delta int) {
}`),
            testFile(go`func TestAdd(t *testing.T) {
	x := 10
	Add(&x, 5)
	Add(&x, -12)
	if x != 3 {
		t.Fatalf("x = %d, want 3", x)
	}
}`),
          ),
          "*n += delta ใช้ได้ทั้ง delta บวกและลบ",
          "*n += delta works for both positive and negative delta",
        ),
        unit(go`func Add(n *int, delta int) {
	*n += delta
}`),
      ),
    ],
  }),
  lesson({
    id: "b07-structs",
    level: "beginner",
    title: text("struct และ method", "Structs and methods"),
    goal: text("รวมข้อมูลที่เกี่ยวกันเป็น struct และเขียน method ให้มัน", "Group related data in a struct and write methods for it"),
    exercises: [
      solved(
        withHint(
          testEx(
            say("easy", "เขียน method Area ของ Rect ให้คืน W คูณ H เช่น Rect{W: 3, H: 4}.Area() ได้ 12", "Write the Area method of Rect to return W times H. Rect{W: 3, H: 4}.Area() is 12"),
            tests,
            unit(go`type Rect struct {
	W int
	H int
}

func (r Rect) Area() int {
	return 0
}`),
            testFile(go`func TestArea(t *testing.T) {
	if (Rect{W: 3, H: 4}).Area() != 12 || (Rect{}).Area() != 0 {
		t.Fatal("Area returned the wrong value")
	}
}`),
          ),
          "ใน method ใช้ r.W กับ r.H อ่านฟิลด์",
          "Inside the method, read the fields with r.W and r.H",
        ),
        unit(go`type Rect struct {
	W int
	H int
}

func (r Rect) Area() int {
	return r.W * r.H
}`),
      ),
      solved(
        withHint(
          testEx(
            say("mid", "เขียน method Grow บน *Rect ให้บวก n ทั้ง W และ H", "Write the Grow method on *Rect to add n to both W and H"),
            tests,
            unit(go`type Rect struct {
	W int
	H int
}

func (r *Rect) Grow(n int) {
}`),
            testFile(go`func TestGrow(t *testing.T) {
	r := Rect{W: 1, H: 2}
	r.Grow(3)
	if r.W != 4 || r.H != 5 {
		t.Fatalf("r = %+v", r)
	}
}`),
          ),
          "receiver เป็น pointer จึงแก้ r.W += n กับ r.H += n แล้วค่าของตัวจริงเปลี่ยน",
          "The receiver is a pointer, so r.W += n and r.H += n change the real value",
        ),
        unit(go`type Rect struct {
	W int
	H int
}

func (r *Rect) Grow(n int) {
	r.W += n
	r.H += n
}`),
      ),
      solved(
        withHint(
          testEx(
            say("hard", "เขียน method Add บน *Cart ให้ต่อราคาเข้า Items และ method Total บน Cart ให้คืนผลรวมราคา", "Write Add on *Cart to append a price to Items, and Total on Cart to return the sum of the prices"),
            tests,
            unit(go`type Cart struct {
	Items []int
}

func (c *Cart) Add(price int) {
}

func (c Cart) Total() int {
	return 0
}`),
            testFile(go`func TestCart(t *testing.T) {
	var c Cart
	if c.Total() != 0 {
		t.Fatal("an empty cart totals 0")
	}
	c.Add(30)
	c.Add(12)
	if len(c.Items) != 2 || c.Total() != 42 {
		t.Fatalf("cart = %+v, total %d", c, c.Total())
	}
}`),
          ),
          "Add ต้องแก้ตะกร้าตัวจริง จึงใช้ c.Items = append(c.Items, price) ส่วน Total แค่อ่าน จึงไล่ c.Items แล้วบวก",
          "Add must change the real cart, so use c.Items = append(c.Items, price). Total only reads, so it walks c.Items and adds",
        ),
        unit(go`type Cart struct {
	Items []int
}

func (c *Cart) Add(price int) {
	c.Items = append(c.Items, price)
}

func (c Cart) Total() int {
	total := 0
	for _, p := range c.Items {
		total += p
	}
	return total
}`),
      ),
      solved(
        withHint(
          testEx(
            say("twist", "เขียน method Shrink บน *Rect ให้ลบ n จาก W และ H แต่ไม่ให้ต่ำกว่า 0", "Write the Shrink method on *Rect to subtract n from W and H, never going below 0"),
            tests,
            unit(go`type Rect struct {
	W int
	H int
}

func (r *Rect) Shrink(n int) {
}`),
            testFile(go`func TestShrink(t *testing.T) {
	r := Rect{W: 5, H: 2}
	r.Shrink(3)
	if r.W != 2 || r.H != 0 {
		t.Fatalf("r = %+v", r)
	}
}`),
          ),
          "ลบก่อน แล้วถ้าผลน้อยกว่า 0 ให้ตั้งเป็น 0 ทำแยกกันทั้ง W และ H",
          "Subtract first, then set the field to 0 if it went below 0. Do W and H separately",
        ),
        unit(go`type Rect struct {
	W int
	H int
}

func (r *Rect) Shrink(n int) {
	r.W = max(r.W-n, 0)
	r.H = max(r.H-n, 0)
}`),
      ),
    ],
  }),
  lesson({
    id: "b08-errors",
    level: "beginner",
    title: text("error", "Errors"),
    goal: text("บอกผู้เรียกว่าทำงานไม่สำเร็จด้วย error และหยุดเมื่อเจอ error", "Tell the caller that the work failed with an error, and stop when you get one"),
    exercises: [
      solved(
        withHint(
          testEx(
            say("easy", "เขียน Div ให้คืน 0 กับ error เมื่อ b เป็น 0 และคืน a / b กับ nil เมื่อหารได้", "Write Div to return 0 and an error when b is 0, and a / b with nil when it can divide"),
            tests,
            unit(go`func Div(a, b int) (int, error) {
	return 0, nil
}`),
            testFile(go`func TestDiv(t *testing.T) {
	if got, err := Div(8, 2); err != nil || got != 4 {
		t.Fatalf("Div(8, 2) = %d, %v", got, err)
	}
	if _, err := Div(1, 0); err == nil {
		t.Fatal("Div(1, 0) must return an error")
	}
}`),
          ),
          "import \"errors\" แล้วคืน 0, errors.New(\"divide by zero\") เมื่อ b == 0",
          "Import \"errors\" and return 0, errors.New(\"divide by zero\") when b == 0",
        ),
        unit(go`import "errors"

func Div(a, b int) (int, error) {
	if b == 0 {
		return 0, errors.New("divide by zero")
	}
	return a / b, nil
}`),
      ),
      solved(
        withHint(
          testEx(
            say("mid", "เขียน MustHave ให้คืน error เมื่อ s เป็นข้อความว่าง และคืน nil เมื่อมีข้อความ", "Write MustHave to return an error when s is empty, and nil when it has text"),
            tests,
            unit(go`func MustHave(s string) error {
	return nil
}`),
            testFile(go`func TestMustHave(t *testing.T) {
	if MustHave("") == nil {
		t.Fatal("empty text must return an error")
	}
	if MustHave("go") != nil {
		t.Fatal("text must return nil")
	}
}`),
          ),
          "เทียบ s == \"\" แล้วคืน errors.New(\"empty\")",
          "Compare s == \"\" and return errors.New(\"empty\")",
        ),
        unit(go`import "errors"

func MustHave(s string) error {
	if s == "" {
		return errors.New("empty")
	}
	return nil
}`),
      ),
      solved(
        withHint(
          testEx(
            say("hard", "เขียน ParsePositive ให้แปลงข้อความเป็นตัวเลขที่มากกว่า 0 เช่น \"12\" ได้ 12 ส่วน \"abc\" กับ \"-3\" ต้องได้ error", "Write ParsePositive to turn text into a number above 0. \"12\" gives 12, while \"abc\" and \"-3\" give an error"),
            tests,
            unit(go`func ParsePositive(s string) (int, error) {
	return 0, nil
}`),
            testFile(go`func TestParsePositive(t *testing.T) {
	if n, err := ParsePositive("12"); err != nil || n != 12 {
		t.Fatalf("ParsePositive(\"12\") = %d, %v", n, err)
	}
	for _, bad := range []string{"abc", "-3", "0", ""} {
		if _, err := ParsePositive(bad); err == nil {
			t.Fatalf("ParsePositive(%q) must return an error", bad)
		}
	}
}`),
          ),
          "import \"strconv\" แล้วใช้ n, err := strconv.Atoi(s) ถ้า err != nil หรือ n <= 0 ให้คืน error",
          "Import \"strconv\" and use n, err := strconv.Atoi(s). If err != nil or n <= 0, return an error",
        ),
        unit(go`import (
	"errors"
	"strconv"
)

func ParsePositive(s string) (int, error) {
	n, err := strconv.Atoi(s)
	if err != nil || n <= 0 {
		return 0, errors.New("not positive")
	}
	return n, nil
}`),
      ),
      solved(
        withHint(
          testEx(
            say("twist", "เขียน Between ให้คืน n กับ nil เมื่อ low ≤ n ≤ high (รวมค่าที่ขอบ) และคืน 0 กับ error เมื่ออยู่นอกช่วง เช่น Between(10, 1, 10) ได้ 10", "Write Between to return n and nil when low ≤ n ≤ high (edges included), and 0 with an error otherwise. Between(10, 1, 10) gives 10"),
            tests,
            unit(go`func Between(n, low, high int) (int, error) {
	return 0, nil
}`),
            testFile(go`func TestBetween(t *testing.T) {
	for _, n := range []int{1, 5, 10} {
		if got, err := Between(n, 1, 10); err != nil || got != n {
			t.Fatalf("Between(%d, 1, 10) = %d, %v", n, got, err)
		}
	}
	for _, n := range []int{0, 11} {
		if _, err := Between(n, 1, 10); err == nil {
			t.Fatalf("Between(%d, 1, 10) must return an error", n)
		}
	}
}`),
          ),
          "นอกช่วงคือ n < low || n > high (|| แปลว่า หรือ)",
          "Outside the range means n < low || n > high (|| means or)",
        ),
        unit(go`import "errors"

func Between(n, low, high int) (int, error) {
	if n < low || n > high {
		return 0, errors.New("out of range")
	}
	return n, nil
}`),
      ),
    ],
  }),
  lesson({
    id: "b09-packages",
    level: "beginner",
    title: text("package และ import", "Packages and imports"),
    goal: text("เรียกใช้ฟังก์ชันจากแพ็กเกจอื่น และรู้ว่าชื่อที่ขึ้นต้นด้วยตัวพิมพ์ใหญ่คือชื่อที่แพ็กเกจอื่นใช้ได้", "Call functions from other packages, and know that a name starting with a capital letter is usable from other packages"),
    exercises: [
      pick(
        "easy",
        "ในแพ็กเกจ greet มีชื่อเหล่านี้ ชื่อไหนที่แพ็กเกจอื่นเรียกใช้ได้",
        "Package greet has these names. Which one can other packages use?",
        text("ชื่อที่ขึ้นต้นด้วยตัวพิมพ์ใหญ่ถูก export จึงเรียกจากแพ็กเกจอื่นได้ เช่น greet.Hello", "A name that starts with a capital letter is exported, so other packages can call it, such as greet.Hello"),
        { th: ["hello", "Hello", "_hello", "hELLO"], en: ["hello", "Hello", "_hello", "hELLO"] },
        1,
      ),
      solved(
        withHint(
          testEx(
            say("mid", "เขียน Shout ให้คืนข้อความเป็นตัวพิมพ์ใหญ่แล้วต่อด้วย ! เช่น Shout(\"go\") ได้ GO!", "Write Shout to return the text in capitals followed by !. Shout(\"go\") is GO!"),
            tests,
            unit(go`func Shout(s string) string {
	return s
}`),
            testFile(go`func TestShout(t *testing.T) {
	if Shout("go") != "GO!" || Shout("") != "!" {
		t.Fatal("Shout returned the wrong text")
	}
}`),
          ),
          "import \"strings\" แล้วใช้ strings.ToUpper(s) + \"!\"",
          "Import \"strings\" and use strings.ToUpper(s) + \"!\"",
        ),
        unit(go`import "strings"

func Shout(s string) string {
	return strings.ToUpper(s) + "!"
}`),
      ),
      solved(
        withHint(
          testEx(
            say("hard", "เขียน JoinAll ให้ต่อทุกคำใน parts โดยคั่นด้วยจุลภาคและช่องว่าง เช่น a, b ได้ \"a, b\" และ slice ว่างได้ข้อความว่าง", "Write JoinAll to join every word in parts with a comma and a space. a, b gives \"a, b\" and an empty slice gives empty text"),
            tests,
            unit(go`func JoinAll(parts []string) string {
	return ""
}`),
            testFile(go`func TestJoinAll(t *testing.T) {
	if JoinAll([]string{"a", "b"}) != "a, b" || JoinAll([]string{"go"}) != "go" || JoinAll(nil) != "" {
		t.Fatal("JoinAll returned the wrong text")
	}
}`),
          ),
          "แพ็กเกจ strings มีฟังก์ชัน Join ที่รับ slice กับตัวคั่น",
          "Package strings has a Join function that takes a slice and a separator",
        ),
        unit(go`import "strings"

func JoinAll(parts []string) string {
	return strings.Join(parts, ", ")
}`),
      ),
      pick(
        "twist",
        "go.mod เขียนว่า module example.com/app และแพ็กเกจอยู่ในโฟลเดอร์ greet ต้อง import ด้วย path ไหน",
        "go.mod says module example.com/app and the package is in the folder greet. Which import path do you use?",
        text("path ของแพ็กเกจคือชื่อโมดูลต่อด้วยโฟลเดอร์ของแพ็กเกจ", "A package path is the module name followed by the package folder"),
        { th: ["\"greet\"", "\"example.com/app/greet\"", "\"app/greet\"", "\"./greet\""], en: ["\"greet\"", "\"example.com/app/greet\"", "\"app/greet\"", "\"./greet\""] },
        1,
      ),
    ],
  }),
  lesson({
    id: "b10-defer",
    level: "beginner",
    title: text("defer", "defer"),
    goal: text("สั่งงานให้ทำตอนฟังก์ชันกำลังจะจบ และรู้ลำดับเมื่อมี defer หลายตัว", "Schedule work for when a function is about to return, and know the order when there are several defers"),
    exercises: [
      solved(
        withHint(
          testEx(
            say("easy", "เขียน Order ให้คืน ab โดย return \"a\" แล้วให้ defer เติม b", "Write Order to return ab by returning \"a\" and letting a defer append b"),
            tests,
            unit(go`func Order() (s string) {
	return ""
}`),
            testFile(go`func TestOrder(t *testing.T) {
	if Order() != "ab" {
		t.Fatal("order")
	}
}`),
          ),
          "ในตัวฟังก์ชันให้ return \"a\" แล้วให้ defer เติม b ต่อท้าย s ผลจึงเป็น ab",
          "Return \"a\" in the body and let a defer append b to s, so the result is ab",
        ),
        unit(go`func Order() (s string) {
	defer func() { s += "b" }()
	return "a"
}`),
      ),
      solved(
        withHint(
          testEx(
            say("mid", "เขียน Closed ให้คืน 1 โดย return 0 แล้วให้ defer เพิ่ม n ขึ้นหนึ่ง", "Write Closed to return 1 by returning 0 and letting a defer add one to n"),
            tests,
            unit(go`func Closed() (n int) {
	return 0
}`),
            testFile(go`func TestClosed(t *testing.T) {
	if Closed() != 1 {
		t.Fatal("closed")
	}
}`),
          ),
          "defer func() { n++ }() ทำงานหลัง return 0 ตั้ง n แล้ว จึงได้ 1",
          "defer func() { n++ }() runs after return 0 sets n, so the result is 1",
        ),
        unit(go`func Closed() (n int) {
	defer func() { n++ }()
	return 0
}`),
      ),
      solved(
        withHint(
          testEx(
            say("hard", "เขียน Mark ให้คืน abc โดย return \"a\" แล้วใช้ defer สองตัวเติม b และ c", "Write Mark to return abc by returning \"a\" and using two defers to append b and c"),
            tests,
            unit(go`func Mark() (s string) {
	return ""
}`),
            testFile(go`func TestMark(t *testing.T) {
	if Mark() != "abc" {
		t.Fatal("mark")
	}
}`),
          ),
          "defer ตัวที่ลงทะเบียนทีหลังทำงานก่อน จึงต้องเขียน defer ที่เติม c ไว้ก่อน defer ที่เติม b",
          "The defer registered last runs first, so write the defer that appends c before the one that appends b",
        ),
        unit(go`func Mark() (s string) {
	defer func() { s += "c" }()
	defer func() { s += "b" }()
	return "a"
}`),
      ),
      solved(
        withHint(
          testEx(
            say("twist", "เขียน Countdown ให้คืน 321 โดยวน i จาก 1 ถึง 3 และ defer เติมเลข i ในแต่ละรอบ", "Write Countdown to return 321 by looping i from 1 to 3 and deferring an append of i each round"),
            tests,
            unit(go`func Countdown() (s string) {
	return ""
}`),
            testFile(go`func TestCountdown(t *testing.T) {
	if Countdown() != "321" {
		t.Fatal("countdown")
	}
}`),
          ),
          "ใน defer ใช้ s += fmt.Sprint(i) ตัวที่ลงทะเบียนตอน i เป็น 3 ทำงานก่อน",
          "Inside the defer, use s += fmt.Sprint(i). The one registered when i is 3 runs first",
        ),
        unit(go`import "fmt"

func Countdown() (s string) {
	for i := 1; i <= 3; i++ {
		defer func() { s += fmt.Sprint(i) }()
	}
	return ""
}`),
      ),
    ],
  }),
  lesson({
    id: "b11-panic",
    level: "beginner",
    title: text("panic และ recover", "panic and recover"),
    goal: text("แยกให้ออกว่าเมื่อไรใช้ error เมื่อไรเกิด panic และกู้โปรแกรมด้วย recover", "Tell when to use an error and when a panic happens, and recover from a panic"),
    exercises: [
      solved(
        withHint(
          panicEx(
            say("easy", "เขียนโปรแกรมที่เรียก panic ด้วยข้อความ boom", "Write a program that calls panic with the message boom"),
            { th: "โปรแกรมต้อง panic และข้อความ panic ต้องมีคำว่า boom", en: "The program must panic, and the panic message must contain boom" },
            main,
            "boom",
          ),
          "ใน main เขียน panic(\"boom\")",
          "Write panic(\"boom\") in main",
        ),
        program(`\tfmt.Println("before")\n\tpanic("boom")`),
      ),
      solved(
        withHint(
          testEx(
            say("mid", "เขียน Safe ให้ panic แล้ว recover ใน defer และคืน true", "Write Safe to panic, recover inside defer, and return true"),
            tests,
            unit(go`func Safe() (recovered bool) {
	return false
}`),
            testFile(go`func TestSafe(t *testing.T) {
	if !Safe() {
		t.Fatal("recover")
	}
}`),
          ),
          "วาง defer ที่เรียก recover และตั้ง recovered = true ไว้ก่อน แล้วจึงเรียก panic",
          "Register a defer that calls recover and sets recovered = true first, then call panic",
        ),
        unit(go`func Safe() (recovered bool) {
	defer func() {
		if recover() != nil {
			recovered = true
		}
	}()
	panic("boom")
}`),
      ),
      solved(
        withHint(
          testEx(
            say("hard", "เขียน SafeDiv ให้คืน a / b และถ้าการหารทำให้ panic (b เป็น 0) ให้ใช้ recover แล้วคืน error แทน", "Write SafeDiv to return a / b. If the division panics (b is 0), use recover and return an error instead"),
            tests,
            unit(go`func SafeDiv(a, b int) (q int, err error) {
	return a / b, nil
}`),
            testFile(go`func TestSafeDiv(t *testing.T) {
	if q, err := SafeDiv(6, 3); err != nil || q != 2 {
		t.Fatalf("SafeDiv(6, 3) = %d, %v", q, err)
	}
	if _, err := SafeDiv(1, 0); err == nil {
		t.Fatal("SafeDiv(1, 0) must return an error")
	}
}`),
          ),
          "ใน defer ถ้า r := recover() ไม่เป็น nil ให้ตั้ง err = fmt.Errorf(\"divide: %v\", r) ค่าคืนแบบมีชื่อ (q, err) ทำให้ defer แก้ผลได้",
          "In the defer, if r := recover() is not nil, set err = fmt.Errorf(\"divide: %v\", r). Named results (q, err) let the defer change the result",
        ),
        unit(go`import "fmt"

func SafeDiv(a, b int) (q int, err error) {
	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("divide: %v", r)
		}
	}()
	return a / b, nil
}`),
      ),
      pick(
        "twist",
        "เหตุการณ์ไหนควรคืน error มากกว่า panic",
        "Which situation should return an error rather than panic?",
        text("ข้อมูลผิดจากผู้ใช้เป็นเรื่องที่คาดไว้ได้ จึงคืน error ให้ผู้เรียกจัดการ ส่วน panic ใช้กับบั๊กที่ไม่ควรเกิด", "Bad input from a user is expected, so return an error for the caller to handle. panic is for bugs that should never happen"),
        {
          th: ["ผู้ใช้กรอกอายุเป็นตัวอักษร", "โค้ดอ่าน slice เกินขนาดเพราะเขียนลูปผิด", "โปรแกรมเริ่มทำงานไม่ได้เพราะค่าคงที่ในโค้ดผิด", "ไม่มีข้อไหนควรคืน error"],
          en: ["A user types letters for their age", "Code reads past the end of a slice because of a loop bug", "The program cannot start because a constant in the code is wrong", "None of these should return an error"],
        },
        0,
      ),
    ],
  }),
];
