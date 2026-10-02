## explanation
interface คือรายการ method ที่ชนิดหนึ่งต้องมี มันบอกแค่ว่า "ทำอะไรได้" ไม่ได้บอกว่า "เป็นอะไร" เหมือนพิธีกรบนเวทีที่ไม่ต้องรู้ว่าใครเป็นหมาหรือแมว แค่ขอให้ส่งเสียง

```
type Speaker interface {
	Speak() string
}
```

ชนิดไหนก็ตามที่มี method `Speak() string` ถือว่าเป็น Speaker ทันที ไม่ต้องเขียนประกาศว่า "ฉันทำตาม Speaker"

```
type Dog struct{}

func (Dog) Speak() string { return "woof" }

var s Speaker = Dog{}
```

บรรทัดสุดท้ายคอมไพล์ผ่าน เพราะ Dog มี Speak ครบแล้ว ถ้าลบ method Speak ออก คอมไพเลอร์จะบอกว่า Dog ไม่ใช่ Speaker

มาจากภาษาอื่น: Java ต้องเขียน `implements Speaker` แต่ Go ไม่มีคำนี้ แค่มี method ครบก็พอ

## apply
ฟังก์ชันที่รับ interface ใช้ได้กับทุกชนิดที่มี method ตามนั้น รวมถึงชนิดที่ยังไม่มีใครเขียนตอนนี้

```
func Announce(s Speaker) string {
	return "on stage: " + s.Speak()
}
```

`Announce(Dog{})` ได้ `on stage: woof` และถ้าวันหลังมีคนเขียน Cat ที่มี Speak ก็ส่ง Cat เข้ามาได้เลยโดยไม่ต้องแก้ Announce

บางครั้งต้องรู้ว่าค่าใน interface เป็นชนิดไหนจริง ๆ ให้ใช้ type switch

```
switch v := s.(type) {
case Dog:
	fmt.Println("a dog")
default:
	fmt.Println("something else", v)
}
```

ควรออกแบบ interface ให้เล็ก มี method น้อยที่สุดเท่าที่ผู้ใช้ต้องการ interface ในไลบรารีมาตรฐานหลายตัวมี method เดียว เช่น `io.Reader`

## easy
ตัวอย่าง: interface สำหรับสิ่งที่บอกราคาได้

```
type Pricer interface {
	Price() int
}

type Coffee struct{}

func (Coffee) Price() int { return 60 }
```

Coffee มี `Price() int` จึงเป็น Pricer แล้ว `var p Pricer = Coffee{}` คอมไพล์ผ่าน

## hard
ตัวอย่าง: รวมราคาของอะไรก็ได้ที่เป็น Pricer

```
type Tea struct{ Cups int }

func (t Tea) Price() int { return 30 * t.Cups }

func Bill(items []Pricer) int {
	total := 0
	for _, it := range items {
		total += it.Price()
	}
	return total
}
```

`Bill([]Pricer{Coffee{}, Tea{Cups: 2}})` ได้ 120 Bill ไม่ต้องรู้เลยว่าในรายการมีกาแฟหรือชา
