## explanation
http.Request มีฟิลด์ Method เป็นข้อความของวิธีเรียก เช่น POST หรือ GET Status อ่าน Method นั้นแล้วเลือกเลขสถานะ

```
func Status(r *http.Request) int {
	if r.Method == http.MethodPost {
		return http.StatusOK
	}
	return http.StatusMethodNotAllowed
}
```

ต้อง import "net/http" Status ของ request ที่ Method เป็น POST ได้ 200 ของ method อื่นได้ 405

## apply
Client คือตัวที่โทรออก ตั้ง Timeout เป็นหนึ่งวินาทีแล้วการโทรที่ค้างนานกว่านั้นจะถูกตัด WriteOK คือฝั่งรับ เขียนสถานะ 200 แล้วเขียนเนื้อหา ok ลง ResponseWriter

```
func Client() *http.Client {
	return &http.Client{Timeout: time.Second}
}
```

ต้อง import "time" ด้วย

```
func WriteOK(w http.ResponseWriter) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("ok"))
}
```

## easy
Status คืน 200 เมื่อ r.Method เป็น POST และคืน 405 เมื่อเป็น method อื่น

```
func Status(r *http.Request) int {
	if r.Method == http.MethodPost {
		return http.StatusOK
	}
	return http.StatusMethodNotAllowed
}
```

## hard
WriteOK ตอบสถานะ 200 และเนื้อหา ok Client คืน http.Client ที่ Timeout เป็นหนึ่งวินาที

```
func WriteOK(w http.ResponseWriter) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("ok"))
}
```

```
func Client() *http.Client {
	return &http.Client{Timeout: time.Second}
}
```
