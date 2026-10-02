## explanation
`io.Reader` คือของที่อ่านข้อมูลออกมาได้ทีละช่วง และ `io.Writer` คือของที่รับข้อมูลเขียนลงไปได้ ทั้งคู่เป็น interface ที่มี method เดียว

```
type Reader interface {
	Read(p []byte) (n int, err error)
}

type Writer interface {
	Write(p []byte) (n int, err error)
}
```

ไฟล์, การเชื่อมต่อเครือข่าย, `strings.NewReader("...")` และ `bytes.Buffer` ล้วนเป็น Reader หรือ Writer ฟังก์ชันที่รับ `io.Reader` จึงใช้ได้กับทุกแหล่ง เหมือนท่อน้ำที่ต่อเข้ากับก๊อกไหนก็ได้

Read ส่งคืน `io.EOF` เมื่ออ่านหมดแล้ว ซึ่งไม่ได้แปลว่าผิดพลาด แค่บอกว่าข้อมูลจบ

## apply
ส่วนใหญ่ไม่ต้องเรียก Read เอง ใช้ฟังก์ชันในแพ็กเกจ io:

- `io.ReadAll(r)` อ่านจนหมดแล้วคืน `[]byte` สะดวกเมื่อข้อมูลเล็ก
- `io.Copy(w, r)` ส่งข้อมูลจาก r ไป w ทีละช่วง ไม่ต้องเก็บทั้งก้อนในหน่วยความจำ
- `io.WriteString(w, s)` เขียนข้อความลง w
- `io.LimitReader(r, n)` ห่อ r ให้อ่านได้ไม่เกิน n ไบต์
- `io.Discard` คือ Writer ที่ทิ้งทุกอย่าง ใช้ตอนต้องการแค่นับหรืออ่านให้หมด

ไฟล์ขนาด 2 GB ถ้าใช้ ReadAll ต้องจองหน่วยความจำ 2 GB แต่ io.Copy ใช้แค่บัฟเฟอร์เล็ก ๆ ตลอดทาง

## easy
ตัวอย่าง: อ่านข้อความทั้งหมดแล้วนับจำนวนบรรทัด

```
func Lines(r io.Reader) (int, error) {
	data, err := io.ReadAll(r)
	if err != nil {
		return 0, err
	}
	return strings.Count(string(data), "\n"), nil
}
```

`Lines(strings.NewReader("a\nb\n"))` ได้ 2

## hard
ตัวอย่าง: คัดลอกข้อมูลไปที่ปลายทาง แล้วบอกว่าคัดลอกไปกี่ไบต์ โดยไม่เก็บทั้งก้อน

```
func Save(dst io.Writer, src io.Reader) (int64, error) {
	n, err := io.Copy(dst, src)
	if err != nil {
		return n, fmt.Errorf("save: %w", err)
	}
	return n, nil
}
```

dst จะเป็นไฟล์, `bytes.Buffer` หรือ `os.Stdout` ก็ได้ Save ไม่ต้องรู้ เพราะรับแค่ io.Writer
