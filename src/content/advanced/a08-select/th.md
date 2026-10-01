## explanation
select รอหลาย channel พร้อมกัน แล้วทำกรณีที่พร้อมก่อน ใส่ default ถ้าอยากไปต่อทันทีเมื่อยังไม่มีค่า ใส่ time.After ถ้าอยากเลิกเมื่อหมดเวลา

```
func FirstReady(a, b <-chan int) int {
	select {
	case v := <-a:
		return v
	case v := <-b:
		return v
	}
}
```

## apply
รับผลจากงานสองชิ้น ชิ้นไหนเสร็จก่อนใช้ชิ้นนั้น ถ้ายังไม่มีค่าให้ใช้ 0 แทนการรอ และถ้าว่างเกิน 20 มิลลิวินาทีให้คืน -1

## easy
FirstReady คืนค่าจาก channel ที่พร้อมก่อนระหว่าง a กับ b

```
func FirstReady(a, b <-chan int) int {
	select {
	case v := <-a:
		return v
	case v := <-b:
		return v
	}
}
```

## hard
OrTimeout คืน -1 เมื่อ channel ว่างเกิน 20 มิลลิวินาที OrZero คืนค่าใน channel หรือ 0 ทันทีถ้ายังไม่มีค่า

```
func OrTimeout(ch <-chan int) int {
	select {
	case v := <-ch:
		return v
	case <-time.After(20 * time.Millisecond):
		return -1
	}
}
```

```
func OrZero(ch <-chan int) int {
	select {
	case v := <-ch:
		return v
	default:
		return 0
	}
}
```
