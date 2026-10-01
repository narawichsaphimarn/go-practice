## explanation
context ที่จบแล้วบอกว่างานต้องหยุด ctx.Done() พร้อมให้อ่าน และ ctx.Err() คือเหตุผลที่จบ เช่น ผู้เรียกยกเลิก Stopped ดูสถานะนั้นแล้วคืน error เมื่อจบแล้ว

```
func Stopped(ctx context.Context) error {
	select {
	case <-ctx.Done():
		return ctx.Err()
	default:
		return nil
	}
}
```

ต้อง import "context" ถ้า context ยังไม่จบ Stopped คืน nil

## apply
Take รอค่าจาก channel แต่ถ้า context จบก่อนก็เลิกแล้วคืน 0 Wait ยืนรอจน context จบ แล้วคืน ctx.Err() ให้ผู้เรียก

```
func Take(ctx context.Context, ch <-chan int) int {
	select {
	case v := <-ch:
		return v
	case <-ctx.Done():
		return 0
	}
}
```

ถ้า ch มีค่า 7 และ context ยังไม่จบ Take ได้ 7 ถ้า context จบก่อนมีค่า Take ได้ 0

## easy
Stopped คืน ctx.Err() เมื่อ context จบแล้ว และคืน nil เมื่อยังไม่จบ

```
func Stopped(ctx context.Context) error {
	select {
	case <-ctx.Done():
		return ctx.Err()
	default:
		return nil
	}
}
```

## hard
Wait บล็อกจน context จบแล้วคืน ctx.Err() Take คืนค่าจาก channel เมื่อมีค่า และคืน 0 เมื่อ context จบ

```
func Wait(ctx context.Context) error {
	<-ctx.Done()
	return ctx.Err()
}
```

```
func Take(ctx context.Context, ch <-chan int) int {
	select {
	case v := <-ch:
		return v
	case <-ctx.Done():
		return 0
	}
}
```
