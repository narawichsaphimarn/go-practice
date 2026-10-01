## explanation
ตัวแปรคือชื่อที่เก็บค่าไว้ใช้ทีหลัง ถ้าประกาศชนิดไว้แต่ยังไม่ใส่ค่า Go ให้ค่าศูนย์ของชนิดนั้น int ได้ 0 string ได้ข้อความว่าง bool ได้ false

```
var count int
var name string
var ready bool

fmt.Println(count)
fmt.Println(name)
fmt.Println(ready)
```

ผลคือ 0 บรรทัดว่าง แล้ว false

## apply
เมื่อต้องพิมพ์ค่าที่คำนวณไว้ ไม่พิมพ์ตัวหนังสือตายตัว ให้เก็บในตัวแปรแล้วส่งตัวแปรเข้า Println

```
lang := "go"
fmt.Println(lang)
```

ได้คำว่า go เพราะพิมพ์ค่าใน lang ไม่ใช่เพราะพิมพ์คำว่า lang

## easy
ประกาศ int โดยไม่ใส่ค่า แล้วพิมพ์ตัวแปรนั้น จะได้ 0

```
var n int
fmt.Println(n)
```

## hard
bool ที่ยังไม่ใส่ค่าคือ false ไม่ใช่ true และไม่ใช่ข้อความว่าง

```
var ok bool
fmt.Println(ok)
```
