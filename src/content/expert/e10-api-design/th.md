## explanation
interface ที่ดีสำหรับผู้เรียกมีเท่าพฤติกรรมที่ผู้เรียกต้องใช้ ถ้าผู้เรียกแค่ขออ่านไบต์ ก็มี method Read ตัวเดียวพอ

```
type Reader interface {
	Read(p []byte) (int, error)
}
```

ชื่อ package ควรสั้นและเป็นคำนาม เช่น package http ไม่ใช่ประโยคยาว

```
package store
```

## apply
error ที่ผู้เรียกต้องแยกเคสต้องเป็นค่าที่ตรวจด้วย errors.Is ได้ ไม่ใช่ข้อความอย่างเดียว ErrNotFound คือค่าที่ผู้เรียกเทียบได้

```
var ErrNotFound = errors.New("not found")

func Find(id string) error {
	return fmt.Errorf("find %s: %w", id, ErrNotFound)
}
```

ผู้เรียกเขียน errors.Is(err, ErrNotFound) แล้วได้ true เพราะ Find ห่อด้วย %w

## easy
interface มีเท่าพฤติกรรมที่ผู้เรียกต้องใช้ Reader มีแค่ Read

```
type Reader interface {
	Read(p []byte) (int, error)
}
```

## hard
error ที่ผู้เรียกต้องแยกเคสเป็นค่าที่ errors.Is มองเห็น ชื่อ package สั้นและเป็นคำนาม

```
var ErrNotFound = errors.New("not found")

func Find(id string) error {
	return fmt.Errorf("find %s: %w", id, ErrNotFound)
}
```

```
package store
```
