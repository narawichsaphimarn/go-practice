## explanation
interface บอกพฤติกรรมที่ต้องการ ไม่ได้บอกชนิดของข้อมูล ผู้เรียกพึ่ง method เท่าที่จำเป็น เช่น Speak

```
type Speaker interface {
	Speak() string
}
```

## apply
ใช้เมื่อของจริงมีได้หลายแบบ แต่ผู้เรียกต้องการคำตอบแบบเดียวกัน เช่น สัตว์ที่ส่งเสียง หรือ storage ที่บันทึกได้

## easy
implementation ตัวแรก

## hard
ตัวที่สอง หรือฟังก์ชันที่รับ interface

## steps
- ประกาศ interface ให้เล็ก
- ผูก method กับชนิดจริง
- รับ interface ที่ฟังก์ชันผู้เรียก
- อย่าบังคับชนิด concrete ในผู้เรียก
