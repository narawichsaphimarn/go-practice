## explanation
เมื่อทำงานไม่สำเร็จ ให้คืน error แล้วผู้เรียกหยุด อย่าแกล้งคืนผลที่ดูเหมือนสำเร็จ error ที่ไม่มีปัญหาคือ nil

```
func Div(a, b int) (int, error) {
	if b == 0 {
		return 0, fmt.Errorf("divide by zero")
	}
	return a / b, nil
}
```

## apply
หารเลขในแบบฟอร์ม ถ้าตัวหารเป็น 0 ให้บอกผู้ใช้ว่าหารไม่ได้ ไม่แสดงผล 0 ราวกับว่าคำนวณได้

```
n, err := Div(4, 0)
if err != nil {
	fmt.Println(err)
	return
}
fmt.Println(n)
```

## easy
Div คืน error เมื่อ b เป็น 0 และคืน a/b กับ nil เมื่อสำเร็จ

```
func Div(a, b int) (int, error) {
	if b == 0 {
		return 0, fmt.Errorf("divide by zero")
	}
	return a / b, nil
}
```

## hard
MustHave คืน error เมื่อสตริงว่าง และคืน nil เมื่อมีข้อความ ParsePositive รับเฉพาะจำนวนที่มากกว่า 0

```
func MustHave(s string) error {
	if s == "" {
		return fmt.Errorf("empty")
	}
	return nil
}
```

```
func ParsePositive(s string) (int, error) {
	n, err := strconv.Atoi(s)
	if err != nil || n <= 0 {
		return 0, fmt.Errorf("not positive")
	}
	return n, nil
}
```
