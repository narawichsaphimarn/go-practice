## explanation
slog เขียน log เป็นข้อความพร้อมคู่ key กับ value ไม่ปนกันในประโยคเดียว Line สร้าง logger ที่เขียนลง Writer แล้วบันทึก msg พร้อมคู่ key value

```
func Line(w io.Writer, msg, key, value string) {
	logger := slog.New(slog.NewTextHandler(w, nil))
	logger.Info(msg, key, value)
}
```

ต้อง import "log/slog" และ "io" Line(w, "saved", "id", "7") เขียนบรรทัดที่มีข้อความ saved และคู่ id=7

## apply
ระดับ Warn คือคำเตือน ไม่ใช่ข้อมูลทั่วไป With คือการติด attribute ไว้กับ logger แล้วทุกบรรทัดที่ logger นั้นเขียนจะมี attribute นั้น

```
func Warn(w io.Writer, code int) {
	logger := slog.New(slog.NewTextHandler(w, nil))
	logger.Warn("warn", "code", code)
}
```

```
func WithUser(w io.Writer, user, msg string) {
	logger := slog.New(slog.NewTextHandler(w, nil)).With("user", user)
	logger.Info(msg)
}
```

WithUser(w, "ann", "login") เขียนบรรทัด login ที่มี user=ann ติดไปด้วย

## easy
Line บันทึก msg กับคู่ key value ลง Writer

```
func Line(w io.Writer, msg, key, value string) {
	logger := slog.New(slog.NewTextHandler(w, nil))
	logger.Info(msg, key, value)
}
```

## hard
WithUser ทำให้ logger มี attribute user ติดไปกับทุกบรรทัด Warn ใช้ระดับ Warn และมี key code

```
func WithUser(w io.Writer, user, msg string) {
	logger := slog.New(slog.NewTextHandler(w, nil)).With("user", user)
	logger.Info(msg)
}
```

```
func Warn(w io.Writer, code int) {
	logger := slog.New(slog.NewTextHandler(w, nil))
	logger.Warn("warn", "code", code)
}
```
