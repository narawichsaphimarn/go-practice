## explanation
benchmark วัดว่าโค้ดเร็วแค่ไหนและจองหน่วยความจำเท่าไร เขียนในไฟล์ `_test.go` ชื่อขึ้นต้นด้วย Benchmark และรับ `*testing.B`

```
func BenchmarkJoin(b *testing.B) {
	parts := []string{"a", "b", "c"}
	for b.Loop() {
		strings.Join(parts, ",")
	}
}
```

`b.Loop()` (Go 1.24) วนให้เองจนได้เวลามากพอจะวัดได้แม่น รันด้วย `go test -bench=. -benchmem` ได้ผลประมาณนี้

```
BenchmarkJoin-8   20000000   61 ns/op   16 B/op   1 allocs/op
```

- `ns/op` เวลาเฉลี่ยต่อการเรียกหนึ่งครั้ง หน่วยนาโนวินาที
- `B/op` จำนวนไบต์ที่จองต่อครั้ง
- `allocs/op` จำนวนครั้งที่จองหน่วยความจำบน heap ต่อครั้ง ยิ่งน้อย ตัวเก็บขยะยิ่งมีงานน้อย

## apply
fuzz หาค่าที่ทำให้ฟังก์ชันพัง โดยสุ่มค่าเข้าไปเรื่อย ๆ แล้วตรวจคุณสมบัติที่ต้องจริงเสมอ เช่น "กลับข้อความสองครั้งต้องได้ของเดิม"

```
func FuzzTrim(f *testing.F) {
	f.Add("  go  ")
	f.Fuzz(func(t *testing.T, s string) {
		once := strings.TrimSpace(s)
		if strings.TrimSpace(once) != once {
			t.Fatalf("trimming twice changed %q", s)
		}
	})
}
```

- `f.Add(...)` ใส่ค่าเริ่มต้น (seed) ที่อยากให้ลองแน่ ๆ
- `f.Fuzz(...)` คือฟังก์ชันที่ถูกเรียกด้วยค่าสุ่ม

`go test` ธรรมดาจะรันแค่ค่าเริ่มต้นเหมือนเทสต์ปกติ ส่วน `go test -fuzz=FuzzTrim` จะสุ่มต่อไปเรื่อย ๆ เมื่อเจอค่าที่ทำให้พัง Go จะเก็บค่านั้นไว้ในโฟลเดอร์ testdata ให้รันซ้ำได้

## easy
ตัวอย่าง: อ่านผล benchmark สองบรรทัดก่อนและหลังแก้

```
BenchmarkOld-8   1000000   1200 ns/op   5 allocs/op
BenchmarkNew-8   3000000    400 ns/op   1 allocs/op
```

แบบใหม่เร็วขึ้นสามเท่า (1200 เหลือ 400 ns/op) และจองหน่วยความจำบน heap น้อยลงจาก 5 เหลือ 1 ครั้งต่อการเรียก

## hard
ตัวอย่าง: fuzz ที่ตรวจว่าการแปลงเลขไปกลับไม่ทำให้ค่าเปลี่ยน

```
func FuzzItoa(f *testing.F) {
	f.Add(0)
	f.Add(-42)
	f.Fuzz(func(t *testing.T, n int) {
		back, err := strconv.Atoi(strconv.Itoa(n))
		if err != nil || back != n {
			t.Fatalf("%d came back as %d, %v", n, back, err)
		}
	})
}
```

fuzz ไม่ได้รู้คำตอบที่ถูกของแต่ละค่า มันตรวจแค่คุณสมบัติที่ต้องจริงกับทุกค่า จึงใช้ได้แม้ไม่รู้ว่าค่าที่สุ่มมาคืออะไร
