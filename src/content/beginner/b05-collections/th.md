## explanation
slice คือแถวของค่าที่เรียงกัน ใช้เมื่อต้องไล่ทุกตัวตามลำดับ map คือคู่ชื่อกับค่า ใช้เมื่อต้องค้นจากชื่อ ไม่ใช่จากตำแหน่ง

```
values := []int{1, 2, 3}
total := 0
for _, n := range values {
	total += n
}
```

```
ages := map[string]int{"ann": 20}
fmt.Println(ages["ann"])
```

## apply
รวมคะแนนในรายการใช้ slice แล้วบวกทีละตัว หาอายุจากชื่อคนใช้ map แล้วดึงด้วยชื่อ

## easy
Sum รวมตัวเลขใน slice ถ้ารายการว่างไม่มีอะไรให้บวก จึงคืน 0

```
func Sum(values []int) int {
	total := 0
	for _, n := range values {
		total += n
	}
	return total
}
```

## hard
Last คืนตัวท้ายของ slice ถ้าว่างไม่มีตัวท้าย จึงคืน 0

```
func Last(values []int) int {
	if len(values) == 0 {
		return 0
	}
	return values[len(values)-1]
}
```

นับว่า target โผล่กี่ครั้งด้วยการบวกหนึ่งทุกครั้งที่เท่ากัน

```
func Count(values []int, target int) int {
	found := 0
	for _, n := range values {
		if n == target {
			found++
		}
	}
	return found
}
```
