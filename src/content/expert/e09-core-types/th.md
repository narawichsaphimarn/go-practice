## explanation
สเปกไม่ใช้คำว่า core type เป็นทางอธิบายหลักแล้ว เมื่อจะบอกว่า type parameter ทำอะไรได้ ให้บอกจาก constraint ของมัน ถ้า constraint รองรับการบวก ค่าชนิดนั้นบวกกันได้

```
func Add[T ~int | ~float64](a, b T) T {
	return a + b
}
```

Add(1, 2) ได้ 3 เพราะ constraint รองรับการบวกของ int

## apply
cmp.Ordered คือ constraint ของชนิดที่เรียงลำดับได้ เช่น int และ string ค่าที่ถูกจำกัดด้วย cmp.Ordered เปรียบเทียบด้วย < ได้

```
func Min[T cmp.Ordered](a, b T) T {
	if a < b {
		return a
	}
	return b
}
```

ต้อง import "cmp" Min(3, 1) ได้ 1 เพราะ 3 < 1 เป็นเท็จ จึงคืน b

## easy
สเปกไม่ใช้คำว่า core type เป็นทางอธิบายหลักแล้ว อธิบายจากการที่ constraint รองรับการกระทำนั้น

```
func Add[T ~int | ~float64](a, b T) T {
	return a + b
}
```

## hard
cmp.Ordered ให้เปรียบเทียบค่าด้วยเครื่องหมายลำดับได้ การบวกของ type parameter อธิบายว่า constraint รองรับการบวก

```
func Min[T cmp.Ordered](a, b T) T {
	if a < b {
		return a
	}
	return b
}
```
