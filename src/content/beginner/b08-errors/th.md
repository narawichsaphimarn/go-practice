## explanation
ใน Go ความผิดพลาดเป็นค่าธรรมดาชนิด `error` ฟังก์ชันที่อาจทำไม่สำเร็จจะคืน error เป็นค่าสุดท้าย ถ้าไม่มีปัญหา error จะเป็น `nil` (แปลว่า "ไม่มี")

```
import "errors"

func Withdraw(balance, amount int) (int, error) {
	if amount > balance {
		return balance, errors.New("not enough money")
	}
	return balance - amount, nil
}
```

`errors.New("...")` สร้าง error พร้อมข้อความ ภาษาอื่นอย่าง Python ใช้ try/except จับความผิดพลาด แต่ Go คืน error ออกมาตรง ๆ ให้ผู้เรียกเช็กเอง

## apply
ผู้เรียกต้องเช็ก error ทันทีหลังเรียก ถ้ามีปัญหาก็หยุด อย่าใช้ผลต่อเหมือนว่าทำสำเร็จ

```
left, err := Withdraw(100, 250)
if err != nil {
	fmt.Println("cannot withdraw:", err)
	return
}
fmt.Println(left)
```

ได้ `cannot withdraw: not enough money` และไม่พิมพ์ยอดเงิน รูปแบบ `if err != nil { ... }` จะเห็นบ่อยมากในโค้ด Go

แพ็กเกจมาตรฐานหลายตัวก็คืน error แบบนี้ เช่น `strconv.Atoi` แปลงข้อความเป็นตัวเลข และคืน error เมื่อข้อความนั้นไม่ใช่ตัวเลข

```
import "strconv"

n, err := strconv.Atoi("42")
```

ได้ n เป็น 42 และ err เป็น nil ส่วน `strconv.Atoi("hi")` จะได้ err ที่ไม่ใช่ nil

## easy
ตัวอย่าง: ตรวจว่าอายุอยู่ในช่วงที่รับได้

```
func CheckAge(age int) error {
	if age < 0 {
		return errors.New("age is negative")
	}
	return nil
}
```

ฟังก์ชันนี้ไม่มีผลอื่นให้คืน จึงคืนแค่ error อย่างเดียว

## hard
ตัวอย่าง: แปลงข้อความเป็นจำนวนชิ้น ต้องเป็นตัวเลขและไม่เกิน 10

```
func ParseQty(s string) (int, error) {
	n, err := strconv.Atoi(s)
	if err != nil {
		return 0, err
	}
	if n > 10 {
		return 0, errors.New("too many")
	}
	return n, nil
}
```

`ParseQty("3")` ได้ 3 กับ nil, `ParseQty("x")` ได้ error จาก Atoi และ `ParseQty("12")` ได้ error ว่า too many ทุกทางที่ล้มเหลวจะคืน 0 เป็นค่าแรก เพื่อไม่ให้ใครเผลอใช้ตัวเลขที่ผิด
