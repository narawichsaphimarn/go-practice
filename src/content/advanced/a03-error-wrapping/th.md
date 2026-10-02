## explanation
เมื่อ error ผ่านหลายชั้นของโปรแกรม แต่ละชั้นควรเติมบริบทว่ากำลังทำอะไรอยู่ โดยไม่ทิ้งสาเหตุเดิม เหมือนใส่จดหมายลงซองแล้วเขียนหน้าซองเพิ่ม จดหมายข้างในยังอยู่ครบ

```
var ErrNotFound = errors.New("not found")

func Find() error {
	return fmt.Errorf("find user 7: %w", ErrNotFound)
}
```

`%w` ห่อ ErrNotFound ไว้ข้างใน ข้อความรวมเป็น `find user 7: not found` ส่วน `%v` จะเก็บแค่ข้อความ แล้วสาเหตุเดิมก็หายไป

## apply
ผู้เรียกหาสาเหตุได้สองแบบ โดยไม่ต้องเทียบข้อความ:

- `errors.Is(err, ErrNotFound)` ตอบว่ามี error ตัวนี้อยู่ในซองชั้นไหนก็ได้หรือไม่ ใช้กับ error ที่ประกาศไว้เป็นตัวแปร (sentinel error)
- `errors.As(err, &target)` หา error ที่เป็นชนิดของ target ถ้าเจอก็ใส่ค่าลง target ใช้เมื่อ error มีข้อมูลเพิ่ม เช่น รหัส

```
type HTTPError struct{ Status int }

func (e HTTPError) Error() string { return fmt.Sprint("status ", e.Status) }

var he HTTPError
if errors.As(err, &he) {
	fmt.Println(he.Status)
}
```

ทำไมไม่เทียบข้อความ: ข้อความเปลี่ยนได้ทุกครั้งที่มีคนแก้คำ และ error สองตัวอาจมีข้อความเหมือนกันโดยบังเอิญ แต่ errors.Is เทียบว่าเป็นค่าตัวเดียวกันจริง

ถ้ามีหลายปัญหาพร้อมกัน `errors.Join(e1, e2)` รวมเป็น error เดียว แล้ว errors.Is ยังหาเจอทุกตัว และ Join จะคืน nil เมื่อไม่มีอะไรให้รวม

## easy
ตัวอย่าง: เติมชื่อไฟล์ลงใน error ที่ได้จากชั้นล่าง

```
func ReadConfig(name string) error {
	err := ErrNotFound
	return fmt.Errorf("read %s: %w", name, err)
}
```

`ReadConfig("app.yaml")` ได้ข้อความ `read app.yaml: not found` และ `errors.Is(..., ErrNotFound)` ยังเป็น true

## hard
ตัวอย่าง: แปลง error เป็นรหัส HTTP โดยดูสาเหตุข้างใน

```
func StatusOf(err error) int {
	var he HTTPError
	switch {
	case err == nil:
		return 200
	case errors.As(err, &he):
		return he.Status
	case errors.Is(err, ErrNotFound):
		return 404
	default:
		return 500
	}
}
```

`switch` ที่ไม่มีค่าหลังคำว่า switch จะเลือก case แรกที่เงื่อนไขเป็นจริง error ที่ห่อ HTTPError{Status: 403} ไว้กี่ชั้นก็ได้ 403
