## explanation
defer เลื่อนการเรียกไว้ตอนฟังก์ชันคืน ลำดับคือย้อนหลังจากที่ defer ทีหลังสุด ถ้าใช้ named return ค่าที่ defer แก้จะถูกส่งออกไป panic หยุดการทำงานทั้งก้อน recover ใช้ได้ใน defer เท่านั้น และไม่ควรแทน error ปกติ

```
func Order() (s string) {
	defer func() { s += "b" }()
	s = "a"
	return
}
```

## apply
ใช้ปิดไฟล์หรือปลดล็อก และใช้ recover เฉพาะขอบของโปรแกรมที่ต้องไม่ล่มทั้งก้อน

## easy
เรียงข้อความด้วย defer

## hard
นับครั้งที่ปิด หรือจับ panic

## steps
- วาง defer ก่อนจุดที่อาจคืน
- ใช้ named return ถ้าต้องแก้ค่าที่คืน
- เรียก recover ใน defer
- อย่าใช้ panic แทน error ธรรมดา
