## explanation
แพ็กเกจ `encoding/json` แปลง struct เป็นข้อความ JSON และแปลงกลับ:

- `json.Marshal(v)` แปลงค่าเป็น JSON ได้ `[]byte`
- `json.Unmarshal(data, &v)` อ่าน JSON แล้วเขียนลง v ต้องส่ง `&v` เพื่อให้มันแก้ค่าตัวจริงได้

ชื่อใน JSON มักเป็นตัวพิมพ์เล็ก แต่ฟิลด์ใน Go ต้องขึ้นต้นด้วยตัวพิมพ์ใหญ่ แพ็กเกจ json ถึงจะมองเห็น (เรื่อง export จากบท package) จึงใช้ tag บอกชื่อใน JSON

```
type Person struct {
	Name string `json:"name"`
	Age  int    `json:"age"`
}

data, _ := json.Marshal(Person{Name: "ann", Age: 30})
fmt.Println(string(data))
```

ได้ `{"name":"ann","age":30}` tag คือข้อความในเครื่องหมาย backtick ท้ายฟิลด์

## apply
ตอนอ่าน JSON:

- ฟิลด์ที่มีใน JSON แต่ไม่มีใน struct จะถูกข้ามไป
- ฟิลด์ที่มีใน struct แต่ไม่มีใน JSON ได้ค่าศูนย์
- JSON ที่ผิดรูปแบบ Unmarshal จะคืน error ต้องเช็กเสมอ

ข้อมูลซ้อนกันก็ประกาศ struct ซ้อนกัน เช่น `Items []Item` สำหรับ array ของวัตถุ

tag ใส่ตัวเลือกเพิ่มได้หลังจุลภาค:

- `json:"email,omitempty"` ไม่ใส่ฟิลด์นี้ถ้าเป็นค่าศูนย์
- `json:"-"` ไม่ใส่ฟิลด์นี้เลยทั้งตอนเขียนและอ่าน ใช้กับของลับอย่างรหัสผ่าน

## easy
ตัวอย่าง: อ่านราคาจาก JSON

```
type Product struct {
	Price int `json:"price"`
}

func PriceOf(data []byte) (int, error) {
	var p Product
	if err := json.Unmarshal(data, &p); err != nil {
		return 0, err
	}
	return p.Price, nil
}
```

ส่ง JSON `{"price":45,"name":"tea"}` เข้า PriceOf ได้ 45 ฟิลด์ name ถูกข้ามไปเพราะ Product ไม่มี

## hard
ตัวอย่าง: นับจำนวนแท็กทั้งหมดใน array ของโพสต์

```
type Post struct {
	Tags []string `json:"tags"`
}

func TagCount(data []byte) (int, error) {
	var posts []Post
	if err := json.Unmarshal(data, &posts); err != nil {
		return 0, err
	}
	n := 0
	for _, p := range posts {
		n += len(p.Tags)
	}
	return n, nil
}
```

JSON `[{"tags":["go","web"]},{"tags":["db"]},{}]` ได้ 3 โพสต์สุดท้ายไม่มี tags จึงได้ slice ว่างซึ่งยาว 0
