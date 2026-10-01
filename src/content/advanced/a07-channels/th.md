## explanation
channel คือท่อส่งค่าจากงานหนึ่งไปอีกงาน รับจะรอจนกว่าจะมีคนส่ง ถ้าปิดท่อแล้ว range จะจบเมื่อค่าที่ส่งไว้หมด

```
func SendRecv(v int) int {
	ch := make(chan int, 1)
	ch <- v
	return <-ch
}
```

SendRecv(7) ได้ 7 เพราะส่งเข้าท่อที่มีที่ว่างหนึ่งช่องแล้วรับกลับทันที

## apply
ส่งเลขหนึ่งตัวไปกลับ ส่งรายการแล้วปิดท่อเพื่อให้ผู้รับรวมจนจบ และรับค่าแรกจากท่อที่มีค่าอยู่แล้วโดยไม่รอเพิ่ม

## easy
SendRecv ส่ง v เข้า channel แล้วรับค่าเดียวกันกลับ

```
func SendRecv(v int) int {
	ch := make(chan int, 1)
	ch <- v
	return <-ch
}
```

## hard
First รับค่าแรกจาก channel ที่มี buffer และมีค่าอยู่แล้ว SumClosed ส่งทุกค่า ปิดท่อ แล้ว range รวมจนจบ

```
func First(ch <-chan int) int {
	return <-ch
}
```

```
func SumClosed(values []int) int {
	ch := make(chan int)
	go func() {
		for _, v := range values {
			ch <- v
		}
		close(ch)
	}()
	total := 0
	for v := range ch {
		total += v
	}
	return total
}
```
