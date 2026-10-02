## explanation
บท a02 ใช้ generics กับฟังก์ชัน บทนี้ใช้กับชนิด (type) ด้วย ชนิด generic มี type parameter อยู่หลังชื่อ แล้ว method ทุกตัวใช้ชื่อเดียวกันนั้น

```
type Stack[T any] struct {
	items []T
}

func (s *Stack[T]) Push(v T) {
	s.items = append(s.items, v)
}
```

ผู้ใช้เลือกชนิดเองตอนประกาศ เช่น `var s Stack[string]` หรือ `var n Stack[int]` โดยไม่ต้องเขียน Stack ใหม่ทีละชนิด

ชนิดถูกกำหนดตอนคอมไพล์เหมือนในบท a02 `Stack[int]` จึงรับ string ไม่ได้ตั้งแต่ตอน build

## apply
API ที่อาจไม่มีค่าให้คืน ควรคืนสองค่าแบบ `(ค่า, ok)` เหมือนการอ่าน map ผู้เรียกจะแยกได้ว่า "ไม่มีค่า" ต่างจาก "ได้ค่าศูนย์"

```
func (s *Stack[T]) Pop() (T, bool) {
	if len(s.items) == 0 {
		var zero T
		return zero, false
	}
	last := s.items[len(s.items)-1]
	s.items = s.items[:len(s.items)-1]
	return last, true
}
```

`var zero T` คือวิธีเดียวที่จะได้ค่าศูนย์ของ T เพราะไม่รู้ล่วงหน้าว่า T เป็นชนิดอะไร

ใช้ generics เมื่อผู้เรียกเป็นคนกำหนดชนิด เช่น คอลเลกชันหรือ cache ถ้าฟังก์ชันใช้กับชนิดเดียวอยู่แล้ว เขียนแบบธรรมดาจะอ่านง่ายกว่า ถ้าแค่ต้องเรียก method ร่วมกัน ใช้ interface แบบในบท a01 ก็พอ

## easy
ตัวอย่าง: คืนสมาชิกที่ตำแหน่ง i ถ้ามีอยู่จริง

```
func At[T any](items []T, i int) (T, bool) {
	if i < 0 || i >= len(items) {
		var zero T
		return zero, false
	}
	return items[i], true
}
```

`At([]string{"a"}, 3)` ได้ข้อความว่างกับ false แทนที่จะ panic

## hard
ตัวอย่าง: ชนิด generic ที่นับว่าแต่ละค่าโผล่กี่ครั้ง

```
type Counter[K comparable] struct {
	counts map[K]int
}

func (c *Counter[K]) Add(k K) {
	if c.counts == nil {
		c.counts = make(map[K]int)
	}
	c.counts[k]++
}

func (c *Counter[K]) Count(k K) int {
	return c.counts[k]
}
```

`var c Counter[string]` ใช้ได้ทันทีโดยไม่ต้องสร้าง map ก่อน เพราะ Add สร้างให้ตอนเรียกครั้งแรก ส่วน Count อ่าน map ที่เป็น nil ได้และได้ 0
