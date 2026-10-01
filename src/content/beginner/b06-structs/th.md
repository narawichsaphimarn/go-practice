## explanation
struct รวมฟิลด์ที่เกี่ยวข้อง method คือฟังก์ชันที่มี receiver ถ้า receiver เป็น pointer การแก้ฟิลด์จะเห็นนอกฟังก์ชัน

```
type Rect struct {
	W int
	H int
}
```

## apply
ใช้แทนกลุ่มค่าที่ส่งกันทั้งก้อน เช่น ขนาดรูป หรือผู้ใช้ที่มีชื่อ

## easy
คำนวณพื้นที่จาก struct

## hard
method ที่เปลี่ยนฟิลด์ หรือเปลี่ยนชื่อ

## steps
- ประกาศ struct
- ส่งค่าหรือ pointer ให้ตรงว่าต้องแก้ฟิลด์ไหม
- เขียน method
- ให้เทสต์เรียกชื่อที่กำหนด
