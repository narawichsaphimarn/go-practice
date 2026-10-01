## explanation
งานคู่ขนานคือให้หลาย goroutine ทำคนละชิ้นพร้อมกัน ถ้าปล่อยทุกงานวิ่งพร้อมกันโดยไม่จำกัด เครื่องอาจรับไม่ไหว channel ขนาด limit คือช่องจอด ใครจะเริ่มงานต้องจอดในช่องก่อน เมื่อช่องเต็ม คนถัดไปรอ

```
func SumJobs(values []int) int {
	total := 0
	for _, v := range values {
		total += v
	}
	return total
}
```

SumJobs([]int{1, 2, 3}) ได้ 6 เพราะบวกทุกค่าใน slice

## apply
CountJobs นับว่ามีงานกี่ชิ้นโดยดูความยาวของ jobs Run รับรายการฟังก์ชัน jobs แล้วให้ทำงานพร้อมกันได้ไม่เกิน limit ชิ้น ใช้ channel เป็นช่องจอด และใช้ WaitGroup รอจนทุกงานจบ

```
func Run(limit int, jobs []func()) {
	sem := make(chan struct{}, limit)
	var wg sync.WaitGroup
	for _, job := range jobs {
		wg.Add(1)
		sem <- struct{}{}
		go func() {
			defer wg.Done()
			defer func() { <-sem }()
			job()
		}()
	}
	wg.Wait()
}
```

ต้อง import "sync" ตั้งแต่ Go 1.22 ตัวแปร job เป็นตัวใหม่ทุกรอบ goroutine จึงใช้ job ได้ตรง ๆ โดยไม่ต้องส่งเป็นพารามิเตอร์ ถ้า limit เป็น 2 และมีงาน 5 ชิ้น จะมี goroutine ที่กำลังทำ job ได้ไม่เกิน 2 ตัวในเวลาเดียวกัน

## easy
SumJobs บวกทุกค่าใน slice แล้วคืนผลรวม

```
func SumJobs(values []int) int {
	total := 0
	for _, v := range values {
		total += v
	}
	return total
}
```

## hard
Run ทำงานใน jobs พร้อมกันได้ไม่เกิน limit CountJobs คืนจำนวนงานจากความยาวของ jobs

```
func Run(limit int, jobs []func()) {
	sem := make(chan struct{}, limit)
	var wg sync.WaitGroup
	for _, job := range jobs {
		wg.Add(1)
		sem <- struct{}{}
		go func() {
			defer wg.Done()
			defer func() { <-sem }()
			job()
		}()
	}
	wg.Wait()
}
```

```
func CountJobs(limit int, jobs []int) int {
	return len(jobs)
}
```
