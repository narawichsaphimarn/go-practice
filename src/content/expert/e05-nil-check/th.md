## explanation
การใช้ pointer ที่เป็น nil อ่านฟิลด์หรือเรียก method ที่แตะฟิลด์ จะ panic ว่า nil pointer dereference Go 1.25 ยังคงตรวจจุดนี้ตอนรัน แบบฝึกนี้ให้โปรแกรม panic จริงบน runner ไม่ใช่ข้อควิซ

```
var p *int
fmt.Println(*p)
```

## apply
ใช้เป็นตัวอย่างของบั๊กที่ได้ผลลัพธ์มาก่อนตรวจ error หรือตรวจ nil

## easy
dereference pointer ที่เป็น nil

## hard
อ่านฟิลด์หรือเรียก method ผ่าน pointer ที่เป็น nil

## steps
- ประกาศ pointer โดยไม่ชี้ค่า
- ใช้ค่านั้นทันที
- รันแล้วดู panic
- ส่งคำตอบเมื่อ stderr มี nil pointer
