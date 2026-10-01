## explanation
io.Reader คือของที่อ่านไบต์ทีละก้อนได้ io.Writer คือของที่เขียนไบต์ลงไปได้ ไม่ต้องรู้ว่าข้างในเป็นไฟล์ หน่วยความจำ หรือเครือข่าย

```
text, err := ReadAll(strings.NewReader("go"))
```

text คือ go เพราะ Reader นี้มีข้อความ go อยู่ในหน่วยความจำ

## apply
อ่านบันทึกทั้งก้อนเมื่อข้อความสั้น เขียนข้อความซ้ำสองครั้งลง log และนับไบต์ที่ไหลผ่านโดยไม่เก็บเนื้อหาไว้

## easy
ReadAll อ่านจนหมดแล้วคืนเป็นสตริง

```
func ReadAll(r io.Reader) (string, error) {
	data, err := io.ReadAll(r)
	if err != nil {
		return "", err
	}
	return string(data), nil
}
```

## hard
Count คืนจำนวนไบต์ที่อ่านได้โดยไม่คืนเนื้อหา WriteTwice เขียนสตริงเดิมลง Writer สองครั้ง

```
func Count(r io.Reader) (int, error) {
	data, err := io.ReadAll(r)
	if err != nil {
		return 0, err
	}
	return len(data), nil
}
```

```
func WriteTwice(w io.Writer, s string) error {
	for i := 0; i < 2; i++ {
		if _, err := io.WriteString(w, s); err != nil {
			return err
		}
	}
	return nil
}
```
