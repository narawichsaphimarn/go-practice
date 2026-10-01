## explanation
go นำหน้าการเรียกฟังก์ชันคือให้ทำงานคู่ไปกับงานปัจจุบัน งานนั้นไม่รอให้กันเอง ถ้าต้องได้ผลกลับ ให้ส่งผ่าน channel แล้วรับใน main

```
func AddAsync(a, b int) int {
	ch := make(chan int)
	go func() { ch <- a + b }()
	return <-ch
}
```

AddAsync(2, 3) คืน 5 หลัง goroutine ส่งผลมา

## apply
แยกงานบวกคนละก้อนแล้วนำมารวม และนับว่ามีกี่งานที่จบแล้ว ต้องรับจาก channel ให้ครบ ไม่งั้น main จบก่อนแล้วผลหาย

## easy
AddAsync คืน a+b โดยให้ goroutine ส่งผลเข้า channel

```
func AddAsync(a, b int) int {
	ch := make(chan int)
	go func() { ch <- a + b }()
	return <-ch
}
```

## hard
WaitBoth เริ่มสอง goroutine แล้วรอทั้งคู่ จึงคืน 2 SumParts รวมผลจากสอง goroutine

```
func WaitBoth() int {
	ch := make(chan int)
	go func() { ch <- 1 }()
	go func() { ch <- 1 }()
	return <-ch + <-ch
}
```

```
func SumParts(a, b int) int {
	ch := make(chan int)
	go func() { ch <- a }()
	go func() { ch <- b }()
	return <-ch + <-ch
}
```
