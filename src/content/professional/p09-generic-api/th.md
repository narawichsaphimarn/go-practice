## explanation
generic คือฟังก์ชันที่ชนิดของข้อมูลไปกับผู้เรียก First[T any] ใช้ได้กับ slice ของชนิดใดก็ได้ เมื่อมีสมาชิก คืนตัวแรกกับ true เมื่อว่าง คืนค่าศูนย์ของชนิดนั้นกับ false

```
func First[T any](items []T) (T, bool) {
	if len(items) == 0 {
		var zero T
		return zero, false
	}
	return items[0], true
}
```

First([]int{4, 5}) ได้ 4 และ true First ของ slice ว่างได้ 0 และ false

## apply
Last คืนสมาชิกตัวท้าย At คืนสมาชิกที่ index เมื่อ index อยู่ในขอบ 0 ถึง len-1 และคืน false เมื่อ index ติดลบหรือเลยท้าย

```
func Last[T any](items []T) (T, bool) {
	if len(items) == 0 {
		var zero T
		return zero, false
	}
	return items[len(items)-1], true
}
```

Last([]string{"a", "b"}) ได้ "b" และ true

## easy
First คืนสมาชิกแรกและ true หรือค่าศูนย์กับ false เมื่อ items ว่าง

```
func First[T any](items []T) (T, bool) {
	if len(items) == 0 {
		var zero T
		return zero, false
	}
	return items[0], true
}
```

## hard
At คืน items[index] และ true เมื่อ index อยู่ในขอบ และคืนค่าศูนย์กับ false เมื่อเกิน Last คืนสมาชิกสุดท้ายและ true

```
func At[T any](items []T, index int) (T, bool) {
	if index < 0 || index >= len(items) {
		var zero T
		return zero, false
	}
	return items[index], true
}
```

```
func Last[T any](items []T) (T, bool) {
	if len(items) == 0 {
		var zero T
		return zero, false
	}
	return items[len(items)-1], true
}
```
