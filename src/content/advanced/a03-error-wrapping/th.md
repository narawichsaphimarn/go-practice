## explanation
ห่อ error ด้วย %w เพื่อเก็บสาเหตุเดิมไว้ errors.Is ตามหาค่า error ใบนั้นในสายที่ห่อไว้ errors.As ดึงชนิดที่ต้องการออกมา ไม่เทียบข้อความที่พิมพ์

```
var ErrBoom = errors.New("boom")

func Wrap() error {
	return fmt.Errorf("wrap: %w", ErrBoom)
}

errors.Is(Wrap(), ErrBoom)
```

ได้ true เพราะ Wrap ห่อ ErrBoom ไว้ แม้ข้อความด้านนอกจะเป็น wrap: boom

## apply
บริการชั้นนอกห่อความผิดของชั้นใน ผู้เรียกตรวจว่าเป็น ErrBoom หรือไม่โดยไม่สนคำอธิบายที่ถูกต่อไว้ ถ้า error มีรหัสอยู่ใน struct ให้ดึงด้วย errors.As

```
type CodeError struct{ Code int }

func (e CodeError) Error() string { return "code" }

func AsCode(err error) int {
	var target CodeError
	if errors.As(err, &target) {
		return target.Code
	}
	return 0
}
```

## easy
Wrap ห่อ ErrBoom ด้วย %w จึงให้ errors.Is เจอ ErrBoom

```
func Wrap() error {
	return fmt.Errorf("wrap: %w", ErrBoom)
}
```

## hard
HasBoom คืน true เมื่อสาย error มียอด ErrBoom แม้จะถูกห่อหลายชั้น AsCode ดึงฟิลด์ Code จาก CodeError ที่ถูกห่อ

```
func HasBoom(err error) bool {
	return errors.Is(err, ErrBoom)
}
```

```
func AsCode(err error) int {
	var target CodeError
	if errors.As(err, &target) {
		return target.Code
	}
	return 0
}
```
