## explanation
memory model บอกว่าการเขียนค่าหนึ่งจะถูกเห็นโดยการอ่านอีกที่เมื่อไร การส่งค่าเข้า channel ที่สำเร็จ happens-before การรับที่คู่กัน ดังนั้นค่าที่เขียนก่อนส่ง จะถูกเห็นหลังรับ

```
func handoff() int {
	ch := make(chan int, 1)
	ch <- 7
	return <-ch
}
```

handoff() ได้ 7 และการส่ง 7 happens-before การรับค่านั้น

## apply
เห็นลำดับผลครั้งเดียวไม่ได้แปลว่าไม่มี data race ต้องมี happens-before จาก channel หรือจาก sync sync.Mutex ที่ใช้ถูกให้ happens-before ระหว่าง Unlock กับ Lock ถัดไปของ mutex เดียวกัน

```
var mu sync.Mutex
var n int

func add() {
	mu.Lock()
	n++
	mu.Unlock()
}
```

Unlock ของ add ครั้งแรก happens-before Lock ของ add ครั้งถัดไป ดังนั้น n++ ทั้งสองครั้งไม่แย่งกัน

## easy
การส่งค่าเข้า channel ที่สำเร็จ happens-before การรับที่คู่กัน

```
ch := make(chan int, 1)
ch <- 7
v := <-ch
```

v คือ 7 และการส่งเกิดก่อนการรับที่คู่กัน

## hard
Mutex ที่ Lock และ Unlock ถูกต้องให้ happens-before ระหว่าง Unlock กับ Lock ถัดไป ลำดับผลที่เห็นครั้งเดียวไม่พิสูจน์ว่าไม่มี data race

```
mu.Lock()
n++
mu.Unlock()
```
