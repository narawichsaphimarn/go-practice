## explanation
ถ้าฟังก์ชันคืนค่าชนิดเดียวกับที่รับมา และไม่ได้เรียก method ของค่านั้น generic ชัดกว่า interface ว่าง ถ้าพฤติกรรมคือ Speak ให้ใช้ interface แทน

```
func First[T any](items []T) (T, bool) {
	if len(items) == 0 {
		var zero T
		return zero, false
	}
	return items[0], true
}
```

## apply
ใช้ใน helper ของไลบรารีที่รับ slice ของชนิดที่ผู้เรียกกำหนด

## easy
คืนสมาชิกตัวแรก

## hard
คืนตัวสุดท้ายพร้อมบอกว่ามีค่า

## steps
- ใช้ type parameter เมื่อต้องคืนชนิดเดิม
- คืน zero value เมื่อว่าง
- อย่าใช้ any แล้วให้ผู้เรียก assert
- ใช้ interface เมื่อต้องการพฤติกรรม
