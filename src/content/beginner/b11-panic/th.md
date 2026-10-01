## explanation
panic คือการที่โปรแกรมหยุดกะทันหันเพราะเจอสิ่งที่ไม่ควรเกิด เช่น อ่าน slice เกินขนาด หรืออ่านค่าผ่าน pointer ที่เป็น nil เมื่อเกิด panic ฟังก์ชันจะหยุดทันที defer ที่ลงทะเบียนไว้ยังทำงาน แล้วโปรแกรมจบพร้อมข้อความบอกสาเหตุ

```
func main() {
	defer fmt.Println("cleanup")
	values := []int{1, 2}
	fmt.Println(values[5])
}
```

ผลคือ cleanup แล้วตามด้วยข้อความ `panic: runtime error: index out of range` เรียก panic เองก็ได้ด้วย `panic("ข้อความ")`

## apply
error กับ panic ใช้ต่างกัน:

- error ใช้กับเรื่องที่คาดไว้ได้ เช่น ผู้ใช้กรอกข้อมูลผิด หรือไฟล์ไม่มี ผู้เรียกเช็กแล้วจัดการต่อได้
- panic ใช้กับบั๊กที่ไม่ควรเกิดเลย ถ้าเกิดแปลว่าโค้ดผิด

`recover()` ใช้หยุด panic ไม่ให้โปรแกรมจบ แต่ทำงานได้เฉพาะเมื่อถูกเรียกใน defer เท่านั้น ถ้าไม่มี panic มันคืน nil ถ้ามี panic มันคืนค่าที่ส่งเข้า panic

```
func Try() (ok bool) {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("caught:", r)
		}
	}()
	panic("bad state")
}
```

`Try()` พิมพ์ `caught: bad state` แล้วคืน false โดยโปรแกรมไม่จบ `if r := recover(); r != nil` คือประกาศ r แล้วเช็กในบรรทัดเดียวกัน

## easy
ตัวอย่าง: ดูว่า defer ยังทำงานตอนเกิด panic

```
func main() {
	defer fmt.Println("saved")
	panic("disk full")
}
```

พิมพ์ saved ก่อน แล้วโปรแกรมจบด้วย `panic: disk full`

## hard
ตัวอย่าง: แปลง panic จากการอ่าน slice เกินขนาดให้กลายเป็น error

```
func At(values []int, i int) (v int, err error) {
	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("bad index %d", i)
		}
	}()
	return values[i], nil
}
```

`At([]int{7}, 0)` ได้ 7 กับ nil ส่วน `At([]int{7}, 3)` ได้ error ว่า `bad index 3` โดย `fmt.Errorf` สร้าง error จากรูปแบบเหมือน Printf ในงานจริงควรเช็ก `i < len(values)` ก่อนจะดีกว่า ตัวอย่างนี้มีไว้ให้เห็นว่า recover ทำงานอย่างไร
