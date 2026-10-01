## explanation
generic คือฟังก์ชันที่ยังไม่ล็อกชนิดไว้ จนกว่าผู้เรียกจะส่งค่าเข้ามา ใช้เมื่อขั้นตอนเดียวกันใช้ได้กับหลายชนิด เช่น คืนค่าเดิม หรือหาค่าที่น้อยกว่า

```
func Identity[T any](v T) T {
	return v
}
```

Identity(1) ได้ 1 และ Identity("go") ได้ go โดยไม่เขียนฟังก์ชันคนละตัว

## apply
เมื่อชนิดต้องไปกับผู้เรียก ไม่ใช่ชนิดตายตัวในฟังก์ชัน Min ใช้ได้ทั้ง int และ string ที่เรียงได้เพราะ constraint คือ cmp.Ordered Map แปลงสมาชิกทุกตัวด้วยฟังก์ชันที่ผู้เรียกส่งมา

```
func Min[T cmp.Ordered](a, b T) T {
	if a < b {
		return a
	}
	return b
}
```

## easy
Identity คืนค่าที่รับมาทุกประการ

```
func Identity[T any](v T) T {
	return v
}
```

## hard
Map สร้าง slice ใหม่โดยเรียก f กับทุกสมาชิก Min คืนตัวที่น้อยกว่าระหว่าง a กับ b

```
func Map[T any, U any](in []T, f func(T) U) []U {
	out := make([]U, len(in))
	for i, v := range in {
		out[i] = f(v)
	}
	return out
}
```

```
func Min[T cmp.Ordered](a, b T) T {
	if a < b {
		return a
	}
	return b
}
```
