## explanation
HTTP handler คือฟังก์ชันที่รับคำขอแล้วเขียนคำตอบ หน้าตาเป็นแบบนี้เสมอ

```
func Ping(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "pong")
}
```

- `r` คือคำขอ: `r.Method` (GET, POST, ...), `r.URL.Query().Get("name")` อ่านค่าหลัง `?` และ `r.Body` คือเนื้อหาที่ส่งมา
- `w` คือคำตอบ: เขียนเนื้อหาลง w เหมือน io.Writer และตั้งสถานะด้วย `w.WriteHeader(code)`

ถ้าไม่เรียก WriteHeader สถานะจะเป็น 200 ให้เอง ต้องเรียก WriteHeader ก่อนเขียนเนื้อหา เพราะหลังเขียนไปแล้วสถานะจะเปลี่ยนไม่ได้

## apply
สถานะที่ใช้บ่อย:

- `http.StatusOK` (200) สำเร็จ, `http.StatusCreated` (201) สร้างของใหม่แล้ว
- `http.StatusBadRequest` (400) ข้อมูลที่ส่งมาผิด
- `http.StatusMethodNotAllowed` (405) method นี้ใช้กับ path นี้ไม่ได้

`http.Error(w, "message", code)` ตั้งสถานะและเขียนข้อความในคราวเดียว ใช้ตอบ error ได้สะดวก

ฝั่งที่เรียก service อื่นต้องตั้ง timeout เสมอ `http.Client` ที่ Timeout เป็นค่าศูนย์จะรอได้ไม่จำกัด ถ้าปลายทางค้าง โปรแกรมเราก็ค้างตาม

```
client := &http.Client{Timeout: 3 * time.Second}
```

ในเทสต์ไม่ต้องเปิดพอร์ตจริง `httptest.NewRequest` สร้างคำขอปลอม และ `httptest.NewRecorder` เก็บคำตอบไว้ให้ตรวจ

## easy
ตัวอย่าง: handler ที่รับเฉพาะ GET

```
func Health(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "use GET", http.StatusMethodNotAllowed)
		return
	}
	fmt.Fprint(w, "ok")
}
```

อย่าลืม `return` หลัง http.Error ไม่งั้นโค้ดจะเขียน ok ต่อท้ายคำตอบ error

## hard
ตัวอย่าง: อ่าน JSON จาก body แล้วตอบผลรวม

```
type Pair struct {
	A int `json:"a"`
	B int `json:"b"`
}

func Add(w http.ResponseWriter, r *http.Request) {
	var p Pair
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		http.Error(w, "bad JSON", http.StatusBadRequest)
		return
	}
	fmt.Fprint(w, p.A+p.B)
}
```

POST body `{"a":2,"b":3}` ได้คำตอบ 5 และ body ที่อ่านไม่ได้ได้สถานะ 400 `json.NewDecoder` อ่านจาก io.Reader ได้ตรง ๆ จึงไม่ต้องอ่าน body ทั้งก้อนก่อน
