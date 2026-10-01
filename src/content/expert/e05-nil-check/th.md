## explanation
pointer ที่เป็น nil ไม่ได้ชี้ออบเจ็กต์ การ dereference คือการไปอ่านค่าที่มันชี้ main ด้านล่างตั้งใจ panic เพราะอ่าน *int ที่เป็น nil

```
func main() {
	var p *int
	fmt.Println(*p)
}
```

p ไม่ได้ชี้ int จริง *p จึง panic ด้วย nil pointer

## apply
struct ที่เป็น nil ก็อ่านฟิลด์ไม่ได้ และ method ที่อ่านฟิลด์บน receiver ที่เป็น nil ก็ panic เช่นกัน ทั้งสามแบบนี้ตั้งใจให้โปรแกรมล้ม

```
type Box struct {
	N int
}

func main() {
	var b *Box
	fmt.Println(b.N)
}
```

b ไม่ได้ชี้ Box จริง b.N จึง panic

## easy
ทำให้ main panic โดย dereference *int ที่เป็น nil

```
func main() {
	var p *int
	fmt.Println(*p)
}
```

## hard
เรียก method Name ที่อ่านฟิลด์บน receiver ที่เป็น nil โปรแกรมต้อง panic การอ่านฟิลด์ผ่าน pointer ของ struct ที่เป็น nil ก็ panic เช่นกัน

```
type User struct {
	Name string
}

func (u *User) Label() string {
	return u.Name
}

func main() {
	var u *User
	fmt.Println(u.Label())
}
```

```
type Box struct {
	N int
}

func main() {
	var b *Box
	fmt.Println(b.N)
}
```
