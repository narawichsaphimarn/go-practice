## explanation
slice คือแถวของค่าชนิดเดียวกันที่เรียงต่อกัน เหมือนช่องเก็บของที่มีเลขกำกับ ช่องแรกคือเลข 0 ไม่ใช่ 1

```
prices := []int{40, 25, 60}
fmt.Println(prices[0])
fmt.Println(len(prices))
fmt.Println(prices[len(prices)-1])
```

- `prices[0]` คือช่องแรก ได้ 40
- `len(prices)` คือจำนวนช่อง ได้ 3
- ช่องสุดท้ายจึงเป็นเลข `len(prices)-1` คือ 2 ได้ 60

อ่านเลขช่องที่ไม่มีจริง เช่น `prices[3]` โปรแกรมจะหยุดทำงาน (panic) ส่วนการเพิ่มค่าต่อท้ายใช้ `prices = append(prices, 10)`

ไล่ทุกช่องด้วย `for ... range` ซึ่งให้ค่ามาสองตัวทุกรอบ คือเลขช่องกับค่าในช่อง

```
for i, p := range prices {
	fmt.Println(i, p)
}
```

ถ้าไม่ใช้เลขช่อง ให้เขียน `_` แทน เช่น `for _, p := range prices`

## apply
map คือสมุดที่จับคู่ชื่อกับค่า ค้นด้วยชื่อแทนเลขช่อง คล้ายสมุดโทรศัพท์

```
ages := map[string]int{"ann": 20}
ages["bob"] = 31
fmt.Println(ages["ann"])
fmt.Println(ages["zed"])
```

ได้ 20 แล้ว 0 ถ้าค้นชื่อที่ไม่มีใน map จะได้ค่าศูนย์ของชนิดนั้น ถ้าอยากรู้ว่ามีชื่อนั้นจริงไหม ให้รับค่าตัวที่สองด้วย `age, ok := ages["zed"]` ซึ่ง ok จะเป็น false เมื่อไม่มีชื่อนั้น

map ใหม่ที่ว่างสร้างด้วย `make(map[string]int)`

เลือกใช้แบบนี้: ถ้าลำดับสำคัญหรือต้องไล่ทีละตัว ใช้ slice ถ้าต้องค้นจากชื่อ ใช้ map

## easy
ตัวอย่าง: หาค่าที่มากที่สุดใน slice ที่ไม่ว่าง

```
func Max(values []int) int {
	best := values[0]
	for _, v := range values {
		if v > best {
			best = v
		}
	}
	return best
}
```

`Max([]int{3, 9, 2})` ได้ 9

## hard
ตัวอย่าง: รวมยอดขายแยกตามสินค้าจากสอง slice ที่ยาวเท่ากัน

```
func Totals(items []string, amounts []int) map[string]int {
	sum := make(map[string]int)
	for i, item := range items {
		sum[item] += amounts[i]
	}
	return sum
}
```

ถ้า items เป็น tea, cake, tea และ amounts เป็น 2, 1, 3 จะได้ tea เป็น 5 และ cake เป็น 1 บรรทัด `sum[item] += amounts[i]` ใช้ได้แม้ชื่อนั้นยังไม่มีใน map เพราะเริ่มจากค่าศูนย์
