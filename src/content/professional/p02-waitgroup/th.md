## explanation
`sync.WaitGroup` คือตัวนับงานที่ยังไม่เสร็จ เหมือนป้ายนับคนที่ยังอยู่ในห้อง เปิดประตูปิดห้องได้ก็ต่อเมื่อเลขเป็นศูนย์

- `wg.Add(1)` เพิ่มตัวนับ
- `wg.Done()` ลดตัวนับเมื่องานจบ
- `wg.Wait()` รอจนตัวนับเป็นศูนย์

ตั้งแต่ Go 1.25 มี `wg.Go(f)` ที่ทำทั้งสามขั้นในบรรทัดเดียว: เพิ่มตัวนับ, เริ่ม f ใน goroutine ใหม่ และลดตัวนับเมื่อ f จบ

```
var wg sync.WaitGroup
for _, url := range urls {
	wg.Go(func() {
		fetch(url)
	})
}
wg.Wait()
```

ตั้งแต่ Go 1.22 ตัวแปรลูปอย่าง url เป็นตัวใหม่ทุกรอบ goroutine แต่ละตัวจึงได้ url ของรอบตัวเอง

## apply
ถ้าเขียน Add เอง ต้องเรียกก่อนคำสั่ง `go` เสมอ ถ้าไปเรียกใน goroutine ใหม่ Wait อาจทำงานตอนที่ยังไม่มีใคร Add ตัวนับเป็นศูนย์ Wait จึงคืนทันทีทั้งที่งานยังไม่เสร็จ คำสั่ง `go vet` ของ Go 1.25 มีตัวตรวจ waitgroup ที่เตือนบั๊กนี้

ถ้าหลาย goroutine เขียนตัวแปรเดียวกันพร้อมกัน ผลจะเพี้ยน เรียกว่า data race ใช้ `sync.Mutex` ล็อกไว้ให้เขียนได้ทีละตัว

```
type Stats struct {
	mu   sync.Mutex
	hits int
}

func (s *Stats) Hit() {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.hits++
}
```

ทางที่ไม่ต้องล็อกเลยคือให้แต่ละ goroutine เขียนคนละช่อง เช่น ช่อง `out[i]` ของ slice ที่จองไว้ก่อน ช่องไม่ทับกันจึงไม่มีการแย่งกัน

## easy
ตัวอย่าง: ส่งอีเมลหลายฉบับพร้อมกันแล้วรอให้ครบ

```
func SendAll(emails []string) {
	var wg sync.WaitGroup
	for _, e := range emails {
		wg.Go(func() {
			send(e)
		})
	}
	wg.Wait()
}
```

ถ้าลืม `wg.Wait()` ฟังก์ชันจะคืนทันที และอีเมลบางฉบับอาจยังส่งไม่เสร็จ

## hard
ตัวอย่าง: รวมความยาวของทุกคำจากหลาย goroutine โดยใช้ Mutex ป้องกันผลรวม

```
func TotalLen(words []string) int {
	var wg sync.WaitGroup
	var mu sync.Mutex
	total := 0
	for _, w := range words {
		wg.Go(func() {
			mu.Lock()
			total += len(w)
			mu.Unlock()
		})
	}
	wg.Wait()
	return total
}
```

ถ้าไม่มี Lock และ Unlock การบวกจากหลาย goroutine อาจทับกันจนผลรวมน้อยกว่าที่ควร
