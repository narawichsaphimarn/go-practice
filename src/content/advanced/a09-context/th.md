## explanation
context.Context พกสัญญาณยกเลิกและเส้นตาย ผู้เรียกสร้างด้วย WithCancel หรือ WithTimeout แล้วส่งเป็นอาร์กิวเมนต์แรก งานที่รอต้องเลือก ctx.Done()

```
if err := ctx.Err(); err != nil {
	return err
}
```

## apply
ใช้ตัดงาน HTTP เมื่อผู้ใช้ปิดหน้า หรือเมื่อหมดเวลาที่กำหนดไว้ที่ขอบของ request

## easy
บอกว่า context จบแล้วหรือยัง

## hard
คืนค่าเริ่มเมื่อถูกยกเลิก หรือรอจน Done

## steps
- รับ ctx เป็นอาร์กิวเมนต์แรก
- ตรวจ ctx.Err()
- เลิกงานเมื่อ Done
- อย่าเก็บ context ไว้ใน struct ของ request
