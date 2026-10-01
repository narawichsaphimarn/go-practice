## explanation
ฟังก์ชันรับค่าเข้าไป แล้วคืนผลออกมา บางฟังก์ชันคืนสองอย่างพร้อมกัน คือผลกับ error ถ้าทำงานได้ error เป็น nil

```
func add(a, b int) int {
	return a + b
}

fmt.Println(add(2, 3))
```

```
func div(a, b int) (int, error) {
	if b == 0 {
		return 0, fmt.Errorf("divide by zero")
	}
	return a / b, nil
}
```

## apply
เครื่องคิดเลขเล็กๆ เรียก add(2, 3) แล้วพิมพ์ 5 ถ้าหาร 4 ด้วย 2 ได้ 2 และ error เป็น nil

```
n, err := div(4, 2)
if err != nil {
	fmt.Println("error")
	return
}
fmt.Println(n)
```

## easy
เขียน add แล้วพิมพ์ผลของ add(2, 3) ซึ่งคือ 5

```
func add(a, b int) int {
	return a + b
}

func main() {
	fmt.Println(add(2, 3))
}
```

## hard
เมื่อตัวหารเป็นศูนย์ อย่าพิมพ์ผลหาร ให้พิมพ์คำว่า error

```
func div(a, b int) (int, error) {
	if b == 0 {
		return 0, fmt.Errorf("divide by zero")
	}
	return a / b, nil
}

func main() {
	_, err := div(4, 0)
	if err != nil {
		fmt.Println("error")
	}
}
```
