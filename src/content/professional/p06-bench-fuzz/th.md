## explanation
benchmark วัดว่าฟังก์ชันใช้เวลานานแค่ไหนต่องานหนึ่งครั้ง ผลมีช่อง ns/op คือเวลาเฉลี่ยเป็นนาโนวินาทีต่องานหนึ่งครั้ง

```
func BenchmarkSum(b *testing.B) {
	for i := 0; i < b.N; i++ {
		SumJobs([]int{1, 2, 3})
	}
}
```

ถ้าผลเป็น 40 ns/op แปลว่างาน SumJobs หนึ่งครั้งใช้เวลาเฉลี่ย 40 นาโนวินาที ต้อง import "testing"

## apply
allocs/op คือจำนวนครั้งที่งานหนึ่งครั้งจองหน่วยความจำบน heap ตัวเลขที่ลดลงแปลว่าจองน้อยลง fuzz คือให้เครื่องมือสุ่มอินพุตใส่ฟังก์ชัน Fuzz ที่รับ *testing.F แล้วเรียก f.Fuzz

```
func FuzzSign(f *testing.F) {
	f.Add(0)
	f.Fuzz(func(t *testing.T, n int) {
		got := Sign(n)
		if got < -1 || got > 1 {
			t.Fatalf("Sign(%d)=%d", n, got)
		}
	})
}
```

f.Add(0) คือเมล็ดเริ่มต้น f.Fuzz คือตัวที่ถูกเรียกกับค่าที่สุ่มมา

## easy
ns/op คือเวลาเฉลี่ยเป็นนาโนวินาทีต่องานหนึ่งครั้ง อ่านจากผลของ Benchmark

```
func BenchmarkSum(b *testing.B) {
	for i := 0; i < b.N; i++ {
		SumJobs([]int{1, 2, 3})
	}
}
```

## hard
fuzz target ขั้นต่ำคือฟังก์ชันชื่อขึ้นต้นด้วย Fuzz รับ *testing.F แล้วเรียก f.Fuzz allocs/op ที่ลดลงแปลว่างานหนึ่งครั้งจอง heap น้อยลง

```
func FuzzSign(f *testing.F) {
	f.Add(0)
	f.Fuzz(func(t *testing.T, n int) {
		got := Sign(n)
		if got < -1 || got > 1 {
			t.Fatalf("Sign(%d)=%d", n, got)
		}
	})
}
```
