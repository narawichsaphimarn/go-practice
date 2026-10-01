## explanation
io.Reader และ io.Writer เป็น interface เล็กที่ไฟล์ เครือข่าย และ bytes.Buffer ทำได้เหมือนกัน io.ReadAll สะดวกเมื่อข้อมูลเล็ก io.Copy กับ io.Discard ใช้นับไบต์โดยไม่เก็บก้อนไว้

```
text, err := io.ReadAll(r)
```

## apply
ใช้ตอนอ่าน body ของ request หรือเขียนซ้ำลง log โดยไม่ผูกกับไฟล์จริง

## easy
อ่านทั้งก้อนเป็นสตริง

## hard
เขียนซ้ำสองครั้ง หรือนับไบต์

## steps
- รับ Reader หรือ Writer
- ตรวจ error จาก Read หรือ Write
- ปิดของที่เปิดเองด้วย defer
- เลือก Copy เมื่อไม่ต้องเก็บเนื้อหา
