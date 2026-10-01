## explanation
ตัวแปรธรรมดาคือค่าที่ก็อปได้ pointer คือที่อยู่ของค่าใบเดิม การแก้ผ่าน pointer จึงเปลี่ยนต้นฉบับ ไม่ใช่สำเนา

```
n := 1
Inc(&n)
fmt.Println(n)
```

หลัง Inc ค่า n เป็น 2 เพราะฟังก์ชันเขียนทับค่าที่ที่อยู่นั้น

## apply
นับคลิกที่ต้องเพิ่มบนตัวเลขใบเดิม ใช้ Inc สลับคะแนนสองคนใช้ Swap เปลี่ยนชื่อใน User ที่ส่งมาเป็น pointer ใช้ SetName

## easy
Inc เพิ่มค่าที่ pointer ชี้อยู่หนึ่ง

```
func Inc(n *int) {
	*n = *n + 1
}
```

## hard
Swap สลับค่าของสอง pointer โดยเก็บค่าหนึ่งไว้ก่อน SetName ตั้ง Name บน User ที่ pointer ชี้อยู่

```
func Swap(a, b *int) {
	kept := *a
	*a = *b
	*b = kept
}
```

```
func SetName(u *User, name string) {
	u.Name = name
}
```
