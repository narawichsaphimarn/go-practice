## explanation
งานที่บล็อกต้องฟัง ctx.Done() คู่กับช่องทางของงานเอง ถ้าผู้เรียกยกเลิก ฟังก์ชันควรคืน ctx.Err() แทนที่จะรอต่อ

```
select {
case <-ctx.Done():
	return ctx.Err()
case v := <-work:
	return use(v)
}
```

## apply
ใช้ใน handler ที่ต้องเลิกคำนวณเมื่อ client ตัดการเชื่อมต่อ

## easy
คืน error เมื่อ context จบแล้ว

## hard
เลือกได้ทั้งผลงานกับสัญญาณยกเลิก

## steps
- ส่ง ctx ลงไปทุกชั้น
- เลือก Done กับงานใน select
- คืน ctx.Err()
- อย่ารอ sleep คงที่แทนการยกเลิก
