## explanation
struct รวมข้อมูลที่เกี่ยวข้องเป็นก้อนเดียว method คือฟังก์ชันที่ผูกกับก้อนนั้น ถ้า method ต้องแก้ข้อมูลในก้อน ให้รับ pointer คือ *Rect ไม่ใช่สำเนา

```
type Rect struct {
	W int
	H int
}

func Area(r Rect) int {
	return r.W * r.H
}
```

## apply
กล่องสี่เหลี่ยมกว้าง 3 สูง 4 มีพื้นที่ 12 Grow ขยายทั้งกว้างและสูงเท่ากัน Rename เปลี่ยนชื่อคนใน struct User

```
box := Rect{W: 3, H: 4}
fmt.Println(Area(box))
```

## easy
Area คืนความกว้างคูณความสูงของ Rect

```
func Area(r Rect) int {
	return r.W * r.H
}
```

## hard
Grow บวก n ให้ทั้ง W และ H ต้องเป็น method บน *Rect จึงแก้กล่องใบเดิมได้ Rename ตั้ง Name ใหม่บน *User

```
func (r *Rect) Grow(n int) {
	r.W += n
	r.H += n
}
```

```
func (u *User) Rename(name string) {
	u.Name = name
}
```
