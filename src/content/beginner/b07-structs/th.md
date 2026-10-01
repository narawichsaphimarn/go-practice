## explanation
struct รวมข้อมูลหลายชิ้นที่เกี่ยวกันไว้เป็นก้อนเดียว เหมือนแถวหนึ่งในตารางที่มีหัวคอลัมน์ แต่ละช่องเรียกว่าฟิลด์ (field)

```
type Book struct {
	Title string
	Pages int
}

b := Book{Title: "Go", Pages: 120}
fmt.Println(b.Title)
```

- `type Book struct { ... }` สร้างชนิดใหม่ชื่อ Book ที่มีสองฟิลด์
- `Book{Title: "Go", Pages: 120}` สร้างค่าของ Book ฟิลด์ที่ไม่ได้ใส่จะได้ค่าศูนย์
- `b.Title` อ่านฟิลด์ด้วยจุด ได้ `Go`

## apply
method คือฟังก์ชันที่ผูกกับชนิด เขียนชนิดนั้นไว้ในวงเล็บหน้าชื่อฟังก์ชัน วงเล็บนี้เรียกว่า receiver

```
func (b Book) Long() bool {
	return b.Pages > 300
}

fmt.Println(b.Long())
```

เรียก method ด้วยจุดเหมือนอ่านฟิลด์ ได้ false เพราะ 120 ไม่มากกว่า 300

receiver แบบ `(b Book)` ได้สำเนา เหมือนพารามิเตอร์ธรรมดาในบทที่แล้ว ถ้า method ต้องแก้ค่าตัวจริง ให้ใช้ receiver เป็น pointer คือ `(b *Book)`

```
func (b *Book) AddPages(n int) {
	b.Pages += n
}

b.AddPages(30)
```

หลังเรียก b.Pages เป็น 150 เขียน `b.AddPages(30)` ได้เลยโดยไม่ต้องใส่ `&` เพราะ Go เอาที่อยู่ของ b ให้เอง ส่วนใน method ใช้ `b.Pages` ได้ตรง ๆ ไม่ต้องเขียน `(*b).Pages`

## easy
ตัวอย่าง: method ที่คืนเส้นรอบรูปของสี่เหลี่ยม

```
type Box struct {
	W int
	H int
}

func (x Box) Perimeter() int {
	return 2 * (x.W + x.H)
}
```

`Box{W: 3, H: 4}.Perimeter()` ได้ 14 method นี้แค่อ่านค่า receiver จึงไม่ต้องเป็น pointer

## hard
ตัวอย่าง: บัญชีที่ฝากเงินได้และดูยอดได้

```
type Account struct {
	History []int
}

func (a *Account) Deposit(n int) {
	a.History = append(a.History, n)
}

func (a Account) Balance() int {
	total := 0
	for _, n := range a.History {
		total += n
	}
	return total
}
```

Deposit ต้องเปลี่ยนบัญชีตัวจริง จึงใช้ `*Account` ส่วน Balance แค่อ่าน จึงใช้ `Account` ฝาก 100 แล้ว 50 จะได้ Balance เป็น 150
