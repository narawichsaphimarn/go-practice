## explanation
defer เก็บงานไว้ทำตอนฟังก์ชันกำลังจะคืนค่า ใช้ปิดของหรือเติมค่าบน named return panic หยุดทั้งก้อนทันที จึงไม่ใช่ทางบอกข้อผิดพลาดปกติ ทางปกติคือคืน error recover ใน defer จับ panic นั้นได้

```
func Order() (s string) {
	defer func() { s += "b" }()
	s = "a"
	return s
}
```

Order คืน ab เพราะ defer เติม b หลังตั้ง s เป็น a แล้วก่อนฟังก์ชันจบจริง

## apply
งานที่ต้องทำตอนจะออกจากฟังก์ชัน ไม่ว่าจะคืนตรงไหน ให้วางใน defer เช่นเติมตัวอักษรท้าย หรือนับว่าปิดแล้ว

## easy
Order คืน ab โดยให้ defer เติม b เข้า named return

```
func Order() (s string) {
	defer func() { s += "b" }()
	s = "a"
	return s
}
```

## hard
Safe เรียก panic แล้ว recover ใน defer และคืน true Closed เพิ่ม named return ใน defer จนได้ 1

```
func Safe() (recovered bool) {
	defer func() {
		if recover() != nil {
			recovered = true
		}
	}()
	panic("boom")
}
```

```
func Closed() (n int) {
	defer func() { n++ }()
	return 0
}
```
