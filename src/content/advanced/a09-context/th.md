## explanation
`context.Context` คือสัญญาณจากผู้เรียกว่างานนี้ยังควรทำต่อหรือควรหยุดแล้ว เช่น ผู้ใช้ปิดหน้าเว็บ หรือเกินเวลาที่ให้ไว้ ฟังก์ชันที่อาจรอนานรับ ctx เป็นพารามิเตอร์ตัวแรกเสมอ

ctx มีสองอย่างที่ใช้บ่อย:

- `ctx.Done()` คือ channel ที่จะถูกปิดเมื่อ context จบ อ่านจากมันได้ทันทีหลังจบ
- `ctx.Err()` เป็น nil ระหว่างที่ยังทำงาน หลังจบจะเป็น `context.Canceled` (ถูกยกเลิก) หรือ `context.DeadlineExceeded` (หมดเวลา)

```
select {
case <-ctx.Done():
	return ctx.Err()
case res := <-results:
	return use(res)
}
```

select ในบท a08 รอหลายทางพร้อมกัน ที่นี่รอทั้งผลงานและสัญญาณหยุด อันไหนมาก่อนก็ทำอันนั้น งานจึงไม่ค้างรอผลที่ไม่มีใครต้องการแล้ว

## apply
ผู้เรียกสร้าง context ลูกจากตัวที่มีอยู่:

- `ctx, cancel := context.WithCancel(parent)` ยกเลิกเองด้วย `cancel()`
- `ctx, cancel := context.WithTimeout(parent, 2*time.Second)` ยกเลิกเองเมื่อครบเวลา

ให้เรียก `defer cancel()` ทันทีหลังสร้าง แม้งานจะเสร็จก่อนก็ตาม ไม่งั้นทรัพยากรของตัวจับเวลาจะค้างอยู่จนหมดเวลา

context ส่งต่อเป็นทอด ๆ ถ้าแม่ถูกยกเลิก ลูกทุกตัวก็จบด้วย เหมือนปิดก๊อกใหญ่แล้วน้ำทุกท่อที่ต่อออกไปหยุดไหล ตัวเริ่มต้นที่ไม่มีวันจบคือ `context.Background()`

## easy
ตัวอย่าง: เช็กก่อนเริ่มงานหนักว่าผู้เรียกยังรออยู่ไหม

```
func Prepare(ctx context.Context) error {
	if err := ctx.Err(); err != nil {
		return err
	}
	return heavyWork()
}
```

ถ้า context ถูกยกเลิกไปแล้ว Prepare คืน `context.Canceled` โดยไม่เริ่ม heavyWork เลย

## hard
ตัวอย่าง: รอคำตอบจาก channel ได้ไม่เกินเวลาที่กำหนด

```
func Ask(ctx context.Context, answers <-chan string) (string, error) {
	ctx, cancel := context.WithTimeout(ctx, 500*time.Millisecond)
	defer cancel()
	select {
	case a := <-answers:
		return a, nil
	case <-ctx.Done():
		return "", ctx.Err()
	}
}
```

ถ้าไม่มีคำตอบภายใน 0.5 วินาที Ask คืน `context.DeadlineExceeded` และถ้าผู้เรียกยกเลิก ctx เดิมก่อน ก็จบทันทีด้วย `context.Canceled`
