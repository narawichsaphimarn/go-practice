## explanation
sync.WaitGroup นับงานที่ยังไม่จบ Add เพิ่มตัวนับ Done ลดตัวนับ Wait หยุดจนกว่าตัวนับจะเป็นศูนย์ ต้องเรียก Add ก่อนคำสั่ง go ไม่ใช่ข้างใน goroutine เพราะ Wait อาจวิ่งไปก่อนที่ Add จะทัน

```
func FanIn(n int) int {
	var wg sync.WaitGroup
	wg.Add(n)
	for i := 0; i < n; i++ {
		go func() {
			wg.Done()
		}()
	}
	wg.Wait()
	return n
}
```

FanIn(3) สตาร์ท goroutine สามตัว รอจนทั้งสามเรียก Done แล้วคืน 3 ต้อง import "sync"

## apply
Total ให้แต่ละ goroutine บวก 1 เข้าตัวแปรเดียวกัน ตัวแปรเดียวกันที่หลาย goroutine เขียนพร้อมกันต้องล็อกด้วย sync.Mutex ไม่งั้นเป็นการแย่งข้อมูล

```
func Total(n int) int {
	var wg sync.WaitGroup
	var mu sync.Mutex
	total := 0
	wg.Add(n)
	for i := 0; i < n; i++ {
		go func() {
			mu.Lock()
			total++
			mu.Unlock()
			wg.Done()
		}()
	}
	wg.Wait()
	return total
}
```

Total(3) ได้ 3 เพราะมี goroutine สามตัว แต่ละตัวบวก 1 ภายใต้ mu

## easy
FanIn คืน n หลังจากรอ goroutine ครบ n ตัว เรียก wg.Add(n) ก่อนลูป แล้วแต่ละ goroutine เรียก wg.Done

```
func FanIn(n int) int {
	var wg sync.WaitGroup
	wg.Add(n)
	for i := 0; i < n; i++ {
		go func() {
			wg.Done()
		}()
	}
	wg.Wait()
	return n
}
```

## hard
โค้ดที่พังเรียก wg.Add ข้างใน goroutine ถ้า Wait ทำงานก่อนที่ goroutine ตัวไหนจะทันเรียก Add ตัวนับยังเป็นศูนย์ Wait จึงคืนทันที ผลคืองานบางชิ้นยังไม่ได้นับ

```
go func() {
	wg.Add(1)
	defer wg.Done()
	done.Add(1)
}()
```

ย้าย wg.Add ออกมาไว้ก่อนคำสั่ง go ตัวนับจึงครบก่อน Wait เริ่มรอ

```
func FanIn(n int) int {
	var wg sync.WaitGroup
	var done atomic.Int64
	for i := 0; i < n; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			done.Add(1)
		}()
	}
	wg.Wait()
	return int(done.Load())
}
```

ต้อง import "sync" และ "sync/atomic" ตั้งแต่ Go 1.25 มี wg.Go(f) ที่เรียก Add ก่อนเริ่ม goroutine และเรียก Done เมื่อ f จบให้เอง จึงเลี่ยงบั๊กนี้ได้ตั้งแต่ต้น
