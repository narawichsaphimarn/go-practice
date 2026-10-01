## explanation
select รอหลาย channel พร้อมกัน เคสที่พร้อมก่อนจะถูกเลือก ถ้ามี default จะไม่รอ ถ้าใส่ time.After จะออกเมื่อหมดเวลา

```
select {
case v := <-ch:
	return v
default:
	return 0
}
```

## apply
ใช้ใน client ที่ต้องไม่แขวน และในลูปที่รับได้ทั้งงานกับสัญญาณยกเลิก

## easy
เลือก channel ที่พร้อม

## hard
คืนค่าทันทีเมื่อยังไม่พร้อม หรือคืนค่าพิเศษเมื่อหมดเวลา

## steps
- ใส่ทุก channel ที่รอได้ใน select
- ใช้ default เมื่อห้ามบล็อก
- ใช้ time.After เมื่อต้องจำกัดเวลา
- อย่าลืมว่า After สร้าง timer
