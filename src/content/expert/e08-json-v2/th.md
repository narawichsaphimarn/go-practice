## explanation
encoding/json คือแพ็กเกจปกติที่ใช้แปลง struct เป็น JSON encoding/json/v2 คือ API ทดลองที่แยกจากตัวนี้ โปรแกรมที่ import encoding/json ไม่เปลี่ยนไปใช้ v2 เอง

```
type Note struct {
	Text string `json:"text"`
}

func toJSON(text string) ([]byte, error) {
	return json.Marshal(Note{Text: text})
}
```

ต้อง import "encoding/json" toJSON("hi") ได้ไบต์ของ {"text":"hi"}

## apply
จะทดลอง v2 ต้องเปิดตามกติกา experiment ของรุ่นนั้น เช่น GOEXPERIMENT=jsonv2 ไม่ใช่แค่เปลี่ยน import แล้วคาดว่าเป็นค่าเริ่มต้น

```
GOEXPERIMENT=jsonv2 go test ./...
```

คำสั่งนี้เปิด experiment ตามกติกาของรุ่น ตัว encoding/json ปกตียังอยู่

## easy
encoding/json/v2 คือ API ทดลองที่แยกจาก encoding/json ตัวปกติ โค้ดที่ใช้ได้ทุกวันยังเป็นแบบนี้

```
func toJSON(text string) ([]byte, error) {
	return json.Marshal(Note{Text: text})
}
```

## hard
ทดลอง v2 โดยเปิดตามกติกา experiment ของรุ่นนั้น โปรแกรมที่ import encoding/json ไม่เปลี่ยนเอง

```
GOEXPERIMENT=jsonv2 go test ./...
```

```
import "encoding/json"
```
