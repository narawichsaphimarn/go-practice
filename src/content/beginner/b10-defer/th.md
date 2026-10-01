## explanation
`defer` สั่งให้เรียกฟังก์ชันหนึ่งตอนที่ฟังก์ชันปัจจุบันกำลังจะจบ ไม่ว่าจะจบด้วย `return` ตรงไหนก็ตาม

```
func Visit() {
	fmt.Println("open")
	defer fmt.Println("close")
	fmt.Println("work")
}
```

ผลคือ open, work แล้ว close บรรทัด defer ไม่ได้พิมพ์ทันที แต่ถูกจดไว้ทำตอนท้าย

ใช้ defer กับงานเก็บกวาดที่ต้องทำเสมอ เช่น ปิดไฟล์ที่เปิดไว้ แล้ววาง defer ไว้ติดกับบรรทัดที่เปิด จะไม่ลืมปิดแม้ฟังก์ชันมีหลายทางออก

## apply
ถ้ามี defer หลายตัว ตัวที่ลงทะเบียนทีหลังจะทำก่อน เหมือนกองจาน จานที่วางทีหลังอยู่บนสุดจึงถูกหยิบก่อน

```
defer fmt.Println("1")
defer fmt.Println("2")
defer fmt.Println("3")
```

ผลคือ 3, 2, 1

ถ้างานใน defer มีหลายบรรทัด ให้ห่อด้วยฟังก์ชันนิรนาม (จากบทที่ 4) แล้วใส่ `()` ต่อท้ายเพื่อสั่งเรียก: `defer func() { ... }()`

ฟังก์ชันที่ตั้งชื่อค่าคืนไว้ เช่น `func Total() (sum int)` มีตัวแปร sum ให้ใช้ตั้งแต่ต้นฟังก์ชัน คำสั่ง `return 5` จะตั้ง sum เป็น 5 ก่อน แล้ว defer จึงทำงาน defer จึงแก้ค่าที่จะคืนได้

```
func Total() (sum int) {
	defer func() { sum = sum * 10 }()
	return 5
}
```

`Total()` ได้ 50

## easy
ตัวอย่าง: พิมพ์ข้อความปิดท้ายเสมอ แม้ออกจากฟังก์ชันกลางทาง

```
func Check(n int) {
	defer fmt.Println("done")
	if n < 0 {
		fmt.Println("negative")
		return
	}
	fmt.Println("ok")
}
```

`Check(-1)` พิมพ์ negative แล้ว done ส่วน `Check(2)` พิมพ์ ok แล้ว done

## hard
ตัวอย่าง: นับจำนวนครั้งที่ฟังก์ชันจบ ด้วย defer ที่อ่านตัวแปรนอกฟังก์ชัน

```
var finished int

func Job() (result string) {
	defer func() {
		finished++
		result = result + "!"
	}()
	return "ok"
}
```

ทุกครั้งที่เรียก `Job()` ได้ `ok!` และ finished เพิ่มขึ้นหนึ่ง เพราะ defer ทำหลังจาก return ตั้ง result เป็น "ok" แล้ว
