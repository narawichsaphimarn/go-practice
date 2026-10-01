## explanation
testing/synctest ใน Go 1.25 ให้ทดสอบโค้ดที่เรียก time.Sleep โดยนาฬิกาใน bubble เดินเมื่อ goroutine ใน bubble ว่างทั้งหมด เทสต์จึงไม่ต้องรอเวลาจริงหนึ่งวินาที

```
synctest.Test(t, func(t *testing.T) {
	time.Sleep(time.Second)
})
```

## apply
ใช้กับโค้ดที่ยกเลิกตามเวลา หรือหน่วงก่อนลองใหม่ โดยไม่ทำให้ชุดเทสต์ช้า

## easy
นอนหนึ่งวินาทีใน bubble แล้วคืน 1

## hard
คืนระยะเวลาที่นาฬิกาใน bubble เดินไป

## steps
- เรียก time.Sleep ในฟังก์ชันที่ถูกเทสต์
- อย่าใช้เวลาจริงนอก bubble
- ให้เทสต์ที่ซ่อนไว้เป็นคนห่อ synctest.Test
- ตรวจทั้งค่าที่คืนและเวลาที่เดิน
