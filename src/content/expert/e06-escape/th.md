## explanation
escape analysis คือขั้นตอนที่คอมไพเลอร์ตัดสินว่าค่าต้องไป heap หรืออยู่บน stack ได้ ถ้าค่าไม่หนีออกจากฟังก์ชัน มันอยู่บน stack ได้

```
func local() int {
	s := []int{1, 2, 3}
	return s[0]
}
```

slice s ถูกใช้แค่ใน local แล้วทิ้ง คอมไพเลอร์จึงมีโอกาสไม่จอง heap ให้ backing array ของมัน

## apply
การที่ backing array ของ slice อยู่บน stack ได้มากขึ้นแปลว่าบาง slice ไม่ต้องจอง heap ถ้าคอมไพเลอร์พิสูจน์ได้ว่าไม่หนี unsafe ที่ผิดอันตรายขึ้นเพราะมันอาจชี้เข้า stack ที่ถูกใช้ซ้ำหลังฟังก์ชันคืน

```
func kept() *int {
	n := 1
	return &n
}
```

n หนีออกจาก kept เพราะมีคนถือ pointer ต่อ ค่านี้ต้องไป heap

## easy
escape analysis ตัดสินว่าค่าต้องไป heap หรืออยู่บน stack ได้

```
func local() int {
	s := []int{1, 2, 3}
	return s[0]
}
```

## hard
unsafe ที่ชี้เข้า stack ผิดอาจชี้เข้าหน่วยความจำที่ถูกใช้ซ้ำหลังฟังก์ชันคืน slice ที่ไม่หนีไม่ต้องจอง heap

```
func local() int {
	s := []int{1, 2, 3}
	return s[0]
}
```
