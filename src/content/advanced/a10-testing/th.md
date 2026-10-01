## explanation
เทสต์แบบตารางคือรายการเคสที่ฟังก์ชันเดียวกันต้องตอบถูกทุกแถว Classify รับจำนวนเต็มแล้วคืนคำว่า neg เมื่อติดลบ zero เมื่อเป็นศูนย์ และ pos เมื่อเป็นบวก

```
func Classify(n int) string {
	if n < 0 {
		return "neg"
	}
	if n == 0 {
		return "zero"
	}
	return "pos"
}
```

Classify(-3) ได้ neg Classify(0) ได้ zero Classify(4) ได้ pos

## apply
ตารางเทสต์เรียกฟังก์ชันเดิมหลายครั้ง แต่ละแถวมีอินพุตกับคำตอบที่คาดไว้ แถวที่พังคือแถวที่คำตอบไม่ตรง เช่น InRange(5, 1, 3) ต้องได้ false เพราะ 5 เกิน 3

```
func InRange(n, low, high int) bool {
	return low <= n && n <= high
}
```

## easy
Classify คืน neg เมื่อ n น้อยกว่า 0 คืน zero เมื่อ n เป็น 0 และคืน pos เมื่อ n มากกว่า 0

```
func Classify(n int) string {
	if n < 0 {
		return "neg"
	}
	if n == 0 {
		return "zero"
	}
	return "pos"
}
```

## hard
Sign คืน -1 เมื่อติดลบ คืน 0 เมื่อเป็นศูนย์ และคืน 1 เมื่อเป็นบวก InRange คืน true เมื่อ low <= n <= high

```
func Sign(n int) int {
	if n < 0 {
		return -1
	}
	if n == 0 {
		return 0
	}
	return 1
}
```

```
func InRange(n, low, high int) bool {
	return low <= n && n <= high
}
```
