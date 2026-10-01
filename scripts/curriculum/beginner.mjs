import { copy, exact, lesson, stdout, testEx, tests, text, withHint } from "./helpers.mjs";

const main = 'package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("todo")\n}\n';

function say(id, th, en) {
  return { id, th, en };
}

export const beginner = [
  lesson({
    id: "b01-hello",
    level: "beginner",
    order: 1,
    title: text("โปรแกรมแรกและ toolchain", "First program and the toolchain"),
    goal: text("เขียน package main แล้วรันด้วย Go 1.25", "Write package main and run it with Go 1.25"),
    copy: copy(
      [
        "โปรแกรม Go เริ่มที่ package main และฟังก์ชัน main\n\n```\npackage main\n\nfunc main() {}\n```\n\nคำสั่ง go run คอมไพล์แล้วรันแพ็กเกจในโฟลเดอร์นั้น โมดูลขั้นต่ำมีไฟล์ go.mod ที่บอกชื่อโมดูลกับรุ่นภาษา Go 1.25",
        "ใช้เป็นจุดเริ่มของเครื่องมือบรรทัดคำสั่งและของ service ที่รันค้าง",
        "พิมพ์คำเดียวหนึ่งบรรทัด",
        "พิมพ์สองบรรทัดหรือประกอบข้อความจากค่าที่คำนวณ",
        ["เปิดไฟล์ main.go", "ตรวจ package main", "รันโปรแกรม", "อ่าน stdout"],
      ],
      [
        "A Go program starts at package main and func main.\n\n```\npackage main\n\nfunc main() {}\n```\n\ngo run compiles and runs the package in that folder. A minimal module has go.mod with a module path and the Go 1.25 language version.",
        "Use it as the entry point of a command-line tool or a long-running service.",
        "Print one word on one line.",
        "Print two lines, or build a line from a calculated value.",
        ["Open main.go", "Check package main", "Run the program", "Read stdout"],
      ],
    ),
    exercises: [
      stdout(say("easy", "พิมพ์ hello", "Print hello"), exact, main, "hello\n"),
      stdout(say("mid", "พิมพ์สองบรรทัด go แล้ว 1.25", "Print go and then 1.25 on separate lines"), exact, main, "go\n1.25\n"),
      stdout(say("hard", "พิมพ์ sum=3 จาก 1+2", "Print sum=3 from 1+2"), exact, main, "sum=3\n"),
      withHint(stdout(say("twist", "ต่อข้อความ go กับ 1.25 ด้วยขีดกลาง แล้วพิมพ์บรรทัดเดียว", "Join the text go and 1.25 with a hyphen and print one line"), exact, main, "go-1.25\n"), "ต่อข้อความสองค่าด้วยขีดกลาง แล้วพิมพ์บรรทัดเดียว", "Join two text values with a hyphen and print one line"),
    ],
  }),
  lesson({
    id: "b02-variables",
    level: "beginner",
    order: 2,
    title: text("ตัวแปรและ zero value", "Variables and zero values"),
    goal: text("ประกาศตัวแปรและคาด zero value ได้", "Declare variables and predict zero values"),
    copy: copy(
      [
        "var ประกาศตัวแปรโดยไม่กำหนดค่า จะได้ zero value: int เป็น 0, string เป็นว่าง, bool เป็น false\n\n```\nvar count int\nfmt.Println(count)\n```\n\n:= ประกาศพร้อมค่าเริ่มและให้คอมไพเลอร์อนุมานชนิด",
        "ใช้ตอนอ่าน config ที่ยังไม่ถูกตั้ง และตอนออกแบบ struct ที่ฟิลด์ว่างต้องมีความหมายชัด",
        "พิมพ์ zero value ของ int",
        "พิมพ์ค่าจากตัวแปร string หรือ zero value ของ bool",
        ["ประกาศตัวแปร", "อย่าใส่ค่าเริ่มถ้าต้องการ zero value", "พิมพ์ค่า", "เทียบกับที่โจทย์ขอ"],
      ],
      [
        "var declares a variable with no explicit value, so it receives the zero value: 0 for int, empty for string, false for bool.\n\n```\nvar count int\nfmt.Println(count)\n```\n\n:= declares and infers the type from the initial value.",
        "Use this when reading unset config and when an empty struct field must have an obvious meaning.",
        "Print the zero value of an int.",
        "Print a string variable, or the zero value of a bool.",
        ["Declare the variable", "Leave it unset when you want the zero value", "Print it", "Match the required text"],
      ],
    ),
    exercises: [
      stdout(say("easy", "พิมพ์ zero value ของ int", "Print the zero value of an int"), exact, main, "0\n"),
      stdout(say("mid", "เก็บ go ไว้ในตัวแปร string แล้วพิมพ์", "Store go in a string variable and print it"), exact, main, "go\n"),
      stdout(say("hard", "พิมพ์ zero value ของ bool", "Print the zero value of a bool"), exact, main, "false\n"),
      withHint(stdout(say("twist", "พิมพ์ zero value ของ int ติดกับสตริง go เป็น 0go", "Print the zero value of an int next to the string go as 0go"), exact, main, "0go\n"), "พิมพ์ตัวเลขศูนย์กับสตริงในบรรทัดเดียวกัน", "Print the zero and the string on the same line"),
    ],
  }),
  lesson({
    id: "b03-control-flow",
    level: "beginner",
    order: 3,
    title: text("ตัวดำเนินการและ control flow", "Operators and control flow"),
    goal: text("ใช้ if, for และ switch", "Use if, for, and switch"),
    copy: copy(
      [
        "if ไม่มีวงเล็บรอบเงื่อนไข for เป็นได้ทั้งลูปและ while switch เทียบค่าแล้วจบเคสเองโดยไม่ fall through\n\n```\nif score >= 80 {\n\tfmt.Println(\"pass\")\n}\n```",
        "ใช้ตัดสินใจใน handler, กรองรายการ, และแปลงรหัสสถานะเป็นข้อความ",
        "เงื่อนไขเดียวที่พิมพ์ pass",
        "ลูปประกอบข้อความ หรือ switch ที่เลือกชื่อวัน",
        ["เลือก if, for หรือ switch", "ใส่ค่าที่โจทย์กำหนด", "พิมพ์ผล", "อย่าพิมพ์ข้อความส่วนเกิน"],
      ],
      [
        "if has no parentheses around the condition. for is both the counted loop and the while loop. switch matches a value and does not fall through.\n\n```\nif score >= 80 {\n\tfmt.Println(\"pass\")\n}\n```",
        "Use it to branch in a handler, filter a list, or map a status code to text.",
        "One condition that prints pass.",
        "A loop that builds text, or a switch that picks a weekday name.",
        ["Choose if, for, or switch", "Use the value from the prompt", "Print the result", "Do not print extra text"],
      ],
    ),
    exercises: [
      stdout(say("easy", "ให้ score เป็น 80 แล้วพิมพ์ pass เมื่อ score >= 80", "Set score to 80 and print pass when score >= 80"), exact, main, "pass\n"),
      stdout(say("mid", "พิมพ์ 123 โดยไม่มีช่องว่าง จากลูป 1 ถึง 3", "Print 123 with no spaces from a loop over 1 through 3"), exact, main, "123\n"),
      stdout(say("hard", "ให้ day เป็น 1 แล้ว switch พิมพ์ monday", "Set day to 1 and switch to print monday"), exact, main, "monday\n"),
      withHint(stdout(say("twist", "วนจาก 3 ลงมา 1 แล้วพิมพ์ 321 โดยไม่มีช่องว่าง", "Loop from 3 down to 1 and print 321 with no spaces"), exact, main, "321\n"), "ให้ลูปนับถอยหลัง และใช้ Print เพื่อไม่เว้นบรรทัด", "Count downward and use Print so the digits stay on one line"),
    ],
  }),
  lesson({
    id: "b04-functions",
    level: "beginner",
    order: 4,
    title: text("ฟังก์ชันและค่าคืนหลายตัว", "Functions and multiple results"),
    goal: text("เขียนฟังก์ชันที่คืนค่ากับ error แล้วเรียกใช้", "Write a function that returns a value and an error, then call it"),
    copy: copy(
      [
        "ฟังก์ชันคืนได้หลายค่า คู่ที่พบบ่อยคือผลลัพธ์กับ error ผู้เรียกต้องตรวจ error ก่อนใช้ผล\n\n```\nfunc add(a, b int) int {\n\treturn a + b\n}\n```",
        "ใช้แยกงานคำนวณออกจาก main เพื่อให้ทดสอบและเรียกซ้ำได้",
        "ฟังก์ชันบวกเลขสองตัวแล้วพิมพ์ผล",
        "ฟังก์ชันหารที่คืน error เมื่อตัวหารเป็นศูนย์",
        ["เขียนฟังก์ชันนอก main", "เรียกจาก main", "ตรวจ error ถ้ามี", "พิมพ์เฉพาะผลที่โจทย์ขอ"],
      ],
      [
        "A function can return multiple values. The common pair is a result and an error. The caller checks the error before using the result.\n\n```\nfunc add(a, b int) int {\n\treturn a + b\n}\n```",
        "Use it to move calculation out of main so the same work can be tested and reused.",
        "A function adds two numbers and main prints the result.",
        "A division function returns an error when the divisor is zero.",
        ["Write the function outside main", "Call it from main", "Check the error when there is one", "Print only the required text"],
      ],
    ),
    exercises: [
      stdout(say("easy", "เขียน add แล้วพิมพ์ผลของ add(2, 3)", "Write add and print the result of add(2, 3)"), exact, main, "5\n"),
      stdout(say("mid", "เขียน div ที่คืน int กับ error แล้วพิมพ์ผลของ 4/2", "Write div that returns an int and an error, then print the result of 4/2"), exact, main, "2\n"),
      stdout(say("hard", "เมื่อหารด้วยศูนย์ให้พิมพ์ error", "When dividing by zero, print error"), exact, main, "error\n"),
      withHint(stdout(say("twist", "เขียน clamp แล้วพิมพ์ผลของ clamp(10, 0, 3)", "Write clamp and print the result of clamp(10, 0, 3)"), exact, main, "3\n"), "ถ้าค่าสูงกว่าเพดานให้คืนเพดาน ถ้าต่ำกว่าพื้นให้คืนพื้น", "Return the ceiling when the value is above it, and the floor when it is below"),
    ],
  }),
  lesson({
    id: "b05-collections",
    level: "beginner",
    order: 5,
    title: text("slice และ map", "Slices and maps"),
    goal: text("เลือก slice หรือ map ให้ตรงงาน", "Pick a slice or a map for the job"),
    copy: copy(
      [
        "array มีความยาวคงที่ slice มองเห็นช่วงของ array และขยายได้ map เก็บค่าตามคีย์ การอ่าน slice เกินขอบเขตทำให้ panic\n\n```\nitems := []int{1, 2, 3}\nfmt.Println(items[0])\n```",
        "ใช้ slice เมื่อลำดับสำคัญ และใช้ map เมื่อค้นด้วยคีย์ เช่น นับคำหรือหารายการตามรหัส",
        "รวมตัวเลขใน slice รวม slice ว่างด้วย",
        "นับจำนวนครั้งของค่า หรือคืนตัวสุดท้ายอย่างปลอดภัย",
        ["เลือกชนิดข้อมูล", "เดิน slice ด้วย range", "กัน slice ว่าง", "คืนค่าที่เทสต์เรียก"],
      ],
      [
        "An array has a fixed length. A slice views a range of an array and can grow. A map stores values by key. Reading past the end of a slice panics.\n\n```\nitems := []int{1, 2, 3}\nfmt.Println(items[0])\n```",
        "Use a slice when order matters and a map when you look up by key, such as counting words or finding a record by id.",
        "Sum the numbers in a slice, including an empty slice.",
        "Count how often a value appears, or return the last element safely.",
        ["Choose the collection", "Walk the slice with range", "Guard the empty slice", "Return the value the test calls"],
      ],
    ),
    exercises: [
      testEx(say("easy", "เขียน Sum ให้รวมตัวเลข และคืน 0 เมื่อ slice ว่าง", "Write Sum to add the numbers and return 0 for an empty slice"), tests, 'package main\n\nfunc Sum(values []int) int {\n\treturn 0\n}\n', 'package main\n\nimport "testing"\n\nfunc TestSum(t *testing.T) {\n\tif Sum([]int{1, 2, 3}) != 6 {\n\t\tt.Fatal("sum")\n\t}\n\tif Sum(nil) != 0 {\n\t\tt.Fatal("empty")\n\t}\n}\n'),
      testEx(say("mid", "เขียน Count ให้นับว่าค่า target โผล่กี่ครั้ง", "Write Count to count how often target appears"), tests, 'package main\n\nfunc Count(values []int, target int) int {\n\treturn 0\n}\n', 'package main\n\nimport "testing"\n\nfunc TestCount(t *testing.T) {\n\tif Count([]int{1, 2, 1}, 1) != 2 {\n\t\tt.Fatal("count")\n\t}\n\tif Count(nil, 1) != 0 {\n\t\tt.Fatal("empty")\n\t}\n}\n'),
      testEx(say("hard", "เขียน Last ให้คืนตัวสุดท้าย และคืน 0 เมื่อว่าง", "Write Last to return the last item, or 0 when empty"), tests, 'package main\n\nfunc Last(values []int) int {\n\treturn 0\n}\n', 'package main\n\nimport "testing"\n\nfunc TestLast(t *testing.T) {\n\tif Last([]int{4, 5, 6}) != 6 {\n\t\tt.Fatal("last")\n\t}\n\tif Last(nil) != 0 {\n\t\tt.Fatal("empty")\n\t}\n}\n'),
      withHint(testEx(say("twist", "เขียน Index ให้คืนตำแหน่งแรกของค่า หรือ -1 เมื่อไม่มี", "Write Index to return the first position of the value, or -1 when it is missing"), tests, 'package main\n\nfunc Index(values []int, target int) int {\n\treturn 0\n}\n', 'package main\n\nimport "testing"\n\nfunc TestIndex(t *testing.T) {\n\tif Index([]int{4, 5, 4}, 4) != 0 {\n\t\tt.Fatal("first")\n\t}\n\tif Index([]int{1, 2}, 9) != -1 {\n\t\tt.Fatal("missing")\n\t}\n\tif Index(nil, 1) != -1 {\n\t\tt.Fatal("empty")\n\t}\n}\n'), "เดิน slice จนเจอค่า ถ้าไม่เจอหรือว่างให้คืน -1", "Walk the slice until you find the value. Return -1 when it is missing or the slice is empty"),
    ],
  }),
  lesson({
    id: "b06-structs",
    level: "beginner",
    order: 6,
    title: text("struct และ method", "Structs and methods"),
    goal: text("รวมข้อมูลเป็น struct และผูก method", "Group data in a struct and attach methods"),
    copy: copy(
      [
        "struct รวมฟิลด์ที่เกี่ยวข้อง method คือฟังก์ชันที่มี receiver ถ้า receiver เป็น pointer การแก้ฟิลด์จะเห็นนอกฟังก์ชัน\n\n```\ntype Rect struct {\n\tW int\n\tH int\n}\n```",
        "ใช้แทนกลุ่มค่าที่ส่งกันทั้งก้อน เช่น ขนาดรูป หรือผู้ใช้ที่มีชื่อ",
        "คำนวณพื้นที่จาก struct",
        "method ที่เปลี่ยนฟิลด์ หรือเปลี่ยนชื่อ",
        ["ประกาศ struct", "ส่งค่าหรือ pointer ให้ตรงว่าต้องแก้ฟิลด์ไหม", "เขียน method", "ให้เทสต์เรียกชื่อที่กำหนด"],
      ],
      [
        "A struct groups related fields. A method is a function with a receiver. A pointer receiver makes field changes visible to the caller.\n\n```\ntype Rect struct {\n\tW int\n\tH int\n}\n```",
        "Use it instead of passing a loose group of values, such as a size or a user name.",
        "Calculate an area from a struct.",
        "A method that changes a field, or renames a value.",
        ["Declare the struct", "Pass a value or a pointer depending on whether you mutate", "Write the method", "Use the name the test calls"],
      ],
    ),
    exercises: [
      testEx(say("easy", "เขียน Area ให้คืน W*H ของ Rect", "Write Area to return W*H of a Rect"), tests, 'package main\n\ntype Rect struct {\n\tW int\n\tH int\n}\n\nfunc Area(r Rect) int {\n\treturn 0\n}\n', 'package main\n\nimport "testing"\n\nfunc TestArea(t *testing.T) {\n\tif Area(Rect{W: 2, H: 3}) != 6 {\n\t\tt.Fatal("area")\n\t}\n}\n'),
      testEx(say("mid", "เขียน method Grow บน *Rect ให้บวก n ทั้ง W และ H", "Write Grow on *Rect to add n to both W and H"), tests, 'package main\n\ntype Rect struct {\n\tW int\n\tH int\n}\n\nfunc (r *Rect) Grow(n int) {\n}\n', 'package main\n\nimport "testing"\n\nfunc TestGrow(t *testing.T) {\n\tr := Rect{W: 2, H: 3}\n\tr.Grow(1)\n\tif r.W != 3 || r.H != 4 {\n\t\tt.Fatal("grow")\n\t}\n}\n'),
      testEx(say("hard", "เขียน Rename บน *User ให้เปลี่ยน Name", "Write Rename on *User to change Name"), tests, 'package main\n\ntype User struct {\n\tName string\n}\n\nfunc (u *User) Rename(name string) {\n}\n', 'package main\n\nimport "testing"\n\nfunc TestRename(t *testing.T) {\n\tu := User{Name: "old"}\n\tu.Rename("ada")\n\tif u.Name != "ada" {\n\t\tt.Fatal("name")\n\t}\n}\n'),
      withHint(testEx(say("twist", "เขียน Shrink บน *Rect ให้ลบ n จาก W และ H แต่ไม่ต่ำกว่า 0", "Write Shrink on *Rect to subtract n from W and H, but not below 0"), tests, 'package main\n\ntype Rect struct {\n\tW int\n\tH int\n}\n\nfunc (r *Rect) Shrink(n int) {\n}\n', 'package main\n\nimport "testing"\n\nfunc TestShrink(t *testing.T) {\n\tr := Rect{W: 2, H: 3}\n\tr.Shrink(1)\n\tif r.W != 1 || r.H != 2 {\n\t\tt.Fatal("shrink")\n\t}\n\tsmall := Rect{W: 1, H: 1}\n\tsmall.Shrink(5)\n\tif small.W != 0 || small.H != 0 {\n\t\tt.Fatal("floor")\n\t}\n}\n'), "ลบ n ออกจากทั้งสองฟิลด์ แล้วกันไม่ให้ติดลบ", "Subtract n from both fields and keep them from going below zero"),
    ],
  }),
  lesson({
    id: "b07-pointers",
    level: "beginner",
    order: 7,
    title: text("pointer", "Pointers"),
    goal: text("แยกการก็อปค่าออกจากการแก้ค่าผ่าน pointer", "Tell a copied value from a value changed through a pointer"),
    copy: copy(
      [
        "การส่ง struct หรือ int เข้าฟังก์ชันคือการก็อป pointer ชี้ไปที่ค่าเดิม การแก้ผ่าน *n จึงเห็นนอกฟังก์ชัน\n\n```\nfunc Inc(n *int) {\n\t*n++\n}\n```",
        "ใช้เมื่อต้องแก้ค่าของผู้เรียก เช่น เพิ่มตัวนับ สลับสองค่า หรือตั้งชื่อใน struct",
        "เพิ่มค่าผ่าน pointer",
        "สลับสองค่า หรือตั้งฟิลด์ผ่าน pointer",
        ["ใส่ * ที่ชนิดพารามิเตอร์", "ใช้ & ตอนส่งที่อยู่", "อย่าลืมตรวจ nil ถ้าผู้เรียกส่งได้", "แก้ค่าแล้วคืนให้ผู้เรียกเห็น"],
      ],
      [
        "Passing a struct or an int copies it. A pointer refers to the original value, so a write through *n is visible to the caller.\n\n```\nfunc Inc(n *int) {\n\t*n++\n}\n```",
        "Use it when the caller must observe the change, such as a counter, a swap, or a renamed field.",
        "Increment through a pointer.",
        "Swap two values, or set a field through a pointer.",
        ["Put * on the parameter type", "Pass the address with &", "Check nil when the caller may pass it", "Write the value the caller can see"],
      ],
    ),
    exercises: [
      testEx(say("easy", "เขียน Inc ให้เพิ่มค่าที่ pointer ชี้อยู่หนึ่ง", "Write Inc to add one to the pointed-to value"), tests, 'package main\n\nfunc Inc(n *int) {\n}\n', 'package main\n\nimport "testing"\n\nfunc TestInc(t *testing.T) {\n\tn := 1\n\tInc(&n)\n\tif n != 2 {\n\t\tt.Fatal("inc")\n\t}\n}\n'),
      testEx(say("mid", "เขียน Swap ให้สลับค่าของสอง pointer", "Write Swap to exchange the values of two pointers"), tests, 'package main\n\nfunc Swap(a, b *int) {\n}\n', 'package main\n\nimport "testing"\n\nfunc TestSwap(t *testing.T) {\n\ta, b := 1, 2\n\tSwap(&a, &b)\n\tif a != 2 || b != 1 {\n\t\tt.Fatal("swap")\n\t}\n}\n'),
      testEx(say("hard", "เขียน SetName ให้ตั้ง Name ผ่าน pointer", "Write SetName to set Name through a pointer"), tests, 'package main\n\ntype User struct {\n\tName string\n}\n\nfunc SetName(u *User, name string) {\n}\n', 'package main\n\nimport "testing"\n\nfunc TestSetName(t *testing.T) {\n\tu := User{}\n\tSetName(&u, "ada")\n\tif u.Name != "ada" {\n\t\tt.Fatal("name")\n\t}\n}\n'),
      withHint(testEx(say("twist", "เขียน Add ให้บวก delta ผ่าน pointer รวมกรณีที่ delta ติดลบ", "Write Add to add delta through a pointer, including a negative delta"), tests, 'package main\n\nfunc Add(n *int, delta int) {\n}\n', 'package main\n\nimport "testing"\n\nfunc TestAdd(t *testing.T) {\n\tn := 5\n\tAdd(&n, -2)\n\tif n != 3 {\n\t\tt.Fatal("down")\n\t}\n\tAdd(&n, 4)\n\tif n != 7 {\n\t\tt.Fatal("up")\n\t}\n}\n'), "บวก delta เข้าค่าที่ pointer ชี้อยู่ delta ติดลบได้", "Add delta through the pointer. Delta may be negative"),
    ],
  }),
  lesson({
    id: "b08-errors",
    level: "beginner",
    order: 8,
    title: text("error พื้นฐาน", "Basic errors"),
    goal: text("คืน error และหยุดเมื่อทำงานไม่สำเร็จ", "Return an error and stop when the work failed"),
    copy: copy(
      [
        "error เป็น interface ค่า nil แปลว่าสำเร็จ ฟังก์ชันที่อาจพลาดควรคืน error และผู้เรียกต้องตรวจก่อนใช้ผลลัพธ์\n\n```\nif b == 0 {\n\treturn 0, errors.New(\"divide by zero\")\n}\n```",
        "ใช้กับงานที่ input ผิดได้ เช่น หารด้วยศูนย์ แปลงข้อความเป็นจำนวนบวก หรือตรวจว่ามีค่า",
        "หารแล้วคืน error เมื่อตัวหารเป็นศูนย์",
        "แปลงเลขบวก หรือปฏิเสธสตริงว่าง",
        ["คืน error เมื่อเงื่อนไขพัง", "คืน nil เมื่อสำเร็จ", "อย่าคืนผลลัพธ์ที่น่าเชื่อถือคู่กับ error", "ให้เทสต์ตรวจทั้งสองทาง"],
      ],
      [
        "error is an interface. nil means success. A function that can fail should return an error, and the caller checks it before using the result.\n\n```\nif b == 0 {\n\treturn 0, errors.New(\"divide by zero\")\n}\n```",
        "Use it for bad input, such as division by zero, parsing a positive number, or requiring a non-empty value.",
        "Divide and return an error when the divisor is zero.",
        "Parse a positive number, or reject an empty string.",
        ["Return an error when the condition fails", "Return nil on success", "Do not pair a trusted result with an error", "Let the test cover both paths"],
      ],
    ),
    exercises: [
      testEx(say("easy", "เขียน Div ให้คืน error เมื่อ b เป็น 0 และคืน a/b เมื่อสำเร็จ", "Write Div to return an error when b is 0 and a/b on success"), tests, 'package main\n\nfunc Div(a, b int) (int, error) {\n\treturn 0, nil\n}\n', 'package main\n\nimport "testing"\n\nfunc TestDiv(t *testing.T) {\n\tgot, err := Div(4, 2)\n\tif err != nil || got != 2 {\n\t\tt.Fatal("ok")\n\t}\n\tif _, err = Div(1, 0); err == nil {\n\t\tt.Fatal("zero")\n\t}\n}\n'),
      testEx(say("mid", "เขียน ParsePositive ให้รับสตริงที่เป็นจำนวนมากกว่า 0", "Write ParsePositive to accept a string that is a number greater than 0"), tests, 'package main\n\nfunc ParsePositive(s string) (int, error) {\n\treturn 0, nil\n}\n', 'package main\n\nimport "testing"\n\nfunc TestParsePositive(t *testing.T) {\n\tgot, err := ParsePositive("3")\n\tif err != nil || got != 3 {\n\t\tt.Fatal("ok")\n\t}\n\tif _, err = ParsePositive("0"); err == nil {\n\t\tt.Fatal("zero")\n\t}\n\tif _, err = ParsePositive("no"); err == nil {\n\t\tt.Fatal("text")\n\t}\n}\n'),
      testEx(say("hard", "เขียน MustHave ให้คืน error เมื่อสตริงว่าง", "Write MustHave to return an error for an empty string"), tests, 'package main\n\nfunc MustHave(s string) error {\n\treturn nil\n}\n', 'package main\n\nimport "testing"\n\nfunc TestMustHave(t *testing.T) {\n\tif err := MustHave("go"); err != nil {\n\t\tt.Fatal("ok")\n\t}\n\tif err := MustHave(""); err == nil {\n\t\tt.Fatal("empty")\n\t}\n}\n'),
      withHint(testEx(say("twist", "เขียน Between ให้คืน error เมื่อค่านอกช่วงปิด และคืนตัวเลขเมื่ออยู่ในช่วง", "Write Between to return an error when the value is outside the closed range, and the number when it is inside"), tests, 'package main\n\nfunc Between(n, low, high int) (int, error) {\n\treturn 0, nil\n}\n', 'package main\n\nimport "testing"\n\nfunc TestBetween(t *testing.T) {\n\tgot, err := Between(5, 1, 10)\n\tif err != nil || got != 5 {\n\t\tt.Fatal("inside")\n\t}\n\tif _, err = Between(0, 1, 10); err == nil {\n\t\tt.Fatal("below")\n\t}\n\tgot, err = Between(10, 1, 10)\n\tif err != nil || got != 10 {\n\t\tt.Fatal("edge")\n\t}\n}\n'), "คืน error เมื่อค่าต่ำกว่า low หรือสูงกว่า high และคืนตัวเลขเมื่ออยู่ในช่วง", "Return an error when the value is below low or above high, and return the number when it is inside"),
    ],
  }),
  lesson({
    id: "b09-packages",
    level: "beginner",
    order: 9,
    title: text("package และ go.mod", "Packages and go.mod"),
    goal: text("จัดฟังก์ชันใน package เดียวกันให้นำไปเรียกต่อได้", "Organize functions in one package so callers can use them"),
    copy: copy(
      [
        "ไฟล์ในโฟลเดอร์เดียวกันที่เป็น package เดียวกันประกอบกันเป็นหนึ่ง package go.mod บอกขอบเขตของโมดูล แบบฝึกนี้ยังอยู่ใน package main ไฟล์เดียว เพราะ runner รับซอร์สเดียว แต่หลักคือแยกฟังก์ชันให้ชื่อขึ้นต้นด้วยตัวใหญ่เมื่อจะให้คนนอก package เรียก\n\n```\nfunc Greet(name string) string {\n\treturn \"hello \" + name\n}\n```",
        "ใช้ตอนแยก helper ออกจาก main เพื่อให้ package อื่นในโมดูลเดียวกันเรียกได้",
        "ทักทายด้วยชื่อ",
        "ต่อสตริง หรือคืนรุ่นภาษา",
        ["ตั้งชื่อที่ขึ้นต้นด้วยตัวใหญ่", "เก็บไว้ใน package main ไฟล์นี้", "อย่าพึ่งพาโมดูลภายนอก", "ให้เทสต์เรียกชื่อนั้น"],
      ],
      [
        "Files in one folder with the same package name form one package. go.mod marks the module boundary. This exercise stays in one package main file because the runner accepts one source blob. The rule is still to export a name with a capital letter when another package should call it.\n\n```\nfunc Greet(name string) string {\n\treturn \"hello \" + name\n}\n```",
        "Use it when a helper should leave main so the rest of the module can call it.",
        "Greet someone by name.",
        "Join strings, or return the language version.",
        ["Start the name with a capital letter", "Keep it in this package main file", "Do not import an outside module", "Use the name the test calls"],
      ],
    ),
    exercises: [
      testEx(say("easy", "เขียน Greet ให้คืน hello ตามด้วยช่องว่างและชื่อ", "Write Greet to return hello, a space, and the name"), tests, 'package main\n\nfunc Greet(name string) string {\n\treturn ""\n}\n', 'package main\n\nimport "testing"\n\nfunc TestGreet(t *testing.T) {\n\tif Greet("ada") != "hello ada" {\n\t\tt.Fatal("greet")\n\t}\n}\n'),
      testEx(say("mid", "เขียน Join ให้ต่อ a กับ b ด้วยจุลภาค", "Write Join to join a and b with a comma"), tests, 'package main\n\nfunc Join(a, b string) string {\n\treturn ""\n}\n', 'package main\n\nimport "testing"\n\nfunc TestJoin(t *testing.T) {\n\tif Join("a", "b") != "a,b" {\n\t\tt.Fatal("join")\n\t}\n}\n'),
      testEx(say("hard", "เขียน Version ให้คืน 1.25", "Write Version to return 1.25"), tests, 'package main\n\nfunc Version() string {\n\treturn ""\n}\n', 'package main\n\nimport "testing"\n\nfunc TestVersion(t *testing.T) {\n\tif Version() != "1.25" {\n\t\tt.Fatal("version")\n\t}\n}\n'),
      withHint(testEx(say("twist", "เขียน Label ให้คืนภาษา เว้นวรรค แล้วรุ่น เช่น go 1.25", "Write Label to return the language, a space, then the version, such as go 1.25"), tests, 'package main\n\nfunc Label(lang, version string) string {\n\treturn ""\n}\n', 'package main\n\nimport "testing"\n\nfunc TestLabel(t *testing.T) {\n\tif Label("go", "1.25") != "go 1.25" {\n\t\tt.Fatal("go")\n\t}\n\tif Label("a", "b") != "a b" {\n\t\tt.Fatal("pair")\n\t}\n}\n'), "คืนภาษา เว้นวรรค แล้วรุ่น", "Return the language, a space, then the version"),
    ],
  }),
  lesson({
    id: "b10-defer",
    level: "beginner",
    order: 10,
    title: text("defer, panic และ recover", "defer, panic, and recover"),
    goal: text("ใช้ defer ปิดงาน และรู้ว่า panic ไม่ใช่ทางจัดการ error ปกติ", "Use defer to finish work, and know panic is not the normal error path"),
    copy: copy(
      [
        "defer เลื่อนการเรียกไว้ตอนฟังก์ชันคืน ลำดับคือย้อนหลังจากที่ defer ทีหลังสุด ถ้าใช้ named return ค่าที่ defer แก้จะถูกส่งออกไป panic หยุดการทำงานทั้งก้อน recover ใช้ได้ใน defer เท่านั้น และไม่ควรแทน error ปกติ\n\n```\nfunc Order() (s string) {\n\tdefer func() { s += \"b\" }()\n\ts = \"a\"\n\treturn\n}\n```",
        "ใช้ปิดไฟล์หรือปลดล็อก และใช้ recover เฉพาะขอบของโปรแกรมที่ต้องไม่ล่มทั้งก้อน",
        "เรียงข้อความด้วย defer",
        "นับครั้งที่ปิด หรือจับ panic",
        ["วาง defer ก่อนจุดที่อาจคืน", "ใช้ named return ถ้าต้องแก้ค่าที่คืน", "เรียก recover ใน defer", "อย่าใช้ panic แทน error ธรรมดา"],
      ],
      [
        "defer runs when the function returns, in reverse order. With a named result, a deferred function can still change the returned value. panic stops the process unless recover runs inside a deferred function. panic is not the normal way to report a mistake.\n\n```\nfunc Order() (s string) {\n\tdefer func() { s += \"b\" }()\n\ts = \"a\"\n\treturn\n}\n```",
        "Use it to close a file or unlock, and use recover only at a boundary that must keep the process alive.",
        "Build a string with defer.",
        "Count a close, or catch a panic.",
        ["Place defer before the return point", "Use a named result if you must change it", "Call recover inside defer", "Do not replace an ordinary error with panic"],
      ],
    ),
    exercises: [
      testEx(say("easy", "เขียน Order ให้คืน ab โดยใช้ defer เติม b", "Write Order to return ab by appending b in defer"), tests, 'package main\n\nfunc Order() (s string) {\n\treturn ""\n}\n', 'package main\n\nimport "testing"\n\nfunc TestOrder(t *testing.T) {\n\tif Order() != "ab" {\n\t\tt.Fatal("order")\n\t}\n}\n'),
      testEx(say("mid", "เขียน Closed ให้คืน 1 โดยเพิ่มตัวนับใน defer ผ่าน named return", "Write Closed to return 1 by incrementing a named result in defer"), tests, 'package main\n\nfunc Closed() (n int) {\n\treturn 0\n}\n', 'package main\n\nimport "testing"\n\nfunc TestClosed(t *testing.T) {\n\tif Closed() != 1 {\n\t\tt.Fatal("closed")\n\t}\n}\n'),
      testEx(say("hard", "เขียน Safe ให้ panic แล้ว recover ใน defer และคืน true", "Write Safe to panic, recover inside defer, and return true"), tests, 'package main\n\nfunc Safe() (recovered bool) {\n\treturn false\n}\n', 'package main\n\nimport "testing"\n\nfunc TestSafe(t *testing.T) {\n\tif !Safe() {\n\t\tt.Fatal("recover")\n\t}\n}\n'),
      withHint(testEx(say("twist", "เขียน Mark ให้ใช้ defer สองตัวเติมตัวอักษร แล้วคืน abc", "Write Mark to use two defers to append letters and return abc"), tests, 'package main\n\nfunc Mark() (s string) {\n\treturn ""\n}\n', 'package main\n\nimport "testing"\n\nfunc TestMark(t *testing.T) {\n\tif Mark() != "abc" {\n\t\tt.Fatal("mark")\n\t}\n}\n'), "defer ที่ประกาศทีหลังทำงานก่อน เลยได้ a แล้ว b แล้ว c", "The defer you register later runs first, so the letters come out a, then b, then c"),
    ],
  }),
];
