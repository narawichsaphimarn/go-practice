## explanation
generics ให้เขียนฟังก์ชันครั้งเดียวแล้วใช้กับหลายชนิด แทนที่จะเขียน `SumInts`, `SumFloats` แยกกัน ชนิดที่ยังไม่ระบุเรียกว่า type parameter เขียนไว้ในวงเล็บเหลี่ยมหลังชื่อฟังก์ชัน

```
func First[T any](s []T) T {
	return s[0]
}
```

`T` คือชื่อแทนชนิด ส่วน `any` คือ constraint บอกว่า T เป็นชนิดอะไรก็ได้ เวลาเรียก `First([]string{"a", "b"})` คอมไพเลอร์รู้เองว่า T คือ string

ชนิดถูกกำหนดตอนคอมไพล์ ไม่ใช่ตอนรัน ถ้าใช้ผิดชนิด โปรแกรมจะคอมไพล์ไม่ผ่านตั้งแต่แรก

## apply
constraint บอกว่าในฟังก์ชันทำอะไรกับ T ได้บ้าง ให้เลือกตัวที่แคบที่สุดที่ยังพอใช้:

- `any` รับทุกชนิด แต่เทียบหรือบวกกันไม่ได้ ทำได้แค่เก็บและส่งต่อ
- `comparable` ใช้ `==` และ `!=` ได้ เช่น ตอนค้นหาค่าใน slice
- `cmp.Ordered` จากแพ็กเกจ `cmp` ใช้ `<` `>` ได้ เช่น ตอนหาค่าน้อยสุดหรือเรียงลำดับ

```
func Max[T cmp.Ordered](a, b T) T {
	if a > b {
		return a
	}
	return b
}
```

`Max(3, 8)` ได้ 8 และ `Max("kiwi", "apple")` ได้ kiwi เพราะเทียบตามลำดับตัวอักษร

ฟังก์ชันมี type parameter หลายตัวได้ เช่น `[T, U any]` ใช้ตอนชนิดเข้ากับชนิดออกต่างกัน

## easy
ตัวอย่าง: นับว่ามีค่าที่ต้องการกี่ตัว ใช้ได้ทั้ง int และ string

```
func CountOf[T comparable](s []T, v T) int {
	n := 0
	for _, x := range s {
		if x == v {
			n++
		}
	}
	return n
}
```

ต้องใช้ `comparable` เพราะในฟังก์ชันมี `x == v` ถ้าใช้ `any` จะคอมไพล์ไม่ผ่าน

## hard
ตัวอย่าง: แปลงทุกค่าใน slice ด้วยฟังก์ชันที่ส่งเข้ามา แล้วรวมผล

```
func SumBy[T any](s []T, f func(T) int) int {
	total := 0
	for _, x := range s {
		total += f(x)
	}
	return total
}

words := []string{"go", "rust"}
fmt.Println(SumBy(words, func(w string) int { return len(w) }))
```

ได้ 6 T คือ string แต่ผลรวมเป็น int เสมอ เพราะ f คืน int
