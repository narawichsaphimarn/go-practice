import { copy, lesson, quiz, testEx, tests, text, withHint } from "./helpers.mjs";

function say(id, th, en) {
  return { id, th, en };
}

export const advanced = [
  lesson({
    id: "a01-interfaces",
    level: "advanced",
    order: 11,
    title: text("interface", "Interfaces"),
    goal: text("ออกแบบ interface เล็กและสลับ implementation ได้", "Design a small interface and swap implementations"),
    copy: copy(
      [
        "interface บอกพฤติกรรมที่ต้องการ ไม่ได้บอกชนิดของข้อมูล ผู้เรียกพึ่ง method เท่าที่จำเป็น เช่น Speak\n\n```\ntype Speaker interface {\n\tSpeak() string\n}\n```",
        "ใช้เมื่อของจริงมีได้หลายแบบ แต่ผู้เรียกต้องการคำตอบแบบเดียวกัน เช่น สัตว์ที่ส่งเสียง หรือ storage ที่บันทึกได้",
        "implementation ตัวแรก",
        "ตัวที่สอง หรือฟังก์ชันที่รับ interface",
        ["ประกาศ interface ให้เล็ก", "ผูก method กับชนิดจริง", "รับ interface ที่ฟังก์ชันผู้เรียก", "อย่าบังคับชนิด concrete ในผู้เรียก"],
      ],
      [
        "An interface names the behavior you need, not the data type. Callers depend only on the methods they use, such as Speak.\n\n```\ntype Speaker interface {\n\tSpeak() string\n}\n```",
        "Use it when several concrete types should answer the same way, such as animals that speak or storage that saves.",
        "A first implementation.",
        "A second one, or a function that accepts the interface.",
        ["Keep the interface small", "Attach the method to the concrete type", "Accept the interface in the caller", "Do not force a concrete type on the caller"],
      ],
    ),
    exercises: [
      testEx(say("easy", "ให้ Dog มี Speak ที่คืน woof", "Give Dog a Speak method that returns woof"), tests, 'package main\n\ntype Dog struct{}\n\nfunc (Dog) Speak() string {\n\treturn ""\n}\n', 'package main\n\nimport "testing"\n\nfunc TestDog(t *testing.T) {\n\tif (Dog{}).Speak() != "woof" {\n\t\tt.Fatal("speak")\n\t}\n}\n'),
      testEx(say("mid", "ให้ Cat มี Speak ที่คืน meow", "Give Cat a Speak method that returns meow"), tests, 'package main\n\ntype Cat struct{}\n\nfunc (Cat) Speak() string {\n\treturn ""\n}\n', 'package main\n\nimport "testing"\n\nfunc TestCat(t *testing.T) {\n\tif (Cat{}).Speak() != "meow" {\n\t\tt.Fatal("speak")\n\t}\n}\n'),
      testEx(say("hard", "เขียน Announce ที่รับ Speaker แล้วคืนผล Speak", "Write Announce that accepts a Speaker and returns Speak"), tests, 'package main\n\ntype Speaker interface {\n\tSpeak() string\n}\n\ntype Dog struct{}\n\nfunc (Dog) Speak() string {\n\treturn "woof"\n}\n\nfunc Announce(s Speaker) string {\n\treturn ""\n}\n', 'package main\n\nimport "testing"\n\nfunc TestAnnounce(t *testing.T) {\n\tif Announce(Dog{}) != "woof" {\n\t\tt.Fatal("announce")\n\t}\n}\n'),
      withHint(testEx(say("twist", "เขียน Louder ให้รับ Speaker แล้วคืนคำพูดต่อด้วย !", "Write Louder to accept a Speaker and return the speech plus !"), tests, 'package main\n\ntype Speaker interface {\n\tSpeak() string\n}\n\ntype Cow struct{}\n\nfunc (Cow) Speak() string {\n\treturn "moo"\n}\n\nfunc Louder(s Speaker) string {\n\treturn ""\n}\n', 'package main\n\nimport "testing"\n\ntype Bird struct{}\n\nfunc (Bird) Speak() string {\n\treturn "tweet"\n}\n\nfunc TestLouder(t *testing.T) {\n\tif Louder(Cow{}) != "moo!" {\n\t\tt.Fatal("cow")\n\t}\n\tif Louder(Bird{}) != "tweet!" {\n\t\tt.Fatal("bird")\n\t}\n}\n'), "เรียก Speak แล้วต่อเครื่องหมายตกใจ", "Call Speak and append an exclamation mark"),
    ],
  }),
  lesson({
    id: "a02-generics",
    level: "advanced",
    order: 12,
    title: text("generics", "Generics"),
    goal: text("เขียนฟังก์ชัน generic เมื่อ type parameter จำเป็นจริง", "Write a generic function when a type parameter is actually needed"),
    copy: copy(
      [
        "type parameter ให้ฟังก์ชันเดียวทำงานกับหลายชนิดโดยยังตรวจชนิดตอนคอมไพล์ ใช้เมื่อไม่มี interface เล็กๆ ที่สื่อความหมายได้ดีกว่า เช่น คืนค่าเดิม หรือหาค่าที่น้อยกว่าด้วย cmp.Ordered\n\n```\nfunc Identity[T any](v T) T {\n\treturn v\n}\n```",
        "ใช้ในไลบรารีที่จัดการ slice ของชนิดใดก็ได้ โดยไม่ต้องเขียนซ้ำทุกชนิด",
        "คืนค่าเดิม",
        "หาค่าที่น้อยกว่า หรือแปลงสมาชิกทีละตัว",
        ["ใส่ type parameter เมื่อชนิดต้องไปกับผู้เรียก", "ใช้ any เมื่อไม่ได้เรียก method", "ใช้ constraint เมื่อต้องเปรียบเทียบ", "อย่าทำ generic ถ้าชนิดเดียวก็พอ"],
      ],
      [
        "A type parameter lets one function work for many types and still check them at compile time. Use it when a small interface would not say the same thing, such as returning the same value or finding the lesser value with cmp.Ordered.\n\n```\nfunc Identity[T any](v T) T {\n\treturn v\n}\n```",
        "Use it in a library that handles a slice of any element type without copying the function for each type.",
        "Return the same value.",
        "Pick the lesser value, or transform each element.",
        ["Add a type parameter when the type must follow the caller", "Use any when you call no methods", "Use a constraint when you compare", "Skip generics when one type is enough"],
      ],
    ),
    exercises: [
      testEx(say("easy", "เขียน Identity ให้คืนค่าที่รับมา", "Write Identity to return the value it received"), tests, 'package main\n\nfunc Identity[T any](v T) T {\n\tvar zero T\n\treturn zero\n}\n', 'package main\n\nimport "testing"\n\nfunc TestIdentity(t *testing.T) {\n\tif Identity(3) != 3 || Identity("go") != "go" {\n\t\tt.Fatal("identity")\n\t}\n}\n'),
      testEx(say("mid", "เขียน Min ให้คืนค่าที่น้อยกว่าระหว่าง a กับ b", "Write Min to return the lesser of a and b"), tests, 'package main\n\nimport "cmp"\n\nfunc Min[T cmp.Ordered](a, b T) T {\n\tvar zero T\n\treturn zero\n}\n', 'package main\n\nimport "testing"\n\nfunc TestMin(t *testing.T) {\n\tif Min(2, 5) != 2 || Min("b", "a") != "a" {\n\t\tt.Fatal("min")\n\t}\n}\n'),
      testEx(say("hard", "เขียน Map ให้แปลงสมาชิกทุกตัวด้วยฟังก์ชัน f", "Write Map to transform every element with f"), tests, 'package main\n\nfunc Map[T any, U any](in []T, f func(T) U) []U {\n\treturn nil\n}\n', 'package main\n\nimport "testing"\n\nfunc TestMap(t *testing.T) {\n\tgot := Map([]int{1, 2}, func(n int) int { return n + 1 })\n\tif len(got) != 2 || got[0] != 2 || got[1] != 3 {\n\t\tt.Fatal("map")\n\t}\n}\n'),
      withHint(testEx(say("twist", "เขียน Filter ให้คัดสมาชิกที่ฟังก์ชันเก็บไว้ รวม slice ว่าง", "Write Filter to keep the items the function accepts, including an empty slice"), tests, 'package main\n\nfunc Filter[T any](in []T, keep func(T) bool) []T {\n\treturn nil\n}\n', 'package main\n\nimport "testing"\n\nfunc TestFilter(t *testing.T) {\n\tgot := Filter([]int{1, 2, 3, 4}, func(n int) bool { return n%2 == 1 })\n\tif len(got) != 2 || got[0] != 1 || got[1] != 3 {\n\t\tt.Fatal("odds")\n\t}\n\tif len(Filter([]string{}, func(string) bool { return true })) != 0 {\n\t\tt.Fatal("empty")\n\t}\n}\n'), "สร้าง slice ใหม่เฉพาะสมาชิกที่ keep คืน true รวมกรณีว่าง", "Build a new slice of items keep accepts, including an empty input"),
    ],
  }),
  lesson({
    id: "a03-error-wrapping",
    level: "advanced",
    order: 13,
    title: text("errors.Is และ errors.As", "errors.Is and errors.As"),
    goal: text("ห่อ error แล้วตรวจสาเหตุโดยไม่เทียบข้อความ", "Wrap an error and inspect the cause without comparing text"),
    copy: copy(
      [
        "fmt.Errorf พร้อม %w ห่อ error เดิมไว้ errors.Is เดินสายห่อเพื่อเทียบค่า sentinel errors.As ดึงชนิดที่ต้องการออกมา การเทียบข้อความ error ทำให้พังเมื่อมีคนแก้ประโยค\n\n```\nreturn fmt.Errorf(\"open: %w\", err)\n```",
        "ใช้เมื่อข้ามชั้นของโปรแกรมแล้วผู้เรียกยังต้องรู้ว่าสาเหตุคือ ErrNotFound หรือชนิดที่มีรหัส",
        "ห่อแล้วใช้ errors.Is",
        "ใช้ errors.As กับชนิดของตัวเอง",
        ["ห่อด้วย %w", "ประกาศ sentinel ด้วย errors.New", "ตรวจด้วย Is หรือ As", "อย่าใช้ strings.Contains กับ Error()"],
      ],
      [
        "fmt.Errorf with %w wraps the original error. errors.Is walks the chain to compare a sentinel. errors.As pulls out a specific type. Comparing the error text breaks when someone edits the sentence.\n\n```\nreturn fmt.Errorf(\"open: %w\", err)\n```",
        "Use it when a layer adds context and the caller still needs to know the cause was ErrNotFound or a coded type.",
        "Wrap and use errors.Is.",
        "Use errors.As with your own type.",
        ["Wrap with %w", "Declare a sentinel with errors.New", "Check with Is or As", "Do not use strings.Contains on Error()"],
      ],
    ),
    exercises: [
      testEx(say("easy", "เขียน Wrap ให้ห่อ ErrBoom แล้วให้ errors.Is เจอ ErrBoom", "Write Wrap so errors.Is finds ErrBoom"), tests, 'package main\n\nimport "errors"\n\nvar ErrBoom = errors.New("boom")\n\nfunc Wrap() error {\n\treturn nil\n}\n', 'package main\n\nimport (\n\t"errors"\n\t"testing"\n)\n\nfunc TestWrap(t *testing.T) {\n\tif !errors.Is(Wrap(), ErrBoom) {\n\t\tt.Fatal("is")\n\t}\n}\n'),
      testEx(say("mid", "เขียน AsCode ให้ดึง Code จาก error ที่ห่อ CodeError", "Write AsCode to read Code from a wrapped CodeError"), tests, 'package main\n\ntype CodeError struct {\n\tCode int\n}\n\nfunc (e CodeError) Error() string {\n\treturn "code"\n}\n\nfunc AsCode(err error) int {\n\treturn 0\n}\n', 'package main\n\nimport (\n\t"fmt"\n\t"testing"\n)\n\nfunc TestAsCode(t *testing.T) {\n\terr := fmt.Errorf("wrap: %w", CodeError{Code: 7})\n\tif AsCode(err) != 7 {\n\t\tt.Fatal("as")\n\t}\n}\n'),
      testEx(say("hard", "เขียน HasBoom ให้คืน true เมื่อสาย error มียอด ErrBoom", "Write HasBoom to return true when the chain contains ErrBoom"), tests, 'package main\n\nimport (\n\t"errors"\n\t"fmt"\n)\n\nvar ErrBoom = errors.New("boom")\n\nfunc HasBoom(err error) bool {\n\treturn false\n}\n\nfunc sample() error {\n\treturn fmt.Errorf("wrap: %w", ErrBoom)\n}\n', 'package main\n\nimport "testing"\n\nfunc TestHasBoom(t *testing.T) {\n\tif !HasBoom(sample()) {\n\t\tt.Fatal("boom")\n\t}\n\tif HasBoom(nil) {\n\t\tt.Fatal("nil")\n\t}\n}\n'),
      withHint(testEx(say("twist", "เขียน CodeOr ให้ดึง Code จาก CodeError ที่ถูกห่อสองชั้น ไม่งั้นคืนค่าสำรอง", "Write CodeOr to read Code from a CodeError wrapped twice, or return the fallback"), tests, 'package main\n\ntype CodeError struct {\n\tCode int\n}\n\nfunc (e CodeError) Error() string {\n\treturn "code"\n}\n\nfunc CodeOr(err error, fallback int) int {\n\treturn 0\n}\n', 'package main\n\nimport (\n\t"errors"\n\t"fmt"\n\t"testing"\n)\n\nfunc TestCodeOr(t *testing.T) {\n\terr := fmt.Errorf("outer: %w", fmt.Errorf("inner: %w", CodeError{Code: 3}))\n\tif CodeOr(err, 9) != 3 {\n\t\tt.Fatal("wrapped")\n\t}\n\tif CodeOr(errors.New("nope"), 9) != 9 {\n\t\tt.Fatal("fallback")\n\t}\n}\n'), "ใช้ errors.As ไล่สาย error ที่ห่อไว้ ถ้าไม่เจอให้คืนค่าสำรอง", "Use errors.As to walk the wrapped chain. Return the fallback when it is not there"),
    ],
  }),
  lesson({
    id: "a04-io",
    level: "advanced",
    order: 14,
    title: text("io.Reader และ io.Writer", "io.Reader and io.Writer"),
    goal: text("อ่านและเขียนสตรีมโดยไม่โหลดทั้งก้อนเมื่อไม่จำเป็น", "Read and write streams without loading everything when you do not need to"),
    copy: copy(
      [
        "io.Reader และ io.Writer เป็น interface เล็กที่ไฟล์ เครือข่าย และ bytes.Buffer ทำได้เหมือนกัน io.ReadAll สะดวกเมื่อข้อมูลเล็ก io.Copy กับ io.Discard ใช้นับไบต์โดยไม่เก็บก้อนไว้\n\n```\ntext, err := io.ReadAll(r)\n```",
        "ใช้ตอนอ่าน body ของ request หรือเขียนซ้ำลง log โดยไม่ผูกกับไฟล์จริง",
        "อ่านทั้งก้อนเป็นสตริง",
        "เขียนซ้ำสองครั้ง หรือนับไบต์",
        ["รับ Reader หรือ Writer", "ตรวจ error จาก Read หรือ Write", "ปิดของที่เปิดเองด้วย defer", "เลือก Copy เมื่อไม่ต้องเก็บเนื้อหา"],
      ],
      [
        "io.Reader and io.Writer are small interfaces that files, network connections, and bytes.Buffer all implement. io.ReadAll is fine for a small payload. io.Copy to io.Discard counts bytes without keeping the payload.\n\n```\ntext, err := io.ReadAll(r)\n```",
        "Use it when reading a request body or writing twice to a log without binding the function to a real file.",
        "Read the whole stream into a string.",
        "Write twice, or count bytes.",
        ["Accept a Reader or a Writer", "Check the error from Read or Write", "Defer a close for what you opened", "Choose Copy when you do not need the contents"],
      ],
    ),
    exercises: [
      testEx(say("easy", "เขียน ReadAll ให้คืนข้อความทั้งก้อนจาก Reader", "Write ReadAll to return the whole Reader as text"), tests, 'package main\n\nimport "io"\n\nfunc ReadAll(r io.Reader) (string, error) {\n\treturn "", nil\n}\n', 'package main\n\nimport (\n\t"strings"\n\t"testing"\n)\n\nfunc TestReadAll(t *testing.T) {\n\tgot, err := ReadAll(strings.NewReader("go"))\n\tif err != nil || got != "go" {\n\t\tt.Fatal("read")\n\t}\n}\n'),
      testEx(say("mid", "เขียน WriteTwice ให้เขียน s ลง Writer สองครั้ง", "Write WriteTwice to write s to the Writer twice"), tests, 'package main\n\nimport "io"\n\nfunc WriteTwice(w io.Writer, s string) error {\n\treturn nil\n}\n', 'package main\n\nimport (\n\t"bytes"\n\t"testing"\n)\n\nfunc TestWriteTwice(t *testing.T) {\n\tvar b bytes.Buffer\n\tif err := WriteTwice(&b, "go"); err != nil {\n\t\tt.Fatal(err)\n\t}\n\tif b.String() != "gogo" {\n\t\tt.Fatal(b.String())\n\t}\n}\n'),
      testEx(say("hard", "เขียน Count ให้คืนจำนวนไบต์ที่อ่านได้โดยไม่เก็บเนื้อหา", "Write Count to return how many bytes were read without keeping them"), tests, 'package main\n\nimport "io"\n\nfunc Count(r io.Reader) (int, error) {\n\treturn 0, nil\n}\n', 'package main\n\nimport (\n\t"strings"\n\t"testing"\n)\n\nfunc TestCount(t *testing.T) {\n\tn, err := Count(strings.NewReader("go"))\n\tif err != nil || n != 2 {\n\t\tt.Fatal("count")\n\t}\n}\n'),
      withHint(testEx(say("twist", "เขียน Head ให้อ่านได้ไม่เกิน n ไบต์ รวมกรณี n เป็น 0", "Write Head to read at most n bytes, including when n is 0"), tests, 'package main\n\nimport "io"\n\nfunc Head(r io.Reader, n int) (string, error) {\n\treturn "", nil\n}\n', 'package main\n\nimport (\n\t"strings"\n\t"testing"\n)\n\nfunc TestHead(t *testing.T) {\n\tgot, err := Head(strings.NewReader("golang"), 2)\n\tif err != nil || got != "go" {\n\t\tt.Fatal("head")\n\t}\n\tgot, err = Head(strings.NewReader("golang"), 0)\n\tif err != nil || got != "" {\n\t\tt.Fatal("zero")\n\t}\n}\n'), "อ่านได้ไม่เกิน n ไบต์ เมื่อ n เป็น 0 ให้คืนสตริงว่าง", "Read at most n bytes. When n is 0, return an empty string"),
    ],
  }),
  lesson({
    id: "a05-json",
    level: "advanced",
    order: 15,
    title: text("encoding/json", "encoding/json"),
    goal: text("marshal และ unmarshal struct ที่กำหนด tag เอง", "Marshal and unmarshal a struct with your own tags"),
    copy: copy(
      [
        "encoding/json จับคู่ฟิลด์ด้วย tag json ถ้าไม่ใส่ tag จะใช้ชื่อฟิลด์ที่ขึ้นต้นด้วยตัวใหญ่ ฟิลด์ที่ไม่มีใน JSON จะได้ zero value\n\n```\nvar person Person\nerr := json.Unmarshal(data, &person)\n```",
        "ใช้รับ body ของ API และเก็บคอนฟิกที่คนแก้เป็นข้อความ",
        "อ่านฟิลด์ name",
        "เขียน JSON หรือรับกรณีที่ฟิลด์หาย",
        ["ใส่ tag ให้ตรงชื่อใน JSON", "ตรวจ error จาก Marshal และ Unmarshal", "อย่าคาดว่าฟิลด์ที่หายจะไม่เป็นศูนย์", "ใช้ชนิดที่ตรงกับค่า"],
      ],
      [
        "encoding/json matches fields with a json tag. Without a tag it uses the exported field name. A missing JSON field becomes the zero value.\n\n```\nvar person Person\nerr := json.Unmarshal(data, &person)\n```",
        "Use it for an API body and for config that people edit as text.",
        "Read the name field.",
        "Write JSON, or accept a missing field.",
        ["Set the tag to the JSON name", "Check errors from Marshal and Unmarshal", "Expect a missing field to be zero", "Use a type that matches the value"],
      ],
    ),
    exercises: [
      testEx(
        say("easy", "เขียน DecodeName ให้อ่านฟิลด์ name", "Write DecodeName to read the name field"),
        tests,
        'package main\n\ntype Person struct {\n\tName string `json:"name"`\n}\n\nfunc DecodeName(data []byte) (string, error) {\n\treturn "", nil\n}\n',
        'package main\n\nimport "testing"\n\nfunc TestDecodeName(t *testing.T) {\n\tgot, err := DecodeName([]byte(`{"name":"ada"}`))\n\tif err != nil || got != "ada" {\n\t\tt.Fatal("name")\n\t}\n}\n',
      ),
      testEx(
        say("mid", "เขียน EncodeName ให้ได้ JSON ที่มี name", "Write EncodeName to produce JSON with name"),
        tests,
        'package main\n\nfunc EncodeName(name string) ([]byte, error) {\n\treturn nil, nil\n}\n',
        'package main\n\nimport "testing"\n\nfunc TestEncodeName(t *testing.T) {\n\tgot, err := EncodeName("ada")\n\tif err != nil || string(got) != `{"name":"ada"}` {\n\t\tt.Fatal(string(got))\n\t}\n}\n',
      ),
      testEx(
        say("hard", "เขียน DecodeName ให้คืนสตริงว่างเมื่อไม่มีฟิลด์ name และไม่มี error", "Write DecodeName to return an empty string without an error when name is missing"),
        tests,
        'package main\n\nfunc DecodeName(data []byte) (string, error) {\n\treturn "x", nil\n}\n',
        'package main\n\nimport "testing"\n\nfunc TestMissing(t *testing.T) {\n\tgot, err := DecodeName([]byte(`{}`))\n\tif err != nil || got != "" {\n\t\tt.Fatal(got)\n\t}\n}\n',
      ),
      withHint(testEx(say("twist", "เขียน SumAges ให้รวมฟิลด์ age จาก JSON array และนับวัตถุที่ไม่มีฟิลด์นั้นเป็น 0", "Write SumAges to add the age fields in a JSON array and count a missing age as 0"), tests, 'package main\n\nfunc SumAges(data []byte) (int, error) {\n\treturn 0, nil\n}\n', 'package main\n\nimport "testing"\n\nfunc TestSumAges(t *testing.T) {\n\tgot, err := SumAges([]byte(`[{"age":2},{"name":"a"},{"age":5}]`))\n\tif err != nil || got != 7 {\n\t\tt.Fatal("sum")\n\t}\n\tgot, err = SumAges([]byte(`[]`))\n\tif err != nil || got != 0 {\n\t\tt.Fatal("empty")\n\t}\n}\n'), "ถอด JSON เป็น slice ของ struct แล้วบวก age ที่หายให้เป็น 0", "Unmarshal into a slice of structs and treat a missing age as 0"),
    ],
  }),
];
