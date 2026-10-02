## explanation
log แบบข้อความล้วน เช่น `user ada saved file` อ่านง่ายสำหรับคน แต่เครื่องค้นหายาก log แบบมีโครงสร้างเก็บข้อมูลเป็นคู่ key กับ value จึงค้นได้ว่า "ทุกบรรทัดที่ user=ada" แพ็กเกจ `log/slog` ทำแบบนี้ให้

```
log := slog.New(slog.NewTextHandler(os.Stdout, nil))
log.Info("saved", "user", "ada", "bytes", 512)
```

ได้บรรทัดประมาณนี้

```
time=... level=INFO msg=saved user=ada bytes=512
```

- `slog.New(handler)` สร้าง logger ส่วน handler กำหนดรูปแบบ: `NewTextHandler` เป็น key=value และ `NewJSONHandler` เป็น JSON
- `Info`, `Warn`, `Error`, `Debug` คือระดับความสำคัญ อาร์กิวเมนต์ตัวแรกคือข้อความ ที่เหลือเป็นคู่ key กับ value

## apply
ข้อมูลที่ต้องติดไปกับทุกบรรทัด เช่น รหัสคำขอหรือชื่อผู้ใช้ ให้ผูกไว้ครั้งเดียวด้วย `With` แทนการพิมพ์ซ้ำทุกครั้ง

```
reqLog := log.With("request_id", "r-17")
reqLog.Info("start")
reqLog.Warn("slow", "ms", 900)
```

ทั้งสองบรรทัดมี `request_id=r-17` อยู่ด้วย

ระดับต่ำสุดที่จะบันทึกตั้งได้ใน HandlerOptions เช่น ใน production อาจไม่อยากเก็บ Info

```
h := slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelWarn})
```

handler นี้ทิ้ง Debug กับ Info และเก็บแค่ Warn กับ Error

ถ้าอยากระบุชนิดของค่าให้ชัด ใช้ `slog.Int("code", 7)` หรือ `slog.String("user", "ada")` แทนการเขียน key กับ value แยกกัน

## easy
ตัวอย่าง: บันทึกว่าการสั่งซื้อสำเร็จ พร้อมรหัสและยอดเงิน

```
func Ordered(w io.Writer, id string, total int) {
	log := slog.New(slog.NewTextHandler(w, nil))
	log.Info("ordered", "id", id, "total", total)
}
```

ได้ `level=INFO msg=ordered id=A1 total=250` ต่อท้ายเวลา

## hard
ตัวอย่าง: logger ของ service ที่ทุกบรรทัดมีชื่อ service และเป็น JSON

```
func ServiceLog(w io.Writer, name string) *slog.Logger {
	return slog.New(slog.NewJSONHandler(w, nil)).With("service", name)
}

log := ServiceLog(os.Stdout, "billing")
log.Error("charge failed", "card", "visa")
```

ได้ JSON ที่มี `"service":"billing"` และ `"card":"visa"` ระบบเก็บ log ส่วนใหญ่อ่าน JSON ได้ทันที
