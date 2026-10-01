## explanation
time.Sleep หยุด goroutine ปัจจุบันตามระยะที่กำหนด WaitTick นอนหนึ่งวินาทีแล้วคืน 1 ในเทสต์ที่ใช้ testing/synctest นาฬิกาใน bubble เดินให้เอง จึงไม่ต้องรอนาฬิกาจริงหนึ่งวินาที

```
func WaitTick() int {
	time.Sleep(time.Second)
	return 1
}
```

ต้อง import "time"

## apply
Nap จับเวลาที่ผ่านไปหลังนอนสองวินาที โดยใช้ time.Since(start) AfterTick รอจน time.After หนึ่งวินาทีพร้อม แล้วคืน true

```
func Nap(start time.Time) time.Duration {
	time.Sleep(2 * time.Second)
	return time.Since(start)
}
```

ถ้า start คือเวลาตอนเริ่ม นอนสองวินาทีแล้ว Nap ได้ระยะประมาณสองวินาที

## easy
WaitTick เรียก time.Sleep หนึ่งวินาทีแล้วคืน 1

```
func WaitTick() int {
	time.Sleep(time.Second)
	return 1
}
```

## hard
AfterTick คืน true หลังจาก time.After หนึ่งวินาทีพร้อม Nap คืนระยะเวลาหลัง time.Sleep สองวินาที

```
func AfterTick() bool {
	<-time.After(time.Second)
	return true
}
```

```
func Nap(start time.Time) time.Duration {
	time.Sleep(2 * time.Second)
	return time.Since(start)
}
```
