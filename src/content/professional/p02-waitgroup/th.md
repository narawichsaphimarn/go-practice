## explanation
WaitGroup.Add ต้องถูกเรียกก่อน go และควรถูกเรียกใน goroutine เดิมที่รอ ไม่ใช่ข้างใน goroutine ใหม่ go vet มีตัวตรวจ waitgroup ที่เตือนเมื่อ Add อยู่ใน goroutine ที่เพิ่งสร้าง Done ควรวางใน defer

```
wg.Add(1)
go func() {
	defer wg.Done()
}()
wg.Wait()
```

## apply
ใช้รอชุดงานที่ไม่มีผลส่งกลับทีละค่า เช่น ปิดทรัพยากรหลายชิ้นพร้อมกัน

## easy
นับงานที่จบครบ

## hard
จัด Add ให้อยู่ก่อน go เพื่อให้ vet ผ่าน

## steps
- เรียก Add ก่อน go
- วาง Done ใน defer
- เรียก Wait หลังปล่อยงานแล้ว
- รัน go vet ให้เงียบ
