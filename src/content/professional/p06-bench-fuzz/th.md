## explanation
go test -bench วัดเวลาต่องานหนึ่งหน่วย ผลมี ns/op และอาจมี allocs/op fuzz ส่งข้อมูลสุ่มเข้าฟังก์ชันแล้วดูว่า panic หรือไม่ เป้าหมาย fuzz รับ *testing.F แล้วเรียก f.Add กับ f.Fuzz

```
func FuzzParse(f *testing.F) {
	f.Add("seed")
	f.Fuzz(func(t *testing.T, s string) {
		_ = len(s)
	})
}
```

## apply
ใช้ตอนจูนฟังก์ชันที่ถูกเรียกบ่อย และตอนหา input ที่ทำให้ parser พัง

## easy
อ่านคอลัมน์ของผล bench

## hard
รูปร่างของ fuzz target

## steps
- แยก ns/op ออกจาก allocs/op
- ดูว่าตัวเลขน้อยลงคือเร็วขึ้น
- จำว่า fuzz อยู่ใน _test.go
- ตอบในหน้านี้
