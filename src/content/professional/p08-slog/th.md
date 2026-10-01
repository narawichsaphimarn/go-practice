## explanation
log/slog ส่งข้อความพร้อมคู่ key และ value handler แบบ text พิมพ์เป็น msg= และ key=value การต่อสตริงเองทำให้เครื่องที่อ่าน log แยกฟิลด์ไม่ได้

```
logger.Info("hello", "user", "ada")
```

## apply
ใช้ใน service ที่ต้องค้น log ตามรหัสผู้ใช้หรือรหัส request

## easy
เขียนหนึ่งบรรทัดที่มี msg และ key

## hard
ส่งค่าคนละชนิดโดยยังเป็นคู่

## steps
- สร้าง logger จาก handler
- ส่ง key แล้วตามด้วย value
- อย่าต่อข้อความทั้งก้อนเอง
- ตรวจว่าผลมีทั้ง msg และ key
