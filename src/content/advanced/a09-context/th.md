## explanation
context คือสัญญาณว่าผู้เรียกยังอยากให้งานทำต่อหรือไม่ เมื่อจบแล้ว ctx.Err() ไม่เป็น nil และ ctx.Done() พร้อมให้อ่าน

```
func Done(ctx context.Context) bool {
	select {
	case <-ctx.Done():
		return true
	default:
		return false
	}
}
```

## apply
ส่ง context ลงไปในฟังก์ชันที่รอ ถ้าผู้ใช้กดยกเลิก งานข้างในเลิกแล้วคืน ctx.Err() แทนผลปกติ

```
func Wait(ctx context.Context) error {
	<-ctx.Done()
	return ctx.Err()
}
```

## easy
Done คืน true เมื่อ context จบแล้ว และ false เมื่อยังไม่จบ

```
func Done(ctx context.Context) bool {
	select {
	case <-ctx.Done():
		return true
	default:
		return false
	}
}
```

## hard
Wait บล็อกจน context จบแล้วคืน ctx.Err() OrDefault คืน 0 เมื่อจบแล้ว และคืน value เมื่อยังไม่จบ

```
func Wait(ctx context.Context) error {
	<-ctx.Done()
	return ctx.Err()
}
```

```
func OrDefault(ctx context.Context, value int) int {
	select {
	case <-ctx.Done():
		return 0
	default:
		return value
	}
}
```
